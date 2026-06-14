'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import {
    ClipboardList,
    Clock,
    MapPin,
    CheckCircle2,
    ChefHat,
    Timer,
    AlertCircle,
    Check,
    Volume2,
    VolumeX,
    XCircle,
    LayoutGrid,
    Sliders,
    Bell,
    Receipt,
    User,
    Users,
    X,
    CheckSquare
} from 'lucide-react'
import { updateOrderStatus } from '@/app/actions/restaurant'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const playNotificationSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const playTone = (freq: number, startTime: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        // Double chime: C6 (1046.5Hz) then E6 (1318.5Hz)
        playTone(1046.50, ctx.currentTime, 0.4);
        playTone(1318.51, ctx.currentTime + 0.15, 0.6);
    } catch (e) {
        console.error("Audio play failed", e);
    }
}

interface TableLayout {
    id: string
    x: number
    y: number
    w: number
    h: number
    shape: 'rectangle' | 'circle'
    rotation: number
}

interface ObstacleLayout {
    id: string
    type: 'wall' | 'door'
    x: number
    y: number
    w: number
    h: number
    rotation: number
}

function ItemCustomizations({ selectedOptions, selectedAddons }: { selectedOptions: string; selectedAddons: string }) {
    let options: { group: string, choice: string }[] = []
    let addons: { name: string, price: number }[] = []
    try {
        if (selectedOptions) {
            options = JSON.parse(selectedOptions)
        }
    } catch {}
    try {
        if (selectedAddons) {
            addons = JSON.parse(selectedAddons)
        }
    } catch {}

    if (options.length === 0 && addons.length === 0) return null

    return (
        <div className="mt-1 space-y-0.5 text-left">
            {options.map((opt, i) => (
                <div key={i} className="text-[11px] text-slate-500 font-medium italic">
                    • {opt.group}: <span className="font-bold text-slate-700">{opt.choice}</span>
                </div>
            ))}
            {addons.map((add, i) => (
                <div key={i} className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    + {add.name} (+{add.price} MAD)
                </div>
            ))}
        </div>
    )
}

