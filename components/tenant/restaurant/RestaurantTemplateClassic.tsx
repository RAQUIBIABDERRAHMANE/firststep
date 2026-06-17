'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import {
    ShoppingCart, QrCode, MapPin, Phone, Mail, Plus, Minus, Trash2,
    ChevronRight, Utensils, CheckCircle2, LayoutDashboard, Bell, Receipt
} from 'lucide-react'

import { translations, Language, CURRENCY } from '@/lib/translations'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })
const ReservationModal = dynamic(() => import('./ReservationModal'), { ssr: false })

import DishCustomizationModal from './DishCustomizationModal'

export default function RestaurantTemplateClassic({ siteName, description, coverImage, logo, config, categories, isOwner, primaryColor }: RestaurantTemplateProps) {
    const defaultData = useRestaurantLogic(categories, isOwner)
    const {
        showScanner, setShowScanner, showCart, setShowCart, activeCategory, setActiveCategory,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity,
        totalPrice, totalItems, tableId, categoryNames, filteredItems, handleScan, handlePlaceOrder, handleCallWaiter, handleRequestBill, removeItem,
        customizingDish, setCustomizingDish, handleConfirmCustomization
    } = defaultData

    const [lang, setLang] = useState<Language>('fr')
    const t = translations[lang as Language].restaurant
    const [showReservation, setShowReservation] = useState(false)

    // Use CSS variable for the primary color and custom theme colors
    const containerStyle = {
        '--primary': primaryColor || '#2563eb',
        '--bg-main': config?.backgroundColor || '#ffffff',
        '--text-main': config?.textColor || '#0f172a',
        '--card-bg': config?.cardColor || '#ffffff',
        '--button-bg': config?.buttonBgColor || primaryColor || '#2563eb',
        '--button-text': config?.buttonTextColor || '#ffffff',
        '--header-bg': config?.headerBgColor || config?.cardColor || '#ffffff',
        '--header-text': config?.headerTextColor || config?.textColor || '#0f172a',
        '--footer-bg': config?.footerBgColor || '#0f172a',
        '--footer-text': config?.footerTextColor || '#ffffff',
        '--category-bg': config?.categoryBgColor || config?.cardColor || '#ffffff',
        '--category-highlight': config?.categoryHighlightColor || primaryColor || '#2563eb',
        '--price-color': config?.priceColor || primaryColor || '#2563eb',
    } as React.CSSProperties

    return (
        <div style={containerStyle} className="flex flex-col min-h-screen bg-[var(--bg-main,#ffffff)] font-sans text-[var(--text-main,#0f172a)] selection:bg-[var(--primary)] selection:text-[var(--card-bg,white)]">
            {/* Call Waiter & Request Bill Logic */}
            {tableId && !isOwner && (
                <div className="fixed bottom-10 left-10 z-50 flex flex-col gap-3">
                    <button
                        onClick={handleRequestBill}
                        className="h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-2 border-white"
                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        title="Request Bill"
                    >
                        <Receipt size={22} />
                    </button>
                    <button
                        onClick={handleCallWaiter}
                        className="h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-2 border-white"
                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        title="Call Waiter"
                    >
                        <Bell size={22} />
                    </button>
                </div>
            )}

            {/* Header - Elegant Classic */}
            <header className="sticky top-0 z-40 w-full border-b" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'rgba(0,0,0,0.05)', color: 'var(--header-text)' }}>
                <div className="container mx-auto flex h-24 items-center justify-between px-6 lg:px-12">
                    <div className="flex items-center gap-5">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-12 w-12 md:h-16 md:w-16 object-contain transition-transform hover:scale-110" />
                        ) : (
                            <div className="h-12 w-12 md:h-16 md:w-16 rounded-[20px] flex items-center justify-center font-serif font-black text-2xl md:text-3xl shadow-2xl"
                                 style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}>
                                {siteName[0]}
                            </div>
                        )}
                        <div>
                            <span className="font-serif font-black text-2xl md:text-3xl tracking-tight block leading-none" style={{ color: 'var(--header-text)' }}>{siteName}</span>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none opacity-60" style={{ color: 'var(--header-text)' }}>Established Excellence</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {isOwner && (
                            <Link href="/dashboard/restaurant">
                                <Button variant="ghost" className="hidden md:flex gap-3 rounded-2xl text-[10px] font-black uppercase tracking-widest h-12 px-6 hover:bg-black/5" style={{ color: 'var(--header-text)' }}>
                                    <LayoutDashboard size={14} /> Dashboard
                                </Button>
                            </Link>
                        )}
                        <button
                            onClick={() => setShowScanner(true)}
                            className="h-12 w-12 flex items-center justify-center rounded-2xl transition-all active:scale-95 border"
                            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--header-text)', borderColor: 'rgba(0,0,0,0.08)' }}
                        >
                            <QrCode size={20} />
                        </button>
                        <button
                            onClick={() => setShowReservation(true)}
                            className="h-12 px-6 rounded-2xl shadow-xl hover:brightness-110 transition-all active:scale-95 flex items-center gap-2"
                            style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">Reserve</span>
                        </button>
                        <button
                            onClick={() => setShowCart(true)}
                            className="group relative h-12 px-6 rounded-2xl shadow-2xl hover:brightness-110 transition-all active:scale-95 flex items-center gap-3"
                            style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        >
                            <ShoppingCart size={20} className="transition-transform group-hover:-translate-y-0.5" />
                            <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Order</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 text-[10px] h-6 w-6 rounded-full flex items-center justify-center font-black border-2 shadow-xl"
                                      style={{ backgroundColor: 'var(--primary)', color: 'var(--card-bg)', borderColor: 'var(--card-bg)' }}>
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 pb-32">
                {/* Hero - Cinematic Classic */}
                <section className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden">
                    <img
                        src={coverImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070'}
                        className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[10s] hover:scale-100"
                        alt="Banner"
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                    <div className="container relative z-10 px-6 max-w-5xl animate-in fade-in zoom-in-95 duration-1000">
                        <div className="inline-flex items-center gap-4 mb-10">
                            <div className="h-px w-12 bg-white/20" />
                            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white/50">Culinary Heritage</span>
                            <div className="h-px w-12 bg-white/20" />
                        </div>
                        <h1 className="text-6xl md:text-9xl font-serif font-black text-white mb-10 leading-[0.85] tracking-tighter">
                            {config.heroTitle || "Delicious moments, served fresh."}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed italic font-serif">
                            "{description || "Explore our menu and experience the best flavors in the city."}"
                        </p>
                    </div>
                    {/* Decorative Scroll indicator */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 animate-pulse">
                        <div className="h-10 w-[1px] bg-white" />
                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">Scroll</span>
                    </div>
                </section>

                {/* Categories - Sticky & Refined */}
                <div className="sticky top-24 z-30 backdrop-blur-md border-b py-6 overflow-x-auto no-scrollbar shadow-sm"
                     style={{ backgroundColor: 'var(--category-bg)', borderColor: 'rgba(0,0,0,0.05)' }}>
                    <div className="container mx-auto px-6 lg:px-12 flex gap-4 min-w-max">
                        {categoryNames.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className="px-8 py-4 rounded-full font-serif font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 border"
                                style={{
                                    backgroundColor: activeCategory === cat ? 'var(--category-highlight)' : 'var(--card-bg)',
                                    color: activeCategory === cat ? 'var(--button-text)' : 'var(--text-main)',
                                    borderColor: activeCategory === cat ? 'var(--category-highlight)' : 'rgba(0,0,0,0.05)',
                                    transform: activeCategory === cat ? 'translateY(-2px)' : 'none',
                                    boxShadow: activeCategory === cat ? '0 10px 20px rgba(0,0,0,0.1)' : 'none',
                                    opacity: activeCategory === cat ? 1 : 0.6
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu - Structured Elegance */}
                <section className="py-24 container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                        {filteredItems.length > 0 ? filteredItems.map((item: any) => (
                            <div key={item.id} className="group bg-[var(--card-bg,white)] rounded-[40px] border border-transparent hover:border-slate-100 overflow-hidden hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 flex flex-col">
                                <div className="relative aspect-square overflow-hidden bg-slate-50">
                                    <img
                                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'}
                                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                        alt={item.name}
                                    />
                                    <div className="absolute top-6 right-6 px-5 py-2.5 backdrop-blur-xl rounded-2xl font-serif font-black shadow-2xl border border-white/50 text-xl tracking-tight"
                                         style={{ backgroundColor: 'var(--card-bg)', color: 'var(--price-color)' }}>
                                        {item.price} <span className="text-xs">{CURRENCY}</span>
                                    </div>
                                </div>
                                <div className="p-10 flex-1 flex flex-col text-center">
                                    <h3 className="text-2xl font-serif font-black mb-2 transition-colors leading-tight" style={{ color: 'var(--text-main)' }}>
                                        {item.name}
                                    </h3>
                                    {/* Dietary tags */}
                                    {(() => {
                                        let tagsList: string[] = []
                                        try {
                                            tagsList = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || [])
                                        } catch {}
                                        if (tagsList.length === 0) return null
                                        return (
                                            <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                                                {tagsList.map(tag => (
                                                    <span key={tag} className="px-2.5 py-1 bg-black/5 text-[9px] font-black uppercase tracking-wider rounded-md" style={{ color: 'var(--text-main)' }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )
                                    })()}
                                    <p className="font-serif italic text-sm leading-relaxed mb-10 flex-1 px-4 opacity-75" style={{ color: 'var(--text-main)' }}>
                                        {item.description || "Prepared using traditional methods with hand-picked seasonal ingredients."}
                                    </p>
                                    <Button
                                        onClick={() => addItem(item)}
                                        className="w-full h-16 rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 border-2 border-transparent"
                                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                    >
                                        {t.add_to_order}
                                    </Button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-40 text-center space-y-8">
                                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                    <Utensils size={40} />
                                </div>
                                <h3 className="text-3xl font-serif font-black text-slate-950">Catalogue Inactive</h3>
                                <p className="text-slate-400 max-w-xs mx-auto">This section is currently undergoing a culinary refresh. Please check back shortly.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Cart Drawer - Premium Sidebar */}
            {showCart && (
                <div className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-500">
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-[var(--card-bg,white)] shadow-3xl animate-in slide-in-from-right duration-700 outline-none flex flex-col">
                        <div className="p-12 border-b flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-serif font-black tracking-tight text-slate-950">Your Selection</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{totalItems} ARTISANAL ITEMS</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowCart(false)} className="h-12 w-12 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-950 transition-colors">
                                <Trash2 size={24} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <ShoppingCart size={48} className="text-slate-100" />
                                    <h3 className="text-2xl font-serif font-black text-slate-950">Selection Empty</h3>
                                    <p className="text-slate-400 text-sm max-w-xs mx-auto">Begin your culinary journey by adding signature dishes to your order.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.cartItemId} className="flex gap-8 items-center group">
                                        <div className="h-24 w-24 rounded-3xl overflow-hidden bg-slate-50 flex-shrink-0 shadow-lg border border-slate-100">
                                            <img src={item.image || ''} className="h-full w-full object-cover transition-transform group-hover:scale-110" alt="" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="font-serif font-black text-xl text-slate-950 leading-tight">{item.name}</h4>
                                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                                    {item.selectedOptions.map(o => `${o.group}: ${o.choice}`).join(', ')}
                                                </div>
                                            )}
                                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                <div className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">
                                                    + {item.selectedAddons.map(a => `${a.name} (+${a.price} MAD)`).join(', ')}
                                                </div>
                                            )}
                                            <span className="text-slate-400 font-bold text-sm tracking-tight block mt-1" style={{ color: 'var(--price-color)' }}>{item.price} {CURRENCY}</span>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <button onClick={() => removeItem(item.cartItemId)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Remove item">
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="flex items-center gap-3 rounded-2xl shadow-xl px-4 py-2.5"
                                                 style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}>
                                                <button onClick={() => updateQuantity(item.cartItemId, -1)} className="hover:opacity-70 transition-opacity"><Minus size={14} strokeWidth={3} /></button>
                                                <span className="font-black text-sm w-6 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.cartItemId, 1)} className="hover:opacity-70 transition-opacity"><Plus size={14} strokeWidth={3} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {items.length > 0 && (
                            <div className="p-12 border-t bg-slate-50/50 space-y-10">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">GRAND TOTAL</span>
                                        <p className="text-sm font-medium text-slate-500">Service Charges Included</p>
                                    </div>
                                    <span className="text-5xl font-serif font-black tracking-tighter text-slate-950">{totalPrice.toFixed(2)} <span className="text-xl font-normal opacity-30">{CURRENCY}</span></span>
                                </div>
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={!tableId || isPlacingOrder}
                                    className="w-full h-24 rounded-[32px] text-sm font-black uppercase tracking-[0.4em] shadow-3xl disabled:opacity-20 active:scale-95 transition-all outline-none border-4 border-slate-100"
                                    style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                >
                                    {isPlacingOrder ? 'Transmitting...' : 'Confirm Order'} <ChevronRight className="ml-4" />
                                </Button>
                                {!tableId && (
                                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                                        <p className="text-[10px] font-black uppercase text-rose-500 tracking-widest">Interaction Required</p>
                                        <p className="text-xs text-rose-400 font-medium mt-1">Please scan table QR code to finalize checkout.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {orderComplete && (
                            <div className="absolute inset-0 bg-[var(--card-bg,white)] z-[70] flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-700">
                                <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mb-10">
                                    <CheckCircle2 size={40} className="text-emerald-500 animate-bounce" />
                                </div>
                                <h2 className="text-4xl font-serif font-black mb-6 text-slate-950">Received with Thanks</h2>
                                <p className="text-slate-400 text-lg mb-12 italic font-serif">"Our culinary team is now attending to your selection with the utmost care."</p>
                                <Button
                                    onClick={() => {
                                        setOrderComplete(false)
                                        setShowCart(false)
                                    }}
                                    className="rounded-full h-16 px-12 font-black uppercase tracking-widest text-[10px]"
                                    style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                >
                                    Return to Menu
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}

            {/* Footer - Sophisticated Finish */}
            <footer className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--footer-bg)', color: 'var(--footer-text)' }}>
                <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)' }} />
                <div className="container mx-auto px-12 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-24 items-start">
                        <div className="space-y-8">
                            <h4 className="font-serif font-black text-2xl tracking-tight">{siteName}</h4>
                            <p className="font-serif italic text-sm leading-relaxed max-w-xs mx-auto opacity-75">
                                "Commitment to culinary excellence and the preservation of traditional gastronomic arts."
                            </p>
                            <div className="flex justify-center gap-6 pt-4">
                                <div className="h-10 w-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"><Mail size={14} /></div>
                                <div className="h-10 w-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"><Phone size={14} /></div>
                                <div className="h-10 w-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"><MapPin size={14} /></div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-50">Contact & Arrival</h4>
                            <div className="space-y-4">
                                <p className="font-serif text-lg opacity-85">{config?.address}</p>
                                <p className="text-xl font-bold tracking-tight">{config?.phone || '+212 522 00 00 00'}</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-50">Service Hours</h4>
                            <div className="space-y-4">
                                <p className="font-serif text-lg whitespace-pre-line leading-relaxed opacity-85">{config?.hours || 'Lunch: 12:00 — 15:00\nDinner: 19:00 — 23:00'}</p>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Reservations Recommended</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 text-[9px] font-black uppercase tracking-[0.6em] opacity-40">
                        <p>© {new Date().getFullYear()} {siteName} / GRAND DINING GROUP</p>
                        <nav className="flex gap-10">
                            <a href="#" className="hover:text-white transition-colors">Legal</a>
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Inquiry</a>
                        </nav>
                    </div>
                </div>
            </footer>

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
            />
        </div>
    )
}
