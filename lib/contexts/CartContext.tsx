'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { syncCartToServer, getCartFromServer } from '@/app/actions/restaurant'


export interface SelectedOption {
    group: string
    choice: string
    priceModifier: number
}

export interface SelectedAddon {
    name: string
    price: number
}

export interface CartItem {
    cartItemId: string // Unique identifier for this configuration (e.g. hash or baseId-options-addons)
    id: string         // Original dish ID
    name: string
    basePrice: number  // Original dish price
    price: number      // Calculated price including options/addons
    quantity: number
    image?: string | null
    selectedOptions: SelectedOption[]
    selectedAddons: SelectedAddon[]
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>) => void
    removeItem: (cartItemId: string) => void
    updateQuantity: (cartItemId: string, delta: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
    tableId: string | null
    setTableId: (id: string | null) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return []
        try {
            const saved = localStorage.getItem('fs_restaurant_cart')
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    })
    const [tableId, setTableId] = useState<string | null>(() => {
        if (typeof window === 'undefined') return null
        try {
            const saved = localStorage.getItem('fs_table_id')
            const scannedAtStr = localStorage.getItem('fs_table_scanned_at')
            if (saved && scannedAtStr) {
                const scannedAt = parseInt(scannedAtStr, 10)
                const now = Date.now()
                const tenMinutes = 10 * 60 * 1000
                const storedOrder = localStorage.getItem(`active_order_${saved}`)
                if (!storedOrder && (now - scannedAt > tenMinutes)) {
                    localStorage.removeItem('fs_table_id')
                    localStorage.removeItem('fs_table_scanned_at')
                    return null
                }
                return saved
            }
            return null
        } catch {
            return null
        }
    })
    const [lastSyncStr, setLastSyncStr] = useState<string>('')

    const handleSetTableId = (id: string | null) => {
        setTableId(id)
        if (typeof window !== 'undefined') {
            if (id) {
                localStorage.setItem('fs_table_id', id)
                localStorage.setItem('fs_table_scanned_at', Date.now().toString())
            } else {
                localStorage.removeItem('fs_table_id')
                localStorage.removeItem('fs_table_scanned_at')
            }
        }
    }

    // Inactivity timeout checker (10 mins without placing order)
    useEffect(() => {
        if (!tableId) return

        const checkTimeout = () => {
            const scannedAtStr = localStorage.getItem('fs_table_scanned_at')
            const storedOrder = localStorage.getItem(`active_order_${tableId}`)
            if (scannedAtStr && !storedOrder) {
                const scannedAt = parseInt(scannedAtStr, 10)
                const now = Date.now()
                const tenMinutes = 10 * 60 * 1000
                if (now - scannedAt > tenMinutes) {
                    handleSetTableId(null)
                }
            }
        }

        const interval = setInterval(checkTimeout, 10000) // check every 10 seconds
        return () => clearInterval(interval)
    }, [tableId])

    // Poll remote cart if tableId is set
    useEffect(() => {
        if (!tableId) return

        const fetchRemoteCart = async () => {
            try {
                const res = await getCartFromServer(tableId)
                if (res.success && res.cartData) {
                    const currentStr = JSON.stringify(items)
                    const remoteStr = JSON.stringify(res.cartData)
                    // If the remote cart is different from our local cart, update it
                    if (remoteStr !== currentStr && remoteStr !== lastSyncStr) {
                        setItems(res.cartData as CartItem[])
                        setLastSyncStr(remoteStr)
                    }
                }
            } catch (e) {
                console.error('Failed to fetch remote cart', e)
            }
        }

        fetchRemoteCart()
        const interval = setInterval(fetchRemoteCart, 3000)
        return () => clearInterval(interval)
    }, [tableId, items, lastSyncStr])

    // Sync local changes to server
    useEffect(() => {
        if (!tableId) {
            localStorage.setItem('fs_restaurant_cart', JSON.stringify(items))
            return
        }

        const syncLocalCart = async () => {
            const currentStr = JSON.stringify(items)
            // Only sync if it's different from the last state we synced/fetched
            if (currentStr !== lastSyncStr) {
                try {
                    setLastSyncStr(currentStr)
                    await syncCartToServer(tableId, items)
                } catch (e) {
                    console.error('Failed to sync cart to server', e)
                }
            }
        }

        localStorage.setItem('fs_restaurant_cart', JSON.stringify(items))
        syncLocalCart()
    }, [items, tableId, lastSyncStr])



    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.cartItemId === item.cartItemId)
            if (existing) {
                return prev.map((i) => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity + 1 } : i)
            }
            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const removeItem = (cartItemId: string) => {
        setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId))
    }

    const updateQuantity = (cartItemId: string, delta: number) => {
        setItems((prev) => prev.map((i) => {
            if (i.cartItemId === cartItemId) {
                const newQty = Math.max(1, i.quantity + delta)
                return { ...i, quantity: newQty }
            }
            return i
        }))
    }

    const clearCart = () => setItems([])

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <CartContext.Provider value={{
            items, addItem, removeItem, updateQuantity, clearCart,
            totalItems, totalPrice, tableId, setTableId: handleSetTableId
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within a CartProvider')
    return context
}
