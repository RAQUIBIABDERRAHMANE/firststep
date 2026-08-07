# Phase 1: Shared Platform Infrastructure Implementation Plan

This document outlines the detailed step-by-step implementation plan for **Phase 1** of the FirstStep V2 migration. Phase 1 focuses on building the foundational shared platform services, API Gateway, Docker Compose containers, and user authentication databases.

---

## 1. Directory Structure

We will create a multi-repository workspace layout under the main directory to isolate the gateway and platform services.

```
D:/firststep/
├── gateway/                    # Laravel 12 API Gateway
│   ├── app/Http/Middleware/    # TenantResolver, ValidateJwtToken
│   └── routes/api.php          # Reverse proxy mapping rules
├── services/
│   ├── identity/               # Identity & Auth Service (Laravel 12)
│   └── tenant/                 # Tenant & Subscription Service (Laravel 12)
├── docker-compose.yml          # Local container orchestration
├── nginx.conf                  # Local Nginx reverse proxy configuration
├── .env.example                # Global environment variables template
└── phase1.md                   # This implementation plan
```

---

## 2. Docker Compose Specification

The root [docker-compose.yml](file:///D:/firststep/docker-compose.yml) configures the shared services, message brokers, and PostgreSQL database nodes.

```yaml
version: '3.8'

services:
  # 1. Identity & Auth Service Container
  identity-service:
    build:
      context: ./services/identity
      dockerfile: Dockerfile
    container_name: firststep-identity
    restart: always
    environment:
      - APP_ENV=production
      - DB_HOST=db-identity
      - DB_DATABASE=firststep_identity
      - DB_USERNAME=fs_admin
      - DB_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    depends_on:
      - db-identity
    networks:
      - firststep-network

  # 2. Tenant Service Container
  tenant-service:
    build:
      context: ./services/tenant
      dockerfile: Dockerfile
    container_name: firststep-tenant
    restart: always
    environment:
      - APP_ENV=production
      - DB_HOST=db-tenant
      - DB_DATABASE=firststep_tenant
      - DB_USERNAME=fs_admin
      - DB_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    depends_on:
      - db-tenant
    networks:
      - firststep-network

  # 3. Database: Identity & Security DB
  db-identity:
    image: postgres:15-alpine
    container_name: db-identity
    restart: always
    volumes:
      - pgdata-identity:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=firststep_identity
      - POSTGRES_USER=fs_admin
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    networks:
      - firststep-network

  # 4. Database: Tenant & Organization DB
  db-tenant:
    image: postgres:15-alpine
    container_name: db-tenant
    restart: always
    volumes:
      - pgdata-tenant:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=firststep_tenant
      - POSTGRES_USER=fs_admin
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    networks:
      - firststep-network

  # 5. Shared Caching & Session Engine
  redis:
    image: redis:7-alpine
    container_name: redis-platform
    restart: always
    command: redis-server --save 60 1 --loglevel warning
    volumes:
      - redisdata:/data
    networks:
      - firststep-network

  # 6. Shared Asynchronous Message Broker
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: rabbitmq-platform
    restart: always
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitdata:/var/lib/rabbitmq
    networks:
      - firststep-network

secrets:
  db_password:
    file: ./secrets/db_password.txt

networks:
  firststep-network:
    driver: bridge

volumes:
  pgdata-identity:
  pgdata-tenant:
  redisdata:
  rabbitdata:
```

---

## 3. Database Migration Schemas

Prisma migrations inside the V1 SQLite structure will be replaced by Laravel migrations writing to dedicated PostgreSQL schemas.

### A. Identity Service Migrations
Located inside `services/identity/database/migrations/`:

```php
// Migration for Users, Sessions, and 2FA
Schema::create('users', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('email')->unique();
    $table->string('password_hash');
    $table->string('role')->default('CLIENT'); // ADMIN, CLIENT
    $table->boolean('is_active')->default(true);
    $table->string('recovery_email')->nullable();
    $table->jsonb('recovery_codes')->default('[]'); // Hashed array
    $table->timestamps();
});

Schema::create('user_2fa_codes', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('email');
    $table->string('code_hash');
    $table->timestamp('expires_at');
    $table->timestamps();
    $table->index(['email', 'expires_at']);
});
```

### B. Tenant Service Migrations
Located inside `services/tenant/database/migrations/`:

```php
// Migration for Multi-Tenant Hierarchy
Schema::create('organizations', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('name');
    $table->timestamps();
});

Schema::create('companies', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('organization_id')->constrained('organizations')->onDelete('cascade');
    $table->string('name');
    $table->string('tax_identifier')->nullable(); // Identifiant Fiscal (IF) for Morocco
    $table->timestamps();
});

Schema::create('locations', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('company_id')->constrained('companies')->onDelete('cascade');
    $table->string('name');
    $table->string('city');
    $table->string('currency')->default('MAD');
    $table->timestamps();
});

Schema::create('tenant_websites', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('location_id')->constrained('locations')->onDelete('cascade');
    $table->string('slug')->unique(); // e.g. "classic-burger" -> resolves /classic-burger
    $table->string('primary_color')->default('#3B82F6');
    $table->jsonb('config')->default('{}');
    $table->string('design_template')->default('classic');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

---

## 4. API Gateway Route & Middleware Spec

The Laravel 12 API Gateway manages reverse proxying, rate-limiting, and tenant resolution.

### A. Tenant Resolution Middleware
Resolves tenant context by inspecting host headers or paths.

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantResolver
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $slug = null;

        // 1. Resolve via custom subdomains (e.g. burger.firststepco.com)
        if ($host !== 'firststepco.com' && str_ends_with($host, '.firststepco.com')) {
            $slug = str_replace('.firststepco.com', '', $host);
        }

        // 2. Resolve fallback header (for local testing/cross-origin requests)
        if (!$slug && $request->hasHeader('X-Tenant-Slug')) {
            $slug = $request->header('X-Tenant-Slug');
        }

        if ($slug) {
            // Bind the tenant slug into Laravel container
            app()->instance('tenant.slug', $slug);
            $request->headers->set('X-Tenant-Resolved-Slug', $slug);
        }

        return $next($request);
    }
}
```

### B. Route Definitions
Located inside `gateway/routes/api.php`:

```php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Middleware\TenantResolver;

Route::middleware([TenantResolver::class])->group(function () {
    // 1. Forward Identity Operations
    Route::any('/v1/auth/{any}', function ($any) {
        $response = Http::withHeaders(request()->headers->all())
            ->send(request()->method(), "http://firststep-identity/api/v1/auth/{$any}", [
                'query' => request()->query(),
                'body' => request()->all()
            ]);
        return response($response->body(), $response->status(), $response->headers());
    })->where('any', '.*');

    // 2. Forward Tenant Operations
    Route::any('/v1/tenant/{any}', function ($any) {
        $response = Http::withHeaders(request()->headers->all())
            ->send(request()->method(), "http://firststep-tenant/api/v1/tenant/{$any}", [
                'query' => request()->query(),
                'body' => request()->all()
            ]);
        return response($response->body(), $response->status(), $response->headers());
    })->where('any', '.*');
});
```

---

## 5. Security Protocols (JWT & Session Management)

1. **Authentication Token**:
   - The Gateway inspects request headers for `Authorization: Bearer <JWT>`.
   - Token payload is signed using HMAC SHA-256 with key `JWT_SECRET`.
   - **Payload Claims**:
     ```json
     {
       "sub": "user-uuid-1234",
       "iss": "firststep-identity-service",
       "role": "CLIENT",
       "tenant_id": "resolved-tenant-uuid",
       "exp": 1811462400
     }
     ```
2. **2FA Flow**:
   - Upon credentials validation, the user password matches but session cookies are **not** set yet.
   - The system publishes a temporary verification token to the user and sends a 6-digit OTP code to the verified user email (via SMTP).
   - Once verified, the gateway returns the signed JWT token.

---

## 6. Verification Steps for Approval

To proceed with executing this phase, we must ensure:
1. File `secrets/db_password.txt` contains a secure password (for local SQLite/Postgres setup).
2. Local DNS entries (e.g. `/etc/hosts` or system hosts file) redirect `firststep.local` and subdomains `*.firststep.local` to `127.0.0.1`.
3. Laravel Horizon or queue workers are configured for asynchronous SMTP dispatch testing.

---
*End of Phase 1 Implementation Plan.*
