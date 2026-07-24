'use server'

import { getWaiters } from '@/app/actions/waiter'
import { getTables, getSpaces } from '@/app/actions/restaurant'
import WaitersClient from './WaitersClient'
import { Plus, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function WaitersPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    // Fetch data in parallel
    const [waiters, tables, spacesRes] = await Promise.all([
        getWaiters(tenantSlug),
        getTables(tenantSlug),
        getSpaces(tenantSlug)
    ])

    const spaces = ('spaces' in spacesRes && Array.isArray(spacesRes.spaces)) ? spacesRes.spaces : []

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href={`/dashboard/restaurant/${tenantSlug}`} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Back to Hub
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Waiter Management</h1>
                    <p className="text-slate-500 mt-1">
                        Create staff accounts and assign tables to them.
                    </p>
                </div>
            </div>

            <WaitersClient initialWaiters={waiters} initialTables={tables} initialSpaces={spaces} tenantSlug={tenantSlug} />
        </div>
    )
}
