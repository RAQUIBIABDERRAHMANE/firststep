'use client'

import { useState, useEffect, useCallback } from 'react'
import { getOrdersForKDS, updateOrderStatus } from '@/app/actions/restaurant'
import { ChefHat, Clock, Flame, Bell, CheckCircle2, RefreshCw } from 'lucide-react'

type Station = 'ALL' | 'KITCHEN' | 'BAR' | 'DESSERT' | 'COLD_PREP'

const STATIONS: { key: Station; label: string; emoji: string }[] = [
    { key: 'ALL',       label: 'Toutes',    emoji: '🍽️' },
    { key: 'KITCHEN',   label: 'Cuisine',   emoji: '🔥' },
    { key: 'BAR',       label: 'Bar',       emoji: '🍹' },
    { key: 'DESSERT',   label: 'Desserts',  emoji: '🍰' },
    { key: 'COLD_PREP', label: 'Froid',     emoji: '🥗' },
]

const STATUS_FLOW: Record<string, string> = {
    PENDING:  'COOKING',
    COOKING:  'READY',
    READY:    'SERVED',
}

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'En attente',
    COOKING: 'En préparation',
    READY:   'Prêt',
    SERVED:  'Servi',
}

function getUrgency(createdAt: Date | string) {
    const elapsed = (Date.now() - new Date(createdAt).getTime()) / 60000
    if (elapsed < 10) return { color: 'border-emerald-500 bg-emerald-950/30', badge: 'bg-emerald-500', pulse: false }
    if (elapsed < 20) return { color: 'border-amber-400 bg-amber-950/30',   badge: 'bg-amber-400',  pulse: false }
    return              { color: 'border-red-500 bg-red-950/30',             badge: 'bg-red-500',    pulse: true  }
}

function ElapsedTimer({ createdAt }: { createdAt: Date | string }) {
    const [secs, setSecs] = useState(
        Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
    )
    useEffect(() => {
        const t = setInterval(() => setSecs(s => s + 1), 1000)
        return () => clearInterval(t)
    }, [])
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return <span className="font-mono text-xs">{m}:{String(s).padStart(2, '0')}</span>
}

interface KDSBoardProps {
    tenantSlug: string
    initialOrders: any[]
}

export default function KDSBoard({ tenantSlug, initialOrders }: KDSBoardProps) {
    const [station, setStation] = useState<Station>('ALL')
    const [orders, setOrders] = useState<any[]>(initialOrders)
    const [updating, setUpdating] = useState<string | null>(null)
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

    const refresh = useCallback(async () => {
        const fresh = await getOrdersForKDS(tenantSlug, station)
        setOrders(fresh as any[])
        setLastRefresh(new Date())
    }, [tenantSlug, station])

    // Auto-refresh every 10 seconds
    useEffect(() => {
        const t = setInterval(refresh, 10000)
        return () => clearInterval(t)
    }, [refresh])

    // Refresh when station changes
    useEffect(() => { refresh() }, [station, refresh])

    const handleAdvance = async (orderId: string, currentStatus: string) => {
        const nextStatus = STATUS_FLOW[currentStatus]
        if (!nextStatus) return
        setUpdating(orderId)
        await updateOrderStatus(orderId, nextStatus, tenantSlug)
        await refresh()
        setUpdating(null)
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <ChefHat size={28} className="text-cyan-400" />
                    <h1 className="text-2xl font-bold">Kitchen Display System</h1>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <span>Mis à jour: {lastRefresh.toLocaleTimeString('fr-FR')}</span>
                    <button
                        onClick={refresh}
                        className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Actualiser"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {/* Station Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {STATIONS.map(s => (
                    <button
                        key={s.key}
                        onClick={() => setStation(s.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                            station === s.key
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        <span>{s.emoji}</span> {s.label}
                    </button>
                ))}
            </div>

            {/* Ticket Count */}
            <div className="text-slate-400 text-sm mb-4">
                {orders.length === 0
                    ? 'Aucune commande active'
                    : `${orders.length} commande${orders.length > 1 ? 's' : ''} active${orders.length > 1 ? 's' : ''}`
                }
            </div>

            {/* Order Grid */}
            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-600">
                    <ChefHat size={56} />
                    <p className="mt-4 text-lg">Cuisine tranquille — aucune commande</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {orders.map(order => {
                        const urgency = getUrgency(order.createdAt)
                        const nextStatus = STATUS_FLOW[order.status]
                        const isUpdating = updating === order.id

                        return (
                            <div
                                key={order.id}
                                className={`relative border-2 rounded-2xl p-4 transition-all ${urgency.color} ${urgency.pulse ? 'animate-pulse-border' : ''}`}
                            >
                                {/* Top row */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold">
                                            Table {order.table?.number ?? '?'}
                                        </span>
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-white ${urgency.badge}`}>
                                        <Clock size={10} />
                                        <ElapsedTimer createdAt={order.createdAt} />
                                    </div>
                                </div>

                                {/* Status badge */}
                                <div className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                                    {order.status === 'COOKING' && <Flame size={12} className="text-amber-400" />}
                                    {order.status === 'READY'   && <Bell  size={12} className="text-emerald-400" />}
                                    <span>{STATUS_LABELS[order.status] ?? order.status}</span>
                                </div>

                                {/* Items list */}
                                <ul className="space-y-1.5 mb-4">
                                    {order.items.map((item: any) => (
                                        <li key={item.id} className="flex items-start justify-between gap-2">
                                            <span className="text-sm font-medium">
                                                {item.quantity}× {item.name}
                                            </span>
                                            {item.selectedOptions && (() => {
                                                try {
                                                    const opts = JSON.parse(item.selectedOptions)
                                                    return opts.length > 0
                                                        ? <span className="text-xs text-slate-400">{opts.map((o: any) => o.choice).join(', ')}</span>
                                                        : null
                                                } catch { return null }
                                            })()}
                                        </li>
                                    ))}
                                </ul>

                                {/* Advance button */}
                                {nextStatus && (
                                    <button
                                        onClick={() => handleAdvance(order.id, order.status)}
                                        disabled={isUpdating}
                                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-700 hover:bg-cyan-600 text-sm font-medium transition-colors disabled:opacity-50"
                                    >
                                        {isUpdating ? (
                                            <RefreshCw size={14} className="animate-spin" />
                                        ) : (
                                            <CheckCircle2 size={14} />
                                        )}
                                        → {STATUS_LABELS[nextStatus]}
                                    </button>
                                )}
                                {!nextStatus && (
                                    <div className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-900/40 text-emerald-400 text-sm font-medium">
                                        <CheckCircle2 size={14} /> Terminé
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
