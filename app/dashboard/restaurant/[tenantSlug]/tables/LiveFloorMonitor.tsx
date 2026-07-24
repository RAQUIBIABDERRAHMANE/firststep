'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getLiveFloorStatus } from '@/app/actions/restaurant'
import {
    MapPin,
    Clock,
    Flame,
    Bell,
    CheckCircle2,
    RefreshCw,
    Layers,
    DollarSign,
    Utensils,
    AlertTriangle,
    X,
    Users
} from 'lucide-react'
import { CURRENCY } from '@/lib/translations'

interface TableStatusItem {
    id: string
    number: string
    capacity?: number | null
    xPos: number
    yPos: number
    rotation: number
    shape: string
    spaceId?: string | null
    spaceName: string
    status: string // "FREE" | "PENDING" | "COOKING" | "READY"
    activeOrderAmount: number
    activeOrderId?: string | null
    hasRequestAlert: boolean
}

interface LiveFloorMonitorProps {
    tenantSlug: string
    spaces: any[]
}

export default function LiveFloorMonitor({ tenantSlug, spaces }: LiveFloorMonitorProps) {
    const [tableStatuses, setTableStatuses] = useState<TableStatusItem[]>([])
    const [activeSpaceName, setActiveSpaceName] = useState<string>(spaces[0]?.name || 'All')
    const [selectedTable, setSelectedTable] = useState<TableStatusItem | null>(null)
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
    const [loading, setLoading] = useState(false)

    const fetchStatus = useCallback(async () => {
        try {
            const res = await getLiveFloorStatus(tenantSlug)
            if (res.success && res.tableStatuses) {
                setTableStatuses(res.tableStatuses as TableStatusItem[])
                setLastRefresh(new Date())
            }
        } catch (e) {
            console.error('Error fetching live floor status:', e)
        }
    }, [tenantSlug])

    // Fast polling every 3.5s
    useEffect(() => {
        fetchStatus()
        const interval = setInterval(fetchStatus, 3500)
        return () => clearInterval(interval)
    }, [fetchStatus])

    // Extract unique space names
    const spaceNames = ['Tous', ...Array.from(new Set(tableStatuses.map(t => t.spaceName)))]

    const filteredTables = activeSpaceName === 'Tous'
        ? tableStatuses
        : tableStatuses.filter(t => t.spaceName === activeSpaceName)

    // Compute stats
    const freeCount = tableStatuses.filter(t => t.status === 'FREE').length
    const occupiedCount = tableStatuses.filter(t => t.status !== 'FREE').length
    const alertsCount = tableStatuses.filter(t => t.hasRequestAlert).length

    return (
        <div className="space-y-6">
            {/* Header Controls & Live Metrics */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
                        <MapPin size={22} className="text-slate-950" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black tracking-tight">Moniteur de Salle En Direct</h2>
                            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                LIVE
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">Occupation et appels serveur en temps réel.</p>
                    </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    <div className="px-3 py-1.5 bg-slate-950/60 border border-emerald-500/30 rounded-xl text-center">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Libres</span>
                        <div className="text-sm font-black text-emerald-300">{freeCount}</div>
                    </div>
                    <div className="px-3 py-1.5 bg-slate-950/60 border border-red-500/30 rounded-xl text-center">
                        <span className="text-[10px] font-bold text-red-400 uppercase">Occupées</span>
                        <div className="text-sm font-black text-red-300">{occupiedCount}</div>
                    </div>
                    <div className="px-3 py-1.5 bg-slate-950/60 border border-amber-500/30 rounded-xl text-center">
                        <span className="text-[10px] font-bold text-amber-400 uppercase">Demandes</span>
                        <div className="text-sm font-black text-amber-300">{alertsCount}</div>
                    </div>

                    <button
                        onClick={fetchStatus}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition-colors ml-2"
                        title={`Mis à jour: ${lastRefresh.toLocaleTimeString()}`}
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Space Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {spaceNames.map(name => (
                    <button
                        key={name}
                        onClick={() => setActiveSpaceName(name)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            activeSpaceName === name
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* Interactive Visual Floor Map */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredTables.map(t => {
                    const isOccupied = t.status !== 'FREE'
                    const hasAlert = t.hasRequestAlert

                    return (
                        <div
                            key={t.id}
                            onClick={() => setSelectedTable(t)}
                            className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer shadow-lg hover:scale-102 ${
                                hasAlert
                                    ? 'bg-amber-950/20 border-amber-500 animate-pulse ring-4 ring-amber-500/20'
                                    : isOccupied
                                    ? 'bg-slate-900 border-red-500/80 text-white shadow-red-500/10'
                                    : 'bg-white border-emerald-500/40 text-slate-900 hover:border-emerald-500'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-black tracking-tight">
                                        Table {t.number}
                                    </span>
                                    {t.capacity && (
                                        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5">
                                            <Users size={10} /> {t.capacity}
                                        </span>
                                    )}
                                </div>

                                <div className={`w-3 h-3 rounded-full ${
                                    hasAlert ? 'bg-amber-400 animate-ping' :
                                    isOccupied ? 'bg-red-500' : 'bg-emerald-500'
                                }`} />
                            </div>

                            <div className="text-xs font-semibold mb-3">
                                {hasAlert ? (
                                    <span className="text-amber-400 font-bold flex items-center gap-1">
                                        <Bell size={12} /> Appel / Addition !
                                    </span>
                                ) : isOccupied ? (
                                    <span className="text-red-400 font-bold flex items-center gap-1">
                                        <Flame size={12} /> En service ({t.status})
                                    </span>
                                ) : (
                                    <span className="text-emerald-600 font-bold">
                                        Libre
                                    </span>
                                )}
                            </div>

                            {isOccupied && (
                                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-mono">Consommation</span>
                                    <span className="font-black text-cyan-400">
                                        {t.activeOrderAmount.toFixed(2)} {CURRENCY}
                                    </span>
                                </div>
                            )}

                            <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {t.spaceName}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Slide-over Table Details Drawer */}
            {selectedTable && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end" onClick={() => setSelectedTable(null)}>
                    <div
                        className="w-full max-w-md bg-slate-900 text-white h-full p-6 shadow-2xl flex flex-col justify-between border-l border-slate-800 animate-in slide-in-from-right duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        <div>
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                <div>
                                    <h3 className="text-2xl font-black">Table {selectedTable.number}</h3>
                                    <p className="text-xs text-slate-400">Espace : {selectedTable.spaceName}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedTable(null)}
                                    className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Statut Actuel</div>
                                    <div className="text-lg font-black text-white flex items-center gap-2">
                                        {selectedTable.status === 'FREE' ? (
                                            <span className="text-emerald-400">🟢 Table Libre</span>
                                        ) : (
                                            <span className="text-red-400">🔴 En Service ({selectedTable.status})</span>
                                        )}
                                    </div>
                                </div>

                                {selectedTable.status !== 'FREE' && (
                                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Montant en cours</div>
                                        <div className="text-2xl font-black text-cyan-400">
                                            {selectedTable.activeOrderAmount.toFixed(2)} {CURRENCY}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedTable(null)}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
