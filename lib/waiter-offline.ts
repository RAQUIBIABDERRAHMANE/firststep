import { createOrder } from '@/app/actions/restaurant'

export interface OfflineOrder {
    id: string
    tableId: string
    items: any[]
    createdAt: number
}

function getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
            reject(new Error('IndexedDB is not supported'))
            return
        }
        const request = indexedDB.open('waiter_offline_db', 1)
        
        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains('orders')) {
                db.createObjectStore('orders', { keyPath: 'id' })
            }
        }
        
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export async function queueOfflineOrder(tableId: string, items: any[]): Promise<OfflineOrder> {
    const db = await getDB()
    const offlineOrder: OfflineOrder = {
        id: `offline-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        tableId,
        items,
        createdAt: Date.now()
    }
    
    return new Promise((resolve, reject) => {
        const tx = db.transaction('orders', 'readwrite')
        const store = tx.objectStore('orders')
        const request = store.add(offlineOrder)
        
        request.onsuccess = () => resolve(offlineOrder)
        request.onerror = () => reject(request.error)
    })
}

export async function getOfflineOrders(): Promise<OfflineOrder[]> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction('orders', 'readonly')
        const store = tx.objectStore('orders')
        const request = store.getAll()
        
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(request.error)
    })
}

export async function deleteOfflineOrder(id: string): Promise<void> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction('orders', 'readwrite')
        const store = tx.objectStore('orders')
        const request = store.delete(id)
        
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
    })
}

export async function flushOfflineQueue(onProgress?: (order: OfflineOrder, success: boolean) => void): Promise<number> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return 0
    }
    
    const orders = await getOfflineOrders()
    if (orders.length === 0) return 0
    
    let successCount = 0
    for (const order of orders) {
        try {
            const res = await createOrder(order.tableId, order.items)
            if (res.success) {
                await deleteOfflineOrder(order.id)
                successCount++
                onProgress?.(order, true)
            } else {
                console.error(`Failed to sync offline order ${order.id}:`, res.error)
                onProgress?.(order, false)
            }
        } catch (e) {
            console.error(`Error syncing offline order ${order.id}`, e)
            onProgress?.(order, false)
        }
    }
    
    return successCount
}
