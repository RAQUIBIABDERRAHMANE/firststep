'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import { ShoppingCart, QrCode, MapPin, Phone, Mail, Plus, Minus, Trash2, ChevronRight, Utensils, CheckCircle2, LayoutDashboard, Bell, X, Receipt, Split } from 'lucide-react'
import SplitBillModal from './SplitBillModal'
import { translations, Language, CURRENCY } from '@/lib/translations'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })
const ReservationModal = dynamic(() => import('./ReservationModal'), { ssr: false })

import DishCustomizationModal from './DishCustomizationModal'

/* ── Decorative SVG Components ── */
function ZelligePattern({ opacity = 0.08 }: { opacity?: number }) {
    return (
        <svg width="100%" height="100%" style={{ opacity }} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="zellige" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <polygon points="30,0 60,15 60,45 30,60 0,45 0,15" fill="none" stroke="#D4A017" strokeWidth="0.8" />
                    <polygon points="30,10 50,20 50,40 30,50 10,40 10,20" fill="none" stroke="#C1440E" strokeWidth="0.5" />
                    <circle cx="30" cy="30" r="4" fill="none" stroke="#D4A017" strokeWidth="0.6" />
                    <line x1="30" y1="0" x2="30" y2="10" stroke="#D4A017" strokeWidth="0.5" />
                    <line x1="30" y1="50" x2="30" y2="60" stroke="#D4A017" strokeWidth="0.5" />
                    <line x1="0" y1="30" x2="10" y2="30" stroke="#D4A017" strokeWidth="0.5" />
                    <line x1="50" y1="30" x2="60" y2="30" stroke="#D4A017" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#zellige)" />
        </svg>
    )
}

function StarOrnament({ size = 40, color = '#D4A017' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill={color} opacity="0.9" />
            <polygon points="50,20 57,40 79,40 62,53 68,75 50,62 32,75 38,53 21,40 43,40" fill="#1A2340" opacity="0.6" />
        </svg>
    )
}

function ArchDivider() {
    return (
        <div className="flex items-center justify-center gap-4 my-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/40" />
            <StarOrnament size={24} />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/40" />
        </div>
    )
}

function GoldBorder() {
    return (
        <div className="w-full h-3 relative overflow-hidden">
            <svg width="100%" height="12" viewBox="0 0 400 12" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,6 Q25,0 50,6 Q75,12 100,6 Q125,0 150,6 Q175,12 200,6 Q225,0 250,6 Q275,12 300,6 Q325,0 350,6 Q375,12 400,6" stroke="#D4A017" strokeWidth="2" fill="none" />
            </svg>
        </div>
    )
}

