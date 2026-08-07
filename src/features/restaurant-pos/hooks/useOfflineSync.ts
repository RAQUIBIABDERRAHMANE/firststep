import { useEffect } from 'react';
import { usePOSStore } from '../store/usePOSStore';
import { initPOSDb } from '../store/indexedDB';
import { posApiFetch } from '../services/api';

export const useOfflineSync = () => {
  const isOnline = usePOSStore((state) => state.isOnline);
  const setOnlineStatus = usePOSStore((state) => state.setOnlineStatus);
  const currentSessionId = usePOSStore((state) => state.currentSessionId);

  // Sync Loop: Process queued orders
  const syncOfflineOrders = async () => {
    if (!isOnline || !currentSessionId) return;

    try {
      const db = await initPOSDb();
      const tx = db.transaction('offline_orders', 'readonly');
      const store = tx.objectStore('offline_orders');
      const allOrders = await store.getAll();
      await tx.done;
      
      const pendingOrders = allOrders.filter(order => order.status === 'pending');
      if (pendingOrders.length === 0) return;

      // Send offline orders in a single batch sync request to Gateway using native fetch
      const response = await posApiFetch('/sync', {
        method: 'POST',
        body: JSON.stringify({
          session_id: currentSessionId,
          orders: pendingOrders
        })
      });

      const writeTx = db.transaction('offline_orders', 'readwrite');
      const writeStore = writeTx.objectStore('offline_orders');

      if (response.status === 200 || response.status === 207) {
        const responseData = await response.json();
        const syncedOrders = responseData.synced_orders || [];
        const syncedSyncIds = syncedOrders.map((o: any) => o.sync_id);
        
        for (const order of pendingOrders) {
          if (syncedSyncIds.includes(order.sync_id)) {
            // Delete synced orders
            await writeStore.delete(order.sync_id);
          }
        }
        
        // Handle failed synchronizations
        const errors = responseData.errors || [];
        if (errors.length > 0) {
          for (const errorDetail of errors) {
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

  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      syncOfflineOrders();
    };
    
    const handleOffline = () => {
      setOnlineStatus(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    if (isOnline) {
      syncOfflineOrders();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [isOnline, currentSessionId]);

  return { syncOfflineOrders };
};
