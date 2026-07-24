'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getWaiterOrders } from '@/app/actions/waiter'
import { startWaiterShift, endWaiterShift, createOrder } from '@/app/actions/restaurant'
import { queueOfflineOrder, getOfflineOrders, flushOfflineQueue } from '@/lib/waiter-offline'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    Loader2, LogOut, RefreshCw, Play, PlusCircle, Wifi, WifiOff,
    Search, Bell, Receipt, Check, Plus, Minus, X, ChevronRight, Layers, Sparkles, Trash2, MapPin
} from 'lucide-react'
import OrdersClient from '@/app/dashboard/restaurant/[tenantSlug]/orders/OrdersClient'
import { toast } from 'sonner'
import { CURRENCY } from '@/lib/translations'

function playChime(type: 'call' | 'bill' = 'call') {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioContext) return
        const ctx = new AudioContext()
        const now = ctx.currentTime

        const playTone = (freq: number, start: number, duration: number) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, start)
            gain.gain.setValueAtTime(0.4, start)
            gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
            osc.start(start)
            osc.stop(start + duration)
        }

        if (type === 'bill') {
            playTone(1050, now, 0.25)
            playTone(1500, now + 0.15, 0.4)
        } else {
            playTone(880, now, 0.35)
            playTone(1109, now + 0.1, 0.45)
        }
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

function formatTableLabel(num: string) {
    if (!num) return ''
    if (num.toLowerCase().startsWith('table ')) return num
    const clean = num.replace(/^T-+/i, '').replace(/^T/i, '').trim()
    return clean ? `T-${clean}` : num
}

