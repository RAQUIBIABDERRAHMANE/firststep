'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRestaurantLogic } from './useRestaurantLogic'
import { RestaurantTemplateProps } from './RestaurantTemplate'
import {
    ShoppingCart, QrCode, MapPin, Plus, Minus, Trash2,
    ChevronRight, Utensils, CheckCircle2, LayoutDashboard, Bell
} from 'lucide-react'

const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false })

export default function RestaurantTemplateMinimal({ siteName, description, coverImage, logo, config, categories, isOwner }: RestaurantTemplateProps) {
    const defaultData = useRestaurantLogic(categories, isOwner)
    const {
        showScanner, setShowScanner, showCart, setShowCart, activeCategory, setActiveCategory,
        isPlacingOrder, orderComplete, setOrderComplete, items, addItem, updateQuantity,
        totalPrice, totalItems, tableId, categoryNames, filteredItems, handleScan, handlePlaceOrder, handleCallWaiter
    } = defaultData

    return (
        <div className="flex flex-col min-h-screen bg-stone-50 font-serif text-stone-900 selection:bg-stone-200">
            {tableId && !isOwner && (
                <Button onClick={handleCallWaiter} variant="outline" className="fixed bottom-6 left-6 h-12 w-12 rounded-full border-stone-800 bg-stone-900 text-stone-50 hover:bg-stone-800 z-50 flex items-center justify-center">
                    <Bell className="h-5 w-5" />
                </Button>
            )}

            <header className="sticky top-0 z-40 w-full bg-stone-50/90 backdrop-blur-sm border-b border-stone-100">
                <div className="container mx-auto flex h-24 items-center justify-between px-6 lg:px-12">
                    <div className="flex items-center gap-4">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-10 w-10 object-contain grayscale hover:grayscale-0 transition-all" />
                        ) : (
                            <div className="h-10 w-10 bg-stone-900 flex items-center justify-center text-stone-50 font-serif text-lg">
                                {siteName[0]}
                            </div>
                        )}
                        <span className="font-serif text-2xl tracking-tight">{siteName}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        {isOwner && (
                            <Link href="/dashboard/restaurant" className="text-xs uppercase tracking-widest underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900 transition-all">
                                Manage
                            </Link>
                        )}
                        <button onClick={() => setShowScanner(true)} className="text-stone-400 hover:text-stone-900 transition-colors">
                            <QrCode size={20} />
                        </button>
                        <button onClick={() => setShowCart(true)} className="flex items-center gap-2 text-stone-900">
                            <span className="text-xs font-bold uppercase tracking-widest">Cart</span>
                            <span className="bg-stone-900 text-stone-50 text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{totalItems}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <section className="py-24 px-6 text-center container max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-serif mb-8 text-stone-900 leading-tight">
                        {config.heroTitle || "Simplicity is the ultimate sophistication."}
                    </h1>
                    <p className="text-xl text-stone-500 font-sans font-light max-w-2xl mx-auto leading-relaxed">
                        {description || "Essential flavors, thoughtfully curated."}
                    </p>
                </section>

                <div className="sticky top-24 z-30 bg-stone-50/95 py-6 border-b border-stone-100">
                    <div className="container flex justify-center gap-8 overflow-x-auto no-scrollbar">
                        {categoryNames.map((cat) => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`text-sm tracking-widest uppercase transition-all pb-1 border-b-2 ${activeCategory === cat ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-900'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <section className="py-20 container px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                        {filteredItems.length > 0 ? filteredItems.map((item: any) => (
                            <div key={item.id} className="group cursor-pointer">
                                <div className="aspect-[4/5] overflow-hidden bg-stone-100 mb-6">
                                    <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.name} />
                                </div>
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-xl font-serif text-stone-900">{item.name}</h3>
                                    <span className="font-mono text-sm text-stone-500">${item.price}</span>
                                </div>
                                <p className="text-stone-400 font-sans text-sm leading-relaxed mb-6 line-clamp-2">{item.description}</p>
                                <button onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })} className="text-xs uppercase tracking-widest font-bold border-b border-stone-200 hover:border-stone-900 pb-1 transition-all">
                                    Add to Cart
                                </button>
                            </div>
                        )) : (
                            <div className="col-span-full py-20 text-center text-stone-300 font-serif italic text-2xl">
                                Empty.
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {showCart && (
                <div className="fixed inset-0 z-[60] bg-white animate-in slide-in-from-bottom duration-500 flex flex-col">
                    <div className="p-8 md:p-12 flex items-center justify-between">
                        <h2 className="text-4xl font-serif">Your Order</h2>
                        <button onClick={() => setShowCart(false)} className="text-stone-400 hover:text-stone-900 uppercase text-xs tracking-widest">Close</button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-8 md:px-12">
                        <div className="max-w-4xl mx-auto space-y-12">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-8 items-start border-b border-stone-100 pb-12">
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-2">
                                            <h4 className="text-2xl font-serif">{item.name}</h4>
                                            <span className="font-mono text-lg">${item.price}</span>
                                        </div>
                                        <div className="flex items-center gap-6 mt-4">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="text-stone-300 hover:text-stone-900"><Minus size={16} /></button>
                                            <span className="font-mono">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="text-stone-300 hover:text-stone-900"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                    <img src={item.image || ''} className="w-24 h-24 object-cover filter grayscale" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>
                    {items.length > 0 && (
                        <div className="p-8 md:p-12 border-t border-stone-100 flex justify-between items-center bg-stone-50">
                            <div className="font-serif text-3xl">Total: ${totalPrice.toFixed(2)}</div>
                            <Button onClick={handlePlaceOrder} disabled={!tableId || isPlacingOrder} className="h-16 px-12 rounded-none bg-stone-900 text-stone-50 hover:bg-stone-800 text-lg uppercase tracking-widest font-bold">
                                {isPlacingOrder ? '...' : 'Checkout'}
                            </Button>
                        </div>
                    )}
                    {orderComplete && (
                        <div className="absolute inset-0 bg-white z-[70] flex flex-col items-center justify-center p-12 text-center">
                            <h2 className="text-5xl font-serif mb-6">Thank you.</h2>
                            <p className="text-xl text-stone-500 font-light mb-12">Your order is being prepared.</p>
                            <button onClick={() => setOrderComplete(false)} className="uppercase tracking-widest text-sm border-b border-stone-900 pb-1">Return to menu</button>
                        </div>
                    )}
                </div>
            )}

            {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
        </div>
    )
}
