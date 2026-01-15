'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import {
    ShoppingCart, QrCode, Plus, Minus, X,
    LayoutDashboard, Bell, Check, Star, ArrowRight
} from 'lucide-react'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })

export default function RestaurantTemplateMinimal({ siteName, description, coverImage, logo, config, categories, isOwner, primaryColor }: RestaurantTemplateProps) {
    const defaultData = useRestaurantLogic(categories, isOwner)
    const {
        showScanner, setShowScanner, showCart, setShowCart,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity, removeItem,
        totalPrice, totalItems, tableId, filteredItems, categoryNames, handleScan, handlePlaceOrder, handleCallWaiter
    } = defaultData

    const [activeSection, setActiveSection] = useState(categoryNames[0])

    const scrollToCategory = (cat: string) => {
        setActiveSection(cat)
        const element = document.getElementById(`cat-${cat}`)
        if (element) {
            const offset = 120 // Height of sticky header + nav
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = element.getBoundingClientRect().top
            const elementPosition = elementRect - bodyRect
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }

    // Use CSS variable for the primary color
    const containerStyle = {
        '--primary': primaryColor || '#1c1917' // Default stone-900
    } as React.CSSProperties

    return (
        <div style={containerStyle} className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[var(--primary)] selection:text-white pb-32">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-10 w-10 object-contain" />
                        ) : (
                            <div className="h-10 w-10 bg-[var(--primary)] text-white flex items-center justify-center font-serif text-xl font-bold rounded-sm">
                                {siteName[0]}
                            </div>
                        )}
                        <span className="font-bold text-lg tracking-tight hidden md:block">{siteName}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        {isOwner && (
                            <Link href="/dashboard/restaurant" className="text-sm font-medium text-slate-500 hover:text-[var(--primary)] transition-colors">
                                Dashboard
                            </Link>
                        )}
                        <button onClick={() => setShowScanner(true)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                            <QrCode size={20} />
                        </button>
                        <button
                            onClick={() => setShowCart(true)}
                            className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-full transition-colors border border-slate-200"
                        >
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cart</span>
                            <div className="bg-[var(--primary)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {totalItems}
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 animate-in slide-in-from-bottom-8 duration-700 fade-in">
                        <div className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full mb-6">
                            Fine Dining Experience
                        </div>
                        <h1 className="font-serif text-5xl md:text-7xl font-medium text-slate-900 mb-6 leading-[1.1]">
                            {config.heroTitle || "Taste the Extraordinary"}
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
                            {description || "Experience a symphony of flavors, crafted with passion and the finest seasonal ingredients."}
                        </p>
                        <div className="flex items-center gap-8 text-sm font-medium text-slate-400">
                            <span>{config.address || "123 Culinary Ave"}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>{config.phone || "555-0123"}</span>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 relative h-[400px] md:h-[500px] rounded-t-[10rem] rounded-b-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-1000 delay-200">
                        <img
                            src={coverImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070'}
                            alt="Hero"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                </div>
            </header>

            {/* Category Navigation (Sticky) */}
            <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 py-4 mb-16">
                <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar flex gap-8">
                    {categoryNames.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => scrollToCategory(cat)}
                            className={`whitespace-nowrap pb-1 text-sm font-bold tracking-wide transition-all ${activeSection === cat
                                ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                                : 'text-slate-400 hover:text-slate-900'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Grid */}
            <div className="max-w-7xl mx-auto px-6 space-y-32">
                {categoryNames.map((cat) => {
                    const categoryItems = categories.find((c: any) => c.name === cat)?.dishes || []
                    if (categoryItems.length === 0) return null

                    return (
                        <section id={`cat-${cat}`} key={cat} className="scroll-mt-40">
                            <div className="flex items-end justify-between mb-12 border-b border-slate-100 pb-4">
                                <h3 className="font-serif text-3xl md:text-4xl text-slate-900">{cat}</h3>
                                <span className="text-slate-400 text-sm hidden md:inline-block">{categoryItems.length} items</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-16">
                                {categoryItems.map((item: any) => (
                                    <div key={item.id} className="group flex gap-6 items-start">
                                        {/* Image */}
                                        <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 overflow-hidden rounded-2xl bg-slate-100 relative">
                                            <img
                                                src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 pt-2">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-serif text-xl font-medium text-slate-900 truncate pr-4">{item.name}</h4>
                                                <span className="font-bold text-[var(--primary)]">${item.price}</span>
                                            </div>
                                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                                {item.description || "A masterfully prepared dish with subtle notes and textures."}
                                            </p>
                                            <button
                                                onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
                                                className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 hover:border-[var(--primary)] hover:text-[var(--primary)] pb-0.5 transition-all flex items-center gap-2 w-fit"
                                            >
                                                Add to Order <ArrowRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                })}
            </div>

            {/* Footer */}
            <footer className="mt-32 border-t border-slate-100 bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-slate-500">
                    <div>
                        <h4 className="font-serif text-xl text-slate-900 mb-6">{siteName}</h4>
                        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">Hours</h5>
                        <p className="whitespace-pre-line">{config.hours || "Mon-Sun\n5:00 PM - 10:00 PM"}</p>
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">Contact</h5>
                        <p>{config.address}</p>
                        <p>{config.phone}</p>
                    </div>
                </div>
            </footer>

            {/* Call Waiter Logic (unchanged same as other templates) */}
            {tableId && !isOwner && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        onClick={handleCallWaiter}
                        className="h-16 w-16 rounded-full bg-[var(--primary)] text-white shadow-2xl hover:brightness-110"
                    >
                        <Bell size={24} />
                    </Button>
                </div>
            )}

            {/* Cart Drawer */}
            {showCart && (
                <div className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm transition-all" onClick={() => setShowCart(false)}>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                            <h2 className="font-serif text-2xl text-slate-900">Your Selection</h2>
                            <button onClick={() => setShowCart(false)} className="text-slate-400 hover:text-slate-900">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <ShoppingCart size={48} className="mb-4 opacity-20" />
                                    <p className="font-serif text-lg">Your cart is empty</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                            <img src={item.image || ''} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-serif text-lg text-slate-900">{item.name}</h4>
                                                <span className="font-medium text-slate-600">${item.price}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"><Minus size={14} /></button>
                                                <span className="font-medium w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"><Plus size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 border-t border-slate-100 bg-slate-50">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Total</span>
                                    <span className="font-serif text-3xl text-slate-900">${totalPrice.toFixed(2)}</span>
                                </div>
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={!tableId || isPlacingOrder}
                                    className="w-full h-14 rounded-xl bg-[var(--primary)] text-white hover:brightness-110 font-bold text-lg shadow-xl shadow-[var(--primary)]/20"
                                >
                                    {isPlacingOrder ? 'Confirming...' : 'Place Order'}
                                </Button>
                                {!tableId && (
                                    <p className="text-center text-xs text-red-500 mt-4 font-medium px-4 py-2 bg-red-50 rounded-lg">
                                        Please scan the table QR code to complete your order.
                                    </p>
                                )}
                            </div>
                        )}
                        {orderComplete && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in z-50">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600">
                                    <Check size={40} />
                                </div>
                                <h2 className="text-3xl font-serif text-slate-900 mb-2">Order Confirmed</h2>
                                <p className="text-slate-500 mb-8 max-w-xs mx-auto">Your order has been sent to the kitchen. Sit back and relax.</p>
                                <Button onClick={() => setOrderComplete(false)} variant="outline" className="border-slate-200 text-slate-900">
                                    Continue Browsing
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
        </div>
    )
}
