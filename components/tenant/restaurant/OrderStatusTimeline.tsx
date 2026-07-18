'use client'

import { useEffect, useState } from 'react'
import { Clock, ChefHat, Bell, UtensilsCrossed, CheckCircle2 } from 'lucide-react'

const STEPS = [
    { status: 'PENDING',  label: 'Reçue',           sublabel: 'Votre commande a été reçue', icon: Clock,           emoji: '🕒', color: 'text-slate-300' },
    { status: 'COOKING',  label: 'En préparation',   sublabel: 'Nos cuisiniers s\'affairent', icon: ChefHat,        emoji: '🍳', color: 'text-amber-400' },
    { status: 'READY',    label: 'Prête',             sublabel: 'Votre commande est prête',   icon: Bell,           emoji: '🛎️', color: 'text-emerald-400' },
    { status: 'SERVED',   label: 'Servie',            sublabel: 'Bon appétit !',              icon: UtensilsCrossed, emoji: '🍽️', color: 'text-cyan-400' },
]

const STATUS_INDEX: Record<string, number> = {
    PENDING: 0, COOKING: 1, READY: 2, SERVED: 3, PAID: 3
}

interface OrderStatusTimelineProps {
    orderId: string
    tenantSlug: string
    initialStatus?: string
    onComplete?: () => void
}

export default function OrderStatusTimeline({
    orderId,
    tenantSlug,
    initialStatus = 'PENDING',
    onComplete
}: OrderStatusTimelineProps) {
    const [status, setStatus] = useState(initialStatus)
    const currentIndex = STATUS_INDEX[status] ?? 0

    useEffect(() => {
        const source = new EventSource(
            `/api/tenant/${tenantSlug}/orders/${orderId}/stream`
        )

        source.onmessage = (e) => {
            try {
                const { status: newStatus } = JSON.parse(e.data)
                if (newStatus && newStatus !== 'NOT_FOUND') {
                    setStatus(newStatus)
                    if (['SERVED', 'PAID', 'CANCELED'].includes(newStatus)) {
                        source.close()
                        onComplete?.()
                    }
                }
            } catch {}
        }

        source.onerror = () => source.close()

        return () => source.close()
    }, [orderId, tenantSlug, onComplete])

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 w-full">
            <h3 className="text-sm font-semibold text-white/70 mb-5 text-center tracking-wide uppercase">
                Suivi de commande
            </h3>

            {/* Timeline */}
            <div className="relative flex justify-between items-start">
                {/* Progress bar track */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 z-0" />
                {/* Progress bar fill */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-cyan-500 z-0 transition-all duration-700"
                    style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step, idx) => {
                    const isDone    = idx < currentIndex
                    const isCurrent = idx === currentIndex
                    const Icon = step.icon

                    return (
                        <div key={step.status} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                            {/* Circle */}
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-lg
                                transition-all duration-500
                                ${isDone    ? 'bg-cyan-500 text-white scale-90' : ''}
                                ${isCurrent ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400 scale-110 shadow-lg shadow-cyan-500/20' : ''}
                                ${!isDone && !isCurrent ? 'bg-white/10 text-white/30' : ''}
                            `}>
                                {isDone ? <CheckCircle2 size={18} /> : <span className="text-lg">{step.emoji}</span>}
                            </div>

                            {/* Label */}
                            <div className="text-center">
                                <p className={`text-xs font-semibold ${isCurrent ? 'text-white' : isDone ? 'text-white/60' : 'text-white/30'}`}>
                                    {step.label}
                                </p>
                                {isCurrent && (
                                    <p className="text-xs text-white/50 mt-0.5 max-w-[80px] text-center leading-tight">
                                        {step.sublabel}
                                    </p>
                                )}
                            </div>

                            {/* Pulsing ring for current step */}
                            {isCurrent && (
                                <span className="absolute top-0 w-10 h-10 rounded-full border-2 border-cyan-400 animate-ping opacity-40 pointer-events-none" />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
