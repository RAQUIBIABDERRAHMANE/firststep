import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { verifyTableTokenBrowser } from '@/lib/crypto-client'
import { useCart } from '@/lib/contexts/CartContext'
import { createOrder, callWaiter, getOrderStatus } from '@/app/actions/restaurant'

export function useRestaurantLogic(categories: any[], isOwner?: boolean) {
    const searchParams = useSearchParams()
    const { items, addItem, removeItem, updateQuantity, clearCart, totalPrice, totalItems, tableId, setTableId } = useCart()

    const [showScanner, setShowScanner] = useState(false)
    const [showCart, setShowCart] = useState(false)
    const [activeCategory, setActiveCategory] = useState('All')
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null)
    const [orderStatus, setOrderStatus] = useState<string | null>(null)

    // Load active order from storage
    useEffect(() => {
        const storedOrder = localStorage.getItem('active_restaurant_order_id')
        if (storedOrder) setActiveOrderId(storedOrder)
    }, [])

    // Poll for order status
    useEffect(() => {
        if (!activeOrderId) return

        const checkStatus = async () => {
            const res = await getOrderStatus(activeOrderId)
            if (res.success && res.status) {
                setOrderStatus(res.status)
                if (res.status === 'COMPLETED' || res.status === 'PAID') {
                    // Stop tracking eventually? Keep showing for now.
                }
            }
        }

        checkStatus()
        const interval = setInterval(checkStatus, 5000)
        return () => clearInterval(interval)
    }, [activeOrderId])

    // Table identification logic
    useEffect(() => {
        const verifyTable = async () => {
            const token = searchParams.get('table')
            if (token) {
                const decodedTableId = await verifyTableTokenBrowser(token)
                if (decodedTableId) {
                    setTableId(decodedTableId)
                }
            }
        }
        verifyTable()
    }, [searchParams, setTableId])

    const handleScan = async (data: string) => {
        try {
            const url = new URL(data)
            const token = url.searchParams.get('table')
            if (token) {
                const decoded = await verifyTableTokenBrowser(token)
                if (decoded) {
                    setTableId(decoded)
                    setShowScanner(false)
                }
            }
        } catch (e) {
            console.error('Invalid QR code format')
        }
    }

    const handlePlaceOrder = async () => {
        if (!tableId || items.length === 0) return

        setIsPlacingOrder(true)
        try {
            const result = await createOrder(
                tableId,
                items.map(i => ({
                    id: i.id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity
                }))
            )

            if (result.success && result.orderId) {
                setOrderComplete(true)
                setActiveOrderId(result.orderId)
                localStorage.setItem('active_restaurant_order_id', result.orderId)
                clearCart()
            } else {
                console.error('Order placement failed:', result.error)
                alert('Failed to place order: ' + result.error)
            }
        } catch (error) {
            console.error('Error placing order:', error)
            alert('An unexpected error occurred. Please try again.')
        } finally {
            setIsPlacingOrder(false)
        }
    }

    const handleCallWaiter = async () => {
        if (!tableId) return
        if (!confirm("Call the waiter to your table?")) return

        const res = await callWaiter(tableId)
        if (res.success) {
            alert("Waiter has been notified! 🔔")
        } else {
            alert("Failed: " + res.error)
        }
    }

    // Filter menu items by category
    const categoryNames = ['All', ...categories.map((c: any) => c.name)]
    const menuItems = categories.flatMap((c: any) =>
        (c.dishes || []).map((d: any) => ({
            ...d,
            category: c.name
        }))
    )
    const filteredItems = activeCategory === 'All'
        ? menuItems
        : menuItems.filter((item: any) => item.category === activeCategory)

    return {
        // State
        showScanner, setShowScanner,
        showCart, setShowCart,
        activeCategory, setActiveCategory,
        isPlacingOrder,
        orderComplete, setOrderComplete,
        activeOrderId, orderStatus,

        // Cart Context
        items, addItem, removeItem, updateQuantity, totalPrice, totalItems, tableId,

        // Data
        categoryNames,
        filteredItems,

        // Handlers
        handleScan,
        handlePlaceOrder,
        handleCallWaiter
    }
}
