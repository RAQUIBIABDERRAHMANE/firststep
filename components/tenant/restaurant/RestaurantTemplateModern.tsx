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
        <div style={containerStyle} className="flex h-screen overflow-hidden bg-[#050505] text-white font-sans selection:bg-[var(--primary)] selection:text-white">
            {/* Left Sidebar - Categories */}
            <aside className="w-20 md:w-80 bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0 relative z-30 shadow-[10px_0_50px_rgba(0,0,0,0.5)]">
                {/* Logo Section */}
                <div className="p-6 md:p-10 border-b border-white/5">
                    <div className="flex items-center gap-5 group cursor-pointer">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform group-hover:scale-110" />
                        ) : (
                            <div className="h-12 w-12 md:h-14 md:w-14 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-white/10">
                                {siteName[0]}
                            </div>
                        )}
                        <div className="hidden md:block">
                            <span className="font-black text-xl tracking-tighter block leading-none">{siteName}</span>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Services</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Categories */}
                <nav className="flex-1 overflow-y-auto py-10 space-y-2 no-scrollbar px-3 md:px-6">
                    {categoryNames.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`w-full text-left px-4 md:px-6 py-5 rounded-2xl transition-all relative group overflow-hidden ${activeCategory === cat
                                ? 'bg-white/5 text-white'
                                : 'text-zinc-500 hover:text-white hover:bg-white/[0.02]'
                                }`}
                        >
                            {activeCategory === cat && (
                                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[var(--primary)] rounded-full shadow-[0_0_15px_var(--primary)]" />
                            )}
                            <span className="hidden md:block font-black text-[11px] uppercase tracking-[0.3em] transition-transform group-hover:translate-x-1">{cat}</span>
                            <span className="md:hidden text-[10px] font-black uppercase text-center block">{cat.slice(0, 3)}</span>
                        </button>
                    ))}
                </nav>

                {/* Bottom Administrative Actions */}
                <div className="p-6 md:p-8 border-t border-white/5 space-y-4">
                    {isOwner && (
                        <Link href="/dashboard/restaurant" className="block">
                            <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-widest">
                                <LayoutDashboard size={18} />
                                <span className="hidden md:inline">Dashboard</span>
                            </Button>
                        </Link>
                    )}
                    <button
                        onClick={() => setShowScanner(true)}
                        className="w-full flex items-center justify-center md:justify-start gap-4 px-4 py-4 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5 active:scale-95"
                    >
                        <QrCode size={18} strokeWidth={2.5} />
                        <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Scan Table QR</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area - Cinematic Showcase */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Decorative Ambient Glows */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--primary)]/10 rounded-full blur-[200px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/2 rounded-full blur-[150px] pointer-events-none translate-y-1/2 -translate-x-1/4" />

                {/* Top Nav Overlay */}
                <div className="absolute top-0 inset-x-0 h-32 px-10 flex items-center justify-between z-20 pointer-events-none">
                    <div className="flex items-center gap-6 pointer-events-auto">
                        <button
                            onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')}
                            className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                        >
                            {lang === 'fr' ? 'FR' : 'EN'}
                        </button>
                        {tableId && (
                            <div className="h-10 px-6 rounded-full bg-white/5 border border-white/5 backdrop-blur-xl flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">Table {tableId}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowCart(true)}
                        className="pointer-events-auto h-16 px-8 flex items-center gap-6 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all shadow-2xl active:scale-95"
                    >
                        <div className="text-right">
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Order Total</p>
                            <p className="text-xl font-black text-white leading-none">{totalPrice.toFixed(2)} <span className="text-[10px]">{CURRENCY}</span></p>
                        </div>
                        <div className="relative">
                            <ShoppingCart size={22} strokeWidth={2.5} />
                            {totalItems > 0 && (
                                <div className="absolute -top-2.5 -right-2.5 bg-[var(--primary)] text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-4 border-[#050505] shadow-lg">
                                    {totalItems}
                                </div>
                            )}
                        </div>
                    </button>
                </div>

                {/* Big Item Presentation */}
                {currentItem ? (
                    <div className="flex-1 flex flex-col lg:flex-row relative group">
                        {/* Immersive Background Image */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src={currentItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'}
                                alt={currentItem.name}
                                className="w-full h-full object-cover opacity-40 transition-transform duration-[3s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent hidden lg:block" />
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 md:px-20 lg:px-32 py-40">
                            <div className="max-w-3xl animate-in slide-in-from-left-10 duration-1000">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-px w-12 bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[var(--primary)]">
                                        Signature Dish
                                    </span>
                                </div>
                                <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black mb-10 leading-[0.8] tracking-tighter transition-all hover:tracking-[-0.05em] cursor-default">
                                    {currentItem.name}
                                </h1>
                                <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed mb-16 max-w-xl">
                                    {currentItem.description || 'An extraordinary culinary composition crafted with precision using curated ingredients from our local partners.'}
                                </p>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Exclusive Price</span>
                                        <span className="text-5xl font-black text-white tabular-nums">{currentItem.price}<span className="text-xl ml-2 font-light opacity-50">{CURRENCY}</span></span>
                                    </div>
                                    <Button
                                        onClick={() => addItem({ id: currentItem.id, name: currentItem.name, price: currentItem.price, image: currentItem.image })}
                                        className="h-20 px-16 rounded-[40px] bg-white text-black hover:bg-zinc-200 transition-all font-black text-lg uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95"
                                    >
                                        {t.add_to_order}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Visual Ornament Side */}
                        <div className="hidden lg:flex w-1/4 h-full flex-col justify-center items-center pr-20 relative z-10">
                            <div className="relative h-[500px] w-full max-w-[300px] rounded-[100px] border border-white/10 overflow-hidden shadow-2xl transition-transform duration-1000 rotate-3 group-hover:rotate-0">
                                <img
                                    src={currentItem.image || ''}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-10 left-0 right-0 text-center">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Details</span>
                                    <p className="font-serif italic text-white text-xl mt-2">Verified Fresh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-800 space-y-6">
                        <div className="h-32 w-32 border border-zinc-900 rounded-full flex items-center justify-center">
                            <X size={48} className="opacity-10" />
                        </div>
                        <p className="text-2xl font-black uppercase tracking-widest opacity-20">Catalog Empty</p>
                    </div>
                )}

                {/* Navigation Controls - Minimal & High End */}
                {filteredItems.length > 1 && (
                    <div className="absolute bottom-12 right-12 z-20 flex gap-4">
                        <button
                            onClick={prevItem}
                            disabled={currentItemIndex === 0}
                            className="h-16 w-16 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/5 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-10 disabled:cursor-not-allowed transition-all active:scale-90"
                        >
                            <ChevronLeft size={24} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={nextItem}
                            disabled={currentItemIndex === filteredItems.length - 1}
                            className="h-16 w-16 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/5 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-10 disabled:cursor-not-allowed transition-all active:scale-90"
                        >
                            <ChevronRight size={24} strokeWidth={2.5} />
                        </button>
                    </div>
                )}

                {/* Timeline Progress */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                    {filteredItems.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentItemIndex(idx)}
                            className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentItemIndex ? 'w-12 bg-white' : 'w-4 bg-white/10 hover:bg-white/20'
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
