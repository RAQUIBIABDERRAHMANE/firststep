'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import {
    ShoppingCart, QrCode, Plus, Minus, X, Trash2,
    ChevronLeft, ChevronRight, LayoutDashboard, Bell, Check, Receipt, Split
} from 'lucide-react'
import SplitBillModal from './SplitBillModal'

import { translations, Language, CURRENCY } from '@/lib/translations'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })
const ReservationModal = dynamic(() => import('./ReservationModal'), { ssr: false })

import DishCustomizationModal from './DishCustomizationModal'

export default function RestaurantTemplateModern({ siteName, description, coverImage, logo, config, categories, isOwner, primaryColor, slug }: RestaurantTemplateProps) {
    const defaultData = useRestaurantLogic(categories, isOwner, slug)
    const {
        showScanner, setShowScanner, showCart, setShowCart, activeCategory, setActiveCategory,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity,
        totalPrice, totalItems, tableId, categoryNames, filteredItems, handleScan, handlePlaceOrder, handleCallWaiter, handleRequestBill, removeItem,
        customizingDish, setCustomizingDish, handleConfirmCustomization,
        activeOrderId, orderStatus, showSplitBill, setShowSplitBill, activeOrderDetails, handleOpenSplitBill
    } = defaultData

    const [lang, setLang] = useState<Language>('fr')
    const t = translations[lang].restaurant
    const [showReservation, setShowReservation] = useState(false)

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

    // Use CSS variable for the primary color and custom theme colors
    const containerStyle = {
        '--primary': primaryColor || '#e11d48', // Default rose-600
        '--bg-main': config?.backgroundColor || '#050505',
        '--text-main': config?.textColor || '#ffffff',
        '--card-bg': config?.cardColor || '#0a0a0a',
        '--button-bg': config?.buttonBgColor || primaryColor || '#e11d48',
        '--button-text': config?.buttonTextColor || '#ffffff',
        '--header-bg': config?.headerBgColor || config?.cardColor || '#0a0a0a',
        '--header-text': config?.headerTextColor || config?.textColor || '#ffffff',
        '--footer-bg': config?.footerBgColor || '#0a0a0a',
        '--footer-text': config?.footerTextColor || '#ffffff',
        '--category-bg': config?.categoryBgColor || 'transparent',
        '--category-highlight': config?.categoryHighlightColor || primaryColor || '#e11d48',
        '--price-color': config?.priceColor || '#ffffff',
    } as React.CSSProperties

    return (
        <div style={{ ...containerStyle, backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} className="flex flex-col min-h-screen lg:flex-row lg:h-screen lg:overflow-hidden font-jakarta selection:bg-[var(--primary)] selection:text-[var(--text-main)]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@400;600;700;800&display=swap');
                .font-syne { font-family: 'Syne', sans-serif; }
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Mobile Top Header (hidden on lg+) */}
            <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-16 border-b border-white/5 backdrop-blur-xl"
                    style={{ backgroundColor: 'rgba(5,5,5,0.85)', color: 'var(--header-text)' }}>
                <div className="flex items-center gap-3">
                    {logo ? (
                        <img src={logo} alt={siteName} className="h-9 w-9 object-contain" />
                    ) : (
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center font-black text-base shadow-lg"
                             style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}>
                            {siteName[0]}
                        </div>
                    )}
                    <span className="font-syne font-bold text-base tracking-tight" style={{ color: 'var(--header-text)' }}>{siteName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowScanner(true)} className="h-9 w-9 flex items-center justify-center rounded-xl border border-white/10" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        <QrCode size={16} />
                    </button>
                    <button onClick={() => setShowCart(true)} className="relative h-9 px-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}>
                        <ShoppingCart size={16} />
                        {totalItems > 0 && (
                            <span className="text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 absolute -top-1.5 -right-1.5"
                                  style={{ backgroundColor: 'var(--primary)', color: 'var(--button-text)', borderColor: 'var(--bg-main)' }}>{totalItems}</span>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Category Strip (hidden on lg+) */}
            <div className="lg:hidden overflow-x-auto no-scrollbar border-b border-white/5 sticky top-16 z-20"
                 style={{ backgroundColor: 'rgba(5,5,5,0.85)' }}>
                <div className="flex gap-1 px-3 py-2 min-w-max">
                    {categoryNames.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all"
                            style={{
                                backgroundColor: activeCategory === cat ? 'var(--category-highlight)' : 'rgba(255,255,255,0.05)',
                                color: activeCategory === cat ? '#fff' : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Menu Grid (hidden on lg+) */}
            <div className="lg:hidden flex-1 overflow-y-auto pb-32">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
                    {filteredItems.length > 0 ? filteredItems.map((item: any) => (
                        <div key={item.id} className="rounded-2xl overflow-hidden border border-white/5 flex flex-col" style={{ backgroundColor: 'var(--card-bg)' }}>
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" alt={item.name} />
                                <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg backdrop-blur-xl font-black text-sm border border-white/10"
                                     style={{ backgroundColor: 'rgba(5,5,5,0.7)', color: 'var(--price-color)' }}>
                                    {item.price} <span className="text-[10px]">{CURRENCY}</span>
                                </div>
                            </div>
                            <div className="p-3 flex-1 flex flex-col">
                                <h3 className="font-syne font-bold text-sm leading-tight mb-1" style={{ color: 'var(--text-main)' }}>{item.name}</h3>
                                <p className="text-[11px] opacity-50 leading-relaxed flex-1 mb-2" style={{ color: 'var(--text-main)' }}>{item.description || ''}</p>
                                <button onClick={() => addItem(item)} className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center"
                                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}>
                                    {t.add_to_order}
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center opacity-30">
                            <p className="font-black uppercase tracking-widest">No items in this category</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Desktop Sidebar (hidden on mobile) ── */}
            <aside className="hidden lg:flex w-80 border-r border-white/5 flex-col shrink-0 relative z-30 shadow-[10px_0_50px_rgba(0,0,0,0.3)] backdrop-blur-xl"
                   style={{ backgroundColor: 'rgba(5, 5, 5, 0.45)', color: 'var(--header-text)' }}>
                {/* Logo Section */}
                <div className="p-6 md:p-10 border-b border-white/5">
                    <div className="flex items-center gap-5 group cursor-pointer">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform group-hover:scale-110" />
                        ) : (
                            <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-white/10"
                                 style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}>
                                {siteName[0]}
                            </div>
                        )}
                        <div className="hidden md:block">
                            <span className="font-syne font-bold text-xl tracking-tighter block leading-none" style={{ color: 'var(--header-text)' }}>{siteName}</span>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-50" style={{ color: 'var(--header-text)' }}>Live Services</span>
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
                            className="w-full text-left px-4 md:px-6 py-5 rounded-2xl transition-all relative group overflow-hidden"
                            style={{
                                color: activeCategory === cat ? 'var(--category-highlight)' : 'var(--header-text)',
                                opacity: activeCategory === cat ? 1 : 0.6,
                                backgroundColor: activeCategory === cat ? 'rgba(255,255,255,0.04)' : 'transparent',
                                transform: activeCategory === cat ? 'scale(1.02) translateX(4px)' : 'none',
                                border: activeCategory === cat ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                                boxShadow: activeCategory === cat ? '0 10px 30px -10px rgba(0,0,0,0.5)' : 'none'
                            }}
                        >
                            {activeCategory === cat && (
                                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-full shadow-[0_0_15px_var(--primary)]"
                                     style={{ backgroundColor: 'var(--category-highlight)' }} />
                            )}
                            <span className="hidden md:block font-syne font-bold text-[11px] uppercase tracking-[0.3em] transition-transform group-hover:translate-x-1">{cat}</span>
                            <span className="md:hidden text-[10px] font-black uppercase text-center block">{cat.slice(0, 3)}</span>
                        </button>
                    ))}
                </nav>

                {/* Bottom Administrative Actions */}
                <div className="p-6 md:p-8 border-t border-white/5 space-y-4">
                    {isOwner && (
                        <Link href="/dashboard/restaurant" className="block">
                            <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl hover:bg-white/5 font-black text-[10px] uppercase tracking-widest"
                                    style={{ color: 'var(--header-text)' }}>
                                <LayoutDashboard size={18} />
                                <span className="hidden md:inline">Dashboard</span>
                            </Button>
                        </Link>
                    )}
                    <button
                        onClick={() => setShowScanner(true)}
                        className="w-full flex items-center justify-center md:justify-start gap-4 px-4 py-4 rounded-2xl transition-all border border-white/5 active:scale-95"
                        style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: 'var(--header-text)' }}
                    >
                        <QrCode size={18} strokeWidth={2.5} />
                        <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Scan Table QR</span>
                    </button>
                </div>
            </aside>

            {/* ── Desktop Main Content (hidden on mobile) ── */}
            <main className="hidden lg:flex flex-1 flex-col relative overflow-hidden">
                {/* Decorative Ambient Glows */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[200px] pointer-events-none -translate-y-1/2 translate-x-1/3"
                     style={{ backgroundColor: 'rgba(var(--primary-rgb, 225, 29, 72), 0.1)' }} />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none translate-y-1/2 -translate-x-1/4"
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }} />

                {/* Top Nav Overlay */}
                <div className="absolute top-0 inset-x-0 h-32 px-10 flex items-center justify-between z-20 pointer-events-none">
                    <div className="flex items-center gap-6 pointer-events-auto">
                        <button
                            onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')}
                            className="text-[10px] font-black hover:text-white uppercase tracking-widest transition-colors"
                            style={{ color: 'var(--text-main)', opacity: 0.6 }}
                        >
                            {lang === 'fr' ? 'FR' : 'EN'}
                        </button>
                        {tableId && (
                            <div className="h-10 px-6 rounded-full border border-white/5 backdrop-blur-xl flex items-center gap-3"
                                 style={{ backgroundColor: 'var(--card-bg)' }}>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">Table {tableId}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowReservation(true)}
                            className="pointer-events-auto h-16 px-8 flex items-center gap-3 backdrop-blur-3xl border border-white/10 rounded-3xl hover:brightness-110 transition-all active:scale-95"
                            style={{
                                backgroundColor: 'var(--button-bg)',
                                color: 'var(--button-text)',
                                boxShadow: '0 0 40px rgba(var(--primary-rgb, 225, 29, 72), 0.2)'
                            }}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">Reserve</span>
                        </button>
                        <button
                            onClick={() => setShowCart(true)}
                            className="pointer-events-auto h-16 px-8 flex items-center gap-6 backdrop-blur-3xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all shadow-2xl active:scale-95"
                            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}
                        >
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-0.5" style={{ color: 'var(--text-main)' }}>Order Total</p>
                                <p className="text-xl font-black leading-none" style={{ color: 'var(--price-color)' }}>{totalPrice.toFixed(2)} <span className="text-[10px]">{CURRENCY}</span></p>
                            </div>
                            <div className="relative">
                                <ShoppingCart size={22} strokeWidth={2.5} />
                                {totalItems > 0 && (
                                    <div className="absolute -top-2.5 -right-2.5 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-4 shadow-lg"
                                         style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)', borderColor: 'var(--bg-main)' }}>
                                        {totalItems}
                                    </div>
                                )}
                            </div>
                        </button>
                    </div>
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
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-main), rgba(0,0,0,0.4))' }} />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden lg:block" />
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 md:px-20 lg:px-32 py-40">
                            <div className="max-w-3xl animate-in slide-in-from-left-10 duration-1000">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-px w-12" style={{ backgroundColor: 'var(--primary)' }} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.5em]" style={{ color: 'var(--primary)' }}>
                                        Signature Dish
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-6xl lg:text-8xl xl:text-[10rem] font-syne font-black mb-6 md:mb-10 leading-[0.85] tracking-tighter transition-all hover:tracking-[-0.05em] cursor-default">
                                    {currentItem.name}
                                </h1>
                                {/* Dietary tags */}
                                {(() => {
                                    let tagsList: string[] = []
                                    try {
                                        tagsList = typeof currentItem.tags === 'string' ? JSON.parse(currentItem.tags || '[]') : (currentItem.tags || [])
                                    } catch {}
                                    if (tagsList.length === 0) return null
                                    return (
                                        <div className="flex flex-wrap gap-1.5 justify-start mb-6">
                                            {tagsList.map(tag => (
                                                <span key={tag} className="px-2.5 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-wider rounded-md">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )
                                })()}
                                <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed mb-16 max-w-xl">
                                    {currentItem.description || 'An extraordinary culinary composition crafted with precision using curated ingredients from our local partners.'}
                                </p>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Exclusive Price</span>
                                        <span className="text-5xl font-black tabular-nums" style={{ color: 'var(--price-color)' }}>{currentItem.price}<span className="text-xl ml-2 font-light opacity-50">{CURRENCY}</span></span>
                                    </div>
                                    <button
                                        onClick={() => addItem(currentItem)}
                                        className="h-20 px-16 rounded-[40px] transition-all font-black text-lg uppercase tracking-[0.3em] active:scale-95 shadow-2xl flex items-center justify-center"
                                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                    >
                                        {t.add_to_order}
                                    </button>
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
                            className="h-16 w-16 rounded-3xl backdrop-blur-xl border border-white/5 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-10 disabled:cursor-not-allowed transition-all active:scale-90"
                            style={{ backgroundColor: 'var(--card-bg)' }}
                        >
                            <ChevronLeft size={24} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={nextItem}
                            disabled={currentItemIndex === filteredItems.length - 1}
                            className="h-16 w-16 rounded-3xl backdrop-blur-xl border border-white/5 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-10 disabled:cursor-not-allowed transition-all active:scale-90"
                            style={{ backgroundColor: 'var(--card-bg)' }}
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
                            className="h-1.5 transition-all duration-500 rounded-full"
                            style={{
                                width: idx === currentItemIndex ? '48px' : '16px',
                                backgroundColor: idx === currentItemIndex ? 'var(--category-highlight)' : 'rgba(255,255,255,0.1)'
                            }}
                        />
                    ))}
                </div>
            </main>

            {/* Cart Slide-over */}
            {showCart && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setShowCart(false)} />
                    <div className="w-full sm:max-w-md border-l border-white/10 flex flex-col animate-in slide-in-from-right"
                         style={{ backgroundColor: 'var(--card-bg)' }}>
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
                                    
                                    {activeOrderId && (
                                        <div className="pt-6 border-t border-white/10 w-full max-w-xs mx-auto space-y-4">
                                            <p className="text-xs text-zinc-400">Vous avez une commande en cours.</p>
                                            <button
                                                onClick={() => {
                                                    setShowCart(false)
                                                    handleOpenSplitBill()
                                                }}
                                                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all text-white"
                                                style={{ backgroundColor: 'var(--button-bg)' }}
                                            >
                                                Partager l'addition
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.cartItemId} className="flex gap-4 items-center rounded-xl p-4"
                                         style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                        <img src={item.image || ''} className="h-16 w-16 rounded-lg object-cover" alt="" />
                                        <div className="flex-1">
                                            <h4 className="font-medium leading-tight">{item.name}</h4>
                                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                                                    {item.selectedOptions.map(o => `${o.group}: ${o.choice}`).join(', ')}
                                                </div>
                                            )}
                                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5">
                                                    + {item.selectedAddons.map(a => `${a.name} (+${a.price} MAD)`).join(', ')}
                                                </div>
                                            )}
                                            <span className="block mt-1" style={{ color: 'var(--price-color)' }}>{item.price} MAD</span>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <button onClick={() => removeItem(item.cartItemId)} className="text-zinc-600 hover:text-red-500 transition-colors p-1" title="Remove item">
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                                                <button onClick={() => updateQuantity(item.cartItemId, -1)} className="p-2 hover:opacity-75" style={{ color: 'var(--primary)' }}>
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-6 text-center font-mono">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.cartItemId, 1)} className="p-2 hover:opacity-75" style={{ color: 'var(--primary)' }}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-black/30">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-zinc-400">Total</span>
                                    <span className="text-3xl font-light" style={{ color: 'var(--price-color)' }}>{totalPrice.toFixed(2)} MAD</span>
                                </div>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={!tableId || isPlacingOrder}
                                    className="w-full h-14 rounded-xl hover:brightness-110 font-bold shadow-xl flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                >
                                    {isPlacingOrder ? 'Processing...' : 'Place Order'}
                                </button>
                                {!tableId && (
                                    <p className="mt-3 text-center text-xs" style={{ color: 'var(--primary)' }}>Scan table QR to checkout</p>
                                )}
                            </div>
                        )}
                        {orderComplete && (
                            <div className="absolute inset-0 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                                 style={{ backgroundColor: 'var(--card-bg)' }}>
                                <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                                    <Check size={40} className="text-emerald-400" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Order Confirmed</h2>
                                <p className="text-zinc-400 mb-8">Your order is being prepared</p>
                                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center px-4 max-w-xs">
                                    <Button
                                        onClick={() => {
                                            setOrderComplete(false)
                                            setShowCart(false)
                                        }}
                                        variant="outline"
                                        className="border-white/20 flex-1"
                                        style={{ color: 'var(--text-main)' }}
                                    >
                                        Continue
                                    </Button>
                                    <button
                                        onClick={() => {
                                            setOrderComplete(false)
                                            setShowCart(false)
                                            handleOpenSplitBill()
                                        }}
                                        className="rounded-xl h-10 px-6 font-bold text-xs uppercase tracking-wider text-white flex-1"
                                        style={{ backgroundColor: 'var(--button-bg)' }}
                                    >
                                        Partager
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Call Waiter & Request Bill Logic */}
            {tableId && !isOwner && (
                <div className="fixed bottom-4 left-4 lg:bottom-6 lg:left-24 z-50 flex flex-col gap-2 lg:gap-3">
                    {activeOrderId && (
                        <button
                            onClick={handleOpenSplitBill}
                            className="h-11 w-11 lg:h-14 lg:w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/10"
                            style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                            title="Partager l'addition"
                        >
                            <Split size={18} />
                        </button>
                    )}
                    <button
                        onClick={handleRequestBill}
                        className="h-11 w-11 lg:h-14 lg:w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/10"
                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        title="Request Bill"
                    >
                        <Receipt size={18} />
                    </button>
                    <button
                        onClick={handleCallWaiter}
                        className="h-11 w-11 lg:h-14 lg:w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/10"
                        style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                        title="Call Waiter"
                    >
                        <Bell size={18} />
                    </button>
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
        </div>
    )
}
