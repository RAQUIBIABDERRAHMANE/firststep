'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import {
    ShoppingCart, QrCode, MapPin, Plus, Minus, X, Trash2,
    ChevronLeft, ChevronRight, LayoutDashboard, Bell, Check, Receipt,
    Loader2, Sparkles, Home, Search, Menu as MenuIcon
} from 'lucide-react'

import { translations, Language, CURRENCY } from '@/lib/translations'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })
const ReservationModal = dynamic(() => import('./ReservationModal'), { ssr: false })

import DishCustomizationModal from './DishCustomizationModal'

export default function RestaurantTemplateLuxury({ siteName, description, coverImage, logo, config, categories, isOwner, primaryColor }: RestaurantTemplateProps) {
    const defaultData = useRestaurantLogic(categories, isOwner)
    const {
        showScanner, setShowScanner, showCart, setShowCart,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity, removeItem,
        totalPrice, totalItems, tableId, filteredItems, categoryNames, handleScan, handlePlaceOrder, handleCallWaiter, handleRequestBill,
        activeOrderId, orderStatus, customizingDish, setCustomizingDish, handleConfirmCustomization
    } = defaultData

    const [lang, setLang] = useState<Language>('fr')
    const t = translations[lang].restaurant
    const [showReservation, setShowReservation] = useState(false)
    const [showOrderTracking, setShowOrderTracking] = useState(false)
    const [activeSection, setActiveSection] = useState(categoryNames[0] || '')
    const [showInfoDrawer, setShowInfoDrawer] = useState(false)

    // Handle scroll categories mapping
    useEffect(() => {
        const handleScroll = () => {
            const offsets = categoryNames.map((cat) => {
                const element = document.getElementById(`cat-${cat}`)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    return { cat, top: rect.top + window.scrollY - 240 }
                }
                return null
            }).filter(Boolean) as { cat: string; top: number }[]

            const scrollPosition = window.scrollY + 10

            let current = categoryNames[0] || ''
            for (let i = 0; i < offsets.length; i++) {
                if (scrollPosition >= offsets[i].top) {
                    current = offsets[i].cat
                }
            }
            setActiveSection(current)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [categoryNames])

    const scrollToCategory = (cat: string) => {
        setActiveSection(cat)
        const element = document.getElementById(`cat-${cat}`)
        if (element) {
            const offset = 180 // Height of header + categories sticky
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

    // Warm Gold/Orange Accent from site or default
    const accentColor = primaryColor || '#e27355' 
    const bgColor = config?.backgroundColor || '#180f0c'
    const cardBg = config?.cardColor || 'rgba(32, 21, 17, 0.9)'
    const textColor = config?.textColor || '#e6e4e2'
    const defaultBgGradient = 'linear-gradient(to bottom, #180f0c, #221612, #140b09)'
    const backgroundStyle = config?.backgroundColor ? bgColor : defaultBgGradient

    const buttonBg = config?.buttonBgColor || accentColor
    const buttonText = config?.buttonTextColor || '#180f0c'
    const headerBg = config?.headerBgColor || bgColor
    const headerText = config?.headerTextColor || '#f3b182'
    const footerBg = config?.footerBgColor || '#140b09'
    const footerText = config?.footerTextColor || '#e6e4e2'
    const categoryBg = config?.categoryBgColor || 'transparent'
    const categoryHighlight = config?.categoryHighlightColor || accentColor
    const priceColor = config?.priceColor || '#f3b182'

    const containerStyle = {
        '--primary': accentColor,
        '--bg-main': bgColor,
        '--card-bg': cardBg,
        '--button-bg': buttonBg,
        '--button-text': buttonText,
        '--header-bg': headerBg,
        '--header-text': headerText,
        '--footer-bg': footerBg,
        '--footer-text': footerText,
        '--category-bg': categoryBg,
        '--category-highlight': categoryHighlight,
        '--price-color': priceColor,
    } as React.CSSProperties

    return (
        <div style={{ ...containerStyle, background: backgroundStyle, color: textColor }} className="min-h-screen font-sans selection:bg-[var(--primary)] selection:text-white pb-32">
            
            {/* Dark Luxury Header */}
            <header className="w-full sticky top-0 z-50 border-b backdrop-blur-md"
                    style={{ backgroundColor: `${headerBg}e6`, borderColor: `${headerText}1a` }}>
                <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between relative">
                    {/* Left dummy/logo space */}
                    <div className="w-10 h-10" />

                    {/* Centered Brand Name */}
                    <span className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl tracking-wide font-medium hover:opacity-90 cursor-pointer"
                          style={{ color: 'var(--header-text)' }}>
                        {siteName}
                    </span>

                    {/* Hamburger Menu Icon */}
                    <button 
                        onClick={() => setShowInfoDrawer(true)}
                        className="transition-colors p-1 shrink-0 w-10 h-10 flex items-center justify-end"
                        style={{ color: 'var(--header-text)' }}
                        aria-label="Informations"
                    >
                        <div className="w-6 h-4.5 flex flex-col justify-between items-end">
                            <span className="w-6 h-0.5 rounded-full animate-pulse-slow" style={{ backgroundColor: 'var(--header-text)' }} />
                            <span className="w-4 h-0.5 rounded-full animate-pulse-slow" style={{ backgroundColor: 'var(--header-text)' }} />
                            <span className="w-5 h-0.5 rounded-full animate-pulse-slow" style={{ backgroundColor: 'var(--header-text)' }} />
                        </div>
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-5 pt-4">
                {/* Hero / Cover Image Banner */}
                <div className="w-full aspect-[16/10] rounded-[28px] overflow-hidden bg-stone-900 shadow-[0_15px_35px_rgba(0,0,0,0.6)] border border-[#2d1b15] mb-6 relative group">
                    <img
                        src={coverImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'}
                        alt={siteName}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#180f0c] via-[#180f0c]/20 to-transparent" style={{ backgroundImage: `linear-gradient(to top, var(--bg-main), rgba(0,0,0,0.1))` }} />
                    
                    {/* Glass Overlay text badge */}
                    <div className="absolute bottom-5 left-5 right-5 bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-[22px] shadow-lg animate-fade-in">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--primary)' }}>L'Expérience Chocolatée</span>
                        <h2 className="font-serif text-2xl font-light text-white mt-1 leading-snug">{config.heroTitle || "Delicious moments, served fresh."}</h2>
                    </div>
                </div>

                {/* Sticky Horizontal Categories bar with Glowing selected state */}
                <div className="sticky top-16 z-40 py-3 -mx-5 px-5 overflow-x-auto no-scrollbar flex gap-3 border-b backdrop-blur-md"
                     style={{ backgroundColor: `${bgColor}f2`, borderColor: `${textColor}1a` }}>
                    <div className="flex gap-3 w-full" style={{ backgroundColor: 'var(--category-bg)' }}>
                        {categoryNames.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => scrollToCategory(cat)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border ${activeSection === cat
                                    ? 'bg-transparent shadow-lg'
                                    : 'opacity-60 hover:opacity-100'
                                    }`}
                                style={{
                                    borderColor: activeSection === cat ? 'var(--category-highlight)' : `${textColor}33`,
                                    color: activeSection === cat ? 'var(--category-highlight)' : textColor,
                                    boxShadow: activeSection === cat ? `0 0 15px var(--category-highlight)59` : 'none',
                                    backgroundColor: activeSection === cat ? 'transparent' : cardBg
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu lists by category */}
                <div className="mt-8 space-y-16">
                    {categoryNames.map((cat) => {
                        const categoryItems = categories.find((c: any) => c.name === cat)?.dishes || []
                        if (categoryItems.length === 0) return null

                        return (
                            <section id={`cat-${cat}`} key={cat} className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-6">
                                    <h3 className="font-serif text-lg tracking-wider font-medium whitespace-nowrap" style={{ color: 'var(--primary)' }}>
                                        {cat}
                                    </h3>
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e27355]/40 to-transparent" style={{ backgroundImage: `linear-gradient(to right, var(--primary)66, transparent)` }} />
                                </div>

                                {/* 2-column grid of elegant card components */}
                                <div className="grid grid-cols-2 gap-4">
                                    {categoryItems.map((item: any) => {
                                        const cartItem = items.find((i: any) => i.id === item.id)
                                        const quantity = cartItem ? cartItem.quantity : 0

                                        return (
                                            <div
                                                key={item.id}
                                                className="group border rounded-[22px] p-3 flex flex-col justify-between transition-all duration-500 shadow-lg hover:-translate-y-1"
                                                style={{ 
                                                    background: cardBg,
                                                    borderColor: `${textColor}1a`
                                                }}
                                                onMouseEnter={(e) => { 
                                                    e.currentTarget.style.borderColor = accentColor;
                                                    e.currentTarget.style.boxShadow = `0 15px 30px rgba(0,0,0,0.5), 0 0 15px ${accentColor}1a`;
                                                }}
                                                onMouseLeave={(e) => { 
                                                    e.currentTarget.style.borderColor = `${textColor}1a`;
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <div className="space-y-3">
                                                    {/* Dish Image */}
                                                    <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-stone-950 relative border" style={{ borderColor: `${textColor}1a` }}>
                                                        {quantity > 0 && (
                                                            <div className="absolute top-2.5 right-2.5 text-stone-950 font-extrabold text-[10px] w-6 h-6 rounded-full flex items-center justify-center shadow-lg border animate-scale-in z-10"
                                                                 style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)', borderColor: 'var(--button-bg)' }}>
                                                                {quantity}
                                                            </div>
                                                        )}
                                                        <img
                                                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    </div>

                                                    {/* Meta Info */}
                                                    <div className="space-y-1 px-1">
                                                        <h4 className="font-semibold text-stone-100 text-sm leading-snug transition-colors duration-300" style={{ color: textColor }}>
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-stone-400 text-[11px] font-light leading-relaxed line-clamp-2 mt-0.5">
                                                            {item.description || "Un délice haut de gamme pour égayer vos papilles."}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Price and Add button */}
                                                <div className="pt-3 mt-2 border-t border-[#2d1b15]/40 flex items-center justify-between px-1">
                                                    <span className="font-bold text-sm" style={{ color: 'var(--price-color)' }}>
                                                        {item.price} <span className="text-[9px] font-normal uppercase">{CURRENCY}</span>
                                                    </span>
                                                    <button
                                                        onClick={() => addItem(item)}
                                                        className="h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md active:scale-90"
                                                        style={quantity > 0 ? {
                                                            backgroundColor: 'transparent',
                                                            borderColor: 'var(--category-highlight)',
                                                            borderWidth: '2px',
                                                            color: 'var(--category-highlight)'
                                                        } : {
                                                            backgroundColor: 'var(--button-bg)',
                                                            color: 'var(--button-text)'
                                                        }}
                                                        title={t.add_to_order}
                                                    >
                                                        {quantity > 0 ? <Check size={14} strokeWidth={3} /> : <Plus size={16} strokeWidth={2.5} />}
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
            </main>

            {/* Sticky Bottom Navigation Bar exactly matching the requested mockup */}
            <div className="fixed bottom-0 inset-x-0 z-50 border-t shadow-[0_-10px_30px_rgba(0,0,0,0.6)]"
                 style={{ backgroundColor: 'var(--footer-bg)', borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between relative">
                    
                    {/* Home Icon */}
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center justify-center text-stone-400 hover:text-white transition-colors py-2 px-3"
                            style={{ color: 'var(--footer-text)', opacity: 0.6 }}>
                        <Home size={22} />
                    </button>

                    {/* Menu Icon (Selected with dot underneath) */}
                    <button className="flex flex-col items-center justify-center py-2 px-3 relative"
                            style={{ color: 'var(--category-highlight)' }}>
                        <MenuIcon size={22} />
                        <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5">Menu</span>
                        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--category-highlight)' }} />
                    </button>

                    {/* Prominent floating capsule button CALL WAITER */}
                    {tableId ? (
                        <button
                            onClick={handleCallWaiter}
                            className="px-6 h-12 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 hover:brightness-110 active:scale-95 shrink-0"
                            style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)', boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.4)' }}
                        >
                            {lang === 'fr' ? 'Appeler Serveur' : 'Call Waiter'}
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowScanner(true)}
                            className="px-6 h-12 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 hover:brightness-110 active:scale-95 shrink-0"
                            style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)', boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.4)' }}
                        >
                            {lang === 'fr' ? 'Scanner Table' : 'Scan Table'}
                        </button>
                    )}

                    {/* Search / Reservation Icon */}
                    <button onClick={() => setShowReservation(true)} className="flex flex-col items-center justify-center transition-colors py-2 px-3"
                            style={{ color: 'var(--footer-text)', opacity: 0.6 }}>
                        <Sparkles size={22} />
                    </button>

                    {/* Cart Icon with badge count */}
                    <button
                        onClick={() => {
                            setShowCart(true)
                            setShowOrderTracking(false)
                        }}
                        className="flex flex-col items-center justify-center transition-colors py-2 px-3 relative"
                        style={{ color: 'var(--footer-text)' }}
                    >
                        <ShoppingCart size={22} />
                        {totalItems > 0 && (
                            <div className="absolute top-1 right-2 text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border"
                                 style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)', borderColor: 'var(--footer-bg)' }}>
                                {totalItems}
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Cart Drawer - Luxury Sidebar */}
            {showCart && (
                <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-all" onClick={() => setShowCart(false)}>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-full max-w-md shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-[#2d1b15]/80"
                        style={{ backgroundColor: 'var(--card-bg)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-[#2d1b15]/60 flex items-center justify-between" style={{ backgroundColor: 'var(--header-bg)', color: 'var(--header-text)' }}>
                            <h2 className="font-serif text-2xl">Votre Commande</h2>
                            <button onClick={() => setShowCart(false)} className="hover:text-white transition-colors p-2 rounded-full hover:bg-[#201511]">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-stone-500">
                                    <ShoppingCart size={40} className="mb-4 opacity-20" />
                                    <p className="font-serif">Votre sélection est vide</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.cartItemId} className="flex gap-4 items-center bg-[#201511]/40 border border-[#2d1b15]/40 rounded-2xl p-3">
                                        <img src={item.image || ''} className="h-14 w-14 rounded-xl object-cover border border-[#2d1b15]/40" alt="" />
                                        <div className="flex-1 text-left">
                                            <h4 className="font-medium text-stone-200 text-sm leading-tight">{item.name}</h4>
                                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">
                                                    {item.selectedOptions.map(o => `${o.group}: ${o.choice}`).join(', ')}
                                                </div>
                                            )}
                                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5">
                                                    + {item.selectedAddons.map(a => `${a.name} (+${a.price} MAD)`).join(', ')}
                                                </div>
                                            )}
                                            <span className="block mt-1 text-xs font-bold" style={{ color: 'var(--price-color)' }}>{item.price} MAD</span>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <button onClick={() => removeItem(item.cartItemId)} className="text-stone-500 hover:text-red-500 transition-colors p-1" title="Supprimer">
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="flex items-center gap-3 rounded-full border p-1" style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)', borderColor: 'var(--button-bg)' }}>
                                                <button onClick={() => updateQuantity(item.cartItemId, -1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:opacity-75 transition-opacity"><Minus size={10} /></button>
                                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.cartItemId, 1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:opacity-75 transition-opacity"><Plus size={10} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 border-t border-[#2d1b15]/60 bg-[#140b09]" style={{ backgroundColor: 'var(--footer-bg)' }}>
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total</span>
                                    <span className="font-serif text-2xl font-bold" style={{ color: 'var(--price-color)' }}>{totalPrice.toFixed(2)} {CURRENCY}</span>
                                </div>
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={!tableId || isPlacingOrder}
                                    className="w-full h-12 rounded-full text-stone-950 font-bold text-sm shadow-md hover:brightness-110"
                                    style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                >
                                    {isPlacingOrder ? 'Envoi...' : 'Passer la commande'}
                                </Button>
                                {!tableId && (
                                    <p className="text-center text-[10px] mt-3 font-medium px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--primary)', border: '1px solid var(--primary)4d' }}>
                                        Veuillez scanner le code QR de votre table pour finaliser l'envoi.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Order Confirmation Screen Overlay */}
                        {(orderComplete || (activeOrderId && showOrderTracking)) ? (
                            <div className="absolute inset-0 bg-[#180f0c]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-50"
                                 style={{ backgroundColor: 'var(--card-bg)' }}>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${orderStatus === 'READY' || orderStatus === 'SERVED' ? 'bg-green-950/40 text-green-500 border border-green-800' :
                                    orderStatus === 'PREPARING' || orderStatus === 'COOKING' ? 'bg-amber-950/40 text-[#f3b182] animate-pulse border border-[#f3b182]/50' :
                                        'bg-stone-900 text-stone-400'
                                    }`}>
                                    {orderStatus === 'READY' || orderStatus === 'SERVED' ? <Check size={36} /> :
                                        orderStatus === 'PREPARING' || orderStatus === 'COOKING' ? <Loader2 size={36} className="animate-spin" /> :
                                            <Sparkles size={36} />}
                                </div>
                                <h2 className="text-2xl font-serif mb-2" style={{ color: 'var(--category-highlight)' }}>
                                    {orderStatus === 'PENDING' && 'Commande Envoyée !'}
                                    {orderStatus === 'PREPARING' && 'En préparation...'}
                                    {orderStatus === 'COOKING' && 'En cuisine...'}
                                    {orderStatus === 'READY' && 'Prêt à servir !'}
                                    {orderStatus === 'SERVED' && 'Bon Appétit !'}
                                    {!orderStatus && 'Commande Validée'}
                                </h2>
                                <p className="text-stone-400 text-sm mb-8 max-w-xs mx-auto font-light">
                                    {orderStatus === 'PENDING' && 'Votre commande a été transmise en cuisine.'}
                                    {orderStatus === 'PREPARING' && 'Le chef prépare vos douceurs chocolatées.'}
                                    {orderStatus === 'COOKING' && 'C’est sur le feu, encore un instant.'}
                                    {orderStatus === 'READY' && 'Vos plats arrivent à votre table.'}
                                    {orderStatus === 'SERVED' && 'Profitez bien de votre expérience Chocolate Dip.'}
                                    {!orderStatus && 'Votre commande a bien été prise en compte.'}
                                </p>
                                <div className="inline-block px-4 py-1.5 border rounded-full text-[9px] font-bold uppercase tracking-wider mb-8"
                                     style={{ backgroundColor: 'var(--header-bg)', color: 'var(--category-highlight)', borderColor: 'rgba(255,255,255,0.05)' }}>
                                    Statut: {orderStatus || 'PENDING'}
                                </div>
                                <Button
                                    onClick={() => {
                                        setOrderComplete(false)
                                        setShowOrderTracking(false)
                                        setShowCart(false)
                                    }}
                                    variant="outline"
                                    className="border-stone-850 rounded-full h-10 px-6"
                                    style={{ color: 'var(--text-main)', backgroundColor: 'var(--header-bg)' }}
                                >
                                    Continuer
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Info Drawer */}
            {showInfoDrawer && (
                <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-all" onClick={() => setShowInfoDrawer(false)}>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-full max-w-md shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col text-stone-200"
                        style={{ backgroundColor: 'var(--card-bg)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b flex items-center justify-between" style={{ backgroundColor: 'var(--header-bg)', color: 'var(--header-text)', borderColor: 'rgba(255,255,255,0.05)' }}>
                            <h2 className="font-serif text-2xl">Informations</h2>
                            <button onClick={() => setShowInfoDrawer(false)} className="text-stone-400 hover:text-white p-2 rounded-full hover:bg-stone-900 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* About / Description */}
                            <div className="space-y-3">
                                <h3 className="font-serif text-lg border-b pb-2" style={{ color: 'var(--category-highlight)', borderColor: 'rgba(255,255,255,0.05)' }}>{siteName}</h3>
                                <p className="text-stone-400 text-sm font-light leading-relaxed">
                                    {description || "Bienvenue dans notre établissement. Découvrez notre sélection exclusive de desserts et chocolats belges de qualité supérieure, conçue pour vous offrir une expérience gustative inoubliable."}
                                </p>
                            </div>

                            {/* Table Session Info */}
                            <div className="border rounded-[20px] p-5 space-y-4" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
                                <h4 className="font-serif text-sm uppercase tracking-wider" style={{ color: 'var(--category-highlight)' }}>Votre Session</h4>
                                {tableId ? (
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-sm font-medium text-stone-200">Table Active : <span className="font-black" style={{ color: 'var(--category-highlight)' }}>Table {tableId}</span></span>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-stone-400 text-xs">
                                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                                            <span>Aucune table connectée.</span>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                setShowScanner(true)
                                                setShowInfoDrawer(false)
                                            }}
                                            className="w-full h-10 rounded-full font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-md"
                                            style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                                        >
                                            Scanner une Table
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Language Switcher */}
                            <div className="space-y-3">
                                <h4 className="font-serif text-sm uppercase tracking-wider" style={{ color: 'var(--category-highlight)' }}>Langue / Language</h4>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setLang('fr')}
                                        className="flex-1 py-2.5 rounded-full text-xs font-bold transition-all border"
                                        style={lang === 'fr' ? {
                                            backgroundColor: 'var(--button-bg)',
                                            color: 'var(--button-text)',
                                            borderColor: 'var(--button-bg)'
                                        } : {
                                            backgroundColor: 'transparent',
                                            borderColor: 'rgba(255,255,255,0.05)',
                                            color: 'var(--text-main)'
                                        }}
                                    >
                                        Français
                                    </button>
                                    <button
                                        onClick={() => setLang('en')}
                                        className="flex-1 py-2.5 rounded-full text-xs font-bold transition-all border"
                                        style={lang === 'en' ? {
                                            backgroundColor: 'var(--button-bg)',
                                            color: 'var(--button-text)',
                                            borderColor: 'var(--button-bg)'
                                        } : {
                                            backgroundColor: 'transparent',
                                            borderColor: 'rgba(255,255,255,0.05)',
                                            color: 'var(--text-main)'
                                        }}
                                    >
                                        English
                                    </button>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-4 text-sm font-light text-stone-300">
                                <h4 className="font-serif text-sm uppercase tracking-wider border-b pb-2" style={{ color: 'var(--category-highlight)', borderColor: 'rgba(255,255,255,0.05)' }}>Horaires & Contact</h4>
                                
                                {config?.hours && (
                                    <div className="flex gap-3 items-start">
                                        <span className="font-bold shrink-0 w-16" style={{ color: 'var(--category-highlight)' }}>Horaires:</span>
                                        <span className="text-stone-400 whitespace-pre-line">{config.hours}</span>
                                    </div>
                                )}
                                <div className="flex gap-3 items-center">
                                    <span className="font-bold shrink-0 w-16" style={{ color: 'var(--category-highlight)' }}>Téléphone:</span>
                                    <a href={`tel:${config?.phone || '0528212173'}`} className="text-stone-400 hover:text-[#f3b182] transition-colors" style={{ color: 'var(--category-highlight)' }}>
                                        {config?.phone || '05 28 21 21 73'}
                                    </a>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <span className="font-bold shrink-0 w-16" style={{ color: 'var(--category-highlight)' }}>Adresse:</span>
                                    <span className="text-stone-400">{config?.address || 'Agadir Bay, Agadir, Maroc'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer (Reservation Button) */}
                        <div className="p-6 border-t" style={{ backgroundColor: 'var(--footer-bg)', borderColor: 'rgba(255,255,255,0.05)' }}>
                            <Button
                                onClick={() => {
                                    setShowReservation(true)
                                    setShowInfoDrawer(false)
                                }}
                                className="w-full h-12 rounded-full font-bold text-sm shadow-md hover:brightness-110 animate-pulse-slow"
                                style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                            >
                                Réserver une Table
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tracking Status Widget */}
            {activeOrderId && !showCart && !showScanner && !orderComplete && (
                <div className="fixed bottom-24 right-6 z-40 animate-in slide-in-from-bottom duration-500">
                    <button
                        onClick={() => {
                            setShowCart(true)
                            setShowOrderTracking(true)
                        }}
                        className="backdrop-blur border shadow-lg px-4 py-2.5 rounded-full flex items-center gap-2.5 transition-transform hover:scale-105"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'rgba(255,255,255,0.05)' }}
                    >
                        <div className={`w-2 h-2 rounded-full ${orderStatus === 'READY' ? 'bg-green-500' : 'bg-[#f3b182] animate-pulse'}`}
                             style={orderStatus !== 'READY' ? { backgroundColor: 'var(--category-highlight)' } : {}} />
                        <div className="text-[9px] font-bold uppercase tracking-wider text-stone-300">
                            Suivi: {orderStatus || 'TRANSMIS'}
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
                primaryColor={accentColor}
                buttonBgColor={config?.buttonBgColor}
                buttonTextColor={config?.buttonTextColor}
            />
        </div>
    )
}
