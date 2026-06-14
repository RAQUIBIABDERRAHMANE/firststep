import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { verifyTableTokenBrowser } from '@/lib/crypto-client'
import { useCart, SelectedOption, SelectedAddon } from '@/lib/contexts/CartContext'
import { createOrder, callWaiter, getOrderStatus, requestBill } from '@/app/actions/restaurant'

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

    // Customize Modal State
    const [customizingDish, setCustomizingDish] = useState<any | null>(null)

    // Load active order from storage when tableId changes
    useEffect(() => {
        if (!tableId) return
        const storedOrder = localStorage.getItem(`active_order_${tableId}`)
        if (storedOrder) {
            setActiveOrderId(storedOrder)
        } else {
            setActiveOrderId(null)
            setOrderStatus(null)
        }
    }, [tableId])

    // Poll for order status
    useEffect(() => {
        if (!activeOrderId || !tableId) return

        const checkStatus = async () => {
            const res = await getOrderStatus(activeOrderId)
            if (res.success && res.status) {
                setOrderStatus(res.status)
                if (res.status === 'COMPLETED' || res.status === 'PAID' || res.status === 'CANCELED') {
                    // Reset the order tracking for this table allowing fresh orders
                    localStorage.removeItem(`active_order_${tableId}`)
                    setActiveOrderId(null)
                    setOrderComplete(false)
                }
            }
        }

        checkStatus()
        const interval = setInterval(checkStatus, 5000)
        return () => clearInterval(interval)
    }, [activeOrderId, tableId])

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

    const handleAddItem = (dish: any) => {
        let opts = []
        let ads = []
        try {
            opts = typeof dish.options === 'string' ? JSON.parse(dish.options || '[]') : (dish.options || [])
        } catch {}
        try {
            ads = typeof dish.addons === 'string' ? JSON.parse(dish.addons || '[]') : (dish.addons || [])
        } catch {}

        if (opts.length > 0 || ads.length > 0) {
            setCustomizingDish(dish)
        } else {
            addItem({
                cartItemId: `${dish.id}-default`,
                id: dish.id,
                name: dish.name,
                basePrice: dish.price,
                price: dish.price,
                image: dish.image,
                selectedOptions: [],
                selectedAddons: []
            })
        }
    }

    const handleConfirmCustomization = (selectedOptions: SelectedOption[], selectedAddons: SelectedAddon[], calculatedPrice: number) => {
        if (!customizingDish) return

        const optionsKey = selectedOptions.map(o => `${o.group}:${o.choice}`).sort().join('|')
        const addonsKey = selectedAddons.map(a => a.name).sort().join('|')
        const cartItemId = `${customizingDish.id}-${optionsKey}-${addonsKey}`

        addItem({
            cartItemId,
            id: customizingDish.id,
            name: customizingDish.name,
            basePrice: customizingDish.price,
            price: calculatedPrice,
            image: customizingDish.image,
            selectedOptions,
            selectedAddons
        })
        
        setCustomizingDish(null)
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
                    quantity: i.quantity,
                    selectedOptions: i.selectedOptions,
                    selectedAddons: i.selectedAddons
                }))
            )

            if (result.success && result.orderId) {
                setOrderComplete(true)
                setActiveOrderId(result.orderId)
                localStorage.setItem(`active_order_${tableId}`, result.orderId)
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
            if (typeof window !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
            }
            alert("Waiter has been notified! 🔔")
        } else {
            alert("Failed: " + res.error)
        }
    }

    const handleRequestBill = async () => {
        if (!tableId) return
        if (!confirm("Request the bill for your table?")) return

        const res = await requestBill(tableId)
        if (res.success) {
            if (typeof window !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
            }
            alert("Bill request sent! A waiter will bring your bill shortly. 🔔")
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
        customizingDish, setCustomizingDish,

        // Cart Context
        items, addItem: handleAddItem, removeItem, updateQuantity, totalPrice, totalItems, tableId,

        // Data
        categoryNames,
        filteredItems,

        // Handlers
        handleScan,
        handlePlaceOrder,
        handleCallWaiter,
        handleRequestBill,
        handleConfirmCustomization
    }
}
