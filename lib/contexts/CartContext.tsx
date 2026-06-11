'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

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
    const [tableId, setTableId] = useState<string | null>(null)

    // Load cart from local storage if needed (optional)

    useEffect(() => {
        localStorage.setItem('fs_restaurant_cart', JSON.stringify(items))
    }, [items])

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
            totalItems, totalPrice, tableId, setTableId
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