export default function OrdersClient({ 
    initialOrders, 
    tenantSlug, 
    initialConfig,
    onOrderUpdate
}: { 
    initialOrders: any[]
    tenantSlug: string
    initialConfig?: string 
    onOrderUpdate?: () => void | Promise<void>
}) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'list' | 'floorplan'>('list')
    const [loading, setLoading] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
    const [isSoundEnabled, setIsSoundEnabled] = useState(true)
    const previousOrderIds = React.useRef<Set<string>>(new Set())
    const [dismissedOrders, setDismissedOrders] = useState<Set<string>>(new Set())

    // Modal view for selected table in floor plan monitor
    const [monitoredTableId, setMonitoredTableId] = useState<string | null>(null)

    // Floor Plan configurations
    const [floorPlan, setFloorPlan] = useState<{
        tables: TableLayout[]
        obstacles: ObstacleLayout[]
    }>(() => {
        try {
            if (initialConfig) {
                const configObj = JSON.parse(initialConfig)
                if (configObj.floorPlan) {
                    return configObj.floorPlan
                }
            }
        } catch (e) {
            console.error('Failed to parse floor plan in monitor', e)
        }
        return { tables: [], obstacles: [] }
    })

    // Track new orders and play sound / vibrate
    useEffect(() => {
        const currentIds = new Set(initialOrders.map(o => o.id));
        let hasNewOrder = false;
        
        if (previousOrderIds.current.size > 0) {
            for (const id of currentIds) {
                if (!previousOrderIds.current.has(id)) {
                    hasNewOrder = true;
                    break;
                }
            }
        } else {
            previousOrderIds.current = currentIds;
            return;
        }

        if (hasNewOrder) {
            if (isSoundEnabled) {
                playNotificationSound();
            }
            // Trigger physical vibration feedback (shake the phone)
            if (typeof window !== 'undefined' && navigator.vibrate) {
                // Shake pattern: Vibrate 300ms, pause 100ms, vibrate 300ms
                navigator.vibrate([300, 100, 300]);
            }
        }
        
        previousOrderIds.current = currentIds;
    }, [initialOrders, isSoundEnabled])

    // Polling for new orders
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
            setLastUpdated(new Date())
        }, 8000) // Poll every 8s
        return () => clearInterval(interval)
    }, [router])

    const handleUpdateStatus = async (orderId: string, status: string) => {
        if (status === 'PAID' || status === 'CANCELED') {
            const confirmed = window.confirm(`Are you sure you want to mark this order as ${status.toLowerCase()}?`)
            if (!confirmed) return
        }

        if (status === 'COMPLETED' || status === 'PAID') {
            setDismissedOrders(prev => new Set(prev).add(orderId))
        }

        setLoading(orderId)
        try {
            await updateOrderStatus(orderId, status, tenantSlug)
            toast.success(`Order marked as ${status.toLowerCase()}`)
            if (onOrderUpdate) {
                await onOrderUpdate()
            }
        } catch (e) {
            toast.error('Failed to update order status')
        } finally {
            setLoading(null)
            router.refresh()
        }
    }

    const handleMarkAllPaid = async (tableId: string) => {
        const activeOrders = initialOrders.filter(
            o => o.tableId === tableId && 
            o.status !== 'PAID' && 
            o.status !== 'CANCELED' && 
            o.status !== 'COMPLETED'
        )

        if (activeOrders.length === 0) return

        const confirmed = window.confirm(`Are you sure you want to mark all ${activeOrders.length} orders at this table as paid?`)
        if (!confirmed) return

        setLoading('all-paid')
        try {
            for (const order of activeOrders) {
                await updateOrderStatus(order.id, 'PAID', tenantSlug)
            }
            toast.success('All orders at table marked as paid')
            if (onOrderUpdate) {
                await onOrderUpdate()
            }
        } catch (e) {
            toast.error('Error settling table orders')
        } finally {
            setLoading(null)
            setMonitoredTableId(null)
            router.refresh()
        }
    }

    // --- Table status compute ---
    const getTableStatus = (tableId: string) => {
        const tableOrders = initialOrders.filter(
            o => o.tableId === tableId && 
            o.status !== 'PAID' && 
            o.status !== 'CANCELED' && 
            o.status !== 'COMPLETED' && 
            !dismissedOrders.has(o.id)
        )

        if (tableOrders.length === 0) {
            return { type: 'FREE', orders: [] }
        }

        // Check call waiter
        const hasCallWaiter = tableOrders.some(
            o => o.items.some((i: any) => i.name === '🔔 CALL WAITER')
        )
        if (hasCallWaiter) {
            const waiterOrder = tableOrders.find(o => o.items.some((i: any) => i.name === '🔔 CALL WAITER'))
            return { type: 'SERVICE', orders: tableOrders, waiterOrderId: waiterOrder?.id }
        }

        // Check request bill
        const hasRequestBill = tableOrders.some(
            o => o.items.some((i: any) => i.name === '🔔 REQUEST BILL')
        )
        if (hasRequestBill) {
            const billOrder = tableOrders.find(o => o.items.some((i: any) => i.name === '🔔 REQUEST BILL'))
            return { type: 'BILL', orders: tableOrders, billOrderId: billOrder?.id }
        }

        return { type: 'OCCUPIED', orders: tableOrders }
    }

    const getStatusColorClass = (type: string) => {
        switch (type) {
            case 'FREE':
                return 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-600'
            case 'OCCUPIED':
                return 'bg-rose-500 text-white hover:bg-rose-600 border-rose-600'
            case 'SERVICE':
                return 'bg-blue-500 text-white hover:bg-blue-600 border-blue-600 animate-pulse'
            case 'BILL':
                return 'bg-amber-500 text-white hover:bg-amber-600 border-amber-600 animate-pulse shadow-md shadow-amber-500/20'
            default:
                return 'bg-slate-300'
        }
    }

    // Modal Details for Monitored Table
    const monitoredTableDetails = (() => {
        if (!monitoredTableId) return null
        const layoutTable = floorPlan.tables.find(t => t.id === monitoredTableId)
        
        // Find in initialOrders to get table name or load from initialTables relation
        let tableNumber = ''
        let tableCapacity = 0
        
        // Lookup from initialOrders
        const matchingOrder = initialOrders.find(o => o.tableId === monitoredTableId)
        if (matchingOrder) {
            tableNumber = matchingOrder.table.number
            tableCapacity = matchingOrder.table.capacity || 0
        } else {
            // Reconstruct if table is currently free
            tableNumber = layoutTable ? `Map-${layoutTable.id.substring(0,3)}` : ''
        }

        const statusInfo = getTableStatus(monitoredTableId)
        return {
            id: monitoredTableId,
            number: tableNumber,
            capacity: tableCapacity,
            ...statusInfo
        }
    })()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200'
            case 'PREPARING': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'READY': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
            case 'SERVED': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
            case 'PAID': return 'bg-slate-100 text-slate-700 border-slate-200'
            case 'CANCELED': return 'bg-red-100 text-red-700 border-red-200'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    return (
        <div className="space-y-8">
            {/* View Tab Toggle & Sound */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex justify-between items-center bg-slate-100 p-1.5 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                            activeTab === 'list' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        <LayoutGrid size={14} /> List Monitor
                    </button>
                    <button
                        onClick={() => setActiveTab('floorplan')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                            activeTab === 'floorplan' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        <MapPin size={14} /> Floor Plan Monitor
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full w-fit">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Sync: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </div>
                    
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                            const nextVal = !isSoundEnabled;
                            setIsSoundEnabled(nextVal);
                            if (nextVal) {
                                playNotificationSound();
                                if (typeof window !== 'undefined' && navigator.vibrate) {
                                    navigator.vibrate([100, 50, 100]);
                                }
                            }
                        }}
                        className={cn(
                            "rounded-full px-4 h-9 gap-2 text-xs font-bold border transition-colors",
                            isSoundEnabled ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                        )}
                    >
                        {isSoundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                        {isSoundEnabled ? "Sound On" : "Enable Sound"}
                    </Button>
                </div>
            </div>

            {/* View Layouts */}
            {activeTab === 'list' ? (
                /* Original List View */
                <>
                    {initialOrders.length === 0 ? (
                        <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center animate-in fade-in duration-500">
                            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-sm mb-8">
                                <ClipboardList size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No active orders</h3>
                            <p className="text-slate-500 max-w-sm leading-relaxed">Incoming orders from your tables will appear here in real-time.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
                            {initialOrders.map((order) => {
                                const isCallWaiter = order.items.some((i: any) => i.name === '🔔 CALL WAITER')
                                const isRequestBill = order.items.some((i: any) => i.name === '🔔 REQUEST BILL')

                                if (isCallWaiter || isRequestBill) {
                                    if (order.status === 'COMPLETED' || dismissedOrders.has(order.id)) return null
                                    const actionText = isCallWaiter ? "Table Needs Assistance" : "Table Requests Bill"

                                    return (
                                        <div 
                                            key={order.id} 
                                            className={cn(
                                                "col-span-1 lg:col-span-2 border rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-top-2",
                                                isCallWaiter ? "bg-orange-50 border-orange-200" : "bg-amber-50 border-amber-200"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center text-white animate-pulse",
                                                    isCallWaiter ? "bg-orange-500" : "bg-amber-500"
                                                )}>
                                                    {isCallWaiter ? <Bell size={18} /> : <Receipt size={18} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-950 text-sm">Table {order.table.number} — {actionText}</h3>
                                                    <p className="text-slate-500 text-xs">Requested at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                                                disabled={loading === order.id}
                                                className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 h-8 text-xs font-bold px-4 rounded-lg shadow-sm"
                                            >
                                                Dismiss
                                            </Button>
                                        </div>
                                    )
                                }

                                return (
                                    <Card key={order.id} className={cn(
                                        "overflow-hidden border-slate-200 shadow-xl shadow-slate-200/20 rounded-[2.5rem] bg-white transition-all duration-300",
                                        order.status === 'PENDING' ? 'ring-4 ring-amber-400/10 border-amber-200' : ''
                                    )}>
                                        <CardHeader className="bg-slate-50/50 py-6 px-8 flex flex-row items-center justify-between border-b border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 font-black shadow-sm ring-1 ring-slate-100">
                                                    {order.table.number}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-black tracking-tight">Table {order.table.number}</CardTitle>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                                        <Clock size={10} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Order #{order.id.substring(order.id.length - 4)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className={cn("rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest gap-2", getStatusColor(order.status))}>
                                                {order.status}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="space-y-6">
                                                <div className="divide-y divide-slate-100">
                                                    {order.items.map((item: any) => (
                                                        <div key={item.id} className="py-4 flex justify-between items-center">
                                                            <div className="flex items-start gap-4">
                                                                <span className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center font-black text-xs text-slate-600 flex-shrink-0 mt-0.5">
                                                                    {item.quantity}x
                                                                </span>
                                                                <div className="text-left">
                                                                    <span className="font-bold text-slate-900">{item.name}</span>
                                                                    <ItemCustomizations selectedOptions={item.selectedOptions} selectedAddons={item.selectedAddons} />
                                                                </div>
                                                            </div>
                                                            <span className="text-sm font-black text-slate-400">{(item.price * item.quantity).toFixed(0)} MAD</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                                                    <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Total Amount</span>
                                                    <span className="text-3xl font-black tracking-tighter text-indigo-600">{order.totalAmount.toFixed(0)} MAD</span>
                                                </div>

                                                {order.status !== 'PAID' && order.status !== 'CANCELED' && (
                                                    <div className="pt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
                                                        <Button
                                                            variant={order.status === 'PREPARING' ? 'default' : 'outline'}
                                                            className="rounded-2xl h-14 font-black text-xs uppercase tracking-widest shadow-none"
                                                            disabled={loading === order.id}
                                                            onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                                                        >
                                                            Cook
                                                        </Button>
                                                        <Button
                                                            variant={order.status === 'READY' ? 'default' : 'outline'}
                                                            className="rounded-2xl h-14 font-black text-xs uppercase tracking-widest shadow-none"
                                                            disabled={loading === order.id}
                                                            onClick={() => handleUpdateStatus(order.id, 'READY')}
                                                        >
                                                            Ready
                                                        </Button>
                                                        <Button
                                                            variant={order.status === 'SERVED' ? 'default' : 'outline'}
                                                            className="rounded-2xl h-14 font-black text-xs uppercase tracking-widest shadow-none"
                                                            disabled={loading === order.id}
                                                            onClick={() => handleUpdateStatus(order.id, 'SERVED')}
                                                        >
                                                            Serve
                                                        </Button>
                                                        <Button
                                                            variant={order.status === 'PAID' ? 'default' : 'outline'}
                                                            className="rounded-2xl h-14 font-black text-xs uppercase tracking-widest shadow-none"
                                                            disabled={loading === order.id}
                                                            onClick={() => handleUpdateStatus(order.id, 'PAID')}
                                                        >
                                                            Settle
                                                        </Button>
                                                        <Button
                                                            variant={order.status === 'CANCELED' ? 'destructive' : 'outline'}
                                                            className={cn(
                                                                "rounded-2xl h-14 font-black text-xs uppercase tracking-widest shadow-none",
                                                                order.status !== 'CANCELED' && "border-red-100 text-red-500 hover:bg-red-50"
                                                            )}
                                                            disabled={loading === order.id}
                                                            onClick={() => handleUpdateStatus(order.id, 'CANCELED')}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </>
            ) : (
                /* Floor Plan Monitor View */
                <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
                    
                    {/* Status Color Legend */}
                    <div className="flex flex-wrap items-center gap-6 bg-slate-50 p-6 border border-slate-200 rounded-[2rem] w-full">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 mr-2">Legend:</span>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-emerald-500 border border-emerald-600" />
                            <span className="text-xs font-bold text-slate-700">Free (Green)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-rose-500 border border-rose-600" />
                            <span className="text-xs font-bold text-slate-700">Occupied (Red)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-blue-500 border border-blue-600 animate-pulse" />
                            <span className="text-xs font-bold text-slate-700">Needs Service (Blue)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-amber-500 border border-amber-600 animate-pulse" />
                            <span className="text-xs font-bold text-slate-700">Requests Bill (Orange)</span>
                        </div>
                    </div>

                    {/* Floor Plan Display Map */}
                    <div className="relative w-full h-[600px] bg-slate-900 rounded-[3rem] border-4 border-slate-800 shadow-2xl overflow-hidden">
                        
                        {/* Interactive Grid Map (unlocked layout) */}
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)',
                            backgroundSize: '20px 20px'
                        }} />

                        {/* Render Obstacles */}
                        {floorPlan.obstacles.map((obstacle) => {
                            const isWall = obstacle.type === 'wall'
                            return (
                                <div
                                    key={obstacle.id}
                                    className={cn(
                                        "absolute opacity-60 border select-none pointer-events-none",
                                        isWall ? "bg-slate-500 border-slate-600" : "bg-amber-800 border-amber-900"
                                    )}
                                    style={{
                                        left: `${obstacle.x}px`,
                                        top: `${obstacle.y}px`,
                                        width: `${obstacle.w}px`,
                                        height: `${obstacle.h}px`,
                                        transform: `rotate(${obstacle.rotation}deg)`
                                    }}
                                />
                            )
                        })}

                        {/* Render Interactive Tables with Real-time Status Colors */}
                        {floorPlan.tables.map((table) => {
                            // Find table name/info
                            let displayName = `T-${table.id.substring(0, 3)}`
                            const matchingOrder = initialOrders.find(o => o.tableId === table.id)
                            if (matchingOrder) {
                                displayName = matchingOrder.table.number
                            }

                            const statusInfo = getTableStatus(table.id)
                            const colorClass = getStatusColorClass(statusInfo.type)

                            return (
                                <div
                                    key={table.id}
                                    onClick={() => setMonitoredTableId(table.id)}
                                    className={cn(
                                        "absolute flex flex-col items-center justify-center font-black border-2 transition-all cursor-pointer shadow-lg active:scale-95 duration-200 z-10",
                                        table.shape === 'circle' ? "rounded-full" : "rounded-2xl",
                                        colorClass
                                    )}
                                    style={{
                                        left: `${table.x}px`,
                                        top: `${table.y}px`,
                                        width: `${table.w}px`,
                                        height: `${table.h}px`,
                                        transform: `rotate(${table.rotation}deg)`
                                    }}
                                >
                                    <span className="text-xl tracking-tight leading-none">T-{displayName}</span>
                                    
                                    {statusInfo.type === 'SERVICE' && (
                                        <Bell size={14} className="mt-1 animate-bounce text-white" />
                                    )}
                                    {statusInfo.type === 'BILL' && (
                                        <Receipt size={14} className="mt-1 animate-pulse text-white" />
                                    )}
                                    {statusInfo.type === 'OCCUPIED' && (
                                        <span className="text-[9px] opacity-75 font-semibold mt-1">
                                            {statusInfo.orders.length} Order(s)
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Table Details Slide Modal Overlay */}
                    {monitoredTableDetails && (
                        <div 
                            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-all flex items-center justify-center p-4 animate-in fade-in"
                            onClick={() => setMonitoredTableId(null)}
                        >
                            <Card 
                                className="w-full max-w-xl bg-white shadow-2xl rounded-[2.5rem] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <CardHeader className="bg-slate-50 py-6 px-8 flex flex-row items-center justify-between border-b border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center font-black text-xl border border-slate-200">
                                            {monitoredTableDetails.number || '?'}
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black">Table {monitoredTableDetails.number}</CardTitle>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                                Status: {monitoredTableDetails.type}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                                        onClick={() => setMonitoredTableId(null)}
                                    >
                                        <X size={18} />
                                    </Button>
                                </CardHeader>
                                
                                <CardContent className="p-8 space-y-6">
                                    {monitoredTableDetails.type === 'FREE' ? (
                                        <div className="py-8 text-center text-slate-400">
                                            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                                            <h4 className="text-lg font-serif text-slate-800">Table is empty</h4>
                                            <p className="text-xs mt-1">No active guest orders or calls registered.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* List of active orders */}
                                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                                {monitoredTableDetails.orders.map((order: any) => {
                                                    const isCallWaiter = order.items.some((i: any) => i.name === '🔔 CALL WAITER')
                                                    const isRequestBill = order.items.some((i: any) => i.name === '🔔 REQUEST BILL')

                                                    return (
                                                        <div key={order.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                                                                    Order #{order.id.substring(order.id.length - 4)}
                                                                </span>
                                                                <Badge variant="outline" className={cn("rounded-full px-3 py-1 font-bold text-[9px] uppercase tracking-wider", getStatusColor(order.status))}>
                                                                    {order.status}
                                                                </Badge>
                                                            </div>
                                                            
                                                            <div className="space-y-2 mb-4">
                                                                {order.items.map((item: any) => (
                                                                    <div key={item.id} className="flex justify-between items-start text-sm py-2 border-b border-slate-100/60 last:border-0">
                                                                        <div className="flex-1 text-left pr-4">
                                                                            <span className="font-semibold text-slate-800">{item.quantity}x {item.name}</span>
                                                                            <ItemCustomizations selectedOptions={item.selectedOptions} selectedAddons={item.selectedAddons} />
                                                                        </div>
                                                                        <span className="text-slate-400 font-bold flex-shrink-0">{(item.price * item.quantity).toFixed(0)} MAD</span>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {/* Actions per order */}
                                                            {!isCallWaiter && !isRequestBill && order.status !== 'PAID' && order.status !== 'CANCELED' && (
                                                                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/50">
                                                                    <Button
                                                                        size="sm"
                                                                        variant={order.status === 'PREPARING' ? 'default' : 'outline'}
                                                                        onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                                                                        className="h-8 text-[10px] font-bold rounded-lg"
                                                                    >
                                                                        Cook
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant={order.status === 'READY' ? 'default' : 'outline'}
                                                                        onClick={() => handleUpdateStatus(order.id, 'READY')}
                                                                        className="h-8 text-[10px] font-bold rounded-lg"
                                                                    >
                                                                        Ready
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant={order.status === 'SERVED' ? 'default' : 'outline'}
                                                                        onClick={() => handleUpdateStatus(order.id, 'SERVED')}
                                                                        className="h-8 text-[10px] font-bold rounded-lg"
                                                                    >
                                                                        Serve
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant={order.status === 'PAID' ? 'default' : 'outline'}
                                                                        onClick={() => handleUpdateStatus(order.id, 'PAID')}
                                                                        className="h-8 text-[10px] font-bold rounded-lg"
                                                                    >
                                                                        Settle
                                                                    </Button>
                                                                </div>
                                                            )}

                                                            {(isCallWaiter || isRequestBill) && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                                                                    className="w-full h-8 text-[10px] font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                                                                >
                                                                    Dismiss Alert
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {/* Settle Entire Table */}
                                            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                                <div className="text-center sm:text-left">
                                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Accumulated Total</span>
                                                    <span className="text-3xl font-black text-blue-600">
                                                        {monitoredTableDetails.orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(0)} MAD
                                                    </span>
                                                </div>

                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <Button
                                                        disabled={loading !== null}
                                                        onClick={() => handleMarkAllPaid(monitoredTableDetails.id)}
                                                        className="flex-1 sm:flex-none h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
                                                    >
                                                        <CheckSquare size={16} /> Settle Table
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setMonitoredTableId(null)}
                                                        className="flex-1 sm:flex-none h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-wider border-slate-200"
                                                    >
                                                        Close
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
