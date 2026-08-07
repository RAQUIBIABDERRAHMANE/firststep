import { openDB } from 'idb';

const DB_NAME = 'firststep_pos_offline';
const DB_VERSION = 1;

export interface CartItem {
  dish_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PaymentItem {
  method: string;
  amount: number;
}

export interface OfflineOrder {
  sync_id: string;
  order_number: string;
  subtotal: number;
  total: number;
  items: CartItem[];
  payments: PaymentItem[];
  status: 'pending' | 'synced' | 'failed';
  error_message?: string;
}

export const initPOSDb = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('menu_cache')) {
        db.createObjectStore('menu_cache', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('offline_orders')) {
        db.createObjectStore('offline_orders', { keyPath: 'sync_id' });
      }
    },
  });
};

export const saveOfflineOrder = async (order: OfflineOrder) => {
  const db = await initPOSDb();
  await db.put('offline_orders', order);
};

export const getOfflineOrders = async (): Promise<OfflineOrder[]> => {
  const db = await initPOSDb();
  return db.getAll('offline_orders');
};

export const deleteOfflineOrder = async (syncId: string) => {
  const db = await initPOSDb();
  await db.delete('offline_orders', syncId);
};
