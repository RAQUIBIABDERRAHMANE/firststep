'use server'

import { getTables } from '@/app/actions/restaurant'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import TablesClient from './TablesClient'
import Link from 'next/link'
import { ChevronLeft, MapPin } from 'lucide-react'

export default async function TableManagementPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const tenant = await getWebsiteBySlug(tenantSlug)
    if (!tenant) return <div>No tenant found</div>

    const tables = await getTables(tenantSlug)

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href={`/dashboard/restaurant/${tenantSlug}`} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Back to Hub
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <MapPin className="text-blue-600" /> Table Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your physical tables and generate unique QR codes for secure ordering.
                    </p>
                </div>
            </div>

            <TablesClient
                initialTables={tables}
                tenantSlug={tenantSlug}
            />
        </div>
    )
}
