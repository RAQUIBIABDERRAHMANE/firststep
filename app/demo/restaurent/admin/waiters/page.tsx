import WaitersClient from '@/app/dashboard/restaurant/[tenantSlug]/waiters/WaitersClient'
import Link from 'next/link'
import { ChevronLeft, Users } from 'lucide-react'

export const metadata = { title: 'FirstStep - Admin Resto Serveurs' }

export default function WaitersDemoPage() {
    const mockWaiters = [
        { id: 'w1', name: 'Karim', pin: '1234', isActive: true, tables: [] },
        { id: 'w2', name: 'Sara', pin: '5678', isActive: true, tables: [] }
    ]

    const mockTables = [
        { id: 't1', number: '1', capacity: 2, isActive: true },
        { id: 't2', number: '2', capacity: 4, isActive: true }
    ]

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/demo/restaurent/admin" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Retour à l'accueil
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Users className="text-indigo-600" /> Gestion de l'Équipe (Démo)
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Créez des accès PIN pour vos serveurs et assignez-leur des tables.
                    </p>
                </div>
            </div>

            <WaitersClient initialWaiters={mockWaiters} initialTables={mockTables} tenantSlug="demo-resto" />
        </div>
    )
}
