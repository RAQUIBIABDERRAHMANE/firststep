'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
    ClipboardList,
    Clock,
    MapPin,
    CheckCircle2,
    ChefHat,
    Timer,
    AlertCircle,
    MoreVertical,
    Check
} from 'lucide-react'
import { updateOrderStatus } from '@/app/actions/restaurant'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)

    // Polling for new orders (simplified real-time)
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, 10000) // Poll every 10s
        return () => clearInterval(interval)
    }, [router])

    const handleUpdateStatus = async (orderId: string, status: string) => {
        setLoading(orderId)
        await updateOrderStatus(orderId, status)
        setLoading(null)
        router.refresh()
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200'
            case 'PREPARING': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'READY': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
            case 'PAID': return 'bg-slate-100 text-slate-700 border-slate-200'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <AlertCircle size={14} />
            case 'PREPARING': return <ChefHat size={14} />
            case 'READY': return <CheckCircle2 size={14} />
            default: return <Check size={14} />
        }
    }

    return (
        <div className="space-y-8">
            {initialOrders.length === 0 ? (
                <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center">
                    <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-sm mb-8">
                        <ClipboardList size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No active orders</h3>
                    <p className="text-slate-500 max-w-sm leading-relaxed">Incoming orders from your tables will appear here in real-time.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {initialOrders.map((order) => (
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
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-6">
                                    <div className="divide-y divide-slate-100">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="py-4 flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center font-black text-xs text-slate-600">
                                                        {item.quantity}x
                                                    </span>
                                                    <span className="font-bold text-slate-900">{item.name}</span>
                                                </div>
                                                <span className="text-sm font-black text-slate-400">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Total Amount</span>
                                        <span className="text-3xl font-black tracking-tighter text-blue-600">${order.totalAmount.toFixed(2)}</span>
                                    </div>

                                    <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
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
                                            Served
                                        </Button>
                                        <Button
                                            variant={order.status === 'PAID' ? 'default' : 'outline'}
                                            className="rounded-2xl h-14 font-black text-xs uppercase tracking-widest shadow-none"
                                            disabled={loading === order.id}
                                            onClick={() => handleUpdateStatus(order.id, 'PAID')}
                                        >
                                            Paid
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
