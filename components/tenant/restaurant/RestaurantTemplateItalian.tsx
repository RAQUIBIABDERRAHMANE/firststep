'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import { 
    ShoppingCart, QrCode, MapPin, Phone, Mail, Plus, Minus, Trash2, 
    ChevronRight, Utensils, CheckCircle2, LayoutDashboard, Bell, X, Receipt, Loader2,
    Home, BookOpen, Calendar, User, Split
} from 'lucide-react'
import SplitBillModal from './SplitBillModal'
import { translations, Language, CURRENCY } from '@/lib/translations'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })
const ReservationModal = dynamic(() => import('./ReservationModal'), { ssr: false })

import DishCustomizationModal from './DishCustomizationModal'

/* ── Custom Crest Logo built with SVG ── */
function ItalianCrestLogo({ letter = 'B', primaryColor, config }: { letter?: string, primaryColor?: string, config?: any }) {
    const shieldBg = config?.cardColor || '#182d42'
    const letterColor = config?.textColor || '#FAF6F0'
    const accent = primaryColor || '#bfa15f'
    
    return (
        <svg width="46" height="46" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
            {/* Crown on top */}
            <path d="M 38,15 L 43,23 L 50,13 L 57,23 L 62,15 L 59,28 L 41,28 Z" fill={accent} />
            <circle cx="38" cy="14" r="1.5" fill={accent} />
            <circle cx="50" cy="12" r="1.5" fill={accent} />
            <circle cx="62" cy="14" r="1.5" fill={accent} />
            
            {/* Shield / Crest frame */}
            <path d="M 30,30 C 30,30 30,68 50,78 C 70,68 70,30 70,30 Z" fill={shieldBg} stroke={accent} strokeWidth="2" />
            <path d="M 34,33 C 34,33 34,64 50,73 C 66,64 66,33 66,33 Z" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.7" />

            {/* Left and Right flourish details */}
            <path d="M 24,35 Q 18,50 32,60" fill="none" stroke={accent} strokeWidth="1" />
            <path d="M 76,35 Q 82,50 68,60" fill="none" stroke={accent} strokeWidth="1" />
            
            {/* Centered Letter */}
            <text x="50" y="58" fontSize="24" fontFamily="'Playfair Display', serif" fontWeight="900" fill={letterColor} textAnchor="middle">
                {letter}
            </text>
        </svg>
    )
}

function DoubleBorder() {
    return (
        <div className="absolute inset-4 border border-[#7f8c67]/20 pointer-events-none rounded-2xl">
            <div className="absolute inset-1 border border-[#7f8c67]/10 rounded-[14px]"></div>
        </div>
    )
}

