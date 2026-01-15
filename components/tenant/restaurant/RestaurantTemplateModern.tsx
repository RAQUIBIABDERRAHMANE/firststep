'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import {
    ShoppingCart, QrCode, MapPin, Plus, Minus, Trash2,
    ChevronRight, Utensils, CheckCircle2, LayoutDashboard, Bell, Search
} from 'lucide-react'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })

export default function RestaurantTemplateModern({ siteName, description, coverImage, logo, config, categories, isOwner }: RestaurantTemplateProps) {
    const defaultData = useRestaurantLogic(categories, isOwner)
    const {
        showScanner, setShowScanner, showCart, setShowCart, activeCategory, setActiveCategory,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity,
        totalPrice, totalItems, tableId, categoryNames, filteredItems, handleScan, handlePlaceOrder, handleCallWaiter
    } = defaultData

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-rose-500 selection:text-white">
            {/* Call Waiter Button */}
            {tableId && !isOwner && (
                <Button onClick={handleCallWaiter} className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-2xl shadow-rose-900/50 bg-rose-600 hover:bg-rose-500 text-white z-50 flex items-center justify-center animate-in zoom-in transition-all border border-rose-400/20">
                    <Bell className="h-6 w-6" />
                </Button>
            )}

            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
                <div className="container mx-auto flex h-24 items-center justify-between px-6 lg:px-10">
                    <div className="flex items-center gap-4">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-12 w-12 object-contain" />
                        ) : (
                            <div className="h-12 w-12 bg-gradient-to-br from-rose-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-900/20">
                                {siteName[0]}
                            </div>
                        )}
                        <div>
                            <span className="font-black text-2xl tracking-tighter block text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{siteName}</span>
                            {tableId && <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1"><MapPin size={10} /> Table {tableId}</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {isOwner && (
                            <Link href="/dashboard/restaurant">
                                <Button variant="ghost" size="sm" className="hidden md:flex gap-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
                                    <LayoutDashboard size={16} />
                                </Button>
                            </Link>
                        )}
                        <button onClick={() => setShowScanner(true)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/5">
                            <QrCode size={20} />
                        </button>
                        <button onClick={() => setShowCart(true)} className="group relative p-3 rounded-xl bg-white/5 hover:bg-rose-600 hover:text-white text-slate-300 transition-all border border-white/5">
                            <ShoppingCart size={20} />
                            {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-bold shadow-lg">{totalItems}</span>}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 pb-32">
                {/* Hero */}
                <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                    <img src={coverImage || 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=2070'} className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom" alt="Banner" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950"></div>
                    <div className="container relative z-10 px-6 text-center">
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter drop-shadow-2xl">
                            {config.heroTitle || "Taste the Extraordinary"}
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
                            {description || "A culinary journey like no other. Experience modern dining at its finest."}
                        </p>
                    </div>
                </section>

                {/* Categories */}
                <div className="sticky top-24 z-30 py-6 overflow-x-auto no-scrollbar pointer-events-none">
                    <div className="container px-6 flex justify-center gap-4 min-w-max pointer-events-auto">
                        {categoryNames.map((cat) => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all backdrop-blur-md border ${activeCategory === cat ? 'bg-white/10 border-rose-500/50 text-white shadow-[0_0_30px_rgba(244,63,94,0.3)]' : 'bg-black/40 border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu */}
                <section className="py-12 container px-6 lg:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                        {filteredItems.length > 0 ? filteredItems.map((item: any) => (
                            <div key={item.id} className="group bg-white/5 rounded-3xl p-4 hover:bg-white/10 transition-all border border-white/5 hover:border-white/10">
                                <div className="flex gap-6 items-start">
                                    <div className="h-32 w-32 rounded-2xl overflow-hidden bg-slate-900 shadow-2xl shrink-0">
                                        <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" alt={item.name} />
                                    </div>
                                    <div className="flex-1 py-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-bold text-white group-hover:text-rose-400 transition-colors">{item.name}</h3>
                                            <span className="text-xl font-light text-rose-400">${item.price}</span>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">{item.description}</p>
                                        <Button onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })} variant="outline" className="rounded-xl border-white/10 hover:bg-rose-500 hover:border-rose-500 hover:text-white text-xs uppercase tracking-widest font-bold h-10 px-6">
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-32 text-center opacity-50">
                                <h3 className="text-3xl font-thin text-slate-500">No items available</h3>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Cart Drawer */}
            {showCart && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md animate-in fade-in">
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-white/10 shadow-2xl animate-in slide-in-from-right flex flex-col">
                        <div className="p-8 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-2xl font-thin text-white tracking-widest uppercase">Your Selection</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowCart(false)} className="text-slate-500 hover:text-white hover:bg-white/5 rounded-full">
                                <Trash2 size={24} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-5 items-center">
                                    <img src={item.image || ''} className="h-16 w-16 rounded-lg object-cover opacity-80" alt="" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-white">{item.name}</h4>
                                        <span className="text-rose-400 font-light">${item.price}</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 p-1 rounded-lg border border-white/5">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:text-rose-400 text-slate-400"><Minus size={14} /></button>
                                        <span className="font-mono text-sm w-4 text-center text-white">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:text-rose-400 text-slate-400"><Plus size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {items.length > 0 && (
                            <div className="p-8 bg-slate-950 border-t border-white/10">
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-slate-400 uppercase text-xs tracking-widest">Total Amount</span>
                                    <span className="text-4xl font-thin text-white tracking-tighter">${totalPrice.toFixed(2)}</span>
                                </div>
                                <Button onClick={handlePlaceOrder} disabled={!tableId || isPlacingOrder} className="w-full h-16 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-lg tracking-widest uppercase shadow-lg shadow-rose-900/40">
                                    {isPlacingOrder ? 'Processing...' : 'Confirm Order'}
                                </Button>
                            </div>
                        )}
                        {orderComplete && (
                            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl z-[70] flex flex-col items-center justify-center p-12 text-center">
                                <CheckCircle2 size={64} className="text-emerald-500 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                <h2 className="text-4xl font-thin text-white mb-4 uppercase tracking-widest">Confirmed</h2>
                                <Button onClick={() => setOrderComplete(false)} variant="outline" className="mt-12 border-white/20 text-white hover:bg-white/10">Close</Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
        </div>
    )
}
