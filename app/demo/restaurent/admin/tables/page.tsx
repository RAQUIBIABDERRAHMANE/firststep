import TablesClient from '@/app/dashboard/restaurant/[tenantSlug]/tables/TablesClient'
import Link from 'next/link'
import { ChevronLeft, MapPin } from 'lucide-react'

export const metadata = { title: 'FirstStep - Admin Resto Tables' }

export default function TablesDemoPage() {
    const mockTables = [
        { id: 't1', number: '1', capacity: 2, isActive: true },
        { id: 't2', number: '2', capacity: 4, isActive: true },
        { id: 't3', number: 'Terrasse-1', capacity: 6, isActive: true },
        { id: 't4', number: '12', capacity: 2, isActive: false },
    ]

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/demo/restaurent/admin" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Retour à l'accueil
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <MapPin className="text-indigo-600" /> Gestion des Tables (Démo)
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Créez vos tables virtuelles et générez des QR codes individuels sécurisés pour faciliter la prise de commande.
                    </p>
                </div>
            </div>

            <TablesClient initialTables={mockTables} tenantSlug="demo-resto" />
        </div>
    )
}
