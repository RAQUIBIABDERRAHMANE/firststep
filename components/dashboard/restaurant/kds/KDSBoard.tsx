'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { getOrdersForKDS, updateOrderStatus } from '@/app/actions/restaurant'
import {
    ChefHat,
    Clock,
    Flame,
    Bell,
    CheckCircle2,
    RefreshCw,
    Volume2,
    VolumeX,
    Maximize2,
    Minimize2,
    LayoutGrid,
    Columns,
    Undo2,
    CheckSquare,
    Square,
    Sparkles
} from 'lucide-react'

type Station = 'ALL' | 'KITCHEN' | 'BAR' | 'DESSERT' | 'COLD_PREP'
type ViewMode = 'GRID' | 'KANBAN'
type StatusFilter = 'ALL' | 'PENDING' | 'COOKING' | 'READY'

const STATIONS: { key: Station; label: string; emoji: string }[] = [
    { key: 'ALL',       label: 'Toutes',    emoji: '🍽️' },
    { key: 'KITCHEN',   label: 'Cuisine',   emoji: '🔥' },
    { key: 'BAR',       label: 'Bar',       emoji: '🍹' },
    { key: 'DESSERT',   label: 'Desserts',  emoji: '🍰' },
    { key: 'COLD_PREP', label: 'Froid',     emoji: '🥗' },
]

const STATION_BADGES: Record<string, { label: string; bg: string; text: string }> = {
    KITCHEN:   { label: 'Cuisine',  bg: 'bg-orange-500/20', text: 'text-orange-300 border-orange-500/30' },
    BAR:       { label: 'Bar',      bg: 'bg-purple-500/20', text: 'text-purple-300 border-purple-500/30' },
    DESSERT:   { label: 'Dessert',  bg: 'bg-pink-500/20',   text: 'text-pink-300 border-pink-500/30' },
    COLD_PREP: { label: 'Froid',    bg: 'bg-cyan-500/20',    text: 'text-cyan-300 border-cyan-500/30' },
}

const STATUS_FLOW: Record<string, string> = {
    PENDING:  'COOKING',
    COOKING:  'READY',
    READY:    'SERVED',
}

const STATUS_PREV: Record<string, string> = {
    COOKING:  'PENDING',
    READY:    'COOKING',
}

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'En attente',
    COOKING: 'En préparation',
    READY:   'Prêt à servir',
    SERVED:  'Servi',
}

function playKitchenChime() {
    try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioCtx) return
        const ctx = new AudioCtx()
        if (ctx.state === 'suspended') {
            ctx.resume()
        }

        // Two-tone chime: High pitch then higher pitch (Ding-Dong!)
        const now = ctx.currentTime
        const osc1 = ctx.createOscillator()
        const gain1 = ctx.createGain()

        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(587.33, now) // D5
        gain1.gain.setValueAtTime(0.3, now)
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

        osc1.connect(gain1)
        gain1.connect(ctx.destination)
        osc1.start(now)
        osc1.stop(now + 0.3)

        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()

        osc2.type = 'sine'
        osc2.frequency.setValueAtTime(880, now + 0.15) // A5
        gain2.gain.setValueAtTime(0.4, now + 0.15)
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.start(now + 0.15)
        osc2.stop(now + 0.6)
    } catch (e) {
        console.warn('Could not play web audio chime:', e)
    }
}

function getUrgency(createdAt: Date | string) {
    const elapsed = (Date.now() - new Date(createdAt).getTime()) / 60000
    if (elapsed < 10) return {
        color: 'border-emerald-500/80 bg-slate-900/90 shadow-emerald-950/20',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        pulse: false,
        level: 'NORMAL'
    }
    if (elapsed < 20) return {
        color: 'border-amber-400/90 bg-slate-900/95 shadow-amber-950/30',
        badge: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
        pulse: false,
        level: 'DELAYED'
    }
    return {
        color: 'border-red-500 bg-slate-900 shadow-red-950/40 ring-1 ring-red-500/30',
        badge: 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse',
        pulse: true,
        level: 'URGENT'
    }
}

