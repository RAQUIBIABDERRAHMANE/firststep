import OrdersClient from '@/app/dashboard/restaurant/[tenantSlug]/orders/OrdersClient'
import Link from 'next/link'
import { ChevronLeft, ClipboardList } from 'lucide-react'

export const metadata = { title: 'FirstStep - Admin Resto Commandes' }

export default function OrdersDemoPage() {
    const mockOrders = [
        {
            id: 'ord_1',
            table: { number: '4' },
            createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
            status: 'PENDING',
            totalAmount: 140,
            items: [{ id: 'i1', name: 'Planche de Charcuteries', quantity: 1, price: 140 }]
        },
        {
            id: 'ord_2',
            table: { number: '12' },
            createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
            status: 'PREPARING',
            totalAmount: 250,
            items: [
                { id: 'i2', name: 'Saumon Teriyaki', quantity: 1, price: 150 },
                { id: 'i3', name: 'Mojito Passion', quantity: 2, price: 50 },
            ]
        }
    ]

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/demo/restaurent/admin" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Retour à l'accueil
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <ClipboardList className="text-emerald-600" /> Moniteur des commandes (Démo)
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Cette interface interactive simule la réception des commandes en direct de vos tables.
                    </p>
                </div>
            </div>

            <OrdersClient initialOrders={mockOrders} tenantSlug="demo-resto" />
        </div>
    )
}