export default function WaiterDashboard() {
    const router = useRouter()
    const params = useParams()
    const tenantSlug = params.tenantSlug as string

    const [waiterName, setWaiterName] = useState('')
    const [waiterId, setWaiterId] = useState('')
    const [orders, setOrders] = useState<any[]>([])
    const [tables, setTables] = useState<any[]>([])
    const [allTables, setAllTables] = useState<any[]>([])
    const [spaces, setSpaces] = useState<any[]>([])
    const [selectedSpaceId, setSelectedSpaceId] = useState<string>('ALL')
    const [menu, setMenu] = useState<any[]>([])
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
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                Notification.requestPermission()
            }
        }

        const id = localStorage.getItem('waiter_id')
        const name = localStorage.getItem('waiter_name')

        if (id) {
            setWaiterId(id)
            setWaiterName(name || 'Personnel')
            fetchOrders(id)

            const interval = setInterval(() => fetchOrders(id), 6000)
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
                    toast.success(`${synced} commande(s) synchronisée(s) !`)
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
            toast.warning('Vous êtes hors-ligne. Les commandes seront stockées localement.')
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
            setOrders(data.orders || [])
            setTables(data.tables || [])
            setAllTables(data.allTables || [])
            setSpaces(data.spaces || [])
            setMenu(data.menu || [])
            setNoActiveShift(data.noActiveShift ?? true)
            setTenantId(data.tenantId || '')
            setInitialConfig(data.config || '')

            const activeBillRequests = (data.orders || []).filter((o: any) =>
                o.status === 'PENDING' && o.items.some((i: any) => i.dishId === 'request-bill')
            ).length

            const activeWaiterCalls = (data.orders || []).filter((o: any) =>
                o.status === 'PENDING' && o.items.some((i: any) => i.dishId === 'call-waiter')
            ).length

            const totalAlerts = activeBillRequests + activeWaiterCalls

            setPrevAlertCount(prev => {
                if (prev !== null && totalAlerts > prev) {
                    if (activeBillRequests > 0) {
                        playChime('bill')
                        showBrowserNotification('Demande d\'addition !', 'Une table demande l\'addition.')
                    } else {
                        playChime('call')
                        showBrowserNotification('Appel Serveur !', 'Un client demande de l\'assistance.')
                    }
                }
                return totalAlerts
            })

            if (typeof window !== 'undefined') {
                const offline = await getOfflineOrders()
                setOfflineOrdersCount(offline.length)
            }

            if (data.noActiveShift && data.allTables && selectedTableIds.length === 0) {
                setSelectedTableIds(data.allTables.map((t: any) => t.id))
            }
        } catch (e) {
            console.error('Failed to fetch orders', e)
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
            toast.error('Veuillez sélectionner au moins une table.')
            return
        }
        setIsShiftTransition(true)
        try {
            const res = await startWaiterShift(waiterId, selectedTableIds, tenantId)
            if (res.success) {
                toast.success('Prise de service validée !')
                await fetchOrders(waiterId)
            } else {
                toast.error(res.error || 'Erreur lors du démarrage du service')
            }
        } catch (e) {
            toast.error('Une erreur est survenue.')
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
                toast.success('Fin de service enregistrée.')
                await fetchOrders(waiterId)
            } else {
                toast.error(res.error || 'Erreur lors de la fermeture du service')
            }
        } catch (e) {
            toast.error('Une erreur est survenue.')
        } finally {
            setIsShiftTransition(false)
        }
    }

    const toggleTableSelection = (tableId: string) => {
        setSelectedTableIds(prev =>
            prev.includes(tableId) ? prev.filter(id => id !== tableId) : [...prev, tableId]
        )
    }

    // Compile dynamic spaces list for active shift tables
    const activeSpacesMap = new Map<string, { id: string, name: string, count: number }>()

    spaces.forEach(sp => {
        const count = tables.filter(t => t.spaceId === sp.id || t.space?.id === sp.id || t.space?.name === sp.name).length
        if (count > 0) {
            activeSpacesMap.set(sp.id, { id: sp.id, name: sp.name, count })
        }
    })

    tables.forEach((t: any) => {
        const sId = t.spaceId || t.space?.id || t.space?.name || 'Salle Principale'
        const sName = t.space?.name || 'Salle Principale'
        if (!activeSpacesMap.has(sId)) {
            const count = tables.filter(tbl => (tbl.spaceId || tbl.space?.id || tbl.space?.name || 'Salle Principale') === sId).length
            activeSpacesMap.set(sId, { id: sId, name: sName, count })
        }
    })

    const activeSpacesList = Array.from(activeSpacesMap.values())

    // Compile dynamic spaces list for check-in tables
    const checkinSpacesMap = new Map<string, { id: string, name: string, count: number }>()

    spaces.forEach(sp => {
        const count = allTables.filter(t => t.spaceId === sp.id || t.space?.id === sp.id || t.space?.name === sp.name).length
        if (count > 0) {
            checkinSpacesMap.set(sp.id, { id: sp.id, name: sp.name, count })
        }
    })

    allTables.forEach((t: any) => {
        const sId = t.spaceId || t.space?.id || t.space?.name || 'Salle Principale'
        const sName = t.space?.name || 'Salle Principale'
        if (!checkinSpacesMap.has(sId)) {
            const count = allTables.filter(tbl => (tbl.spaceId || tbl.space?.id || tbl.space?.name || 'Salle Principale') === sId).length
            checkinSpacesMap.set(sId, { id: sId, name: sName, count })
        }
    })

    const checkinSpacesList = Array.from(checkinSpacesMap.values())

    const filteredTables = selectedSpaceId === 'ALL'
        ? tables
        : tables.filter(t => (t.spaceId === selectedSpaceId || t.space?.id === selectedSpaceId || t.space?.name === selectedSpaceId || (selectedSpaceId === 'Salle Principale' && !t.space && !t.spaceId)))

    const filteredCheckinTables = selectedSpaceId === 'ALL'
        ? allTables
        : allTables.filter(t => (t.spaceId === selectedSpaceId || t.space?.id === selectedSpaceId || t.space?.name === selectedSpaceId || (selectedSpaceId === 'Salle Principale' && !t.space && !t.spaceId)))

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
        )
    }

    // Check-in screen if no active shift
    if (noActiveShift) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-center text-white border-b border-slate-800">
                        <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-black">
                            {waiterName[0]}
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">Check-in de Service</h1>
                        <p className="text-slate-400 text-xs mt-1">
                            Bonjour <span className="text-indigo-400 font-bold">{waiterName}</span>, sélectionnez vos tables de service :
                        </p>
                    </div>

                    <div className="p-8 space-y-6 flex-1">
                        {/* Floor Space Filters */}
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                            <button
                                onClick={() => setSelectedSpaceId('ALL')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                    selectedSpaceId === 'ALL'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                                }`}
                            >
                                Toutes les zones ({allTables.length})
                            </button>
                            {checkinSpacesList.map(sp => (
                                <button
                                    key={sp.id}
                                    onClick={() => setSelectedSpaceId(sp.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                                        selectedSpaceId === sp.id
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                                    }`}
                                >
                                    <MapPin size={12} /> {sp.name} ({sp.count})
                                </button>
                            ))}
                        </div>

                        {allTables.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl">
                                Aucune table ne vous est assignée. Contactez l'administrateur du restaurant.
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                                {Object.entries(
                                    filteredCheckinTables.reduce((acc: Record<string, any[]>, table: any) => {
                                        const spaceName = table.space?.name || 'Salle Principale'
                                        if (!acc[spaceName]) acc[spaceName] = []
                                        acc[spaceName].push(table)
                                        return acc
                                    }, {})
                                ).map(([spaceName, spaceTables]) => {
                                    const allSpaceSelected = spaceTables.every(t => selectedTableIds.includes(t.id))
                                    const toggleSpace = () => {
                                        if (allSpaceSelected) {
                                            setSelectedTableIds(prev => prev.filter(id => !spaceTables.some(t => t.id === id)))
                                        } else {
                                            const newIds = Array.from(new Set([...selectedTableIds, ...spaceTables.map(t => t.id)]))
                                            setSelectedTableIds(newIds)
                                        }
                                    }

                                    return (
                                        <div key={spaceName} className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                                                    <MapPin size={12} /> {spaceName} ({spaceTables.length})
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={toggleSpace}
                                                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20"
                                                >
                                                    {allSpaceSelected ? 'Désélectionner l\'étage' : 'Tout sélectionner'}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2.5">
                                                {spaceTables.map((table: any) => {
                                                    const isSelected = selectedTableIds.includes(table.id)
                                                    return (
                                                        <button
                                                            key={table.id}
                                                            type="button"
                                                            onClick={() => toggleTableSelection(table.id)}
                                                            className={`py-3 rounded-xl font-black border-2 transition-all flex flex-col items-center justify-center gap-0.5 ${
                                                                isSelected
                                                                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/10'
                                                                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
                                                            }`}
                                                        >
                                                            <span className="text-base">{formatTableLabel(table.number)}</span>
                                                            <span className="text-[9px] text-slate-500">Cap: {table.capacity || 'N/A'}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 rounded-xl text-slate-300 border-slate-800 hover:bg-slate-800"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} className="mr-2" /> Déconnexion
                            </Button>
                            <Button
                                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-indigo-500/20"
                                onClick={handleStartShift}
                                disabled={isShiftTransition || selectedTableIds.length === 0 || allTables.length === 0}
                            >
                                {isShiftTransition ? (
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                ) : (
                                    <Play size={16} className="mr-2" />
                                )}
                                Démarrer le service ({selectedTableIds.length})
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 px-6 h-16 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-black flex items-center justify-center">
                        {waiterName[0]}
                    </div>
                    <div>
                        <span className="font-bold text-sm text-white">{waiterName}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold">
                                En service
                            </span>
                            {isOnline ? (
                                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                    <Wifi size={10} /> En ligne
                                </span>
                            ) : (
                                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                                    <WifiOff size={10} /> Hors-ligne
                                </span>
                            )}
                            {offlineOrdersCount > 0 && (
                                <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.2 rounded-full font-bold animate-pulse">
                                    {offlineOrdersCount} à sync
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => fetchOrders(waiterId)} className="text-slate-400 hover:text-white">
                        <RefreshCw size={18} />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEndShift}
                        className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10 rounded-xl font-bold text-xs"
                        disabled={isShiftTransition}
                    >
                        {isShiftTransition ? <Loader2 className="animate-spin h-4 w-4" /> : 'Fin de service'}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-400">
                        <LogOut size={18} />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Tables Overview & Space/Floor Filters */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                                    Tables assignées ({filteredTables.length})
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">Tables sous votre surveillance directe par salle/étage.</p>
                            </div>
                            <Button
                                onClick={() => setShowTakeOrderModal(true)}
                                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 px-6 py-3 shadow-lg shadow-indigo-600/20"
                                disabled={tables.length === 0}
                            >
                                <PlusCircle size={18} /> Prendre commande
                            </Button>
                        </div>

                        {/* Floor Space Navigation Bar - ALWAYS RENDERED */}
                        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                                    <Layers size={13} className="text-indigo-400" /> Navigation par Étage / Zone
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                                    {activeSpacesList.length} zone{activeSpacesList.length > 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-1">
                                <button
                                    onClick={() => setSelectedSpaceId('ALL')}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                                        selectedSpaceId === 'ALL'
                                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400/40'
                                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <MapPin size={13} /> Tous les étages ({tables.length})
                                </button>

                                {activeSpacesList.map(sp => (
                                    <button
                                        key={sp.id}
                                        onClick={() => setSelectedSpaceId(sp.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                                            selectedSpaceId === sp.id
                                                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400/40'
                                                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                                        }`}
                                    >
                                        <MapPin size={13} /> {sp.name} ({sp.count})
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {Object.entries(
                                filteredTables.reduce((acc: Record<string, any[]>, table: any) => {
                                    const spaceName = table.space?.name || 'Salle Principale'
                                    if (!acc[spaceName]) acc[spaceName] = []
                                    acc[spaceName].push(table)
                                    return acc
                                }, {})
                            ).map(([spaceName, spaceTables]) => (
                                <div key={spaceName} className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                                        <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                                            <MapPin size={14} className="text-indigo-400" /> Étage / Zone : {spaceName}
                                        </h3>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                                            {spaceTables.length} table{spaceTables.length > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {spaceTables.map((table: any) => {
                                            const activeOrder = orders.find((o: any) => o.tableId === table.id)
                                            const hasCall = activeOrder && activeOrder.items.some((i: any) => i.dishId === 'call-waiter')
                                            const hasBill = activeOrder && activeOrder.items.some((i: any) => i.dishId === 'request-bill')

                                            return (
                                                <div
                                                    key={table.id}
                                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 shadow-md ${
                                                        hasBill || hasCall
                                                            ? 'bg-amber-950/30 border-amber-500 animate-pulse text-amber-300 ring-2 ring-amber-500/20'
                                                            : activeOrder
                                                            ? 'bg-slate-950 border-red-500/80 text-white'
                                                            : 'bg-slate-800/60 border-slate-700 text-slate-300'
                                                    }`}
                                                >
                                                    <span className="font-black text-lg">{formatTableLabel(table.number)}</span>
                                                    {hasBill ? (
                                                        <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                                                            <Receipt size={10} /> Addition !
                                                        </span>
                                                    ) : hasCall ? (
                                                        <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                                                            <Bell size={10} /> Appel !
                                                        </span>
                                                    ) : activeOrder ? (
                                                        <span className="text-[10px] font-mono text-cyan-400 font-bold">
                                                            {activeOrder.totalAmount.toFixed(2)} {CURRENCY}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-emerald-400">
                                                            Libre
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}

                            {filteredTables.length === 0 && (
                                <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
                                    Aucune table assignée dans cet espace.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Active Orders List */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                            Commandes Actives
                        </h2>
                        <OrdersClient
                            initialOrders={orders}
                            tenantSlug={tenantSlug}
                            initialConfig={initialConfig}
                            onOrderUpdate={() => fetchOrders(waiterId)}
                            allowedTableIds={tables.map(t => t.id)}
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
    const [cart, setCart] = useState<{ dish: any; quantity: number; selectedOptions: any[]; selectedAddons: any[] }[]>([])
    const [activeCategory, setActiveCategory] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (tables.length > 0 && !selectedTableId) setSelectedTableId(tables[0].id)
        if (menu.length > 0 && !activeCategory) setActiveCategory(menu[0].name)
    }, [tables, menu, isOpen])

    if (!isOpen) return null

    const handleAdd = (dish: any) => {
        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.dish.id === dish.id)
            if (existingIndex > -1) {
                const updated = [...prev]
                updated[existingIndex].quantity += 1
                return updated
            }
            return [...prev, { dish, quantity: 1, selectedOptions: [], selectedAddons: [] }]
        })
    }

    const handleRemove = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index))
    }

    const handleQtyChange = (index: number, delta: number) => {
        setCart(prev => prev.map((item, i) => {
            if (i === index) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) }
            }
            return item
        }))
    }

    const total = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0)

    const handleSubmit = async () => {
        if (!selectedTableId) {
            toast.error('Veuillez sélectionner une table.')
            return
        }
        if (cart.length === 0) {
            toast.error('Votre panier est vide.')
            return
        }

        setIsSubmitting(true)
        try {
            const orderItems = cart.map(item => ({
                id: item.dish.id,
                name: item.dish.name,
                price: item.dish.price,
                quantity: item.quantity,
                selectedOptions: item.selectedOptions || [],
                selectedAddons: item.selectedAddons || []
            }))

            if (isOnline) {
                const res = await createOrder(selectedTableId, orderItems)
                if (res.success) {
                    toast.success('Commande envoyée en cuisine !')
                    onOrderPlaced()
                    onClose()
                } else {
                    toast.error(res.error || 'Erreur lors de l\'envoi de la commande')
                }
            } else {
                await queueOfflineOrder(selectedTableId, orderItems)
                toast.warning('Commande enregistrée localement (Hors-ligne). Elle sera synchronisée dès retour du réseau.')
                onOrderPlaced()
                onClose()
            }
        } catch (e) {
            toast.error('Une erreur est survenue.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const categoryDishes = menu.find(c => c.name === activeCategory)?.dishes || []
    const filteredDishes = searchQuery.trim()
        ? menu.flatMap(c => c.dishes || []).filter((d: any) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : categoryDishes

    return (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <div>
                        <h2 className="text-lg font-black tracking-tight">Prendre une commande directe</h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Mode: {isOnline ? <span className="text-emerald-400 font-bold">En ligne</span> : <span className="text-amber-400 font-bold">Hors-ligne (Stockage local)</span>}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Left Column: Menu Selector */}
                    <div className="flex-[2] border-r border-slate-800 p-5 flex flex-col overflow-hidden">
                        {/* Table & Search Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Table de destination</label>
                                <select
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white mt-1 font-bold"
                                    value={selectedTableId}
                                    onChange={e => setSelectedTableId(e.target.value)}
                                >
                                    {Object.entries(
                                        tables.reduce((acc: Record<string, any[]>, table: any) => {
                                            const spaceName = table.space?.name || 'Salle Principale'
                                            if (!acc[spaceName]) acc[spaceName] = []
                                            acc[spaceName].push(table)
                                            return acc
                                        }, {})
                                    ).map(([spaceName, spaceTables]) => (
                                        <optgroup key={spaceName} label={`📍 Étage / Zone: ${spaceName}`} className="bg-slate-950 font-black text-indigo-400">
                                            {spaceTables.map(table => (
                                                <option key={table.id} value={table.id} className="bg-slate-900 text-white font-bold">
                                                    {formatTableLabel(table.number)}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Rechercher un plat</label>
                                <div className="relative mt-1">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <Input
                                        placeholder="Nom du plat..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="h-9 bg-slate-950 border-slate-800 pl-9 text-xs text-white rounded-xl focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category Selector */}
                        {!searchQuery && (
                            <div className="flex gap-1.5 overflow-x-auto pb-2 shrink-0">
                                {menu.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setActiveCategory(cat.name)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                            activeCategory === cat.name
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Dishes Grid */}
                        <div className="flex-1 overflow-y-auto mt-3 grid grid-cols-2 gap-3 pr-1">
                            {filteredDishes.map((dish: any) => (
                                <div key={dish.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-700 transition-all">
                                    <div>
                                        <h4 className="font-bold text-xs text-slate-200">{dish.name}</h4>
                                        {dish.description && (
                                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{dish.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-900">
                                        <span className="font-mono text-xs text-cyan-400 font-bold">{dish.price} MAD</span>
                                        <Button
                                            size="sm"
                                            className="h-7 rounded-lg text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3"
                                            onClick={() => handleAdd(dish)}
                                        >
                                            + Ajouter
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Cart Summary */}
                    <div className="flex-[1.2] p-5 bg-slate-950 flex flex-col overflow-hidden">
                        <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3 flex justify-between">
                            <span>Panier Commande</span>
                            <span>{cart.reduce((s, i) => s + i.quantity, 0)} articles</span>
                        </h3>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto py-3 space-y-2">
                            {cart.map((item, index) => (
                                <div key={`${item.dish.id}-${index}`} className="flex justify-between items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="flex-1">
                                        <h5 className="text-xs font-bold text-slate-200">{item.dish.name}</h5>
                                        <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{(item.dish.price * item.quantity).toFixed(2)} MAD</p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => handleQtyChange(index, -1)}
                                            className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold"
                                        >
                                            -
                                        </button>
                                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQtyChange(index, 1)}
                                            className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => handleRemove(index)}
                                            className="text-xs text-red-400 hover:text-red-300 ml-1"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {cart.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12">
                                    Panier vide
                                </div>
                            )}
                        </div>

                        {/* Order Summary & Submit */}
                        <div className="border-t border-slate-800 pt-4 space-y-3 shrink-0">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-400 uppercase">Total</span>
                                <span className="text-lg font-black text-cyan-400 font-mono">{total.toFixed(2)} MAD</span>
                            </div>
                            <Button
                                className="w-full h-11 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20"
                                disabled={isSubmitting || cart.length === 0}
                                onClick={handleSubmit}
                            >
                                {isSubmitting ? 'Envoi...' : isOnline ? 'Valider & Envoyer' : 'Valider Hors-ligne'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