function ElapsedTimer({ createdAt }: { createdAt: Date | string }) {
    const [secs, setSecs] = useState(
        Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000))
    )
    useEffect(() => {
        const t = setInterval(() => {
            setSecs(Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)))
        }, 1000)
        return () => clearInterval(t)
    }, [createdAt])

    const m = Math.floor(secs / 60)
    const s = secs % 60
    return <span className="font-mono font-bold">{m}:{String(s).padStart(2, '0')}</span>
}

interface KDSBoardProps {
    tenantSlug: string
    initialOrders: any[]
}

export default function KDSBoard({ tenantSlug, initialOrders }: KDSBoardProps) {
    const [station, setStation] = useState<Station>('ALL')
    const [viewMode, setViewMode] = useState<ViewMode>('GRID')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
    const [orders, setOrders] = useState<any[]>(initialOrders)
    const [updating, setUpdating] = useState<string | null>(null)
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
    const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
    const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({})

    const prevOrderIdsRef = useRef<Set<string>>(new Set(initialOrders.map(o => o.id)))
    const isFirstRender = useRef(true)

    // Sound alert on new orders
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        const currentIds = new Set(orders.map(o => o.id))
        const hasNewOrder = Array.from(currentIds).some(id => !prevOrderIdsRef.current.has(id))
        
        if (hasNewOrder && soundEnabled) {
            playKitchenChime()
        }
        prevOrderIdsRef.current = currentIds
    }, [orders, soundEnabled])

    const refresh = useCallback(async () => {
        try {
            const fresh = await getOrdersForKDS(tenantSlug, station)
            setOrders(fresh as any[])
            setLastRefresh(new Date())
        } catch (err) {
            console.error('KDS Refresh error:', err)
        }
    }, [tenantSlug, station])

    // Fast Polling every 4 seconds
    useEffect(() => {
        const t = setInterval(refresh, 4000)
        return () => clearInterval(t)
    }, [refresh])

    // Refresh when station changes
    useEffect(() => {
        refresh()
    }, [station, refresh])

    // Fullscreen toggle handler
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
        }
    }

    const handleAdvance = async (orderId: string, currentStatus: string) => {
        const nextStatus = STATUS_FLOW[currentStatus]
        if (!nextStatus) return
        setUpdating(orderId)
        await updateOrderStatus(orderId, nextStatus, tenantSlug)
        await refresh()
        setUpdating(null)
    }

    const handleUndo = async (orderId: string, currentStatus: string) => {
        const prevStatus = STATUS_PREV[currentStatus]
        if (!prevStatus) return
        setUpdating(orderId)
        await updateOrderStatus(orderId, prevStatus, tenantSlug)
        await refresh()
        setUpdating(null)
    }

    const toggleItemCheck = (itemId: string) => {
        setCompletedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }))
    }

    // Filtered orders for GRID view status filter
    const displayedOrders = orders.filter(o => {
        if (statusFilter === 'ALL') return true
        return o.status === statusFilter
    })

    // Compute summary stats
    const pendingCount = orders.filter(o => o.status === 'PENDING').length
    const cookingCount = orders.filter(o => o.status === 'COOKING').length
    const readyCount   = orders.filter(o => o.status === 'READY').length

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col overflow-hidden font-sans select-none">
            {/* ═══ HEADER BAR ═══ Compact, sticky top strip */}
            <header className="shrink-0 bg-slate-900/95 border-b border-slate-800/80 backdrop-blur-xl">
                {/* Row 1: Title + Metrics + Controls */}
                <div className="flex items-center justify-between gap-3 px-4 py-2.5">
                    {/* Left: Logo + Title */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
                            <ChefHat size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-black tracking-tight">KDS</h1>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    LIVE
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center: Metrics Bar */}
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
                            <span className="text-sm font-black text-white tabular-nums">{orders.length}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-amber-500/30">
                            <Clock size={12} className="text-amber-400" />
                            <span className="text-sm font-black text-amber-300 tabular-nums">{pendingCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-blue-500/30">
                            <Flame size={12} className="text-blue-400" />
                            <span className="text-sm font-black text-blue-300 tabular-nums">{cookingCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-emerald-500/30">
                            <Bell size={12} className="text-emerald-400" />
                            <span className="text-sm font-black text-emerald-300 tabular-nums">{readyCount}</span>
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                                soundEnabled
                                    ? 'bg-slate-800 text-emerald-400 border-emerald-500/40 hover:bg-slate-700'
                                    : 'bg-slate-800/60 text-slate-500 border-slate-700 hover:text-slate-300'
                            }`}
                            title={soundEnabled ? 'Son activé' : 'Son muet'}
                        >
                            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                        </button>

                        <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                            <button
                                onClick={() => setViewMode('GRID')}
                                className={`p-1.5 rounded-md text-xs font-bold transition-all ${
                                    viewMode === 'GRID' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                                }`}
                                title="Grille"
                            >
                                <LayoutGrid size={14} />
                            </button>
                            <button
                                onClick={() => setViewMode('KANBAN')}
                                className={`p-1.5 rounded-md text-xs font-bold transition-all ${
                                    viewMode === 'KANBAN' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                                }`}
                                title="Kanban"
                            >
                                <Columns size={14} />
                            </button>
                        </div>

                        <button
                            onClick={toggleFullscreen}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg transition-colors"
                            title="Plein écran (F11)"
                        >
                            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        </button>

                        <button
                            onClick={refresh}
                            className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg transition-colors"
                            title={`Mis à jour: ${lastRefresh.toLocaleTimeString('fr-FR')}`}
                        >
                            <RefreshCw size={14} className={updating ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                {/* Row 2: Station tabs + Status filter */}
                <div className="flex items-center justify-between gap-2 px-4 pb-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                        {STATIONS.map(s => {
                            const count = s.key === 'ALL'
                                ? orders.length
                                : orders.filter(o => o.items.some((i: any) => i.prepStation === s.key)).length

                            return (
                                <button
                                    key={s.key}
                                    onClick={() => setStation(s.key)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                                        station === s.key
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/25'
                                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                                >
                                    <span>{s.emoji}</span>
                                    <span>{s.label}</span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                                        station === s.key ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-500'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {viewMode === 'GRID' && (
                        <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800 shrink-0">
                            {(['ALL', 'PENDING', 'COOKING', 'READY'] as StatusFilter[]).map(st => (
                                <button
                                    key={st}
                                    onClick={() => setStatusFilter(st)}
                                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                                        statusFilter === st
                                            ? 'bg-slate-800 text-cyan-400'
                                            : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {st === 'ALL' ? 'Tous' : STATUS_LABELS[st]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* ═══ MAIN CONTENT ═══ Fills remaining viewport height, scrollable */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-5 text-cyan-400/60">
                            <ChefHat size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-300">Aucune commande active</h3>
                        <p className="text-sm text-slate-500 mt-2 max-w-md text-center">
                            Les nouvelles commandes apparaîtront automatiquement sur ce moniteur.
                        </p>
                    </div>
                ) : viewMode === 'GRID' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                        {displayedOrders.map(order => (
                            <OrderTicketCard
                                key={order.id}
                                order={order}
                                updating={updating === order.id}
                                completedItems={completedItems}
                                onAdvance={handleAdvance}
                                onUndo={handleUndo}
                                onToggleItem={toggleItemCheck}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4 h-full">
                        <KanbanColumn
                            title="En attente"
                            subtitle="Nouvelles commandes"
                            icon={Clock}
                            count={pendingCount}
                            headerBg="border-amber-500/40 bg-amber-500/10 text-amber-300"
                            orders={orders.filter(o => o.status === 'PENDING')}
                            updating={updating}
                            completedItems={completedItems}
                            onAdvance={handleAdvance}
                            onUndo={handleUndo}
                            onToggleItem={toggleItemCheck}
                        />
                        <KanbanColumn
                            title="En préparation"
                            subtitle="Sur les fourneaux"
                            icon={Flame}
                            count={cookingCount}
                            headerBg="border-blue-500/40 bg-blue-500/10 text-blue-300"
                            orders={orders.filter(o => o.status === 'COOKING')}
                            updating={updating}
                            completedItems={completedItems}
                            onAdvance={handleAdvance}
                            onUndo={handleUndo}
                            onToggleItem={toggleItemCheck}
                        />
                        <KanbanColumn
                            title="Prêt à servir"
                            subtitle="Comptoir de passe"
                            icon={Bell}
                            count={readyCount}
                            headerBg="border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                            orders={orders.filter(o => o.status === 'READY')}
                            updating={updating}
                            completedItems={completedItems}
                            onAdvance={handleAdvance}
                            onUndo={handleUndo}
                            onToggleItem={toggleItemCheck}
                        />
                    </div>
                )}
            </main>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Ticket Card Component
   ────────────────────────────────────────────────────────────────────────── */
interface OrderTicketCardProps {
    order: any
    updating: boolean
    completedItems: Record<string, boolean>
    onAdvance: (orderId: string, currentStatus: string) => void
    onUndo: (orderId: string, currentStatus: string) => void
    onToggleItem: (itemId: string) => void
}

function OrderTicketCard({
    order,
    updating,
    completedItems,
    onAdvance,
    onUndo,
    onToggleItem
}: OrderTicketCardProps) {
    const urgency = getUrgency(order.createdAt)
    const nextStatus = STATUS_FLOW[order.status]
    const prevStatus = STATUS_PREV[order.status]

    // Calculate progress of items prepared
    const totalItems = order.items.length
    const doneItems  = order.items.filter((i: any) => completedItems[i.id]).length
    const allDone    = totalItems > 0 && doneItems === totalItems

    return (
        <div className={`relative flex flex-col justify-between border-2 rounded-2xl p-4 transition-all duration-200 shadow-xl ${urgency.color} ${allDone ? 'ring-2 ring-emerald-400 bg-slate-900/95' : ''}`}>
            {/* Ticket Header */}
            <div>
                <div className="flex items-start justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-white tracking-tight">
                                Table {order.table?.number ?? '?'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                #{order.id.slice(-4)}
                            </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                            {order.status === 'PENDING' && <Clock size={12} className="text-amber-400" />}
                            {order.status === 'COOKING' && <Flame size={12} className="text-blue-400" />}
                            {order.status === 'READY'   && <Bell  size={12} className="text-emerald-400" />}
                            <span className="font-semibold text-slate-300">{STATUS_LABELS[order.status]}</span>
                        </div>
                    </div>

                    {/* Urgency Badge / Timer */}
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${urgency.badge}`}>
                        <Clock size={12} />
                        <ElapsedTimer createdAt={order.createdAt} />
                    </div>
                </div>

                {/* Items Preparation Progress Bar */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="font-semibold text-slate-300">Items ({doneItems}/{totalItems})</span>
                    {allDone && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Sparkles size={11} /> Prêt !
                        </span>
                    )}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${totalItems > 0 ? (doneItems / totalItems) * 100 : 0}%` }}
                    />
                </div>

                {/* Ticket Items List */}
                <ul className="space-y-2 mb-4">
                    {order.items.map((item: any) => {
                        const isChecked = !!completedItems[item.id]
                        const stationBadge = STATION_BADGES[item.prepStation]

                        return (
                            <li
                                key={item.id}
                                onClick={() => onToggleItem(item.id)}
                                className={`group p-2 rounded-xl border transition-all cursor-pointer ${
                                    isChecked
                                        ? 'bg-slate-950/40 border-slate-800/80 text-slate-500 line-through'
                                        : 'bg-slate-950/80 border-slate-800 text-slate-100 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-start gap-2.5">
                                    <div className="mt-0.5 shrink-0 text-slate-400 group-hover:text-cyan-400 transition-colors">
                                        {isChecked ? (
                                            <CheckSquare size={16} className="text-emerald-400" />
                                        ) : (
                                            <Square size={16} />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <span className={`text-sm font-bold tracking-wide ${isChecked ? 'text-slate-500' : 'text-white'}`}>
                                                <span className="text-cyan-400 font-black mr-1">{item.quantity}×</span>
                                                {item.name}
                                            </span>

                                            {/* Prep Station Badge */}
                                            {stationBadge && (
                                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${stationBadge.bg} ${stationBadge.text} shrink-0`}>
                                                    {stationBadge.label}
                                                </span>
                                            )}
                                        </div>

                                        {/* Options */}
                                        {item.selectedOptions && (() => {
                                            try {
                                                const opts = JSON.parse(item.selectedOptions)
                                                return opts && opts.length > 0 ? (
                                                    <div className="text-xs text-amber-300/90 font-medium mt-0.5">
                                                        {opts.map((o: any) => o.choice || o.name).join(', ')}
                                                    </div>
                                                ) : null
                                            } catch { return null }
                                        })()}

                                        {/* Addons */}
                                        {item.selectedAddons && (() => {
                                            try {
                                                const adds = JSON.parse(item.selectedAddons)
                                                return adds && adds.length > 0 ? (
                                                    <div className="text-xs text-cyan-300/80 font-medium mt-0.5">
                                                        + {adds.map((a: any) => a.name).join(', ')}
                                                    </div>
                                                ) : null
                                            } catch { return null }
                                        })()}
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                {/* Undo / Back Status Button */}
                {prevStatus && (
                    <button
                        onClick={() => onUndo(order.id, order.status)}
                        disabled={updating}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                        title={`Revenir à ${STATUS_LABELS[prevStatus]}`}
                    >
                        <Undo2 size={15} />
                    </button>
                )}

                {/* Main Advance Button */}
                {nextStatus && (
                    <button
                        onClick={() => onAdvance(order.id, order.status)}
                        disabled={updating}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md disabled:opacity-50 ${
                            order.status === 'PENDING'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/30'
                                : order.status === 'COOKING'
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-cyan-900/30'
                        }`}
                    >
                        {updating ? (
                            <RefreshCw size={15} className="animate-spin" />
                        ) : (
                            <CheckCircle2 size={15} />
                        )}
                        <span>
                            {order.status === 'PENDING' && '🔥 Lancer la cuisson'}
                            {order.status === 'COOKING' && '🔔 Marquer Prêt'}
                            {order.status === 'READY'   && '✓ Valider & Servir'}
                        </span>
                    </button>
                )}
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Kanban Column Component
   ────────────────────────────────────────────────────────────────────────── */
interface KanbanColumnProps {
    title: string
    subtitle: string
    icon: any
    count: number
    headerBg: string
    orders: any[]
    updating: string | null
    completedItems: Record<string, boolean>
    onAdvance: (orderId: string, currentStatus: string) => void
    onUndo: (orderId: string, currentStatus: string) => void
    onToggleItem: (itemId: string) => void
}

function KanbanColumn({
    title,
    subtitle,
    icon: Icon,
    count,
    headerBg,
    orders,
    updating,
    completedItems,
    onAdvance,
    onUndo,
    onToggleItem
}: KanbanColumnProps) {
    return (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-3 flex flex-col h-full min-h-0">
            {/* Column Header */}
            <div className={`flex items-center justify-between p-3 rounded-xl border mb-4 ${headerBg}`}>
                <div className="flex items-center gap-2.5">
                    <Icon size={20} />
                    <div>
                        <h2 className="font-black text-sm tracking-tight">{title}</h2>
                        <p className="text-[10px] opacity-80">{subtitle}</p>
                    </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-950/40 border border-current">
                    {count}
                </span>
            </div>

            {/* Column Orders */}
            <div className="space-y-4 flex-1 overflow-y-auto">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-600 border border-dashed border-slate-800 rounded-xl">
                        <Icon size={28} className="opacity-40 mb-2" />
                        <p className="text-xs">Aucun ticket dans cette colonne</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <OrderTicketCard
                            key={order.id}
                            order={order}
                            updating={updating === order.id}
                            completedItems={completedItems}
                            onAdvance={onAdvance}
                            onUndo={onUndo}
                            onToggleItem={onToggleItem}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
