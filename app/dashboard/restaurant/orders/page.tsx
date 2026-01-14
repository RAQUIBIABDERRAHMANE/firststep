'use server'

import { getOrders } from '@/app/actions/restaurant'
import OrdersClient from '@/app/dashboard/restaurant/orders/OrdersClient'
import Link from 'next/link'
import { ChevronLeft, ClipboardList } from 'lucide-react'

export default async function OrdersPage() {
    const orders = await getOrders()

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard/restaurant" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Back to Hub
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <ClipboardList className="text-emerald-600" /> Live Orders Monitor
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track and fulfill guest orders in real-time. Stay on top of your kitchen flow.
                    </p>
                </div>
            </div>

            <OrdersClient initialOrders={orders} />
        </div>
    )
}
