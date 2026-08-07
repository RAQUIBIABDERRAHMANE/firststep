# Phase 4: POS Offline Sync & Frontend Next.js Integration

This document outlines the detailed step-by-step design blueprint for **Phase 4** of the FirstStep V2 enterprise migration. Phase 4 focuses on configuring the Next.js frontend (located in the workspace root) to communicate with the Gateway container, establishing browser-level offline storage via Zustand + IndexedDB, and implementing background synchronization loops.

---

## 1. Directory Structure

We will organize the POS Frontend feature folder under the Next.js feature-based layout:

```
D:/firststep/
└── src/
    └── features/
        └── restaurant-pos/      # POS Feature Module
            ├── components/      # UI components (Cart, CashDrawer, SyncIndicator)
            ├── hooks/           # useOfflineSync.ts (online listener, auto-sync loops)
            ├── store/           # Offline storage engines
            │   ├── usePOSStore.ts    # Zustand core store definitions
            │   └── indexedDB.ts      # IndexedDB repository wrappers
            └── services/
                └── api.ts       # Axios API client routing to http://localhost:8000/api
```

---

## 2. API Client Configuration

Located inside `src/features/restaurant-pos/services/api.ts`:

```typescript
import axios from 'axios';

export const posApiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1/pos', // Directs requests to Gateway Container proxy
  timeout: 10000,
});

// Automatically inject active tenant and session headers from Zustand store state
posApiClient.interceptors.request.use((config) => {
  const activeTenantSlug = localStorage.getItem('fs_tenant_slug');
  if (activeTenantSlug) {
    config.headers['X-Tenant-Slug'] = activeTenantSlug;
  }
  return config;
});
```

---

## 3. IndexedDB Local Storage Schema

We will use a native browser IndexedDB wrapper (such as `idb`) to guarantee fast, non-blocking local storage of sales data during offline states.

```typescript
// src/features/restaurant-pos/store/indexedDB.ts
import { openDB } from 'idb';

const DB_NAME = 'firststep_pos_offline';
const DB_VERSION = 1;

export const initPOSDb = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 1. Store for caching categories and dishes offline
      if (!db.objectStoreNames.contains('menu_cache')) {
        db.createObjectStore('menu_cache', { keyPath: 'id' });
      }
      // 2. Queue for holding offline sales orders
      if (!db.objectStoreNames.contains('offline_orders')) {
        db.createObjectStore('offline_orders', { keyPath: 'sync_id' });
      }
    },
  });
};
```

---

## 4. Zustand Offline Store Specification

Located inside `src/features/restaurant-pos/store/usePOSStore.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  dish_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentItem {
  method: string; // cash, card, mobile
  amount: number;
}

interface OfflineOrder {
  sync_id: string;
  order_number: string;
  subtotal: number;
  total: number;
  items: CartItem[];
  payments: PaymentItem[];
  status: 'pending' | 'synced' | 'failed';
  error_message?: string;
}

interface POSState {
  currentSessionId: string | null;
  cart: CartItem[];
  isOnline: boolean;
  
  // Actions
  setSessionId: (id: string | null) => void;
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
  setOnlineStatus: (status: boolean) => void;
}

export const usePOSStore = create<POSState>()(
  persist(
    (set) => ({
      currentSessionId: null,
      cart: [],
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      
      setSessionId: (id) => set({ currentSessionId: id }),
      addToCart: (item) => set((state) => {
        const existing = state.cart.find((c) => c.dish_id === item.dish_id);
        if (existing) {
          return {
            cart: state.cart.map((c) => 
              c.dish_id === item.dish_id ? { ...c, quantity: c.quantity + 1 } : c
            )
          };
        }
        return { cart: [...state.cart, item] };
      }),
      clearCart: () => set({ cart: [] }),
      setOnlineStatus: (isOnline) => set({ isOnline }),
    }),
    { name: 'fs_pos_store' }
  )
);
```

---

## 5. Network Listener & Auto-Sync Pipeline

Located inside `src/features/restaurant-pos/hooks/useOfflineSync.ts`:

```typescript
import { useEffect } from 'react';
import { usePOSStore } from '../store/usePOSStore';
import { initPOSDb } from '../store/indexedDB';
import { posApiClient } from '../services/api';

export const useOfflineSync = () => {
  const isOnline = usePOSStore((state) => state.isOnline);
  const setOnlineStatus = usePOSStore((state) => state.setOnlineStatus);
  const currentSessionId = usePOSStore((state) => state.currentSessionId);

  // 1. Sync Loop: Process queued orders
  const syncOfflineOrders = async () => {
    if (!isOnline || !currentSessionId) return;

    const db = await initPOSDb();
    const tx = db.transaction('offline_orders', 'readonly');
    const store = tx.objectStore('offline_orders');
    const allOrders = await store.getAll();
    
    // Get only pending unsynced orders
    const pendingOrders = allOrders.filter(order => order.status === 'pending');
    if (pendingOrders.length === 0) return;

    try {
      // Send offline orders in a single batch sync request to Gateway
      const response = await posApiClient.post('/sync', {
        session_id: currentSessionId,
        orders: pendingOrders
      });

      // Update sync statuses inside local IndexedDB based on response
      const writeTx = db.transaction('offline_orders', 'readwrite');
      const writeStore = writeTx.objectStore('offline_orders');

      if (response.status === 200 || response.status === 207) {
        const syncedSyncIds = response.data.synced_orders.map((o: any) => o.sync_id);
        for (const order of pendingOrders) {
          if (syncedSyncIds.includes(order.sync_id)) {
            // Option A: Delete synced orders to keep DB light
            await writeStore.delete(order.sync_id);
          }
        }
        
        // Handle failed synchronizations (e.g. Session expired on server)
        if (response.data.errors && response.data.errors.length > 0) {
          for (const errorDetail of response.data.errors) {
            const failedOrder = pendingOrders[errorDetail.index];
            if (failedOrder) {
              failedOrder.status = 'failed';
              failedOrder.error_message = errorDetail.error;
              await writeStore.put(failedOrder);
            }
          }
        }
      }
      await writeTx.done;
    } catch (err) {
      console.error('Batch sync failed temporarily:', err);
    }
  };

  // 2. Event Listeners for network changes
  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      syncOfflineOrders();
    };
    
    const handleOffline = () => {
      setOnlineStatus(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial background check on hook startup
    if (isOnline) {
      syncOfflineOrders();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);
};
```

---

## 6. Conflict Resolution & Idempotency Rules

1. **Idempotence**: Every offline order is assigned a unique client-side generated UUID `sync_id`. This prevents duplicates if a sync request is partially processed and then retried due to network drops.
2. **Failed Synchronizations**: If an order fails sync (e.g. a cashier closes a shift on the server before the PWA finishes syncing), it is flagged as `status = 'failed'` and marked with the error reason. A manager resolution panel allows re-assigning these to the correct active session.

---
*End of Phase 4 Implementation Plan.*
