'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import { ShoppingCart, QrCode, MapPin, Phone, Mail, Plus, Minus, Trash2, ChevronRight, Utensils, CheckCircle2, LayoutDashboard, Bell, X } from 'lucide-react'
import { translations, Language, CURRENCY } from '@/lib/translations'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })
const ReservationModal = dynamic(() => import('./ReservationModal'), { ssr: false })

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
    siteName, description, coverImage, logo, config, categories, isOwner, primaryColor
}: RestaurantTemplateProps) {
    const logic = useRestaurantLogic(categories, isOwner)
    const {
        showScanner, setShowScanner, showCart, setShowCart, activeCategory, setActiveCategory,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity,
        totalPrice, totalItems, tableId, categoryNames, filteredItems, handleScan, handlePlaceOrder, handleCallWaiter, removeItem
    } = logic

    const [showReservation, setShowReservation] = useState(false)
    const [lang, setLang] = useState<Language>('fr')
    const t = translations[lang as Language].restaurant

    const primary = primaryColor || '#C1440E'
    const bgColor = config?.backgroundColor || '#FDF6E3'
    const textColor = config?.textColor || '#1A2340'
    const cardColor = config?.cardColor || '#FFF8ED'

    return (
        <div
            className="flex flex-col min-h-screen font-sans"
            style={{ 
                background: bgColor, 
                color: textColor,
                fontFamily: "'Lato', sans-serif" 
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700;900&display=swap');
                .font-amiri { font-family: 'Amiri', serif; }
                .moroccan-arch {
                    clip-path: polygon(0% 100%, 0% 40%, 10% 20%, 20% 8%, 30% 2%, 50% 0%, 70% 2%, 80% 8%, 90% 20%, 100% 40%, 100% 100%);
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Call Waiter */}
            {tableId && !isOwner && (
                <Button
                    onClick={handleCallWaiter}
                    className="fixed bottom-10 left-10 h-16 w-16 rounded-full shadow-2xl z-50 flex items-center justify-center animate-bounce border-4 border-amber-300 active:scale-95 transition-all"
                    style={{ background: primary, color: 'white' }}
                >
                    <Bell className="h-7 w-7" />
                </Button>
            )}

            {/* ── HEADER ── */}
            <header className="sticky top-0 z-40 w-full" style={{ background: '#1A2340', borderBottom: '3px solid #D4A017' }}>
                <GoldBorder />
                <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
                    <div className="flex items-center gap-4">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-12 w-12 object-contain rounded-full border-2 border-amber-400" />
                        ) : (
                            <div className="h-12 w-12 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-300 font-amiri font-bold text-xl"
                                style={{ background: 'rgba(212,160,23,0.15)' }}>
                                {siteName[0]}
                            </div>
                        )}
                        <div>
                            <span className="font-amiri font-bold text-2xl text-amber-300 block leading-none">{siteName}</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600/70">مطعم مغربي أصيل</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isOwner && (
                            <Link href="/dashboard/restaurant">
                                <Button variant="ghost" className="hidden md:flex gap-2 text-amber-300 hover:text-amber-100 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest h-10 px-5 rounded-full border border-amber-800">
                                    <LayoutDashboard size={14} /> Dashboard
                                </Button>
                            </Link>
                        )}
                        <button
                            onClick={() => setShowReservation(true)}
                            className="hidden md:flex h-12 px-6 items-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all active:scale-95"
                            style={{ background: primary }}
                        >
                            <CheckCircle2 size={16} /> Réserver
                        </button>
                        <button
                            onClick={() => setShowScanner(true)}
                            className="h-10 w-10 flex items-center justify-center rounded-full border border-amber-700 text-amber-300 hover:bg-amber-400/10 transition-all"
                        >
                            <QrCode size={18} />
                        </button>
                        <button
                            onClick={() => setShowCart(true)}
                            className="group relative h-10 px-5 rounded-full text-[#1A2340] font-bold text-sm flex items-center gap-2 transition-all hover:brightness-110 active:scale-95"
                            style={{ background: '#D4A017' }}
                        >
                            <ShoppingCart size={18} />
                            <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">سلة الطلبات</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-black border-2 border-amber-200 shadow-lg"
                                    style={{ background: primary }}>
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                <GoldBorder />
            </header>

            <main className="flex-1 pb-32">
                {/* ── HERO ── */}
                <section className="relative h-[70vh] flex items-center justify-center text-center overflow-hidden">
                    <img
                        src={coverImage || 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=2070'}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Banner"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(26,35,64,0.85) 0%, rgba(26,35,64,0.6) 60%, rgba(26,35,64,0.9) 100%)' }} />

                    {/* Zellige overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                        <ZelligePattern opacity={0.05} />
                    </div>

                    {/* Arch frame */}
                    <div className="relative z-10 px-6 max-w-4xl">
                        <div className="mx-auto max-w-2xl border-2 border-amber-400/40 rounded-t-[999px] pt-10 pb-8 px-10 relative"
                            style={{ background: 'rgba(26,35,64,0.5)', backdropFilter: 'blur(10px)' }}>
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <StarOrnament size={20} />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-400/70">Heritage Culinaire</span>
                                <StarOrnament size={20} />
                            </div>
                            <h1 className="font-amiri text-5xl md:text-7xl font-bold text-amber-100 mb-4 leading-tight">
                                {config?.heroTitle || siteName}
                            </h1>
                            <ArchDivider />
                            <p className="text-amber-200/70 text-lg font-amiri italic mt-4">
                                {description || "Saveurs authentiques du Maroc, préparées avec passion et tradition."}
                            </p>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-pulse">
                        <div className="h-8 w-[1px] bg-amber-300" />
                        <StarOrnament size={16} color="#D4A017" />
                    </div>
                </section>

                {/* ── CATEGORIES ── */}
                <div className="sticky top-20 z-30 overflow-x-auto no-scrollbar py-4 shadow-md"
                    style={{ background: '#1A2340', borderBottom: '2px solid #D4A017' }}>
                    <div className="container mx-auto px-6 flex gap-3 min-w-max">
                        {categoryNames.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 border"
                                style={activeCategory === cat
                                    ? { background: '#D4A017', color: '#1A2340', borderColor: '#D4A017', boxShadow: '0 4px 20px rgba(212,160,23,0.4)' }
                                    : { background: 'transparent', color: 'rgba(212,160,23,0.6)', borderColor: 'rgba(212,160,23,0.2)' }
                                }
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── MENU ── */}
                <section className="py-20 container mx-auto px-6 lg:px-12">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <StarOrnament size={28} />
                            <h2 className="font-amiri text-4xl font-bold" style={{ color: '#C1440E' }}>Notre Carte</h2>
                            <StarOrnament size={28} />
                        </div>
                        <ArchDivider />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.length > 0 ? filteredItems.map((item: any) => (
                            <div
                                key={item.id}
                                className="group rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                                style={{ background: cardColor, border: '1px solid rgba(212,160,23,0.2)' }}
                            >
                                {/* Arch image */}
                                <div className="relative overflow-hidden" style={{ paddingTop: '75%' }}>
                                    <img
                                        src={item.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000'}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={item.name}
                                    />
                                    {/* Arch overlay at bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 h-8"
                                        style={{ background: cardColor, clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
                                    {/* Price badge */}
                                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full font-bold text-sm shadow-lg"
                                        style={{ background: '#D4A017', color: '#1A2340' }}>
                                        {item.price} <span className="text-xs opacity-70">{CURRENCY}</span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col text-center">
                                    <h3 className="font-amiri text-xl font-bold mb-2 transition-colors" style={{ color: textColor }}>
                                        {item.name}
                                    </h3>
                                    <p className="text-sm leading-relaxed mb-6 flex-1 font-amiri italic" style={{ color: '#8B7355' }}>
                                        {item.description || "Préparé avec des épices authentiques marocaines."}
                                    </p>
                                    <button
                                        onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
                                        className="w-full py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 shadow-lg"
                                        style={{ background: primary, color: 'white' }}
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
                                    <h3 className="font-amiri text-2xl font-bold" style={{ color: textColor }}>Carte en préparation</h3>
                                    <p className="text-sm mt-2" style={{ color: '#8B7355' }}>Notre menu sera bientôt disponible.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* ── CART DRAWER ── */}
            {showCart && (
                <div className="fixed inset-0 z-[60] backdrop-blur-sm animate-in fade-in duration-300" style={{ background: 'rgba(26,35,64,0.7)' }}>
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col"
                        style={{ background: bgColor }}>
                        {/* Cart header */}
                        <div className="p-8 flex items-center justify-between" style={{ borderBottom: '2px solid #D4A017', background: '#1A2340' }}>
                            <div>
                                <h2 className="font-amiri text-2xl font-bold text-amber-300">سلة الطلبات</h2>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600/70">{totalItems} articles sélectionnés</p>
                            </div>
                            <button onClick={() => setShowCart(false)} className="h-10 w-10 rounded-full border border-amber-700 text-amber-300 flex items-center justify-center hover:bg-amber-400/10 transition-all">
                                <X size={18} />
                            </button>
                        </div>
                        <GoldBorder />

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                                    <StarOrnament size={48} color="#D4A017" />
                                    <h3 className="font-amiri text-xl font-bold" style={{ color: '#1A2340' }}>Votre sélection est vide</h3>
                                    <p className="text-sm" style={{ color: '#8B7355' }}>Ajoutez des plats pour commencer votre commande.</p>
                                </div>
                            ) : items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center rounded-2xl p-4 border border-amber-100 bg-white/60">
                                    <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 border border-amber-200">
                                        <img src={item.image || ''} className="h-full w-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-amiri font-bold text-base" style={{ color: textColor }}>{item.name}</h4>
                                        <span className="text-sm font-bold" style={{ color: '#D4A017' }}>{item.price} {CURRENCY}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <button onClick={() => removeItem(item.id)} className="text-red-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                        <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-white text-sm"
                                            style={{ background: '#1A2340' }}>
                                            <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-amber-400 transition-colors"><Minus size={12} strokeWidth={3} /></button>
                                            <span className="font-black w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-amber-400 transition-colors"><Plus size={12} strokeWidth={3} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart footer */}
                        {items.length > 0 && (
                            <div className="p-8 space-y-6" style={{ borderTop: '2px solid #D4A017', background: cardColor }}>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#8B7355' }}>Total</span>
                                    <span className="font-amiri text-4xl font-bold" style={{ color: textColor }}>
                                        {totalPrice.toFixed(2)} <span className="text-lg opacity-40">{CURRENCY}</span>
                                    </span>
                                </div>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={!tableId || isPlacingOrder}
                                    className="w-full py-5 rounded-full font-bold text-sm uppercase tracking-widest disabled:opacity-30 active:scale-95 transition-all shadow-xl"
                                    style={{ background: primary, color: 'white' }}
                                >
                                    {isPlacingOrder ? 'Envoi en cours...' : 'Confirmer la commande'} →
                                </button>
                                {!tableId && (
                                    <div className="rounded-2xl p-4 text-center border border-red-200" style={{ background: '#FFF0F0' }}>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Scanner requis</p>
                                        <p className="text-xs text-red-400 mt-1">Scannez le QR code de votre table pour valider.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Order complete overlay */}
                        {orderComplete && (
                            <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500"
                                style={{ background: bgColor }}>
                                <StarOrnament size={60} color="#D4A017" />
                                <CheckCircle2 size={48} className="text-green-500 mt-4 animate-bounce" />
                                <h2 className="font-amiri text-3xl font-bold mt-6 mb-3" style={{ color: textColor }}>Commande reçue !</h2>
                                <p className="font-amiri italic text-lg mb-8" style={{ color: '#8B7355' }}>
                                    "Notre équipe prépare votre repas avec soin et tradition."
                                </p>
                                <button
                                    onClick={() => setOrderComplete(false)}
                                    className="rounded-full px-10 py-4 font-bold uppercase tracking-widest text-sm text-white transition-all hover:brightness-110"
                                    style={{ background: primary }}
                                >
                                    Retour au menu
                                </button>
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

            {/* ── FOOTER ── */}
            <footer className="relative overflow-hidden py-24 text-white" style={{ background: '#1A2340' }}>
                {/* Zellige background */}
                <div className="absolute inset-0 pointer-events-none">
                    <ZelligePattern opacity={0.06} />
                </div>
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, transparent, #D4A017, transparent)' }} />

                <div className="container mx-auto px-12 relative z-10 text-center">
                    <StarOrnament size={40} />
                    <h3 className="font-amiri text-4xl font-bold text-amber-300 mt-4 mb-2">{siteName}</h3>
                    <ArchDivider />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-16 items-start text-center">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: '#D4A017' }}>Notre Histoire</h4>
                            <p className="font-amiri italic text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                "Une tradition culinaire transmise de génération en génération, au cœur du Maroc."
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: '#D4A017' }}>Contact & Adresse</h4>
                            <div className="space-y-2">
                                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{config?.address || 'Médina, Marrakech, Maroc'}</p>
                                <p className="font-bold text-amber-300">{config?.phone || '+212 5 24 00 00 00'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: '#D4A017' }}>Horaires</h4>
                            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                {config?.hours || 'Déjeuner: 12:00 — 15:00\nDîner: 19:00 — 23:00'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6"
                        style={{ borderTop: '1px solid rgba(212,160,23,0.2)' }}>
                        <p className="text-[9px] font-black uppercase tracking-[0.5em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            © {new Date().getFullYear()} {siteName} · مطعم مغربي أصيل
                        </p>
                        <div className="flex gap-4">
                            {[Mail, Phone, MapPin].map((Icon, i) => (
                                <div key={i} className="h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer hover:bg-amber-400/10 transition-colors"
                                    style={{ borderColor: 'rgba(212,160,23,0.3)', color: '#D4A017' }}>
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
