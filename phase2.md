# Phase 2: Restaurant Service Implementation Plan

This document outlines the detailed step-by-step implementation plan for **Phase 2** of the FirstStep V2 migration. Phase 2 focuses on creating the core **Restaurant Service** using Laravel 12, defining its PostgreSQL schemas, laying out its Domain-Driven Design (DDD) boundaries, and configuring its integration API routes.

---

## 1. Directory Structure

We will bootstrap the `services/restaurant/` repository and align it with a DDD domain-focused layout.

```
D:/firststep/
├── services/
│   └── restaurant/             # Restaurant Service (Laravel 12)
│       ├── app/
│       │   ├── Domains/        # DDD Domain Entities & Actions
│       │   │   └── Restaurant/
│       │   │       ├── Models/        # Eloquent Models
│       │   │       ├── Repositories/  # Data Access Layers
│       │   │       └── Actions/       # Core Use Cases (ManageMenu, ManageTables)
│       │   └── Http/
│       │       ├── Controllers/       # REST API Endpoints
│       │       └── Middleware/        # Tenant Validation Checks
│       └── database/migrations/       # Database Migration Scripts
```

---

## 2. Docker Compose Integration

We will add the Restaurant Service database (`db-restaurant`) and application service container (`restaurant-service`) to our root [docker-compose.yml](file:///D:/firststep/docker-compose.yml) config.

```yaml
  # Restaurant Service Container
  restaurant-service:
    build:
      context: ./services/restaurant
      dockerfile: Dockerfile
    container_name: firststep-restaurant
    restart: always
    environment:
      - APP_ENV=production
      - DB_HOST=db-restaurant
      - DB_DATABASE=firststep_restaurant
      - DB_USERNAME=fs_admin
      - DB_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    depends_on:
      - db-restaurant
    networks:
      - firststep-network

  # Database: Restaurant Service PostgreSQL
  db-restaurant:
    image: postgres:15-alpine
    container_name: db-restaurant
    restart: always
    volumes:
      - pgdata-restaurant:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=firststep_restaurant
      - POSTGRES_USER=fs_admin
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    networks:
      - firststep-network
```

---

## 3. Database Migration Schemas

Located inside `services/restaurant/database/migrations/`:

```php
// Migration for Menu Categories and Dishes
Schema::create('restaurant_categories', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('tenant_id')->index(); // Tenant website isolation key
    $table->string('name');
    $table->integer('sort_order')->default(0);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

Schema::create('restaurant_dishes', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('category_id');
    $table->string('name');
    $table->text('description')->nullable();
    $table->double precision('price'); // Price in local currency (MAD)
    $table->string('image_url')->nullable();
    $table->boolean('is_active')->default(true);
    $table->integer('sort_order')->default(0);
    $table->jsonb('options')->default('[]'); // Customizable choices (e.g. spiciness)
    $table->jsonb('addons')->default('[]'); // Extra additions
    $table->timestamps();

    $table->foreign('category_id')->references('id')->on('restaurant_categories')->onDelete('cascade');
});

// Migration for Tables and Waiters
Schema::create('restaurant_tables', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('tenant_id')->index();
    $table->string('number');
    $table->integer('capacity')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();

    $table->unique(['tenant_id', 'number']);
});

Schema::create('restaurant_waiters', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('tenant_id')->index();
    $table->string('name');
    $table->string('pin_hash');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

---

## 4. DDD Domain Design

### A. Repository Contracts (Contracts Layer)
Decouples query logic from model classes.

```php
namespace App\Domains\Restaurant\Contracts;

interface DishRepositoryInterface
{
    public function getActiveByTenant(string $tenantId);
    public function findById(string $id);
    public function save(array $data);
}
```

### B. Core Actions (Application Layer)
Handles the core business logic.

```php
namespace App\Domains\Restaurant\Actions;

use App\Domains\Restaurant\Contracts\DishRepositoryInterface;

class CreateDishAction
{
    protected $dishRepository;

    public function __construct(DishRepositoryInterface $dishRepository)
    {
        $this->dishRepository = $dishRepository;
    }

    public function execute(string $categoryId, array $data)
    {
        // 1. Business Validation Rules
        if ($data['price'] <= 0) {
            throw new \InvalidArgumentException('Price must be greater than zero.');
        }

        // 2. Perform Save
        return $this->dishRepository->save(array_merge($data, [
            'category_id' => $categoryId
        ]));
    }
}
```

---

## 5. API Routes

Exposes API endpoints for the front-end. Located inside `services/restaurant/routes/api.php`:

```php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\TableController;

Route::prefix('v1/restaurant')->group(function () {
    // Menu Category & Dishes CRUD
    Route::get('/categories', [MenuController::class, 'indexCategories']);
    Route::post('/categories', [MenuController::class, 'storeCategory']);
    Route::put('/categories/{id}', [MenuController::class, 'updateCategory']);
    
    Route::post('/categories/{categoryId}/dishes', [MenuController::class, 'storeDish']);
    Route::put('/dishes/{id}', [MenuController::class, 'updateDish']);
    
    // Tables Routing
    Route::get('/tables', [TableController::class, 'index']);
    Route::post('/tables', [TableController::class, 'store']);
});
```

---

## 6. Integration Events (RabbitMQ Integration)

The Restaurant Service publishes state changes (such as inventory updates or order placement) to RabbitMQ.

### Example Payload: `DishCreatedEvent`
- **Exchange**: `restaurant.menu.exchange`
- **Routing Key**: `dish.created`
- **Body**:
  ```json
  {
    "event_id": "uuid-for-event",
    "event_type": "DISH_CREATED",
    "timestamp": "2026-06-26T22:10:00Z",
    "data": {
      "tenant_id": "tenant-uuid",
      "dish_id": "dish-uuid",
      "name": "Moroccan Tagine",
      "price": 85.00
    }
  }
  ```

---
*End of Phase 2 Implementation Plan.*
