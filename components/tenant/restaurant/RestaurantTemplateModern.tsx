'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import {
    ShoppingCart, QrCode, MapPin, Plus, Minus, X,
    ChevronLeft, ChevronRight, LayoutDashboard, Bell, Check
} from 'lucide-react'

import { translations, Language, CURRENCY } from '@/lib/translations'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })

export default function RestaurantTemplateModern({ siteName, description, coverImage, logo, config, categories, isOwner, primaryColor }: RestaurantTemplateProps) {
    const defaultData = useRestaurantLogic(categories, isOwner)
    const {
        showScanner, setShowScanner, showCart, setShowCart, activeCategory, setActiveCategory,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity,
        totalPrice, totalItems, tableId, categoryNames, filteredItems, handleScan, handlePlaceOrder, handleCallWaiter
    } = defaultData

    const [lang, setLang] = useState<Language>('fr')
    const t = translations[lang].restaurant

    const [currentItemIndex, setCurrentItemIndex] = useState(0)
    const currentItem = filteredItems[currentItemIndex] || null

    const nextItem = () => {
        if (currentItemIndex < filteredItems.length - 1) {
            setCurrentItemIndex(currentItemIndex + 1)
        }
    }

    const prevItem = () => {
        if (currentItemIndex > 0) {
            setCurrentItemIndex(currentItemIndex - 1)
        }
    }

    // Reset index when category changes
    React.useEffect(() => {
        setCurrentItemIndex(0)
    }, [activeCategory])

    // Use CSS variable for the primary color
    const containerStyle = {
        '--primary': primaryColor || '#e11d48' // Default rose-600
    } as React.CSSProperties

    return (
        <div style={containerStyle} className="flex h-screen overflow-hidden bg-black text-white font-sans">
            {/* Left Sidebar - Categories */}
            <aside className="w-20 md:w-72 bg-zinc-950 border-r border-white/5 flex flex-col shrink-0">
                {/* Logo */}
                <div className="p-4 md:p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-10 w-10 md:h-12 md:w-12 object-contain" />
                        ) : (
                            <div className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-[var(--primary)] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                {siteName[0]}
                            </div>
                        )}
                        <div className="hidden md:block">
                            <span className="font-bold text-lg block">{siteName}</span>
                            {tableId && <span className="text-xs text-emerald-400">Table {tableId}</span>}
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <nav className="flex-1 overflow-y-auto py-4">
                    {categoryNames.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`w-full text-left px-4 md:px-6 py-4 transition-all border-l-2 ${activeCategory === cat
                                ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-white'
                                : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="hidden md:block font-medium">{cat}</span>
                            <span className="md:hidden text-xs text-center block">{cat.slice(0, 3)}</span>
                        </button>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-white/5 space-y-2">
                    {isOwner && (
                        <Link href="/dashboard/restaurant" className="block">
                            <Button variant="ghost" className="w-full justify-start gap-2 text-zinc-400 hover:text-white">
                                <LayoutDashboard size={18} />
                                <span className="hidden md:inline">Manage</span>
                            </Button>
                        </Link>
                    )}
                    <button
                        onClick={() => setShowScanner(true)}
                        className="w-full flex items-center gap-2 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        <QrCode size={18} />
                        <span className="hidden md:inline text-sm">Scan QR</span>
                    </button>
                </div>
            </aside>

            {/* Main Content - Single Item Showcase */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Call Waiter */}
                {tableId && !isOwner && (
                    <Button
                        onClick={handleCallWaiter}
                        className="absolute top-4 left-4 z-20 h-12 w-12 rounded-full bg-[var(--primary)] hover:brightness-110 shadow-2xl shadow-rose-900/50"
                    >
                        <Bell className="h-5 w-5" />
                    </Button>
                )}

                {/* Cart Button */}
                <button
                    onClick={() => setShowCart(true)}
                    className="absolute top-4 right-4 z-20 flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full pl-4 pr-2 py-2 hover:bg-white/20 transition-all"
                >
                    <span className="text-sm font-medium">{totalPrice.toFixed(2)} {CURRENCY}</span>
                    <div className="bg-[var(--primary)] text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {totalItems}
                    </div>
                </button>

                {/* Item Display */}
                {currentItem ? (
                    <div className="flex-1 flex">
                        {/* Image Side */}
                        <div className="w-1/2 relative">
                            <img
                                src={currentItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'}
                                alt={currentItem.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80" />
                        </div>

                        {/* Details Side */}
                        <div className="w-1/2 flex flex-col justify-center px-8 md:px-16 py-12">
                            <div className="mb-2 text-zinc-500 text-sm uppercase tracking-widest">
                                {activeCategory} • {currentItemIndex + 1} / {filteredItems.length}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                                {currentItem.name}
                            </h1>
                            <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-md">
                                {currentItem.description || 'A carefully crafted dish made with the finest ingredients.'}
                            </p>
                            <div className="flex items-center gap-6 mb-10">
                                <span className="text-4xl font-light text-[var(--primary)]">{currentItem.price} {CURRENCY}</span>
                            </div>
                            <Button
                                onClick={() => addItem({ id: currentItem.id, name: currentItem.name, price: currentItem.price, image: currentItem.image })}
                                className="w-fit h-14 px-10 rounded-full bg-gradient-to-r from-[var(--primary)] to-orange-600 hover:brightness-110 text-white font-bold text-lg shadow-2xl shadow-rose-900/30"
                            >
                                {t.add_to_order}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-zinc-600">
                        <p className="text-xl">No items in this category</p>
                    </div>
                )}

                {/* Navigation Arrows */}
                {filteredItems.length > 1 && (
                    <>
                        <button
                            onClick={prevItem}
                            disabled={currentItemIndex === 0}
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextItem}
                            disabled={currentItemIndex === filteredItems.length - 1}
                            className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                {/* Progress dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {filteredItems.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentItemIndex(idx)}
                            className={`h-2 rounded-full transition-all ${idx === currentItemIndex ? 'w-8 bg-[var(--primary)]' : 'w-2 bg-white/20 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            </main>

            {/* Cart Slide-over */}
            {showCart && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setShowCart(false)} />
                    <div className="w-full max-w-md bg-zinc-950 border-l border-white/10 flex flex-col animate-in slide-in-from-right">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Your Order</h2>
                            <button onClick={() => setShowCart(false)} className="text-zinc-500 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                                    <ShoppingCart size={48} className="mb-4 opacity-30" />
                                    <p>Your order is empty</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center bg-white/5 rounded-xl p-4">
                                        <img src={item.image || ''} className="h-16 w-16 rounded-lg object-cover" alt="" />
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.name}</h4>
                                            <span className="text-[var(--primary)]">${item.price}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:text-[var(--primary)]">
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-6 text-center font-mono">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:text-[var(--primary)]">
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-black/30">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-zinc-400">Total</span>
                                    <span className="text-3xl font-light">${totalPrice.toFixed(2)}</span>
                                </div>
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={!tableId || isPlacingOrder}
                                    className="w-full h-14 rounded-xl bg-gradient-to-r from-[var(--primary)] to-orange-600 hover:brightness-110 text-white font-bold"
                                >
                                    {isPlacingOrder ? 'Processing...' : 'Place Order'}
                                </Button>
                                {!tableId && (
                                    <p className="mt-3 text-center text-xs text-[var(--primary)]">Scan table QR to checkout</p>
                                )}
                            </div>
                        )}
                        {orderComplete && (
                            <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
                                <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                                    <Check size={40} className="text-emerald-400" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Order Confirmed</h2>
                                <p className="text-zinc-400 mb-8">Your order is being prepared</p>
                                <Button onClick={() => setOrderComplete(false)} variant="outline" className="border-white/20">
                                    Continue
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
