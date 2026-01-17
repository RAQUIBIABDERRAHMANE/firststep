'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import { ArrowRight, Bell, ChevronLeft, Minus, Plus, QrCode, ShoppingCart, X, Check, Loader2, Sparkles } from 'lucide-react'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })

import { translations, Language, CURRENCY } from '@/lib/translations'

export default function RestaurantTemplateMinimal({ siteName, description, coverImage, logo, config, categories, isOwner, primaryColor }: RestaurantTemplateProps) {
    const defaultData = useRestaurantLogic(categories, isOwner)
    const {
        showScanner, setShowScanner, showCart, setShowCart,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity, removeItem,
        totalPrice, totalItems, tableId, filteredItems, categoryNames, handleScan, handlePlaceOrder, handleCallWaiter,
        activeOrderId, orderStatus
    } = defaultData

    const [lang, setLang] = useState<Language>('fr')
    const t = translations[lang].restaurant

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
            {/* Top Navigation Bar - Glassmorphism */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-500">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-12 w-12 object-contain transition-transform group-hover:scale-110" />
                        ) : (
                            <div className="h-12 w-12 bg-black text-white flex items-center justify-center font-serif text-2xl font-black rounded-xl shadow-lg shadow-black/10">
                                {siteName[0]}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="font-black text-xl tracking-tight leading-none">{siteName}</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">Premium Dining</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                        {isOwner && (
                            <Link href="/dashboard/restaurant" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[var(--primary)] transition-colors hidden md:block">
                                Admin Dashboard
                            </Link>
                        )}
                        <button onClick={() => setShowScanner(true)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                            <QrCode size={22} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')}
                            className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest bg-slate-100 rounded-full px-4 py-1.5 transition-all active:scale-95"
                        >
                            {lang === 'fr' ? 'FR' : 'EN'}
                        </button>
                        <button
                            onClick={() => setShowCart(true)}
                            className="relative flex items-center justify-center h-12 w-12 bg-black hover:bg-slate-800 text-white rounded-2xl transition-all shadow-xl shadow-black/10 active:scale-95"
                        >
                            <ShoppingCart size={20} strokeWidth={2.5} />
                            {totalItems > 0 && (
                                <div className="absolute -top-1.5 -right-1.5 bg-[var(--primary)] text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                    {totalItems}
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Impactful & Clean */}
            <header className="relative pt-40 pb-20 md:pt-56 md:pb-40 px-6 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-40 -left-20 w-80 h-80 bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-20 -right-20 w-96 h-96 bg-slate-200/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div className="order-2 md:order-1 animate-in slide-in-from-bottom-10 duration-1000 fade-in">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-px w-8 bg-slate-300" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
                                {config.subtitle || "The Art of Gastronomy"}
                            </span>
                        </div>
                        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-medium text-slate-900 mb-10 leading-[0.95] tracking-tight">
                            {config.heroTitle || "Simple. Fresh. Elegant."}
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed mb-12 max-w-lg font-medium">
                            {description || "A curated dining experience celebrating the finest seasonal local produce and culinary traditions."}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full border border-slate-300" />
                                <span>{config.address || "123 Royale Avenue"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full border border-slate-300" />
                                <span>{config.phone || "+212 5XX-XXXXXX"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 relative group">
                        <div className="relative h-[450px] md:h-[650px] w-full rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-1000 delay-300">
                            <img
                                src={coverImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070'}
                                alt="Hero"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        </div>
                        {/* Status Float */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-10 shadow-3xl hidden lg:block border border-slate-100 rounded-3xl animate-float">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Status</p>
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="font-serif text-2xl text-slate-900 italic">Open for Table Service</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Category Navigation - Minimal & Sticky */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100/50 py-6 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar flex items-center justify-center gap-12">
                    {categoryNames.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => scrollToCategory(cat)}
                            className={`whitespace-nowrap text-[11px] font-black uppercase tracking-[0.3em] transition-all relative py-2 ${activeSection === cat
                                ? 'text-black'
                                : 'text-slate-400 hover:text-slate-900'
                                }`}
                        >
                            {cat}
                            {activeSection === cat && (
                                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Sections */}
            <div className="max-w-7xl mx-auto px-6 space-y-40 mt-32">
                {categoryNames.map((cat) => {
                    const categoryItems = categories.find((c: any) => c.name === cat)?.dishes || []
                    if (categoryItems.length === 0) return null

                    return (
                        <section id={`cat-${cat}`} key={cat} className="scroll-mt-48 animate-in slide-in-from-bottom-8 duration-700">
                            <div className="max-w-3xl mb-20">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-px w-12 bg-[var(--primary)]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary)]">Curated Selection</span>
                                </div>
                                <h3 className="font-serif text-5xl md:text-7xl text-slate-900 mb-6">{cat}</h3>
                                <p className="text-slate-500 text-lg max-w-lg leading-relaxed font-medium">
                                    A collection of our finest {cat.toLowerCase()}, prepared with exceptional care and precision.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
                                {categoryItems.map((item: any) => (
                                    <div key={item.id} className="group flex flex-col sm:flex-row gap-8 items-start relative">
                                        {/* Image Container with Hover Effect */}
                                        <div className="w-full sm:w-48 sm:h-48 aspect-square shrink-0 overflow-hidden rounded-[32px] bg-slate-50 relative shadow-xl shadow-slate-200 transition-transform duration-500 group-hover:-translate-y-2">
                                            <img
                                                src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 min-w-0 py-2">
                                            <div className="flex justify-between items-baseline mb-4">
                                                <h4 className="font-serif text-3xl font-medium text-slate-900 group-hover:text-[var(--primary)] transition-colors">{item.name}</h4>
                                                <div className="h-px flex-1 mx-6 bg-slate-100 hidden sm:block" />
                                                <span className="font-black text-xl text-slate-900">{item.price} <span className="text-[10px] uppercase ml-1">{CURRENCY}</span></span>
                                            </div>
                                            <p className="text-slate-500 text-base leading-relaxed mb-8 font-medium line-clamp-2">
                                                {item.description || "A masterfully balanced composition of premium ingredients and delicate execution."}
                                            </p>
                                            <button
                                                onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
                                                className="group/btn flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-black pr-12 transition-all"
                                            >
                                                <div className="h-10 w-10 bg-slate-100 group-hover/btn:bg-black group-hover/btn:text-white rounded-full flex items-center justify-center transition-all">
                                                    <Plus size={16} />
                                                </div>
                                                <span className="group-hover/btn:translate-x-1 transition-transform">{t.add_to_order}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                })}
            </div>

            {/* Footer - Elegant & Minimal */}
            <footer className="mt-60 border-t border-slate-100 bg-white py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
                        <div className="md:col-span-2 space-y-8">
                            <h4 className="font-serif text-4xl text-slate-900 leading-tight">{siteName}</h4>
                            <p className="text-slate-500 text-lg max-w-sm leading-relaxed font-medium">
                                Redefining the boundaries of culinary excellence, one plate at a time.
                            </p>
                            <div className="flex gap-6 pt-4">
                                <div className="h-12 w-12 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-black hover:border-black transition-all cursor-pointer">
                                    <Sparkles size={18} />
                                </div>
                                <div className="h-12 w-12 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-black hover:border-black transition-all cursor-pointer">
                                    <QrCode size={18} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{t.hours}</h5>
                            <p className="text-slate-900 font-medium leading-loose whitespace-pre-line">
                                {config.hours || "Tue — Sun\n12:30 — 15:30\n19:30 — 23:00"}
                            </p>
                        </div>
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{t.contact}</h5>
                            <div className="space-y-4 text-slate-900 font-medium leading-relaxed">
                                <p className="hover:text-[var(--primary)] transition-all cursor-pointer">{config.address}</p>
                                <p className="hover:text-[var(--primary)] transition-all cursor-pointer font-black text-xl">{config.phone || "0522XXXXXX"}</p>
                                <p className="hover:text-[var(--primary)] transition-all cursor-pointer text-slate-400">{config.email || "hello@firststep.ma"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                            &copy; {new Date().getFullYear()} {siteName}. Proprietary System.
                        </p>
                        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                            <a href="#" className="hover:text-black transition-colors">Privacy</a>
                            <a href="#" className="hover:text-black transition-colors">Safety</a>
                            <a href="#" className="hover:text-black transition-colors">Terms</a>
                        </div>
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
                                                <span className="font-medium text-slate-600">{item.price} {CURRENCY}</span>
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
                                    <span className="text-sm font-bold uppercase tracking-wider text-slate-500">{t.total}</span>
                                    <span className="font-serif text-3xl text-slate-900">{totalPrice.toFixed(2)} {CURRENCY}</span>
                                </div>
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={!tableId || isPlacingOrder}
                                    className="w-full h-14 rounded-xl bg-[var(--primary)] text-white hover:brightness-110 font-bold text-lg shadow-xl shadow-[var(--primary)]/20"
                                >
                                    {isPlacingOrder ? `${t.status.PENDING}...` : t.place_order}
                                </Button>
                                {!tableId && (
                                    <p className="text-center text-xs text-red-500 mt-4 font-medium px-4 py-2 bg-red-50 rounded-lg">
                                        Please scan the table QR code to complete your order.
                                    </p>
                                )}
                            </div>
                        )}
                        {orderComplete || activeOrderId ? (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in z-50">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${orderStatus === 'READY' || orderStatus === 'SERVED' ? 'bg-green-100 text-green-600' :
                                    orderStatus === 'PREPARING' || orderStatus === 'COOKING' ? 'bg-orange-100 text-orange-600 animate-pulse' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                    {orderStatus === 'READY' || orderStatus === 'SERVED' ? <Check size={48} /> :
                                        orderStatus === 'PREPARING' || orderStatus === 'COOKING' ? <Loader2 size={48} className="animate-spin" /> :
                                            <Sparkles size={48} />}
                                </div>
                                <h2 className="text-3xl font-serif text-slate-900 mb-2">
                                    {orderStatus === 'PENDING' && 'Order Sent!'}
                                    {orderStatus === 'PREPARING' && 'Preparing...'}
                                    {orderStatus === 'COOKING' && 'Cooking...'}
                                    {orderStatus === 'READY' && 'Ready to Serve!'}
                                    {orderStatus === 'SERVED' && 'Bon Appétit!'}
                                    {!orderStatus && 'Order Confirmed'}
                                </h2>
                                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                                    {orderStatus === 'PENDING' && 'Your order has been sent to the kitchen.'}
                                    {orderStatus === 'PREPARING' && 'The chef looks excited about this one.'}
                                    {orderStatus === 'COOKING' && 'Good things take time. Sit tight!'}
                                    {orderStatus === 'READY' && 'Your food is on its way to your table.'}
                                    {orderStatus === 'SERVED' && 'Enjoy your meal!'}
                                    {!orderStatus && 'Your order has been received.'}
                                </p>
                                <div className="inline-block px-4 py-2 bg-slate-100 rounded-full text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">
                                    Status: {orderStatus || 'PENDING'}
                                </div>
                                <Button onClick={() => setOrderComplete(false)} variant="outline" className="border-slate-200 text-slate-900">
                                    Continue Browsing
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {activeOrderId && !showCart && !showScanner && !orderComplete && (
                <div className="fixed bottom-24 right-6 z-40 animate-in slide-in-from-bottom duration-500">
                    <button
                        onClick={() => setShowCart(true)}
                        className="bg-white/90 backdrop-blur border border-slate-200 shadow-xl px-4 py-3 rounded-full flex items-center gap-3 transition-transform hover:scale-105"
                    >
                        <div className={`w-2 h-2 rounded-full ${orderStatus === 'READY' ? 'bg-green-500' : 'bg-[var(--primary)] animate-pulse'}`}></div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            {orderStatus || 'TRACKING'}
                        </div>
                    </button>
                </div>
            )}

            {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
        </div>
    )
}
