# Phase 5: Frontend Server Actions Refactor & Microservices Integration

This document outlines the detailed step-by-step implementation plan for **Phase 5** of the FirstStep V2 enterprise migration. Phase 5 focuses on refactoring the legacy Next.js Server Actions (`app/actions/*`) and utility libs (`lib/tenant.ts`) to query the containerized microservices via the API Gateway (`http://localhost:8000`) instead of making direct database queries via Prisma.

---

## 1. Shared Server-Side Fetch Utility

We will implement a clean, lightweight server-side HTTP fetch helper `lib/api-fetch.ts` to execute requests from Next.js server context to the Laravel API Gateway. This helper propagates tenant headers, logs response codes, and forwards authorization contexts.

```typescript
// lib/api-fetch.ts
import { cookies } from 'next/headers';

const GATEWAY_URL = 'http://localhost:8000/api';

export async function serverApiFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('fs_session_token')?.value;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Get active tenant slug from cookies or referrer context if available
  const tenantSlug = cookieStore.get('fs_tenant_slug')?.value;
  if (tenantSlug) {
    headers.set('X-Tenant-Slug', tenantSlug);
  }

  const response = await fetch(`${GATEWAY_URL}${path}`, {
    ...options,
    headers,
  });

  return response;
}
```

---

## 2. Refactoring Identity & Auth Actions

**Target File**: [app/actions/auth.ts](file:///D:/firststep/app/actions/auth.ts)  
We will replace the Prisma queries verifying email/password matches with requests to the `firststep-identity` service.

```typescript
// app/actions/auth.ts (Refactored Preview)
import { cookies } from 'next/headers';
import { serverApiFetch } from '@/lib/api-fetch';

export async function login(credentials: any) {
  try {
    const res = await serverApiFetch('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || 'Authentication failed' };
    }

    const data = await res.json();
    const cookieStore = await cookies();
    
    // Save stateless signed JWT in secure httpOnly cookie
    cookieStore.set('fs_session_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 Day
      path: '/'
    });

    return { success: true, user: data.user };
  } catch (err) {
    return { error: 'Connection to authentication service failed' };
  }
}
```

---

## 3. Refactoring Tenant Actions

**Target File**: [lib/tenant.ts](file:///D:/firststep/lib/tenant.ts)  
We will update `getTenantBySlug` to call the `firststep-tenant` and `firststep-restaurant` services downstream to aggregate structural settings, active modules, and menus.

```typescript
// lib/tenant.ts (Refactored Preview)
import { serverApiFetch } from '@/lib/api-fetch';
import { cache } from 'react';

export const getTenantBySlug = cache(async (slug: string) => {
  try {
    // 1. Fetch Tenant structural configuration from Tenant Service
    const tenantRes = await serverApiFetch(`/v1/tenant/websites/${slug}`, {
      method: 'GET'
    });

    if (!tenantRes.ok) return null;
    const tenant = await tenantRes.json();

    // 2. Fetch Restaurant menu structure from Restaurant Service
    const menuRes = await serverApiFetch(`/v1/restaurant/categories`, {
      method: 'GET',
      headers: {
        'X-Tenant-Slug': tenant.id // Query by UUID tenant reference
      }
    });

    const categories = menuRes.ok ? await menuRes.json() : [];

    // Return unified structural entity matching legacy V1 expected interface
    return {
      ...tenant,
      categories
    };
  } catch (err) {
    console.error('Failed to resolve tenant or menu from microservices:', err);
    return null;
  }
});
```

---

## 4. Refactoring Restaurant & Waiter Actions

**Target Files**: 
- [app/actions/restaurant.ts](file:///D:/firststep/app/actions/restaurant.ts)
- [app/actions/waiter.ts](file:///D:/firststep/app/actions/waiter.ts)

We will rewrite category and dish modifiers to send POST/PUT operations to the Restaurant Service instead of running SQLite inserts:

```typescript
// app/actions/restaurant.ts (Refactored Preview)
import { serverApiFetch } from '@/lib/api-fetch';
import { revalidatePath } from 'next/cache';

export async function createCategory(name: string, slug?: string) {
  try {
    const res = await serverApiFetch('/v1/restaurant/categories', {
      method: 'POST',
      body: JSON.stringify({ name, sort_order: 0 })
    });

    if (!res.ok) {
      const err = await res.json();
      return { error: err.error || 'Failed to create category' };
    }

    const data = await res.json();
    if (slug) revalidatePath(`/${slug}`);
    
    return data;
  } catch (err) {
    return { error: 'Failed to connect to restaurant service' };
  }
}
```

---

## 5. DTO Adapters & Compatibility Layer

To prevent breaking UI layout bindings (since Next.js components rely on V1 database types), the refactored actions will act as **Data Transfer Object (DTO) Adapters**. They will transform Laravel microservice JSON responses (e.g. converting `snake_case` fields like `tenant_id` and `sort_order` back to `camelCase` `tenantId` and `order`) before returning them to the React templates.

---
*End of Phase 5 Implementation Plan.*
