'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { verifyTableTokenBrowser } from '@/lib/crypto'
import { useCart } from '@/lib/contexts/CartContext'
import { createOrder, callWaiter } from '@/app/actions/restaurant'
import {
    ShoppingCart,
    QrCode,
    Search,
    MapPin,
    Clock,
    Phone,
    Mail,
    Plus,
    Minus,
    Trash2,
    ChevronRight,
    Utensils,
    CheckCircle2,
    LayoutDashboard,
    Bell
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import QR Scanner to avoid SSR issues with camera
const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })

export interface RestaurantTemplateProps {
    siteName: string
    description?: string | null
    coverImage?: string | null
    logo?: string | null
    config: any
    categories: any[]
    isOwner?: boolean
}

function RestaurantContent({ siteName, description, coverImage, logo, config, categories, isOwner }: RestaurantTemplateProps) {
    const searchParams = useSearchParams()
    const { items, addItem, removeItem, updateQuantity, clearCart, totalPrice, totalItems, tableId, setTableId } = useCart()

    const [showScanner, setShowScanner] = useState(false)
    const [showCart, setShowCart] = useState(false)
    const [activeCategory, setActiveCategory] = useState('All')
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)

    // Table identification logic (async because of Web Crypto API)
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

            if (result.success) {
                setOrderComplete(true)
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

    // Filter menu items by category (using DB relations)
    const categoryNames = ['All', ...categories.map((c: any) => c.name)]

    // Flatten dishes for the grid, attaching their category names
    const menuItems = categories.flatMap((c: any) =>
        (c.dishes || []).map((d: any) => ({
            ...d,
            category: c.name
        }))
    )

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

    const filteredItems = activeCategory === 'All'
        ? menuItems
        : menuItems.filter((item: any) => item.category === activeCategory)

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Call Waiter Button */}
            {tableId && !isOwner && (
                <Button
                    onClick={handleCallWaiter}
                    className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-xl bg-orange-500 hover:bg-orange-600 text-white z-50 flex items-center justify-center animate-in slide-in-from-bottom-5 active:scale-95 transition-all"
                >
                    <Bell className="h-6 w-6" />
                </Button>
            )}

            {/* Dynamic Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-xl">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-3">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-10 w-10 md:h-12 md:w-12 object-contain" />
                        ) : (
                            <div className="h-10 w-10 md:h-12 md:w-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg ring-4 ring-primary/10">
                                {siteName[0]}
                            </div>
                        )}
                        <div>
                            <span className="font-extrabold text-xl md:text-2xl tracking-tight block">{siteName}</span>
                            {tableId && (
                                <span className="text-[10px] md:text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                    <MapPin size={10} /> Table {tableId} • Connected
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {isOwner && (
                            <Link href="/dashboard/restaurant">
                                <Button variant="outline" size="sm" className="hidden md:flex gap-2 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50">
                                    <LayoutDashboard size={14} /> Manage Restaurant
                                </Button>
                            </Link>
                        )}
                        <button
                            onClick={() => setShowScanner(true)}
                            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
                            title="Scan QR Code"
                        >
                            <QrCode size={24} />
                        </button>
                        <button
                            onClick={() => setShowCart(true)}
                            className="relative p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95"
                        >
                            <ShoppingCart size={24} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] h-6 w-6 rounded-full flex items-center justify-center font-bold border-2 border-primary shadow-md">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 pb-32 md:pb-20">
                {/* Banner / Hero */}
                <section className="relative h-[40vh] md:h-[50vh] flex items-end">
                    <img
                        src={coverImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070'}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Restaurant Banner"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="container relative z-10 px-6 pb-12 lg:px-12">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                            {config.heroTitle || "Delicious moments, served fresh."}
                        </h1>
                        <p className="text-lg text-slate-200 max-w-xl font-medium">
                            {description || "Explore our menu and experience the best flavors in the city."}
                        </p>
                    </div>
                </section>

                {/* Category Navigation */}
                <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b py-4 overflow-x-auto no-scrollbar">
                    <div className="container px-4 lg:px-8 flex gap-3 min-w-max">
                        {categoryNames.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-3xl font-bold text-sm transition-all ${activeCategory === cat
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-y-[-2px]'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Grid */}
                <section id="menu" className="py-12 container px-4 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.length > 0 ? filteredItems.map((item: any) => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col"
                            >
                                <div className="relative aspect-square overflow-hidden bg-slate-50">
                                    <img
                                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={item.name}
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-slate-900 shadow-xl border border-white">
                                        ${item.price}
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{item.name}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                                        {item.description || "Freshly prepared with hand-picked seasonal ingredients."}
                                    </p>
                                    <Button
                                        onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
                                        className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
                                    >
                                        Add to order
                                    </Button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="inline-flex p-8 bg-slate-50 rounded-full text-slate-200 mb-6">
                                    <Utensils size={64} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No items found</h3>
                                <p className="text-slate-500">Looks like we're still setting up our {activeCategory.toLowerCase()} menu!</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Cart Drawer Overlay */}
            {showCart && (
                <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500 outline-none flex flex-col">
                        <div className="p-8 border-b flex items-center justify-between">
                            <h2 className="text-2xl font-black tracking-tight">Your Order</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowCart(false)} className="rounded-2xl">
                                <Trash2 size={24} className="text-slate-400" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                                        <ShoppingCart size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Order is empty</h3>
                                    <p className="text-slate-500 max-w-xs">Start adding some delicious items to your order!</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-6 items-center group">
                                        <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 shadow-sm">
                                            <img src={item.image || ''} className="h-full w-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                                            <span className="text-primary font-bold text-sm">${item.price}</span>
                                        </div>
                                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-primary"><Minus size={16} /></button>
                                            <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-primary"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 border-t bg-slate-50/50">
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-slate-500 font-bold">Estimated Total</span>
                                    <span className="text-3xl font-black tracking-tighter">${totalPrice.toFixed(2)}</span>
                                </div>
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={!tableId || isPlacingOrder}
                                    className="w-full h-16 rounded-[1.5rem] text-xl font-black shadow-xl shadow-primary/30"
                                >
                                    {isPlacingOrder ? 'Sending...' : 'Place Order'} <ChevronRight className="ml-2" />
                                </Button>
                                {!tableId && (
                                    <p className="mt-4 text-center text-xs text-rose-500 font-bold p-2 bg-rose-50 rounded-xl">
                                        Please scan your table QR code to checkout
                                    </p>
                                )}
                            </div>
                        )}

                        {orderComplete && (
                            <div className="absolute inset-0 bg-white z-[70] flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                                <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-emerald-100">
                                    <CheckCircle2 size={48} className="animate-bounce" />
                                </div>
                                <h2 className="text-3xl font-black mb-4 tracking-tight">Order Placed!</h2>
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    Your order for Table {tableId} has been sent to the kitchen. Please relax while we prepare your meal!
                                </p>
                                <Button onClick={() => setOrderComplete(false)} className="mt-12 rounded-2xl h-14 px-8">
                                    Continue Browsing
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* QR Scanner Overlay */}
            {showScanner && (
                <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
            )}

            {/* Social Footer */}
            <footer className="bg-slate-900 text-white py-20">
                <div className="container px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-slate-900 font-black">
                                    {siteName[0]}
                                </div>
                                <span className="text-2xl font-black">{siteName}</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed font-medium">
                                Providing the ultimate dining experience since inception. Quality ingredients, passionate chefs.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-8">Contact</h4>
                            <ul className="space-y-4 text-slate-400">
                                <li className="flex items-center gap-4"><MapPin size={18} /> {config.address || '123 Business Way'}</li>
                                <li className="flex items-center gap-4"><Phone size={18} /> {config.phone || '+123 456 789'}</li>
                                <li className="flex items-center gap-4"><Mail size={18} /> {config.email || 'hello@site.com'}</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-8">Open Hours</h4>
                            <p className="text-slate-400 whitespace-pre-line leading-relaxed italic">
                                {config.hours || "Mon-Fri: 9:00 AM - 10:00 PM\nSat-Sun: 10:00 AM - 11:00 PM"}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-8">Follow Us</h4>
                            <div className="flex gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-14 w-14 bg-white/5 rounded-[1.25rem] border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                                        <Utensils size={20} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-500 text-sm font-bold tracking-tight">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
                        <div className="flex gap-8 text-slate-500 text-sm font-bold">
                            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default function RestaurantTemplate(props: RestaurantTemplateProps) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black animate-pulse">Loading experience...</div>}>
            <RestaurantContent {...props} />
        </Suspense>
    )
}
