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
    Loader2, Sparkles, Heart
} from 'lucide-react'

import { translations, Language, CURRENCY } from '@/lib/translations'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })
const ReservationModal = dynamic(() => import('./ReservationModal'), { ssr: false })

import DishCustomizationModal from './DishCustomizationModal'

export default function RestaurantTemplateLight({ siteName, description, coverImage, logo, config, categories, isOwner, primaryColor }: RestaurantTemplateProps) {
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

    // Handle scroll categories mapping
    useEffect(() => {
        const handleScroll = () => {
            const offsets = categoryNames.map((cat) => {
                const element = document.getElementById(`cat-${cat}`)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    return { cat, top: rect.top + window.scrollY - 200 }
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
            const offset = 140 // Height of sticky header + category bar
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

    // Custom Luxury Ivory & Warm Gold Palette
    const goldColor = primaryColor || '#c5a880' // Champagne/Gold accent
    const containerStyle = {
        '--primary': goldColor,
        '--primary-hover': '#b4966e',
        '--bg-main': '#faf9f5', // Ivory cream base
        '--text-main': '#1c1917', // Stone-900 typography
        '--card-bg': 'rgba(255, 255, 255, 0.85)',
        '--border-color': '#ede9dd',
    } as React.CSSProperties

    return (
        <div style={containerStyle} className="min-h-screen bg-[#faf9f5] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50/20 via-[#faf9f5] to-[#f4f3ed] font-sans text-stone-900 selection:bg-[var(--primary)] selection:text-white pb-24">
            {/* Top Navigation Bar - Minimalist Glassmorphism */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-[#faf9f5]/70 backdrop-blur-xl border-b border-[#ede9dd]/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-12 w-12 object-contain transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                            <div className="h-12 w-12 bg-stone-900 text-amber-50 flex items-center justify-center font-serif text-2xl font-light rounded-2xl shadow-md">
                                {siteName[0]}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="font-serif text-xl tracking-tight leading-none font-medium">{siteName}</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#c5a880] mt-1">L'Expérience Chocolatée</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {isOwner && (
                            <Link href="/dashboard/restaurant" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-950 transition-colors hidden md:block">
                                Table Tableau
                            </Link>
                        )}
                        <button onClick={() => setShowScanner(true)} className="p-2.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all duration-300" title="Scanner QR">
                            <QrCode size={20} strokeWidth={2} />
                        </button>
                        <button
                            onClick={() => setLang(l => l === 'en' ? 'fr' : 'en')}
                            className="text-[10px] font-bold text-stone-500 hover:text-stone-900 uppercase tracking-widest border border-stone-200 rounded-full px-3 py-1 transition-all active:scale-95 bg-white/50"
                        >
                            {lang === 'fr' ? 'FR' : 'EN'}
                        </button>
                        <button
                            onClick={() => setShowReservation(true)}
                            className="text-[10px] font-black uppercase tracking-widest bg-stone-900 text-amber-50 hover:bg-stone-800 rounded-full px-5 h-10 transition-all active:scale-95 shadow-md"
                        >
                            Réserver
                        </button>
                        <button
                            onClick={() => {
                                setShowCart(true)
                                setShowOrderTracking(false)
                            }}
                            className="relative flex items-center justify-center h-12 w-12 bg-[#c5a880] hover:bg-[#b4966e] text-white rounded-full transition-all shadow-md active:scale-95"
                        >
                            <ShoppingCart size={18} strokeWidth={2.5} />
                            {totalItems > 0 && (
                                <div className="absolute -top-1 -right-1 bg-stone-900 text-amber-50 text-[9px] font-black w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-[#faf9f5] shadow-sm animate-bounce">
                                    {totalItems}
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Premium Hero Section - Refined Editorial Layout */}
            <header className="relative pt-36 pb-16 md:pt-48 md:pb-28 px-6 overflow-hidden max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    <div className="lg:col-span-6 z-10 animate-in slide-in-from-bottom-6 duration-1000">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c5a880]">
                                {config.subtitle || "Chocolaterie & Salon de thé"}
                            </span>
                            <div className="h-px w-8 bg-[#ede9dd]" />
                        </div>
                        <h1 className="font-serif text-5xl md:text-7xl font-light text-stone-900 mb-8 leading-[1.08] tracking-tight">
                            {config.heroTitle || "L'Art Belge du Chocolat"}
                        </h1>
                        <p className="text-lg text-stone-600 leading-relaxed mb-10 max-w-lg font-normal">
                            {description || "Chocolat fondu de haute qualité, gaufres et crêpes fraîches au cœur d'une ambiance moderne et décontractée."}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                            {config.address && (
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#c5a880]" />
                                    <span>{config.address}</span>
                                </div>
                            )}
                            {config.phone && (
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#c5a880]" />
                                    <span>{config.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Editorial Curved Image Framing */}
                    <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[60px] overflow-hidden shadow-[0_30px_70px_rgba(197,168,128,0.12)] border border-[#ede9dd]/60 group z-10">
                            <img
                                src={coverImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'}
                                alt="Chocolate Dip Specialty"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 via-transparent to-transparent" />
                        </div>

                        {/* Aesthetic Floating Card */}
                        <div className="absolute -bottom-6 -left-4 bg-white/90 backdrop-blur-md p-6 shadow-xl border border-[#ede9dd]/50 rounded-[24px] hidden sm:block z-20 animate-fade-in-up">
                            <p className="text-[8px] font-black uppercase tracking-widest text-[#c5a880] mb-1">Ambiance</p>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="font-serif text-lg text-stone-900 italic font-medium">Ouvert pour service sur table</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sticky Category Bar - Luxury Line Highlight */}
            <div className="sticky top-20 z-40 bg-[#faf9f5]/85 backdrop-blur-md border-b border-[#ede9dd]/50 py-4 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar flex items-center gap-8 md:gap-12 justify-start lg:justify-center">
                    {categoryNames.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => scrollToCategory(cat)}
                            className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.25em] transition-all relative py-2 ${activeSection === cat
                                ? 'text-stone-950 scale-105 font-black'
                                : 'text-stone-400 hover:text-stone-700'
                                }`}
                        >
                            {cat}
                            {activeSection === cat && (
                                <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#c5a880] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Items Showcase */}
            <div className="max-w-7xl mx-auto px-6 mt-20 space-y-28">
                {categoryNames.map((cat) => {
                    const categoryItems = categories.find((c: any) => c.name === cat)?.dishes || []
                    if (categoryItems.length === 0) return null

                    return (
                        <section id={`cat-${cat}`} key={cat} className="scroll-mt-40">
                            {/* Section Title */}
                            <div className="max-w-xl mb-12">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-px w-8 bg-[#c5a880]" />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c5a880]">Notre Sélection</span>
                                </div>
                                <h3 className="font-serif text-3xl md:text-5xl font-light text-stone-900">{cat}</h3>
                            </div>

                            {/* Dishes Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categoryItems.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="group bg-white/55 hover:bg-white backdrop-blur-md rounded-[32px] border border-[#ede9dd]/40 p-5 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(197,168,128,0.15)] hover:border-[#c5a880]/30 hover:-translate-y-1"
                                    >
                                        <div className="space-y-4">
                                            {/* Dish Thumbnail */}
                                            <div className="w-full aspect-video rounded-[24px] overflow-hidden bg-stone-100 relative shadow-sm border border-[#ede9dd]/20">
                                                <img
                                                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>

                                            {/* Dish Metadata */}
                                            <div className="px-1">
                                                <div className="flex justify-between items-start gap-2 mb-2">
                                                    <h4 className="font-serif text-xl font-medium text-stone-900 group-hover:text-[#c5a880] transition-colors duration-300">
                                                        {item.name}
                                                    </h4>
                                                    <span className="font-medium text-lg text-[#c5a880] whitespace-nowrap shrink-0 mt-0.5">
                                                        {item.price} <span className="text-[10px] uppercase">{CURRENCY}</span>
                                                    </span>
                                                </div>

                                                {/* Tags */}
                                                {(() => {
                                                    let tagsList: string[] = []
                                                    try {
                                                        tagsList = typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : (item.tags || [])
                                                    } catch { }
                                                    if (tagsList.length === 0) return null
                                                    return (
                                                        <div className="flex flex-wrap gap-1 mb-2.5">
                                                            {tagsList.map(tag => (
                                                                <span key={tag} className="px-2 py-0.5 bg-stone-100 text-stone-500 text-[8px] font-bold uppercase tracking-wider rounded-md">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )
                                                })()}

                                                <p className="text-stone-500 text-sm font-light leading-relaxed line-clamp-2">
                                                    {item.description || "Un délice raffiné élaboré à partir de chocolat de qualité supérieure et d'ingrédients soigneusement sélectionnés."}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="pt-5 mt-4 border-t border-[#ede9dd]/45 flex justify-end">
                                            <button
                                                onClick={() => addItem(item)}
                                                className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.25em] text-stone-800 hover:text-[#c5a880] transition-colors"
                                            >
                                                <span className="h-8 w-8 bg-stone-900 group-hover:bg-[#c5a880] text-amber-50 group-hover:text-white rounded-full flex items-center justify-center transition-all duration-300">
                                                    <Plus size={14} />
                                                </span>
                                                <span>{t.add_to_order}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                })}
            </div>

            {/* Aesthetic Footer */}
            <footer className="mt-40 border-t border-[#ede9dd]/60 bg-white/40 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
                        <div className="md:col-span-2 space-y-6">
                            <h4 className="font-serif text-3xl font-medium text-stone-900">{siteName}</h4>
                            <p className="text-stone-500 text-base max-w-sm leading-relaxed font-light">
                                L'art suprême du dessert belge dans une ambiance chaleureuse et raffinée.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-[9px] font-bold uppercase tracking-[0.35em] text-stone-400">{t.hours}</h5>
                            <p className="text-stone-800 font-light text-sm leading-relaxed whitespace-pre-line">
                                {config.hours || "Lun — Dim\n14:00 — 00:00"}
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-[9px] font-bold uppercase tracking-[0.35em] text-stone-400">{t.contact}</h5>
                            <div className="space-y-3 text-stone-800 font-light text-sm leading-relaxed">
                                {config.address && <p>{config.address}</p>}
                                {config.phone && <p className="font-bold text-stone-950 text-base">{config.phone}</p>}
                                {config.email && <p className="text-stone-400">{config.email}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="mt-20 pt-8 border-t border-[#ede9dd]/40 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400">
                            &copy; {new Date().getFullYear()} {siteName}. Tous droits réservés.
                        </p>
                        <div className="flex gap-6 text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400">
                            <a href="#" className="hover:text-stone-950 transition-colors">Politique</a>
                            <a href="#" className="hover:text-stone-950 transition-colors">Conditions</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Waiter & Bill Floating Action Group */}
            {tableId && !isOwner && (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                    <button
                        onClick={handleRequestBill}
                        className="h-12 w-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        title="Demander l'addition"
                    >
                        <Receipt size={18} />
                    </button>
                    <button
                        onClick={handleCallWaiter}
                        className="h-12 w-12 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-50 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        title="Appeler serveur"
                    >
                        <Bell size={18} />
                    </button>
                </div>
            )}

            {/* Shopping Cart Drawer */}
            {showCart && (
                <div className="fixed inset-0 z-[60] bg-stone-900/20 backdrop-blur-sm transition-all" onClick={() => setShowCart(false)}>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-[#ede9dd]/60"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-[#ede9dd]/40 flex items-center justify-between">
                            <h2 className="font-serif text-2xl text-stone-900">Votre Commande</h2>
                            <button onClick={() => setShowCart(false)} className="text-stone-400 hover:text-stone-900 p-2 rounded-full hover:bg-stone-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-3">
                                    <ShoppingCart size={36} className="opacity-20" />
                                    <p className="font-serif text-base font-light">Votre panier est vide</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.cartItemId} className="flex gap-4 pb-4 border-b border-[#ede9dd]/30">
                                        <div className="w-16 h-16 rounded-[16px] bg-stone-100 overflow-hidden shrink-0 border border-[#ede9dd]/20">
                                            <img src={item.image || ''} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <h4 className="font-medium text-stone-900 leading-tight text-sm">{item.name}</h4>
                                                <span className="font-bold text-stone-800 shrink-0 text-sm">{item.price} {CURRENCY}</span>
                                            </div>
                                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                <div className="text-[9px] text-[#c5a880] font-bold uppercase tracking-wider mb-1">
                                                    {item.selectedOptions.map(o => `${o.group}: ${o.choice}`).join(', ')}
                                                </div>
                                            )}
                                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                                                <div className="text-[8px] text-emerald-600 font-bold uppercase tracking-widest mb-1">
                                                    + {item.selectedAddons.map(a => `${a.name} (+${a.price} MAD)`).join(', ')}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <button onClick={() => removeItem(item.cartItemId)} className="text-stone-300 hover:text-red-500 transition-colors p-1" title="Supprimer">
                                                    <Trash2 size={14} />
                                                </button>
                                                <div className="flex items-center gap-3 bg-stone-50 rounded-full border border-[#ede9dd]/40 p-1">
                                                    <button onClick={() => updateQuantity(item.cartItemId, -1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-stone-600 transition-colors"><Minus size={10} /></button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.cartItemId, 1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-stone-600 transition-colors"><Plus size={10} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 border-t border-[#ede9dd]/40 bg-[#faf9f5]">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total</span>
                                    <span className="font-serif text-2xl text-[#c5a880] font-bold">{totalPrice.toFixed(2)} {CURRENCY}</span>
                                </div>
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={!tableId || isPlacingOrder}
                                    className="w-full h-12 rounded-full bg-stone-900 hover:bg-stone-850 text-amber-50 font-bold text-sm shadow-md"
                                >
                                    {isPlacingOrder ? 'Envoi...' : 'Passer la commande'}
                                </Button>
                                {!tableId && (
                                    <p className="text-center text-[10px] text-amber-700 mt-3 font-medium px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                                        Veuillez scanner le code QR de votre table pour finaliser l'envoi.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Order Confirmation Screen Overlay */}
                        {(orderComplete || (activeOrderId && showOrderTracking)) ? (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in z-50">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${orderStatus === 'READY' || orderStatus === 'SERVED' ? 'bg-green-50 text-green-600' :
                                    orderStatus === 'PREPARING' || orderStatus === 'COOKING' ? 'bg-amber-55/60 text-[#c5a880] animate-pulse' :
                                        'bg-stone-100 text-stone-600'
                                    }`}>
                                    {orderStatus === 'READY' || orderStatus === 'SERVED' ? <Check size={36} /> :
                                        orderStatus === 'PREPARING' || orderStatus === 'COOKING' ? <Loader2 size={36} className="animate-spin" /> :
                                            <Sparkles size={36} />}
                                </div>
                                <h2 className="text-2xl font-serif text-stone-900 mb-2">
                                    {orderStatus === 'PENDING' && 'Commande Envoyée !'}
                                    {orderStatus === 'PREPARING' && 'En préparation...'}
                                    {orderStatus === 'COOKING' && 'En cuisine...'}
                                    {orderStatus === 'READY' && 'Prêt à servir !'}
                                    {orderStatus === 'SERVED' && 'Bon Appétit !'}
                                    {!orderStatus && 'Commande Validée'}
                                </h2>
                                <p className="text-stone-500 text-sm mb-8 max-w-xs mx-auto font-light">
                                    {orderStatus === 'PENDING' && 'Votre commande a été transmise en cuisine.'}
                                    {orderStatus === 'PREPARING' && 'Le chef prépare vos douceurs chocolatées.'}
                                    {orderStatus === 'COOKING' && 'C’est sur le feu, encore un instant.'}
                                    {orderStatus === 'READY' && 'Vos plats arrivent à votre table.'}
                                    {orderStatus === 'SERVED' && 'Profitez bien de votre expérience Chocolate Dip.'}
                                    {!orderStatus && 'Votre commande a bien été prise en compte.'}
                                </p>
                                <div className="inline-block px-4 py-1.5 bg-[#ede9dd]/65 border border-[#ede9dd]/45 rounded-full text-[9px] font-bold uppercase tracking-wider text-stone-600 mb-8">
                                    Statut: {orderStatus || 'PENDING'}
                                </div>
                                <Button
                                    onClick={() => {
                                        setOrderComplete(false)
                                        setShowOrderTracking(false)
                                        setShowCart(false)
                                    }}
                                    variant="outline"
                                    className="border-stone-200 text-stone-850 rounded-full h-10 px-6"
                                >
                                    Continuer
                                </Button>
                            </div>
                        ) : null}
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
                        className="bg-white/90 backdrop-blur border border-[#ede9dd] shadow-lg px-4 py-2.5 rounded-full flex items-center gap-2.5 transition-transform hover:scale-105"
                    >
                        <div className={`w-2 h-2 rounded-full ${orderStatus === 'READY' ? 'bg-green-500' : 'bg-[#c5a880] animate-pulse'}`}></div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-stone-600">
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
                primaryColor={goldColor}
            />
        </div>
    )
}
