'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getWaiterOrders } from '@/app/actions/waiter'
import { startWaiterShift, endWaiterShift, createOrder } from '@/app/actions/restaurant'
import { queueOfflineOrder, getOfflineOrders, flushOfflineQueue } from '@/lib/waiter-offline'
import { Button } from '@/components/ui/Button'
import { Loader2, LogOut, RefreshCw, Play, PlusCircle, Wifi, WifiOff } from 'lucide-react'
import OrdersClient from '@/app/dashboard/restaurant/[tenantSlug]/orders/OrdersClient'
import { toast } from 'sonner'


function playChime() {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioContext) return
        const ctx = new AudioContext()
        
        const playTone = (freq: number, start: number, duration: number) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, start)
            
            gain.gain.setValueAtTime(0.5, start)
            gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
            
            osc.start(start)
            osc.stop(start + duration)
        }
        
        const now = ctx.currentTime
        playTone(880, now, 0.4) // A5
        playTone(1109, now + 0.1, 0.5) // C#6
    } catch (e) {
        console.error('Failed to play chime', e)
    }
}

function showBrowserNotification(title: string, body: string) {
    if (typeof window === 'undefined') return
    if (!('Notification' in window)) return
    
    if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/logo.png' })
    }
}

export default function WaiterDashboard() {
    const router = useRouter()
    const params = useParams()
    const tenantSlug = params.tenantSlug as string

    const [waiterName, setWaiterName] = useState('')
    const [waiterId, setWaiterId] = useState('')
    const [orders, setOrders] = useState([])
    const [tables, setTables] = useState([])
    const [allTables, setAllTables] = useState([])
    const [menu, setMenu] = useState([])
    const [noActiveShift, setNoActiveShift] = useState(true)
    const [tenantId, setTenantId] = useState('')
    const [selectedTableIds, setSelectedTableIds] = useState<string[]>([])
    const [initialConfig, setInitialConfig] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isShiftTransition, setIsShiftTransition] = useState(false)
    const [prevAlertCount, setPrevAlertCount] = useState<number | null>(null)
    const [isOnline, setIsOnline] = useState(true)
    const [offlineOrdersCount, setOfflineOrdersCount] = useState(0)
    const [showTakeOrderModal, setShowTakeOrderModal] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsOnline(navigator.onLine)
        }
    }, [])

    useEffect(() => {
        // Request Notification permission
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                Notification.requestPermission()
            }
        }

        // Client-side auth check
        const id = localStorage.getItem('waiter_id')
        const name = localStorage.getItem('waiter_name')

        if (id) {
            setWaiterId(id)
            setWaiterName(name || 'Staff')
            fetchOrders(id)

            // Set up polling
            const interval = setInterval(() => fetchOrders(id), 10000)
            return () => clearInterval(interval)
        } else {
            router.push(`/${tenantSlug}/waiter/login`)
        }
    }, [params.tenantSlug])

    useEffect(() => {
        if (typeof window === 'undefined' || !waiterId) return

        const handleOnline = async () => {
            setIsOnline(true)
            toast.success('Connexion rétablie. Synchronisation des commandes hors-ligne...')
            try {
                const synced = await flushOfflineQueue()
                if (synced > 0) {
                    toast.success(`${synced} commande(s) synchronisée(s) avec succès !`)
                    fetchOrders(waiterId)
                }
                const offline = await getOfflineOrders()
                setOfflineOrdersCount(offline.length)
            } catch (e) {
                console.error(e)
            }
        }

        const handleOffline = () => {
            setIsOnline(false)
            toast.warning('Vous êtes hors-ligne. Les commandes prises seront stockées localement.')
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [waiterId])

    const fetchOrders = async (id: string) => {
        try {
            const data = await getWaiterOrders(id)
            // @ts-ignore
            setOrders(data.orders || [])
            // @ts-ignore
            setTables(data.tables || [])
            // @ts-ignore
            setAllTables(data.allTables || [])
            // @ts-ignore
            setMenu(data.menu || [])
            // @ts-ignore
            setNoActiveShift(data.noActiveShift ?? true)
            // @ts-ignore
            setTenantId(data.tenantId || '')
            // @ts-ignore
            setInitialConfig(data.config || '')
            
            const activeAlertCount = (data.orders || []).filter((o: any) => 
                o.status === 'PENDING' && o.items.some((i: any) => i.dishId === 'call-waiter' || i.dishId === 'request-bill')
            ).length

            // If we have a previous count and it increased, trigger chime + notification
            setPrevAlertCount(prev => {
                if (prev !== null && activeAlertCount > prev) {
                    playChime()
                    showBrowserNotification(
                        'Nouvelle demande client !',
                        `Un client demande de l'assistance ou l'addition.`
                    )
                }
                return activeAlertCount
            })

            if (typeof window !== 'undefined') {
                const offline = await getOfflineOrders()
                setOfflineOrdersCount(offline.length)
            }

            // Only pre-select all tables if selectedTableIds is empty and we have data
            // @ts-ignore
            if (data.noActiveShift && data.allTables && selectedTableIds.length === 0) {
                // @ts-ignore
                setSelectedTableIds(data.allTables.map((t: any) => t.id))
            }
        } catch (e) {
            console.error('Failed to fetch orders')
        } finally {
            setIsLoading(false)
        }
    }



    const handleLogout = () => {
        localStorage.removeItem('waiter_id')
        localStorage.removeItem('waiter_name')
        router.push(`/${tenantSlug}/waiter/login`)
    }

    const handleStartShift = async () => {
        if (selectedTableIds.length === 0) {
            alert('Veuillez sélectionner au moins une table.')
            return
        }
        setIsShiftTransition(true)
        try {
            const res = await startWaiterShift(waiterId, selectedTableIds, tenantId)
            if (res.success) {
                await fetchOrders(waiterId)
            } else {
                alert(res.error || 'Erreur lors du démarrage du service')
            }
        } catch (e) {
            alert('Une erreur est survenue.')
        } finally {
            setIsShiftTransition(false)
        }
    }

    const handleEndShift = async () => {
        if (!confirm('Terminer votre service actuel ? Vous ne recevrez plus d\'alertes pour ces tables.')) return
        setIsShiftTransition(true)
        try {
            const res = await endWaiterShift(waiterId)
            if (res.success) {
                setSelectedTableIds([])
                await fetchOrders(waiterId)
            } else {
                alert(res.error || 'Erreur lors de la fermeture du service')
            }
        } catch (e) {
            alert('Une erreur est survenue.')
        } finally {
            setIsShiftTransition(false)
        }
    }

    const toggleTableSelection = (tableId: string) => {
        setSelectedTableIds(prev => {
            if (prev.includes(tableId)) {
                return prev.filter(id => id !== tableId)
            } else {
                return [...prev, tableId]
            }
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    // Check-in screen if no active shift
    if (noActiveShift) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                    <div className="bg-slate-900 p-8 text-center text-white">
                        <h1 className="text-2xl font-bold mb-2">Check-in de Service</h1>
                        <p className="text-slate-400 text-sm">
                            Bonjour {waiterName}, sélectionnez vos tables de service :
                        </p>
                    </div>

                    <div className="p-8 space-y-6 flex-1">
                        {allTables.length === 0 ? (
                            <div className="text-center py-6 text-slate-500">
                                Aucune table ne vous est assignée dans la configuration. Veuillez contacter un administrateur.
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                {allTables.map((table: any) => {
                                    const isSelected = selectedTableIds.includes(table.id)
                                    return (
                                        <button
                                            key={table.id}
                                            type="button"
                                            onClick={() => toggleTableSelection(table.id)}
                                            className={`py-4 rounded-xl font-bold border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                                                isSelected
                                                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            <span className="text-lg">T-{table.number}</span>
                                            <span className="text-[10px] text-slate-400">Capacité: {table.capacity || 'N/A'}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 rounded-xl text-slate-600"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} className="mr-2" /> Déconnexion
                            </Button>
                            <Button
                                className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                                onClick={handleStartShift}
                                disabled={isShiftTransition || selectedTableIds.length === 0 || allTables.length === 0}
                            >
                                {isShiftTransition ? (
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                ) : (
                                    <Play size={16} className="mr-2" />
                                )}
                                Démarrer le service
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">

            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10 px-6 h-16 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                        {waiterName[0]}
                    </div>
                    <span className="font-semibold text-slate-900">{waiterName}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">En service</span>
                    {isOnline ? (
                        <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-250 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <Wifi size={12} /> En ligne
                        </span>
                    ) : (
                        <span className="text-xs bg-amber-50 text-amber-600 border border-amber-250 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <WifiOff size={12} /> Hors ligne
                        </span>
                    )}
                    {offlineOrdersCount > 0 && (
                        <span className="text-xs bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                            {offlineOrdersCount} en attente de sync
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => fetchOrders(waiterId)}>
                        <RefreshCw size={18} />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEndShift}
                        className="text-amber-700 hover:text-amber-850 border-amber-200 hover:bg-amber-50 rounded-xl font-semibold"
                        disabled={isShiftTransition}
                    >
                        {isShiftTransition ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                            'Fin de service'
                        )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut size={18} />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Tables Overview & Quick Actions */}
                    <div className="bg-white rounded-3xl p-6 border shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    Tables assignées
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">Tables configurées pour votre service actuel.</p>
                            </div>
                            <Button
                                onClick={() => setShowTakeOrderModal(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 px-5 py-2.5 shadow-md shadow-indigo-600/10"
                                disabled={tables.length === 0}
                            >
                                <PlusCircle size={16} /> Prendre commande
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {tables.map((table: any) => {
                                const hasActiveOrder = orders.some((o: any) => o.tableId === table.id)
                                return (
                                    <div 
                                        key={table.id} 
                                        className={`px-6 py-4 min-w-[5rem] flex items-center justify-center font-black text-xl rounded-2xl shadow-sm border-2 transition-all ${
                                            hasActiveOrder 
                                                ? 'bg-amber-105 border-amber-200 text-amber-900 ring-2 ring-amber-400/20' 
                                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        T-{table.number}
                                    </div>
                                )
                            })}
                            {tables.length === 0 && (
                                <div className="w-full text-center py-8 text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                    Aucune table assignée pour ce service.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Orders */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Commandes Actives</h2>
                        <OrdersClient 
                            initialOrders={orders} 
                            tenantSlug={tenantSlug} 
                            initialConfig={initialConfig} 
                            onOrderUpdate={() => fetchOrders(waiterId)}
                        />
                    </div>
                </div>
            </div>

            {/* Take Order Modal */}
            <TakeOrderModal
                isOpen={showTakeOrderModal}
                onClose={() => setShowTakeOrderModal(false)}
                tables={tables}
                menu={menu}
                isOnline={isOnline}
                onOrderPlaced={() => fetchOrders(waiterId)}
            />
        </div>
    )
}

interface TakeOrderModalProps {
    isOpen: boolean
    onClose: () => void
    tables: any[]
    menu: any[]
    isOnline: boolean
    onOrderPlaced: () => void
}

function TakeOrderModal({ isOpen, onClose, tables, menu, isOnline, onOrderPlaced }: TakeOrderModalProps) {
    const [selectedTableId, setSelectedTableId] = useState('')
    const [cart, setCart] = useState<{ dish: any; quantity: number }[]>([])
    const [activeCategory, setActiveCategory] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (tables.length > 0 && !selectedTableId) setSelectedTableId(tables[0].id)
        if (menu.length > 0 && !activeCategory) setActiveCategory(menu[0].name)
    }, [tables, menu, isOpen])

    if (!isOpen) return null

    const handleAdd = (dish: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.dish.id === dish.id)
            if (existing) {
                return prev.map(item => item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item)
            }
            return [...prev, { dish, quantity: 1 }]
        })
    }

    const handleRemove = (dishId: string) => {
        setCart(prev => prev.filter(item => item.dish.id !== dishId))
    }

    const handleQtyChange = (dishId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.dish.id === dishId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) }
            }
            return item
        }))
    }

    const total = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0)

    const handleSubmit = async () => {
        if (!selectedTableId) {
            alert('Veuillez sélectionner une table.')
            return
        }
        if (cart.length === 0) {
            alert('Votre panier est vide.')
            return
        }

        setIsSubmitting(true)
        try {
            const orderItems = cart.map(item => ({
                id: item.dish.id,
                name: item.dish.name,
                price: item.dish.price,
                quantity: item.quantity,
                selectedOptions: [],
                selectedAddons: []
            }))

            if (isOnline) {
                const res = await createOrder(selectedTableId, orderItems)
                if (res.success) {
                    toast.success('Commande envoyée avec succès !')
                    onOrderPlaced()
                    onClose()
                } else {
                    alert(res.error || 'Erreur lors de l\'envoi de la commande')
                }
            } else {
                await queueOfflineOrder(selectedTableId, orderItems)
                toast.warning('Commande enregistrée localement (Hors-ligne). Elle sera envoyée dès connexion rétablie.')
                onOrderPlaced()
                onClose()
            }
        } catch (e) {
            alert('Une erreur est survenue.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedCategoryDishes = menu.find(c => c.name === activeCategory)?.dishes || []

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 text-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950">
                    <div>
                        <h2 className="text-xl font-bold">Prendre une commande</h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Mode: {isOnline ? <span className="text-emerald-400 font-bold">En ligne</span> : <span className="text-amber-400 font-bold">Hors-ligne (Stockage local)</span>}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">
                        &times;
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Left Column: Menu Selector */}
                    <div className="flex-[2] border-r border-white/10 p-6 flex flex-col overflow-hidden min-h-[300px]">
                        {/* Table Selector */}
                        <div className="mb-4">
                            <label className="text-xs text-slate-400 uppercase tracking-widest pl-1 font-bold">Sélectionner la Table</label>
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white mt-1.5"
                                value={selectedTableId}
                                onChange={e => setSelectedTableId(e.target.value)}
                            >
                                {tables.map(table => (
                                    <option key={table.id} value={table.id} className="bg-slate-900">
                                        Table {table.number}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category Selector */}
                        <div className="flex gap-2 overflow-x-auto pb-2 shrink-0">
                            {menu.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        activeCategory === cat.name
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Dishes Grid */}
                        <div className="flex-1 overflow-y-auto mt-4 grid grid-cols-2 gap-3 pr-1">
                            {selectedCategoryDishes.map((dish: any) => (
                                <div key={dish.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/[0.08] transition-all">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-100">{dish.name}</h4>
                                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{dish.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                                        <span className="font-mono text-sm text-indigo-450 font-bold">{dish.price} MAD</span>
                                        <Button
                                            size="sm"
                                            className="h-8 rounded-lg text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
                                            onClick={() => handleAdd(dish)}
                                        >
                                            Ajouter
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Cart Panel */}
                    <div className="flex-[1.2] p-6 bg-slate-950 flex flex-col overflow-hidden">
                        <h3 className="font-bold text-md border-b border-white/10 pb-3 flex justify-between">
                            <span>Panier</span>
                            <span className="text-slate-400 text-xs font-normal">({cart.length} articles)</span>
                        </h3>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto py-4 space-y-3">
                            {cart.map(item => (
                                <div key={item.dish.id} className="flex justify-between items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex-1">
                                        <h5 className="text-xs font-bold text-slate-200">{item.dish.name}</h5>
                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{(item.dish.price * item.quantity).toFixed(2)} MAD</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleQtyChange(item.dish.id, -1)}
                                            className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/15 flex items-center justify-center text-xs font-bold"
                                        >
                                            −
                                        </button>
                                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQtyChange(item.dish.id, 1)}
                                            className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/15 flex items-center justify-center text-xs font-bold"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => handleRemove(item.dish.id)}
                                            className="text-xs text-red-405 hover:text-red-300 ml-1 font-semibold"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {cart.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm py-12">
                                    Panier vide
                                </div>
                            )}
                        </div>

                        {/* Footer Summary */}
                        <div className="border-t border-white/10 pt-4 space-y-4 shrink-0">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-medium">Total</span>
                                <span className="text-xl font-bold text-indigo-400 font-mono">{total.toFixed(2)} MAD</span>
                            </div>
                            <Button
                                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm"
                                disabled={isSubmitting || cart.length === 0}
                                onClick={handleSubmit}
                            >
                                {isSubmitting ? 'Envoi...' : isOnline ? 'Valider Commande' : 'Valider Hors-ligne'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

