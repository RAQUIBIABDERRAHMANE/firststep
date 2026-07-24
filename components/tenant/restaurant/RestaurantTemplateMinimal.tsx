'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import { ArrowRight, Bell, ChevronLeft, Minus, Plus, QrCode, ShoppingCart, X, Check, Loader2, Sparkles, Trash2, Receipt, Split } from 'lucide-react'
import SplitBillModal from './SplitBillModal'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })
const ReservationModal = dynamic(() => import('./ReservationModal'), { ssr: false })

import { translations, Language, CURRENCY } from '@/lib/translations'

import DishCustomizationModal from './DishCustomizationModal'

export default function RestaurantTemplateMinimal({ siteName, description, coverImage, logo, config, categories, isOwner, primaryColor, slug }: RestaurantTemplateProps) {
    const defaultData = useRestaurantLogic(categories, isOwner, slug)
    const {
        showScanner, setShowScanner, showCart, setShowCart,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity, removeItem,
        totalPrice, totalItems, tableId, filteredItems, categoryNames, handleScan, handlePlaceOrder, handleCallWaiter, handleRequestBill,
        activeOrderId, orderStatus, customizingDish, setCustomizingDish, handleConfirmCustomization,
        showSplitBill, setShowSplitBill, activeOrderDetails, handleOpenSplitBill
    } = defaultData

    const [lang, setLang] = useState<Language>('fr')
    const t = translations[lang].restaurant
    const [showReservation, setShowReservation] = useState(false)
    const [showOrderTracking, setShowOrderTracking] = useState(false)

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

    // Use CSS variable for the primary color and custom theme colors
    const containerStyle = {
        '--primary': primaryColor || '#0f172a', // Default slate-900
        '--bg-main': config?.backgroundColor || '#ffffff',
        '--text-main': config?.textColor || '#000000',
        '--card-bg': config?.cardColor || '#f8f9fa',
        '--button-bg': config?.buttonBgColor || primaryColor || '#0f172a',
        '--button-text': config?.buttonTextColor || '#ffffff',
        '--header-bg': config?.headerBgColor || config?.cardColor || '#ffffff',
        '--header-text': config?.headerTextColor || config?.textColor || '#000000',
        '--footer-bg': config?.footerBgColor || '#f8f9fa',
        '--footer-text': config?.footerTextColor || '#000000',
        '--category-bg': config?.categoryBgColor || 'transparent',
        '--category-highlight': config?.categoryHighlightColor || primaryColor || '#0f172a',
        '--price-color': config?.priceColor || primaryColor || '#0f172a',
    } as React.CSSProperties

    return (
        <div style={{ ...containerStyle, backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} className="min-h-screen font-montserrat selection:bg-[var(--primary)] selection:text-[var(--bg-main)] pb-24">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500;600;700;900&display=swap');
                .font-cormorant { font-family: 'Cormorant Garamond', serif; }
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            {/* Top Navigation Bar - Glassmorphism */}
            <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-500"
                 style={{ backgroundColor: 'var(--header-bg)', color: 'var(--header-text)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-9 w-9 sm:h-12 sm:w-12 object-contain transition-transform group-hover:scale-110" />
                        ) : (
                            <div className="h-9 w-9 sm:h-12 sm:w-12 flex items-center justify-center font-serif text-xl sm:text-2xl font-black rounded-xl shadow-lg shadow-black/10"
                                 style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}>
                                {siteName[0]}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="font-black text-base sm:text-xl tracking-tight leading-none" style={{ color: 'var(--header-text)' }}>{siteName}</span>
                            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.2em] mt-1 opacity-50" style={{ color: 'var(--header-text)' }}>Premium Dining</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
                        {isOwner && (
                            <Link href="/dashboard/restaurant" className="text-xs font-black uppercase tracking-widest transition-colors hidden md:block"
                                  style={{ color: 'var(--header-text)', opacity: 0.6 }}>
                                Admin Dashboard
                            </Link>
                        )}
                        <button onClick={() => setShowScanner(true)} className="p-2 transition-colors hover:opacity-75" style={{ color: 'var(--header-text)' }}>
                            <QrCode size={20} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')}
                            className="hidden sm:block text-[10px] font-black uppercase tracking-widest rounded-full px-3 py-1.5 transition-all active:scale-95 bg-black/5"
                            style={{ color: 'var(--header-text)' }}
                        >
                            {lang === 'fr' ? 'FR' : 'EN'}
                        </button>
                        <button
                            onClick={() => setShowReservation(true)}
                            className="hidden sm:block text-[10px] font-black uppercase tracking-widest hover:brightness-110 rounded-full px-4 sm:px-5 h-9 sm:h-10 transition-all active:scale-95 shadow-lg shadow-black/5"
                            style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        >
                            Reserve
                        </button>
                        <button
                            onClick={() => {
                                setShowCart(true)
                                setShowOrderTracking(false)
                            }}
                            className="relative flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl transition-all shadow-xl shadow-black/10 active:scale-95"
                            style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        >
                            <ShoppingCart size={18} strokeWidth={2.5} />
                            {totalItems > 0 && (
                                <div className="absolute -top-1.5 -right-1.5 text-[10px] font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-4 shadow-lg"
                                     style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-main)', borderColor: 'var(--header-bg)' }}>
                                    {totalItems}
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Impactful & Clean */}
            <header className="relative pt-24 pb-10 sm:pt-32 sm:pb-16 md:pt-56 md:pb-40 px-4 sm:px-6 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-40 -left-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'rgba(var(--primary-rgb, 15, 23, 42), 0.05)' }} />
                <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }} />

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 lg:gap-24 items-center">
                    <div className="order-2 md:order-1 animate-in slide-in-from-bottom-10 duration-1000 fade-in">
                        <div className="flex items-center gap-3 mb-4 sm:mb-8">
                            <div className="h-px w-8 bg-slate-300" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
                                {config.subtitle || "The Art of Gastronomy"}
                            </span>
                        </div>
                        <h1 className="font-cormorant text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-medium text-[var(--text-main)] mb-6 sm:mb-10 leading-[0.95] tracking-tight">
                            {config.heroTitle || "Simple. Fresh. Elegant."}
                        </h1>
                        <p className="text-base sm:text-xl text-slate-500 leading-relaxed mb-6 sm:mb-12 max-w-lg font-medium">
                            {description || "A curated dining experience celebrating the finest seasonal local produce and culinary traditions."}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
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
                        <div className="relative h-[220px] sm:h-[380px] md:h-[450px] lg:h-[650px] w-full rounded-2xl sm:rounded-[40px] overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)] sm:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-1000 delay-300">
                            <img
                                src={coverImage || 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=2000'}
                                alt="Restaurant Interior"
                                className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-103"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Sticky Category Selection Bar */}
            <div className="sticky top-16 sm:top-20 z-40 py-3 sm:py-6 border-b transition-all"
                 style={{ backgroundColor: 'var(--header-bg)', borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ backgroundColor: 'var(--category-bg)' }}>
                    <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto no-scrollbar flex gap-4 sm:gap-8">
                        {categoryNames.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => scrollToCategory(cat)}
                                className="relative py-2 shrink-0 transition-all duration-300"
                            >
                                <span className="font-black text-xs uppercase tracking-widest block transition-colors whitespace-nowrap"
                                      style={{ color: activeSection === cat ? 'var(--category-highlight)' : 'var(--text-main)', opacity: activeSection === cat ? 1 : 0.4 }}>
                                    {cat}
                                </span>
                                {activeSection === cat && (
                                    <div className="w-1/2 mx-auto h-[3px] rounded-full mt-2"
                                         style={{ backgroundColor: 'var(--category-highlight)' }} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Items Showcase */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20 space-y-12 sm:space-y-20 md:space-y-32">
                {categoryNames.map((cat) => {
                    const categoryItems = categories.find((c: any) => c.name === cat)?.dishes || []
                    if (categoryItems.length === 0) return null

                    return (
                        <section id={`cat-${cat}`} key={cat} className="scroll-mt-28 sm:scroll-mt-36">
                            <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-10 md:mb-16">
                                <h3 className="font-cormorant text-2xl sm:text-3xl md:text-4xl text-[var(--text-main)] font-medium">
                                    {cat}
                                </h3>
                                <div className="h-px flex-1 bg-slate-100" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                                    {categoryItems.length} Offerings
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-12 xl:gap-16">
                                {categoryItems.map((item: any) => {
                                    return (
                                        <div key={item.id} className="group flex flex-col justify-between p-6 rounded-3xl transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.02)] border border-slate-100 hover:border-slate-200"
                                             style={{ backgroundColor: 'var(--card-bg)' }}>
                                            <div className="space-y-6">
                                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50">
                                                    <img
                                                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'}
                                                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-103"
                                                        alt={item.name}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <h4 className="font-cormorant text-2xl text-[var(--text-main)] leading-snug group-hover:opacity-85 transition-opacity">
                                                            {item.name}
                                                        </h4>
                                                    </div>
                                                    {/* Dietary tags */}
                                                    {(() => {
                                                        let tagsList: string[] = []
                                                        try {
                                                            tagsList = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || [])
                                                        } catch {}
                                                        if (tagsList.length === 0) return null
                                                        return (
                                                            <div className="flex flex-wrap gap-1.5 justify-start">
                                                                {tagsList.map(tag => (
                                                                    <span key={tag} className="px-2.5 py-1 bg-black/5 text-[9px] font-black uppercase tracking-wider rounded-md" style={{ color: 'var(--text-main)', opacity: 0.6 }}>
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )
                                                    })()}
                                                    <p className="text-sm text-slate-400 leading-relaxed font-medium pt-2">
                                                        {item.description || "Fresh local ingredients, prepared and seasoned according to the chef's secret recipe."}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-6 border-t border-slate-100/50 pt-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Price</span>
                                                    <span className="font-serif text-3xl font-medium tracking-tight mt-1" style={{ color: 'var(--price-color)' }}>
                                                        {item.price} <span className="text-sm font-sans font-black opacity-30">{CURRENCY}</span>
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => addItem(item)}
                                                    className="rounded-full h-12 w-12 flex items-center justify-center transition-all active:scale-95 hover:scale-105"
                                                    style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                                >
                                                    <Plus size={20} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )
                })}
            </div>

            {/* Footer */}
            <footer className="py-24 border-t" style={{ backgroundColor: 'var(--footer-bg)', color: 'var(--footer-text)', borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 items-start">
                        <div className="space-y-4 md:col-span-2">
                            <span className="font-cormorant text-3xl tracking-tight block">{siteName}</span>
                            <p className="text-slate-400 text-sm max-w-sm font-medium leading-relaxed">
                                {description || "A culinary destination focusing on local sourcing, modern gastronomy, and premium hospitality standards."}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Contact</span>
                            <div className="space-y-2 text-sm text-slate-400 font-medium">
                                <p>{config.address || "123 Royale Avenue, Morocco"}</p>
                                <p className="text-[var(--text-main)] font-bold">{config.phone || "+212 5XX-XXXXXX"}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Timing</span>
                            <div className="space-y-2 text-sm text-slate-400 font-medium whitespace-pre-line leading-relaxed">
                                {config.hours || "Mon - Sun: 12:00 PM - 11:30 PM"}
                            </div>
                        </div>
                    </div>
                    <div className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                            &copy; {new Date().getFullYear()} {siteName}. Proprietary System.
                        </p>
                        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                            <a href="#" className="hover:text-black transition-colors">Privacy</a>
                            <a href="#" className="hover:text-black transition-colors">Safety</a>
                            <a href="#" className="hover:text-black transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Call Waiter & Request Bill Logic */}
            {tableId && !isOwner && (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                    <button
                        onClick={handleRequestBill}
                        className="h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        title="Request Bill"
                    >
                        <Receipt size={22} />
                    </button>
                    <button
                        onClick={handleCallWaiter}
                        className="h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        title="Call Waiter"
                    >
                        <Bell size={22} />
                    </button>
                </div>
            )}

            {/* Cart Drawer */}
            {showCart && (
                <div className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm transition-all" onClick={() => setShowCart(false)}>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-full max-w-md shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col"
                        style={{ backgroundColor: 'var(--card-bg)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-cormorant text-2xl text-[var(--text-main)]">Your Selection</h2>
                            <button onClick={() => setShowCart(false)} className="text-slate-400 hover:text-[var(--text-main)]">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <ShoppingCart size={48} className="mb-4 opacity-20" />
                                    <p className="font-cormorant text-lg">Your cart is empty</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.cartItemId} className="flex gap-4">
                                        <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                            <img src={item.image || ''} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-cormorant text-lg text-[var(--text-main)] leading-tight">{item.name}</h4>
                                                <span className="font-medium shrink-0 ml-2" style={{ color: 'var(--price-color)' }}>{item.price} {CURRENCY}</span>
                                            </div>
                                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                                                    {item.selectedOptions.map(o => `${o.group}: ${o.choice}`).join(', ')}
                                                </div>
                                            )}
                                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                <div className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-1">
                                                    + {item.selectedAddons.map(a => `${a.name} (+${a.price} MAD)`).join(', ')}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <button onClick={() => removeItem(item.cartItemId)} className="text-slate-300 hover:text-red-500 transition-colors p-2" title="Remove item">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="flex items-center gap-4">
                                                    <button onClick={() => updateQuantity(item.cartItemId, -1)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"><Minus size={14} /></button>
                                                    <span className="font-medium w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.cartItemId, 1)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"><Plus size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-sm font-bold uppercase tracking-wider text-slate-500">{t.total}</span>
                                    <span className="font-cormorant text-3xl text-[var(--text-main)]">{totalPrice.toFixed(2)} {CURRENCY}</span>
                                </div>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={!tableId || isPlacingOrder}
                                    className="w-full h-14 rounded-xl hover:brightness-110 font-bold text-lg shadow-xl flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                >
                                    {isPlacingOrder ? `${t.status.PENDING}...` : t.place_order}
                                </button>
                                {!tableId && (
                                    <p className="text-center text-xs text-red-500 mt-4 font-medium px-4 py-2 bg-red-50 rounded-lg">
                                        Please scan the table QR code to complete your order.
                                    </p>
                                )}
                            </div>
                        )}
                        {orderComplete || (activeOrderId && showOrderTracking) ? (
                            <div className="absolute inset-0 bg-[var(--card-bg)]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in z-50">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${orderStatus === 'READY' || orderStatus === 'SERVED' ? 'bg-green-100 text-green-600' :
                                    orderStatus === 'PREPARING' || orderStatus === 'COOKING' ? 'bg-orange-100 text-orange-600 animate-pulse' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                    {orderStatus === 'READY' || orderStatus === 'SERVED' ? <Check size={48} /> :
                                        orderStatus === 'PREPARING' || orderStatus === 'COOKING' ? <Loader2 size={48} className="animate-spin" /> :
                                            <Sparkles size={48} />}
                                </div>
                                <h2 className="text-3xl font-cormorant text-[var(--text-main)] mb-2">
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
                                <div className="inline-block px-4 py-2 bg-slate-100 rounded-full text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
                                    Status: {orderStatus || 'PENDING'}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                                    {activeOrderId && (
                                        <button
                                            onClick={handleOpenSplitBill}
                                            className="flex-1 border rounded-xl h-11 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:brightness-110"
                                            style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                        >
                                            <Split size={14} />
                                            <span>Split Bill</span>
                                        </button>
                                    )}
                                    <Button
                                        onClick={() => {
                                            setOrderComplete(false)
                                            setShowOrderTracking(false)
                                            setShowCart(false)
                                        }}
                                        variant="outline"
                                        className="border-slate-200 text-[var(--text-main)] flex-1 h-11"
                                    >
                                        Continue
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {activeOrderId && !showCart && !showScanner && !orderComplete && (
                <div className="fixed bottom-24 right-6 z-40 animate-in slide-in-from-bottom duration-500">
                    <button
                        onClick={() => {
                            setShowCart(true)
                            setShowOrderTracking(true)
                        }}
                        className="backdrop-blur border border-slate-200 shadow-xl px-4 py-3 rounded-full flex items-center gap-3 transition-transform hover:scale-105"
                        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}
                    >
                        <div className={`w-2 h-2 rounded-full ${orderStatus === 'READY' ? 'bg-green-500' : 'bg-[var(--primary)] animate-pulse'}`}></div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            {orderStatus || 'TRACKING'}
                        </div>
                    </button>
                </div>
            )}

            {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}

            {/* Reservation Modal */}
            <ReservationModal
                isOpen={showReservation}
                onClose={() => setShowReservation(false)}
                tenantId={categories[0]?.tenantId}
                siteName={siteName}
                primaryColor="var(--primary)"
                config={config}
            />

            <DishCustomizationModal
                isOpen={!!customizingDish}
                dish={customizingDish}
                onClose={() => setCustomizingDish(null)}
                onConfirm={handleConfirmCustomization}
                primaryColor={primaryColor}
                buttonBgColor={config?.buttonBgColor}
                buttonTextColor={config?.buttonTextColor}
            />

            {showSplitBill && activeOrderId && activeOrderDetails && (
                <SplitBillModal
                    orderId={activeOrderId}
                    items={activeOrderDetails.items}
                    totalPrice={activeOrderDetails.totalPrice}
                    onClose={() => setShowSplitBill(false)}
                />
            )}
        </div>
    )
}
