'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { getWaiterOrders } from '@/app/actions/waiter'
import { Button } from '@/components/ui/Button'
import { Loader2, LogOut, RefreshCw } from 'lucide-react'
import OrdersClient from '@/app/dashboard/restaurant/orders/OrdersClient'

export default function WaiterDashboard() {
    const router = useRouter()
    const params = useParams()
    const pathname = usePathname()
    const tenantSlug = params.tenantSlug as string

    const [waiterName, setWaiterName] = useState('')
    const [waiterId, setWaiterId] = useState('')
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
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
        }
    }, [params.tenantSlug])

    const fetchOrders = async (id: string) => {
        try {
            const data = await getWaiterOrders(id)
            // @ts-ignore
            setOrders(data)
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
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
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => fetchOrders(waiterId)}>
                        <RefreshCw size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut size={18} />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold mb-4 text-slate-800">My Tables</h2>
                    <OrdersClient initialOrders={orders} />
                </div>
            </div>
        </div>
    )
}
