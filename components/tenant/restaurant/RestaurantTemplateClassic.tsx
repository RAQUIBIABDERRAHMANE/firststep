'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import {
    ShoppingCart, QrCode, MapPin, Phone, Mail, Plus, Minus, Trash2,
    ChevronRight, Utensils, CheckCircle2, LayoutDashboard, Bell
} from 'lucide-react'

import { translations, Language, CURRENCY } from '@/lib/translations'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })

export default function RestaurantTemplateClassic({ siteName, description, coverImage, logo, config, categories, isOwner, primaryColor }: RestaurantTemplateProps) {
    const defaultData = useRestaurantLogic(categories, isOwner)
    const {
        showScanner, setShowScanner, showCart, setShowCart, activeCategory, setActiveCategory,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity,
        totalPrice, totalItems, tableId, categoryNames, filteredItems, handleScan, handlePlaceOrder, handleCallWaiter
    } = defaultData

    const [lang, setLang] = useState<Language>('fr')
    const t = translations[lang as Language].restaurant

    // Use CSS variable for the primary color
    const containerStyle = {
        '--primary': primaryColor || '#2563eb'
    } as React.CSSProperties

    return (
        <div style={containerStyle} className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
            {/* Call Waiter Button */}
            {tableId && !isOwner && (
                <Button onClick={handleCallWaiter} className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-xl bg-[var(--primary)] hover:brightness-110 text-white z-50 flex items-center justify-center animate-in slide-in-from-bottom-5 active:scale-95 transition-all">
                    <Bell className="h-6 w-6" />
                </Button>
            )}

            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-xl">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-3">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-10 w-10 md:h-12 md:w-12 object-contain" />
                        ) : (
                            <div className="h-10 w-10 md:h-12 md:w-12 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg ring-4 ring-slate-100">
                                {siteName[0]}
                            </div>
                        )}
                        <div>
                            <span className="font-extrabold text-xl md:text-2xl tracking-tight block">{siteName}</span>
                            {tableId && <span className="text-[10px] md:text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1"><MapPin size={10} /> Table {tableId} • Connected</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        {isOwner && (
                            <Link href="/dashboard/restaurant">
                                <Button variant="outline" size="sm" className="hidden md:flex gap-2 rounded-xl border-slate-200 text-[var(--primary)] hover:bg-slate-50">
                                    <LayoutDashboard size={14} /> Manage
                                </Button>
                            </Link>
                        )}
                        <button onClick={() => setShowScanner(true)} className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95">
                            <QrCode size={24} />
                        </button>
                        <button onClick={() => setShowCart(true)} className="relative p-3 rounded-2xl bg-[var(--primary)] text-white shadow-lg shadow-blue-600/20 hover:brightness-110 transition-all active:scale-95">
                            <ShoppingCart size={24} />
                            {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-white text-[var(--primary)] text-[10px] h-6 w-6 rounded-full flex items-center justify-center font-bold border-2 border-[var(--primary)] shadow-md">{totalItems}</span>}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 pb-32 md:pb-20">
                {/* Hero */}
                <section className="relative h-[40vh] md:h-[50vh] flex items-end">
                    <img src={coverImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070'} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="container relative z-10 px-6 pb-12 lg:px-12">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">{config.heroTitle || "Delicious moments, served fresh."}</h1>
                        <p className="text-lg text-slate-200 max-w-xl font-medium">{description || "Explore our menu and experience the best flavors in the city."}</p>
                    </div>
                </section>

                {/* Categories */}
                <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b py-4 overflow-x-auto no-scrollbar">
                    <div className="container px-4 lg:px-8 flex gap-3 min-w-max">
                        {categoryNames.map((cat) => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-3 rounded-3xl font-bold text-sm transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-y-[-2px]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu */}
                <section className="py-12 container px-4 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.length > 0 ? filteredItems.map((item: any) => (
                            <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col">
                                <div className="relative aspect-square overflow-hidden bg-slate-50">
                                    <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-slate-900 shadow-xl border border-white">{item.price} {CURRENCY}</div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--primary)] transition-colors">{item.name}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">{item.description || "Freshly prepared with hand-picked seasonal ingredients."}</p>
                                    <Button onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })} className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-blue-600/20 bg-[var(--primary)] hover:brightness-110 text-white">
                                        {t.add_to_order}
                                    </Button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="inline-flex p-8 bg-slate-50 rounded-full text-slate-200 mb-6"><Utensils size={64} /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No items found</h3>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Cart Drawer & QR Scanner */}
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
                                    <ShoppingCart size={40} className="text-slate-200 mb-4" />
                                    <h3 className="text-xl font-bold mb-2">Order is empty</h3>
                                    <p className="text-slate-500 max-w-xs">Start adding some delicious items!</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-6 items-center group">
                                        <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 shadow-sm">
                                            <img src={item.image || ''} className="h-full w-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                                            <span className="text-[var(--primary)] font-bold text-sm">${item.price}</span>
                                        </div>
                                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-[var(--primary)]"><Minus size={16} /></button>
                                            <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-[var(--primary)]"><Plus size={16} /></button>
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
                                <Button onClick={handlePlaceOrder} disabled={!tableId || isPlacingOrder} className="w-full h-16 rounded-[1.5rem] text-xl font-black shadow-xl shadow-blue-600/30 bg-[var(--primary)] hover:brightness-110 text-white">
                                    {isPlacingOrder ? 'Sending...' : 'Place Order'} <ChevronRight className="ml-2" />
                                </Button>
                                {!tableId && <p className="mt-4 text-center text-xs text-rose-500 font-bold p-2 bg-rose-50 rounded-xl">Scan table QR code to checkout</p>}
                            </div>
                        )}
                        {orderComplete && (
                            <div className="absolute inset-0 bg-white z-[70] flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                                <CheckCircle2 size={48} className="text-emerald-500 mb-4 animate-bounce" />
                                <h2 className="text-3xl font-black mb-4">Order Placed!</h2>
                                <p className="text-slate-500 text-lg mb-8">We're preparing your meal.</p>
                                <Button onClick={() => setOrderComplete(false)} className="rounded-2xl h-14 px-8 bg-slate-900 text-white hover:bg-slate-800">Continue Browsing</Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-20">
                <div className="container px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <h4 className="font-bold text-lg mb-6">{siteName}</h4>
                            <p className="text-slate-400">Delicious moments served fresh.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6">Contact</h4>
                            <p className="text-slate-400">{config?.address}</p>
                            <p className="text-slate-400">{config?.phone}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6">Hours</h4>
                            <p className="text-slate-400 whitespace-pre-line">{config?.hours}</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