export default function RestaurantTemplateItalian({
    siteName, description, coverImage, logo, config, categories, isOwner, primaryColor
}: RestaurantTemplateProps) {
    const logic = useRestaurantLogic(categories, isOwner)
    const {
        showScanner, setShowScanner, showCart, setShowCart, activeCategory, setActiveCategory,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity,
        totalPrice, totalItems, tableId, categoryNames, filteredItems, handleScan, handlePlaceOrder, handleCallWaiter, handleRequestBill, removeItem,
        customizingDish, setCustomizingDish, handleConfirmCustomization, activeOrderId, orderStatus,
        showSplitBill, setShowSplitBill, activeOrderDetails, handleOpenSplitBill
    } = logic

    const [showReservation, setShowReservation] = useState(false)
    const [lang, setLang] = useState<Language>('fr')
    
    // Safely cast translation keys
    const t = (translations[lang as Language]?.restaurant || translations['en'].restaurant) as any

    // Custom Colors (Admin-configurable)
    const primary = primaryColor || '#8f4a27' // Rust/terracotta for headings/price
    const sageGreen = primaryColor || '#7f8c67' // Sage/olive green for buttons & badge
    const bgColor = config?.backgroundColor || '#f2efe9' // Warm plaster background
    const cardBg = config?.cardColor || '#ffffff' // Crisp white card background
    const textColor = config?.textColor || '#2b2823' // Dark espresso text
    const textSecondary = config?.textColor ? `${config.textColor}bf` : '#5e5950' // 75% opacity fallback

    // Specific Element Colors (derived from dashboard inputs)
    const buttonBg = config?.buttonBgColor || primary
    const buttonText = config?.buttonTextColor || '#ffffff'
    const headerBg = config?.headerBgColor || bgColor
    const headerText = config?.headerTextColor || textColor
    const footerBg = config?.footerBgColor || '#182d42'
    const footerText = config?.footerTextColor || '#FAF6F0'
    const categoryBg = config?.categoryBgColor || bgColor
    const categoryHighlight = config?.categoryHighlightColor || buttonBg
    const priceColor = config?.priceColor || primary

    const crestLetter = siteName ? siteName.replace(/^(Trattoria|Ristorante|O'|Da)\s+/i, '')[0].toUpperCase() : 'B'

    return (
        <div
            className="flex flex-col min-h-screen font-sans select-none pb-20"
            style={{ 
                backgroundColor: bgColor, 
                color: textColor,
                fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
                .font-serif-italian { font-family: 'Italiana', serif; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                .active-category-tab {
                    position: relative;
                }
                .active-category-tab::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 20%;
                    right: 20%;
                    height: 2px;
                    background-color: ${categoryHighlight};
                }
                
                .italian-card {
                    background-color: ${cardBg};
                    border-color: ${textColor}1a;
                    color: ${textColor};
                }
                .italian-card:hover {
                    border-color: ${primary}4d;
                }
                .italian-card-title {
                    color: ${textColor};
                    transition: color 0.3s;
                }
                .group:hover .italian-card-title {
                    color: ${primary};
                }
            `}</style>

            {/* Call Waiter & Request Bill buttons for scanned tables */}
            {tableId && !isOwner && (
                <div className="fixed bottom-24 left-6 z-50 flex flex-col gap-3">
                    {activeOrderId && (
                        <button
                            onClick={handleOpenSplitBill}
                            className="h-12 w-12 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-[#FAF6F0]/25"
                            style={{ backgroundColor: buttonBg, color: buttonText }}
                            title="Partager l'addition"
                        >
                            <Split size={18} />
                        </button>
                    )}
                    <button
                        onClick={handleRequestBill}
                        className="h-12 w-12 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-[#FAF6F0]/25"
                        style={{ backgroundColor: buttonBg, color: buttonText }}
                        title={lang === 'it' ? 'Richiedi il conto' : lang === 'fr' ? "Demander l'addition" : 'Request Bill'}
                    >
                        <Receipt size={18} />
                    </button>
                    <button
                        onClick={handleCallWaiter}
                        className="h-12 w-12 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-[#FAF6F0]/25"
                        style={{ backgroundColor: buttonBg, color: buttonText }}
                        title={t.call_waiter}
                    >
                        <Bell size={18} />
                    </button>
                </div>
            )}

            {/* ── HEADER ── */}
            <header className="sticky top-0 z-40 w-full border-b py-4" style={{ backgroundColor: headerBg, borderColor: `${headerText}0d` }}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Left: MENU toggle */}
                    <button 
                        onClick={() => {
                            const element = document.getElementById('menu-list-section')
                            if (element) element.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="font-serif-italian font-bold text-sm tracking-widest hover:opacity-80 transition-opacity uppercase"
                        style={{ color: headerText }}
                    >
                        Menù
                    </button>

                    {/* Center: Crest & Title */}
                    <div className="flex flex-col items-center justify-center text-center">
                        <ItalianCrestLogo letter={crestLetter} primaryColor={buttonBg} config={config} />
                        <span className="font-serif-italian font-extrabold text-lg md:text-xl tracking-widest mt-1 uppercase block leading-none" style={{ color: headerText }}>
                            {siteName}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-[0.5px] w-6 opacity-30" style={{ backgroundColor: headerText }} />
                            <span className="text-[7px] font-bold uppercase tracking-[0.3em] opacity-60 leading-none" style={{ color: headerText }}>Dal 1958</span>
                            <div className="h-[0.5px] w-6 opacity-30" style={{ backgroundColor: headerText }} />
                        </div>
                    </div>

                    {/* Right: Language Switcher, Cart & User icons */}
                    <div className="flex items-center gap-4">
                        {/* Language Selection Buttons */}
                        <div className="flex gap-0.5 rounded-full p-0.5 border mr-1" style={{ backgroundColor: `${headerText}0d`, borderColor: `${headerText}1a` }}>
                            {(['it', 'fr', 'en'] as Language[]).map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLang(l)}
                                    className={`px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider rounded-full transition-all ${
                                        lang === l 
                                            ? 'shadow-sm' 
                                            : 'opacity-50 hover:opacity-100'
                                    }`}
                                    style={{ 
                                        backgroundColor: lang === l ? buttonBg : 'transparent',
                                        color: lang === l ? buttonText : headerText 
                                    }}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowCart(true)}
                            className="relative hover:opacity-80 transition-all p-1"
                            style={{ color: headerText }}
                        >
                            <ShoppingCart size={22} strokeWidth={1.5} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-2 text-[8px] h-4.5 w-4.5 rounded-full flex items-center justify-center font-black shadow-md"
                                    style={{ backgroundColor: buttonBg, color: buttonText }}>
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        
                        {isOwner ? (
                            <Link href="/dashboard/restaurant" className="hover:opacity-80 transition-all" style={{ color: headerText }}>
                                <LayoutDashboard size={20} strokeWidth={1.5} />
                            </Link>
                        ) : (
                            <button onClick={() => setShowScanner(true)} className="hover:opacity-80 transition-all" style={{ color: headerText }}>
                                <User size={20} strokeWidth={1.5} />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-4">
                {/* ── CATEGORY HORIZONTAL SCROLL BAR ── */}
                <div className="w-full border-t border-b py-3 overflow-x-auto no-scrollbar flex justify-start gap-6 md:gap-8 mt-2" style={{ borderColor: `${textColor}1a`, backgroundColor: categoryBg }}>
                    {categoryNames.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap pb-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 font-serif-italian ${
                                activeCategory === cat 
                                    ? 'active-category-tab font-black' 
                                    : 'opacity-50 hover:opacity-100'
                            }`}
                            style={{ color: activeCategory === cat ? categoryHighlight : textColor }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* ── MENU LIST SECTION ── */}
                <section id="menu-list-section" className="py-8 scroll-mt-24">
                    <div className="space-y-12">
                        {categoryNames.map((cat) => {
                            if (activeCategory !== cat) return null

                            // Filter dishes for this category
                            const dishes = cat === 'All'
                                ? filteredItems
                                : (categories.find((c: any) => c.name === cat)?.dishes || [])

                            if (dishes.length === 0) {
                                return (
                                    <div key={cat} className="text-center py-20 space-y-4">
                                        <div className="h-16 w-16 mx-auto rounded-full flex items-center justify-center border border-dashed" style={{ borderColor: `${textColor}33` }}>
                                            <Utensils size={24} className="opacity-40" style={{ color: textColor }} />
                                        </div>
                                        <h3 className="font-serif-italian text-lg font-bold">{t.in_preparation}</h3>
                                        <p className="text-xs" style={{ color: textSecondary }}>{t.no_dishes_yet}</p>
                                    </div>
                                )
                            }

                            return (
                                <div key={cat} className="space-y-8">
                                    {/* Category Label divider if needed, e.g. for multi-view grid */}
                                    <div className="flex items-center gap-3">
                                        <span className="font-serif-italian font-bold text-xs uppercase tracking-widest opacity-40" style={{ color: textColor }}>
                                            {cat}
                                        </span>
                                        <div className="h-[0.5px] flex-1 opacity-10" style={{ backgroundColor: textColor }} />
                                    </div>

                                    {/* Hybrid Dynamic Grid mapping:
                                        - Large card (full-width) for the first dish
                                        - Large card (full-width) for the second dish
                                        - 2-column grid layout for subsequent dishes, matching the mockup rhythm!
                                    */}
                                    <div className="space-y-8">
                                        {/* Large full-width items */}
                                        <div className="grid grid-cols-1 gap-8">
                                            {dishes.slice(0, 2).map((item: any) => (
                                                <div 
                                                    key={item.id}
                                                    className="group rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 flex flex-col italian-card"
                                                >
                                                    {/* Full image */}
                                                    <div className="w-full aspect-[16/9] relative bg-stone-100 overflow-hidden" style={{ borderBottomColor: `${textColor}0d` }}>
                                                        <img 
                                                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'} 
                                                            alt={item.name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                                                        />
                                                    </div>
                                                    
                                                    {/* Card Body */}
                                                    <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                                                        <div>
                                                            <h3 className="font-serif-italian text-lg md:text-xl font-bold uppercase tracking-wide transition-colors italian-card-title">
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
                                                                    <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                                                                        {tagsList.map(tag => (
                                                                            <span key={tag} className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded border" style={{ backgroundColor: bgColor, color: primary, borderColor: `${primary}1a` }}>
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )
                                                            })()}

                                                            <p className="text-xs md:text-sm font-light mt-2 leading-relaxed" style={{ color: textSecondary }}>
                                                                {item.description || "Authentic recipe prepared with selected fresh local ingredients in traditional style."}
                                                            </p>
                                                        </div>

                                                        {/* Footer info & button */}
                                                        <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: `${textColor}0d` }}>
                                                            <span className="font-serif-italian font-bold text-base md:text-lg" style={{ color: priceColor }}>
                                                                {CURRENCY} {item.price.toFixed(2)}
                                                            </span>
                                                            
                                                            <button
                                                                onClick={() => addItem(item)}
                                                                className="px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-95 hover:brightness-110"
                                                                style={{ backgroundColor: buttonBg, color: buttonText }}
                                                            >
                                                                Cart now
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Half-width items (2-column layout) for the remaining items */}
                                        {dishes.length > 2 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {dishes.slice(2).map((item: any) => (
                                                    <div 
                                                        key={item.id}
                                                        className="group rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 flex flex-col justify-between italian-card"
                                                    >
                                                        <div>
                                                            {/* Thumbnail Image */}
                                                            <div className="w-full aspect-[4/3] relative bg-stone-100 overflow-hidden" style={{ borderBottomColor: `${textColor}0d` }}>
                                                                <img 
                                                                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'} 
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                                                                />
                                                            </div>

                                                            {/* Content */}
                                                            <div className="p-5">
                                                                <h3 className="font-serif-italian text-base font-bold uppercase tracking-wide transition-colors leading-snug italian-card-title">
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
                                                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                                                            {tagsList.map(tag => (
                                                                                <span key={tag} className="px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-widest rounded border" style={{ backgroundColor: bgColor, color: primary, borderColor: `${primary}1a` }}>
                                                                                    {tag}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )
                                                                })()}

                                                                <p className="text-[11px] font-light mt-2 leading-relaxed line-clamp-3" style={{ color: textSecondary }}>
                                                                    {item.description || "Authentic recipe prepared with selected fresh local ingredients in traditional style."}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Footer info & button */}
                                                        <div className="p-5 pt-0 flex items-center justify-between">
                                                            <span className="font-serif-italian font-bold text-sm" style={{ color: priceColor }}>
                                                                {CURRENCY} {item.price.toFixed(2)}
                                                            </span>
                                                            
                                                            <button
                                                                onClick={() => addItem(item)}
                                                                className="px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-95 hover:brightness-110"
                                                                style={{ backgroundColor: buttonBg, color: buttonText }}
                                                            >
                                                                Cart now
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            {/* ── CART DRAWER ── */}
            {showCart && (
                <div className="fixed inset-0 z-[60] backdrop-blur-sm transition-all duration-300" style={{ background: 'rgba(43,40,35,0.6)' }} onClick={() => setShowCart(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col bg-[#f2efe9]"
                        onClick={e => e.stopPropagation()}>
                        <DoubleBorder />

                        {/* Cart Header */}
                        <div className="p-8 flex items-center justify-between z-10" style={{ borderBottom: '1.5px solid rgba(43, 40, 35, 0.1)', background: '#182d42' }}>
                            <div>
                                <h2 className="font-serif-italian text-2xl font-bold text-[#FAF6F0] tracking-wide uppercase">{t.my_order}</h2>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-[#FAF6F0]/60 mt-0.5">{totalItems} {t.items_count}</p>
                            </div>
                            <button onClick={() => setShowCart(false)} className="h-10 w-10 rounded-full border border-[#FAF6F0]/20 text-[#FAF6F0] flex items-center justify-center hover:bg-white/5 transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar z-10">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                                    <Utensils size={40} className="text-[#2b2823]/30" />
                                    <h3 className="font-serif-italian text-xl font-bold">{t.cart_empty}</h3>
                                    <p className="text-xs text-[#5e5950]">{t.start_journey}</p>
                                    
                                    {activeOrderId && (
                                        <div className="pt-4 border-t border-[#2b2823]/10 w-full max-w-xs mx-auto space-y-3 z-10">
                                            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Ordine attivo in corso</p>
                                            <button
                                                onClick={() => {
                                                    setShowCart(false)
                                                    handleOpenSplitBill()
                                                }}
                                                className="w-full py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all"
                                                style={{ backgroundColor: buttonBg, color: buttonText }}
                                            >
                                                Partager l'addition
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : items.map((item) => (
                                <div key={item.cartItemId} className="flex gap-4 items-center rounded-xl p-4 border border-[#2b2823]/10 bg-white shadow-sm">
                                    <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border border-stone-100 bg-[#E5E7EB]">
                                        <img src={item.image || ''} className="h-full w-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="font-serif-italian font-bold text-sm text-[#2b2823]">{item.name}</h4>
                                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                                            <div className="text-[9px] text-[#8f4a27] font-semibold uppercase tracking-wider mt-1">
                                                {item.selectedOptions.map(o => `${o.group}: ${o.choice}`).join(', ')}
                                            </div>
                                        )}
                                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                                            <div className="text-[8px] text-emerald-700 font-bold uppercase tracking-widest mt-0.5">
                                                + {item.selectedAddons.map(a => `${a.name} (+${a.price} MAD)`).join(', ')}
                                            </div>
                                        )}
                                        <span className="text-xs font-bold block mt-1 text-[#8f4a27]">{CURRENCY} {item.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <button onClick={() => removeItem(item.cartItemId)} className="text-stone-400 hover:text-[#8f4a27] transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                        <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold"
                                            style={{ background: '#182d42' }}>
                                            <button onClick={() => updateQuantity(item.cartItemId, -1)} className="hover:text-[#FAF6F0] transition-colors"><Minus size={11} strokeWidth={3.5} /></button>
                                            <span className="w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.cartItemId, 1)} className="hover:text-[#FAF6F0] transition-colors"><Plus size={11} strokeWidth={3.5} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Footer Checkout section */}
                        {items.length > 0 && (
                            <div className="p-8 space-y-6 z-10 border-t border-[#2b2823]/10 bg-white">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#5e5950]">{t.total_amount}</span>
                                    <span className="font-serif-italian text-2xl text-[#8f4a27] font-bold">
                                        {CURRENCY} {totalPrice.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={!tableId || isPlacingOrder}
                                    className="w-full py-4 rounded-lg font-bold text-xs uppercase tracking-[0.25em] disabled:opacity-30 active:scale-95 transition-all shadow-md border border-transparent flex items-center justify-center gap-2"
                                    style={{ backgroundColor: buttonBg, color: buttonText }}
                                >
                                    {isPlacingOrder ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : null}
                                    {isPlacingOrder ? t.sending_order : t.place_order}
                                </button>
                                {!tableId && (
                                    <div className="rounded-lg p-3 text-center border border-amber-200" style={{ background: '#FFF7ED' }}>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#8f4a27]">{t.table_not_scanned}</p>
                                        <p className="text-xs text-stone-500 mt-1">{t.scan_required}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Order Complete Screen */}
                        {orderComplete && (
                            <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500 bg-[#f2efe9]">
                                <DoubleBorder />
                                <CheckCircle2 size={48} className="text-emerald-700 mt-4 animate-bounce" />
                                <h2 className="font-serif-italian text-3xl font-bold mt-6 mb-3 text-[#2b2823]">{t.thanks}</h2>
                                <p className="font-serif-italian italic text-base mb-8 text-[#5e5950] px-4">
                                     {t.chef_preparing}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center px-4 max-w-sm z-10">
                                    <button
                                        onClick={() => {
                                            setOrderComplete(false)
                                            setShowCart(false)
                                        }}
                                        className="rounded-lg px-6 py-3 font-bold uppercase tracking-widest text-[10px] transition-all border border-stone-300 text-stone-700 hover:bg-stone-50 flex-1"
                                    >
                                        {t.back_to_menu}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOrderComplete(false)
                                            setShowCart(false)
                                            handleOpenSplitBill()
                                        }}
                                        className="rounded-lg px-6 py-3 font-bold uppercase tracking-widest text-[10px] transition-all flex-1"
                                        style={{ backgroundColor: buttonBg, color: buttonText }}
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
            {showSplitBill && activeOrderId && activeOrderDetails && (
                <SplitBillModal
                    orderId={activeOrderId}
                    items={activeOrderDetails.items}
                    totalPrice={activeOrderDetails.totalPrice}
                    onClose={() => setShowSplitBill(false)}
                />
            )}

            {/* ── FLOATING ACTION BUTTON ── */}
            {!tableId ? (
                <button
                    onClick={() => setShowScanner(true)}
                    className="fixed bottom-24 right-6 z-45 px-5 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 animate-bounce"
                    style={{ backgroundColor: buttonBg, color: buttonText }}
                >
                    <QrCode size={16} />
                    <span>Scan Table</span>
                </button>
            ) : (
                <div className="fixed bottom-24 right-6 z-45 flex flex-col gap-2.5 items-end">
                    {/* Active Order Status Capsule */}
                    {activeOrderId && orderStatus && (
                        <div className="bg-[#182d42] border border-[#bfa15f]/30 rounded-xl px-4 py-2 text-white shadow-xl flex items-center gap-2 animate-pulse-slow">
                            <span className="text-[8px] font-black uppercase tracking-widest text-[#bfa15f]/80">Status:</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                {t.status?.[orderStatus] || orderStatus}
                            </span>
                        </div>
                    )}

                    {/* Table Info and Call Actions */}
                    <div className="flex gap-2">
                        {activeOrderId && (
                            <button
                                onClick={handleOpenSplitBill}
                                className="h-11 px-4 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-white/15 text-[10px] font-black uppercase tracking-widest"
                                style={{ backgroundColor: buttonBg, color: buttonText }}
                            >
                                <Split size={14} />
                                <span>Dividi</span>
                            </button>
                        )}
                        <button
                            onClick={handleRequestBill}
                            className="h-11 px-4 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-white/15 text-[10px] font-black uppercase tracking-widest"
                            style={{ backgroundColor: buttonBg, color: buttonText }}
                        >
                            <Receipt size={14} />
                            <span>Conto</span>
                        </button>
                        <button
                            onClick={handleCallWaiter}
                            className="h-11 px-4 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-white/15 text-[10px] font-black uppercase tracking-widest"
                            style={{ backgroundColor: buttonBg, color: buttonText }}
                        >
                            <Bell size={14} />
                            <span>Cameriere</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ── FOOTER ── */}
            <footer className="mt-20 py-20 relative overflow-hidden pb-32" style={{ backgroundColor: footerBg, color: footerText }}>
                {/* Thin gold border at the top of the footer */}
                <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: `${buttonBg}4d` }} />
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                        {/* Column 1: Story / About */}
                        <div className="space-y-4">
                            <h4 className="font-serif-italian font-bold text-lg tracking-widest uppercase text-current">
                                {siteName}
                            </h4>
                            <p className="font-serif-italian italic text-xs leading-relaxed max-w-xs mx-auto md:mx-0 opacity-70 text-current">
                                {description || t.about_default}
                            </p>
                            <div className="flex justify-center md:justify-start gap-4 pt-2">
                                {config?.email && (
                                    <a 
                                        href={`mailto:${config.email}`}
                                        className="h-9 w-9 rounded-full border flex items-center justify-center transition-all"
                                        style={{ borderColor: `${buttonBg}4d`, color: buttonBg }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${buttonBg}26` }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                                    >
                                        <Mail size={14} />
                                    </a>
                                )}
                                {config?.phone && (
                                    <a 
                                        href={`tel:${config.phone}`}
                                        className="h-9 w-9 rounded-full border flex items-center justify-center transition-all"
                                        style={{ borderColor: `${buttonBg}4d`, color: buttonBg }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${buttonBg}26` }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                                    >
                                        <Phone size={14} />
                                    </a>
                                )}
                                {config?.address && (
                                    <a 
                                        href={`https://maps.google.com/?q=${encodeURIComponent(config.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-9 w-9 rounded-full border flex items-center justify-center transition-all"
                                        style={{ borderColor: `${buttonBg}4d`, color: buttonBg }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${buttonBg}26` }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                                    >
                                        <MapPin size={14} />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Column 2: Service Hours */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] font-serif-italian" style={{ color: buttonBg }}>
                                {t.orari}
                            </h4>
                            <p className="font-serif-italian text-xs leading-relaxed whitespace-pre-line opacity-85 text-current">
                                {config?.hours || 'Lun — Dom\n12:00 — 15:30\n19:00 — 23:30'}
                            </p>
                        </div>

                        {/* Column 3: Contact & Arrival */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] font-serif-italian" style={{ color: buttonBg }}>
                                {t.contatti}
                            </h4>
                            <div className="space-y-2 text-xs opacity-85 text-current">
                                <p className="leading-relaxed">{config?.address || 'Corso Vittorio Emanuele II, Roma'}</p>
                                <p className="font-serif-italian font-bold text-sm tracking-wide mt-1 text-current">
                                    {config?.phone || '+39 06 1234567'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: `${footerText}1a`, color: footerText }}>
                        <p className="opacity-50">© {new Date().getFullYear()} {siteName} / ITALIAN DINING GROUP</p>
                        <nav className="flex gap-6">
                            <a href="#" className="hover:opacity-100 opacity-50 transition-opacity">Privacy</a>
                            <a href="#" className="hover:opacity-100 opacity-50 transition-opacity">Terms</a>
                        </nav>
                    </div>
                </div>
            </footer>

            {/* ── STICKY BOTTOM NAVIGATION BAR ── */}
            <div className="fixed bottom-0 inset-x-0 z-50 border-t py-3 shadow-[0_-5px_20px_rgba(43,40,35,0.08)]" style={{ backgroundColor: headerBg, borderColor: `${headerText}1a` }}>
                <div className="max-w-md mx-auto flex items-center justify-around">
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex flex-col items-center justify-center transition-colors hover:opacity-100"
                        style={{ color: headerText, opacity: 0.6 }}
                    >
                        <Home size={20} strokeWidth={1.8} />
                        <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Home</span>
                    </button>
                    
                    <button 
                        onClick={() => {
                            const element = document.getElementById('menu-list-section')
                            if (element) element.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="flex flex-col items-center justify-center transition-colors relative"
                        style={{ color: headerText }}
                    >
                        <BookOpen size={20} strokeWidth={1.8} />
                        <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Menù</span>
                        <div className="absolute -bottom-1.5 w-1 h-1 rounded-full" style={{ backgroundColor: headerText }} />
                    </button>

                    <button 
                        onClick={() => setShowReservation(true)}
                        className="flex flex-col items-center justify-center transition-colors hover:opacity-100"
                        style={{ color: headerText, opacity: 0.6 }}
                    >
                        <Calendar size={20} strokeWidth={1.8} />
                        <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Prenota</span>
                    </button>

                    <button 
                        onClick={() => {
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                        }}
                        className="flex flex-col items-center justify-center transition-colors hover:opacity-100"
                        style={{ color: headerText, opacity: 0.6 }}
                    >
                        <User size={20} strokeWidth={1.8} />
                        <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Contatti</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