export default function RestaurantTemplateMoroccan({
    siteName, description, coverImage, logo, config, categories, isOwner, primaryColor, slug
}: RestaurantTemplateProps) {
    const logic = useRestaurantLogic(categories, isOwner, slug)
    const {
        showScanner, setShowScanner, showCart, setShowCart, activeCategory, setActiveCategory,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity,
        totalPrice, totalItems, tableId, categoryNames, filteredItems, handleScan, handlePlaceOrder, handleCallWaiter, handleRequestBill, removeItem,
        customizingDish, setCustomizingDish, handleConfirmCustomization,
        activeOrderId, orderStatus, showSplitBill, setShowSplitBill, activeOrderDetails, handleOpenSplitBill
    } = logic

    const [showReservation, setShowReservation] = useState(false)
    const [lang, setLang] = useState<Language>('fr')
    const t = translations[lang as Language].restaurant

    // Use CSS variable for the primary color and custom theme colors
    const containerStyle = {
        '--primary': primaryColor || '#C1440E',
        '--bg-main': config?.backgroundColor || '#FDF6E3',
        '--text-main': config?.textColor || '#1A2340',
        '--card-bg': config?.cardColor || '#FFF8ED',
        '--button-bg': config?.buttonBgColor || primaryColor || '#C1440E',
        '--button-text': config?.buttonTextColor || '#ffffff',
        '--header-bg': config?.headerBgColor || '#1A2340',
        '--header-text': config?.headerTextColor || '#D4A017',
        '--footer-bg': config?.footerBgColor || '#1A2340',
        '--footer-text': config?.footerTextColor || '#FFF8ED',
        '--category-bg': config?.categoryBgColor || '#1A2340',
        '--category-highlight': config?.categoryHighlightColor || '#D4A017',
        '--price-color': config?.priceColor || primaryColor || '#C1440E',
    } as React.CSSProperties

    return (
        <div
            className="flex flex-col min-h-screen font-sans"
            style={{ 
                ...containerStyle,
                background: 'var(--bg-main)', 
                color: 'var(--text-main)',
                fontFamily: "'Lato', sans-serif" 
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700;900&display=swap');
                .font-amiri { font-family: 'Amiri', serif; }
                .moroccan-arch {
                    border-radius: 120px 120px 24px 24px;
                    border: 2px solid rgba(212, 160, 23, 0.2);
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Call Waiter & Request Bill Logic */}
            {tableId && !isOwner && (
                <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col gap-2 sm:gap-3">
                    {activeOrderId && (
                        <button
                            onClick={handleOpenSplitBill}
                            className="h-11 w-11 sm:h-14 sm:w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-2 border-[#b89047]"
                            style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                            title="Partager l'addition"
                        >
                            <Split size={18} />
                        </button>
                    )}
                    <button
                        onClick={handleRequestBill}
                        className="h-11 w-11 sm:h-14 sm:w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-2 border-[#b89047]"
                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        title="Request Bill"
                    >
                        <Receipt size={18} />
                    </button>
                    <button
                        onClick={handleCallWaiter}
                        className="h-11 w-11 sm:h-14 sm:w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-2 border-[#b89047]"
                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        title="Call Waiter"
                    >
                        <Bell size={18} />
                    </button>
                </div>
            )}

            {/* ── HEADER ── */}
            <header className="sticky top-0 z-40 w-full" style={{ background: 'var(--header-bg)', borderBottom: '3px solid var(--header-text)' }}>
                <GoldBorder />
                <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
                    <div className="flex items-center gap-3 sm:gap-4">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-9 w-9 sm:h-12 sm:w-12 object-contain rounded-full border-2 border-amber-400" />
                        ) : (
                            <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-full border-2 flex items-center justify-center font-amiri font-bold text-lg sm:text-xl"
                                 style={{ background: 'rgba(212,160,23,0.15)', borderColor: 'var(--header-text)', color: 'var(--header-text)' }}>
                                {siteName[0]}
                            </div>
                        )}
                        <div>
                            <span className="font-amiri font-bold text-lg sm:text-2xl block leading-none" style={{ color: 'var(--header-text)' }}>{siteName}</span>
                            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.3em] opacity-80" style={{ color: 'var(--header-text)' }}>مطعم مغربي أصيل</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {isOwner && (
                            <Link href="/dashboard/restaurant">
                                <Button variant="ghost" className="hidden md:flex gap-2 text-[10px] font-bold uppercase tracking-widest h-10 px-5 rounded-full border hover:bg-white/5"
                                        style={{ color: 'var(--header-text)', borderColor: 'var(--header-text)' }}>
                                    <LayoutDashboard size={14} /> Dashboard
                                </Button>
                            </Link>
                        )}
                        <button onClick={() => setShowScanner(true)} className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border hover:bg-white/5 transition-all"
                                style={{ color: 'var(--header-text)', borderColor: 'var(--header-text)' }}>
                            <QrCode size={15} />
                        </button>
                        <button
                            onClick={() => setShowReservation(true)}
                            className="hidden sm:flex px-4 sm:px-5 h-9 sm:h-10 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 shadow-md items-center"
                            style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        >
                            {t.reserve || 'Réserver'}
                        </button>
                        <button
                            onClick={() => setShowCart(true)}
                            className="group relative h-9 sm:h-10 px-3 sm:px-5 rounded-full transition-all active:scale-95 flex items-center gap-2 shadow-lg"
                            style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        >
                            <ShoppingCart size={15} className="transition-transform group-hover:-translate-y-0.5" />
                            <span className="hidden md:inline text-[10px] font-bold uppercase tracking-widest">{t.place_order || 'Commander'}</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 text-[9px] h-5 w-5 rounded-full flex items-center justify-center font-black border border-amber-900"
                                      style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 pb-24">
                {/* ── HERO ── */}
                <section className="relative h-[40vh] sm:h-[45vh] flex items-center justify-center text-center overflow-hidden">
                    <img
                        src={coverImage || 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&q=80&w=2000'}
                        className="absolute inset-0 w-full h-full object-cover scale-103 transition-transform duration-1000"
                        alt="Moroccan Banquet"
                    />
                    <div className="absolute inset-0 bg-[#1A2340]/60 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 pointer-events-none">
                        <ZelligePattern opacity={0.05} />
                    </div>
                    <div className="container relative z-10 px-4 sm:px-6 max-w-4xl">
                        <StarOrnament size={28} />
                        <h1 className="font-amiri text-3xl sm:text-5xl md:text-7xl font-bold text-amber-300 mt-4 sm:mt-6 mb-3 sm:mb-6 leading-tight">
                            {config.heroTitle || "Tradition & Hospitalité Marocaine"}
                        </h1>
                        <div className="h-0.5 w-16 sm:w-24 bg-amber-400 mx-auto mb-3 sm:mb-6" />
                        <p className="text-base sm:text-lg md:text-xl text-amber-100/80 max-w-xl mx-auto font-amiri italic leading-relaxed">
                            "{description || "Un voyage sensoriel inoubliable à travers les saveurs authentiques du Royaume."}"
                        </p>
                    </div>
                </section>

                {/* ── STICKY CATEGORIES BAR ── */}
                <div className="sticky top-16 sm:top-20 z-30 py-2 sm:py-4 overflow-x-auto no-scrollbar border-b shadow-md"
                     style={{ backgroundColor: 'var(--category-bg)', borderColor: 'rgba(212,160,23,0.2)' }}>
                    <div className="px-3 sm:px-6 lg:px-12 flex gap-2 sm:gap-4 min-w-max justify-center">
                        {categoryNames.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-amiri text-sm sm:text-base font-bold transition-all duration-300 border whitespace-nowrap"
                                style={{
                                    backgroundColor: activeCategory === cat ? 'var(--category-highlight)' : 'transparent',
                                    color: activeCategory === cat ? 'var(--button-text)' : 'var(--header-text)',
                                    borderColor: activeCategory === cat ? 'var(--category-highlight)' : 'rgba(212,160,23,0.3)',
                                    boxShadow: activeCategory === cat ? '0 5px 15px rgba(212,160,23,0.2)' : 'none',
                                    opacity: activeCategory === cat ? 1 : 0.6
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── MENU DISHES ── */}
                <section className="py-8 sm:py-12 md:py-20 container mx-auto px-4 sm:px-6 lg:px-12 relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {filteredItems.length > 0 ? filteredItems.map((item: any) => (
                            <div key={item.id} className="group rounded-[32px] border overflow-hidden hover:shadow-[0_20px_40px_rgba(193,68,14,0.06)] hover:-translate-y-1 transition-all duration-500 flex flex-col relative"
                                 style={{ backgroundColor: 'var(--card-bg)', borderColor: 'rgba(212,160,23,0.12)' }}>
                                <div className="absolute inset-0 pointer-events-none">
                                    <ZelligePattern opacity={0.02} />
                                </div>
                                <div className="relative aspect-[4/3] overflow-hidden bg-amber-50 moroccan-arch m-3">
                                    <img
                                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'}
                                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                                        alt={item.name}
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                        <h3 className="text-xl font-amiri font-bold leading-tight flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                            <span className="text-amber-500/60 font-serif">◈</span> {item.name}
                                        </h3>
                                        <span className="font-amiri font-bold text-xl shrink-0 mt-0.5" style={{ color: 'var(--price-color)' }}>
                                            {item.price} <span className="text-xs font-sans font-black opacity-30">{CURRENCY}</span>
                                        </span>
                                    </div>
                                    {/* Dietary tags */}
                                    {(() => {
                                        let tagsList: string[] = []
                                        try {
                                            tagsList = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || [])
                                        } catch {}
                                        if (tagsList.length === 0) return null
                                        return (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {tagsList.map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 bg-amber-500/10 text-[9px] font-black uppercase tracking-wider rounded-md" style={{ color: 'var(--price-color)' }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )
                                    })()}
                                    <p className="text-sm leading-relaxed mb-6 flex-1 font-amiri italic opacity-85" style={{ color: 'var(--text-main)' }}>
                                        {item.description || "Préparé avec des épices authentiques marocaines."}
                                    </p>
                                    <button
                                        onClick={() => addItem(item)}
                                        className="w-full py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 shadow-lg"
                                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                    >
                                        {t.add_to_order}
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-32 text-center space-y-6">
                                <div className="h-20 w-20 mx-auto rounded-full flex items-center justify-center border-2 border-amber-200"
                                     style={{ background: '#FFF3DB' }}>
                                    <Utensils size={36} style={{ color: '#D4A017' }} />
                                </div>
                                <div>
                                    <h3 className="font-amiri text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Carte en préparation</h3>
                                    <p className="text-sm mt-2 opacity-60" style={{ color: 'var(--text-main)' }}>Notre menu sera bientôt disponible.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* ── CART DRAWER ── */}
            {showCart && (
                <div className="fixed inset-0 z-[60] backdrop-blur-sm animate-in fade-in duration-300" style={{ background: 'rgba(26,35,64,0.7)' }}>
                    <div className="absolute right-0 top-0 bottom-0 w-full sm:max-w-md shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col"
                        style={{ background: 'var(--bg-main)' }}>
                        {/* Cart header */}
                        <div className="p-4 sm:p-8 flex items-center justify-between" style={{ borderBottom: '2px solid var(--category-highlight)', background: 'var(--header-bg)' }}>
                            <div>
                                <h2 className="font-amiri text-2xl font-bold" style={{ color: 'var(--header-text)' }}>سلة الطلبات</h2>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80" style={{ color: 'var(--header-text)' }}>{totalItems} articles sélectionnés</p>
                            </div>
                            <button onClick={() => setShowCart(false)} className="h-10 w-10 rounded-full border text-amber-300 flex items-center justify-center hover:bg-amber-400/10 transition-all"
                                    style={{ borderColor: 'var(--header-text)', color: 'var(--header-text)' }}>
                                <X size={18} />
                            </button>
                        </div>
                        <GoldBorder />

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 no-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                                    <StarOrnament size={48} color="var(--category-highlight)" />
                                    <h3 className="font-amiri text-xl font-bold" style={{ color: 'var(--text-main)' }}>Votre sélection est vide</h3>
                                    <p className="text-sm opacity-60" style={{ color: 'var(--text-main)' }}>Ajoutez des plats pour commencer votre commande.</p>
                                    
                                    {activeOrderId && (
                                        <div className="pt-6 border-t border-amber-100 w-full max-w-xs mx-auto space-y-4">
                                            <p className="text-xs opacity-60">Vous avez une commande en cours.</p>
                                            <button
                                                onClick={() => {
                                                    setShowCart(false)
                                                    handleOpenSplitBill()
                                                }}
                                                className="w-full py-4 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all animate-bounce"
                                                style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                            >
                                                Partager l'addition
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : items.map((item) => (
                                <div key={item.cartItemId} className="flex gap-4 items-center rounded-2xl p-4 border border-amber-100 bg-white/60">
                                    <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 border border-amber-200">
                                        <img src={item.image || ''} className="h-full w-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="font-amiri font-bold text-base" style={{ color: 'var(--text-main)' }}>{item.name}</h4>
                                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                                                {item.selectedOptions.map(o => `${o.group}: ${o.choice}`).join(', ')}
                                            </div>
                                        )}
                                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                                            <div className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-0.5">
                                                + {item.selectedAddons.map(a => `${a.name} (+${a.price} MAD)`).join(', ')}
                                            </div>
                                        )}
                                        <span className="text-sm font-bold block mt-1" style={{ color: 'var(--price-color)' }}>{item.price} {CURRENCY}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <button onClick={() => removeItem(item.cartItemId)} className="text-red-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                        <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-white text-sm"
                                            style={{ background: 'var(--button-bg)', color: 'var(--button-text)' }}>
                                            <button onClick={() => updateQuantity(item.cartItemId, -1)} className="hover:opacity-75 transition-opacity"><Minus size={12} strokeWidth={3} /></button>
                                            <span className="font-black w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.cartItemId, 1)} className="hover:opacity-75 transition-opacity"><Plus size={12} strokeWidth={3} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart footer */}
                        {items.length > 0 && (
                            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6" style={{ borderTop: '2px solid var(--category-highlight)', background: 'var(--card-bg)' }}>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: 'var(--text-main)' }}>Total</span>
                                    <span className="font-amiri text-4xl font-bold" style={{ color: 'var(--text-main)' }}>
                                        {totalPrice.toFixed(2)} <span className="text-lg opacity-40">{CURRENCY}</span>
                                    </span>
                                </div>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={!tableId || isPlacingOrder}
                                    className="w-full py-5 rounded-full font-bold text-sm uppercase tracking-widest disabled:opacity-30 active:scale-95 transition-all shadow-xl"
                                    style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                >
                                    {isPlacingOrder ? 'Envoi en cours...' : 'Confirmer la commande'} →
                                </button>
                                {!tableId && (
                                    <div className="rounded-2xl p-4 text-center border border-red-200 bg-red-50">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Scanner requis</p>
                                        <p className="text-xs text-red-400 mt-1">Scannez le QR code de votre table pour valider.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Order complete overlay */}
                        {orderComplete && (
                            <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500"
                                style={{ background: 'var(--bg-main)' }}>
                                <StarOrnament size={60} color="var(--category-highlight)" />
                                <CheckCircle2 size={48} className="text-green-500 mt-4 animate-bounce" />
                                <h2 className="font-amiri text-3xl font-bold mt-6 mb-3" style={{ color: 'var(--text-main)' }}>Commande reçue !</h2>
                                <p className="font-amiri italic text-lg mb-8 opacity-80" style={{ color: 'var(--text-main)' }}>
                                    "Notre équipe prépare votre repas avec soin et tradition."
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-6 max-w-md">
                                    <button
                                        onClick={() => {
                                            setOrderComplete(false)
                                            setShowCart(false)
                                        }}
                                        className="rounded-full h-16 px-8 font-black uppercase tracking-widest text-[10px] flex items-center justify-center border border-amber-500/20 text-slate-800 hover:bg-slate-50 transition-all flex-1"
                                    >
                                        Retour au menu
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOrderComplete(false)
                                            setShowCart(false)
                                            handleOpenSplitBill()
                                        }}
                                        className="rounded-full h-16 px-8 font-black uppercase tracking-widest text-[10px] flex items-center justify-center transition-all flex-1"
                                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                    >
                                        Partager l'addition
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
            {showSplitBill && activeOrderId && activeOrderDetails && (
                <SplitBillModal
                    orderId={activeOrderId}
                    items={activeOrderDetails.items}
                    totalPrice={activeOrderDetails.totalPrice}
                    onClose={() => setShowSplitBill(false)}
                />
            )}

            <ReservationModal
                isOpen={showReservation}
                tenantId={categories[0]?.tenantId}
                siteName={siteName}
                primaryColor={primaryColor}
                config={config}
                onClose={() => setShowReservation(false)}
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

            {/* ── FOOTER ── */}
            <footer className="relative overflow-hidden py-24" style={{ backgroundColor: 'var(--footer-bg)', color: 'var(--footer-text)' }}>
                {/* Zellige background */}
                <div className="absolute inset-0 pointer-events-none">
                    <ZelligePattern opacity={0.06} />
                </div>
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, transparent, var(--category-highlight), transparent)' }} />

                <div className="container mx-auto px-12 relative z-10 text-center">
                    <StarOrnament size={40} color="var(--category-highlight)" />
                    <h3 className="font-amiri text-4xl font-bold mt-4 mb-2" style={{ color: 'var(--category-highlight)' }}>{siteName}</h3>
                    <div className="flex items-center justify-center gap-4 my-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/40" />
                        <StarOrnament size={24} color="var(--category-highlight)" />
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/40" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-16 items-start text-center">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: 'var(--category-highlight)' }}>Notre Histoire</h4>
                            <p className="font-amiri italic text-sm leading-relaxed opacity-60" style={{ color: 'var(--footer-text)' }}>
                                "Une tradition culinaire transmise de génération en génération, au cœur du Maroc."
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: 'var(--category-highlight)' }}>Contact & Adresse</h4>
                            <div className="space-y-2">
                                <p className="text-sm opacity-80" style={{ color: 'var(--footer-text)' }}>{config?.address || 'Médina, Marrakech, Maroc'}</p>
                                <p className="font-bold text-amber-300" style={{ color: 'var(--category-highlight)' }}>{config?.phone || '+212 5 24 00 00 00'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: 'var(--category-highlight)' }}>Horaires</h4>
                            <p className="text-sm leading-relaxed whitespace-pre-line opacity-80" style={{ color: 'var(--footer-text)' }}>
                                {config?.hours || 'Déjeuner: 12:00 — 15:00\nDîner: 19:00 — 23:00'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6"
                         style={{ borderTop: '1px solid rgba(212,160,23,0.2)' }}>
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-40">
                            © {new Date().getFullYear()} {siteName} · مطعم مغربي أصيل
                        </p>
                        <div className="flex gap-4">
                            {[Mail, Phone, MapPin].map((Icon, i) => (
                                <div key={i} className="h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer hover:bg-amber-400/10 transition-colors"
                                     style={{ borderColor: 'rgba(212,160,23,0.3)', color: 'var(--category-highlight)' }}>
                                    <Icon size={14} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
