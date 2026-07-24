'use server'

import { getTables, getSpaces } from '@/app/actions/restaurant'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import TablesClient from './TablesClient'
import Link from 'next/link'
import { ChevronLeft, MapPin } from 'lucide-react'

export default async function TableManagementPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const tenant = await getWebsiteBySlug(tenantSlug)
    if (!tenant) return <div>No tenant found</div>

    const tables = await getTables(tenantSlug)
    const spacesRes = await getSpaces(tenantSlug)
    const spaces = spacesRes.success && spacesRes.spaces ? spacesRes.spaces : []

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href={`/dashboard/restaurant/${tenantSlug}`} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Back to Hub
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <MapPin className="text-blue-600" /> Table & Floor Plan Management
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage multi-space 2D floor plans, track live table statuses, and generate QR codes for secure ordering.
                    </p>
                </div>
            </div>

            <TablesClient
                initialTables={tables}
                initialSpaces={spaces}
                tenantSlug={tenantSlug}
                initialConfig={tenant.config}
            />
        </div>
    )
}
