'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
    ClipboardList,
    Clock,
    Volume2,
    VolumeX,
    Bell,
    Receipt
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

        playTone(1046.50, ctx.currentTime, 0.4);
        playTone(1318.51, ctx.currentTime + 0.15, 0.6);
    } catch (e) {
        console.error("Audio play failed", e);
    }
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
    onOrderUpdate,
    allowedTableIds,
}: { 
    initialOrders: any[]
    tenantSlug: string
    initialConfig?: string 
    onOrderUpdate?: () => void | Promise<void>
    allowedTableIds?: string[]
    hideFloorPlanTab?: boolean
}) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
    const [isSoundEnabled, setIsSoundEnabled] = useState(true)
    const previousOrderIds = React.useRef<Set<string>>(new Set())
    const [dismissedOrders, setDismissedOrders] = useState<Set<string>>(new Set())

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
            if (typeof window !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([300, 100, 300]);
            }
        }
        
        previousOrderIds.current = currentIds;
    }, [initialOrders, isSoundEnabled])

    // Polling for new orders every 8s
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
            setLastUpdated(new Date())
        }, 8000)
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

    const displayOrders = allowedTableIds 
        ? initialOrders.filter(o => allowedTableIds.includes(o.tableId)) 
        : initialOrders

    return (
        <div className="space-y-8">
            {/* Header Toolbar: Sync Status & Sound Toggle */}
            <div className="flex items-center justify-between gap-4">
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

            {/* List View of Active Orders */}
            {displayOrders.length === 0 ? (
                <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center animate-in fade-in duration-500">
                    <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-sm mb-8">
                        <ClipboardList size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No active orders</h3>
                    <p className="text-slate-500 max-w-sm leading-relaxed">Incoming orders from your tables will appear here in real-time.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
                    {displayOrders.map((order) => {
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
                                <CardHeader className="bg-slate-50/50 py-4 px-5 sm:py-6 sm:px-8 flex flex-row items-center justify-between border-b border-slate-100">
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
                                <CardContent className="p-5 sm:p-8">
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
                                            <div className="pt-6 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                                                <Button
                                                    variant={order.status === 'PREPARING' ? 'default' : 'outline'}
                                                    className="rounded-2xl h-11 sm:h-14 font-black text-xs uppercase tracking-widest shadow-none"
                                                    disabled={loading === order.id}
                                                    onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                                                >
                                                    Cook
                                                </Button>
                                                <Button
                                                    variant={order.status === 'READY' ? 'default' : 'outline'}
                                                    className="rounded-2xl h-11 sm:h-14 font-black text-xs uppercase tracking-widest shadow-none"
                                                    disabled={loading === order.id}
                                                    onClick={() => handleUpdateStatus(order.id, 'READY')}
                                                >
                                                    Ready
                                                </Button>
                                                <Button
                                                    variant={order.status === 'SERVED' ? 'default' : 'outline'}
                                                    className="rounded-2xl h-11 sm:h-14 font-black text-xs uppercase tracking-widest shadow-none"
                                                    disabled={loading === order.id}
                                                    onClick={() => handleUpdateStatus(order.id, 'SERVED')}
                                                >
                                                    Serve
                                                </Button>
                                                <Button
                                                    variant={order.status === 'PAID' ? 'default' : 'outline'}
                                                    className="rounded-2xl h-11 sm:h-14 font-black text-xs uppercase tracking-widest shadow-none"
                                                    disabled={loading === order.id}
                                                    onClick={() => handleUpdateStatus(order.id, 'PAID')}
                                                >
                                                    Settle
                                                </Button>
                                                <Button
                                                    variant={order.status === 'CANCELED' ? 'destructive' : 'outline'}
                                                    className={cn(
                                                        "rounded-2xl h-11 sm:h-14 font-black text-xs uppercase tracking-widest shadow-none",
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
        </div>
    )
}
