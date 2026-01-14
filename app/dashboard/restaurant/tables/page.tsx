'use server'

import { getTables } from '@/app/actions/restaurant'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'
import TablesClient from '@/app/dashboard/restaurant/tables/TablesClient'
import Link from 'next/link'
import { ChevronLeft, MapPin } from 'lucide-react'

export default async function TableManagementPage() {
    const user = await getCurrentUser()
    if (!user) return null

    const tenant = await prisma.tenantWebsite.findFirst({
        where: { userId: user.id }
    })

    if (!tenant) return <div>No tenant found</div>

    const tables = await getTables()

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard/restaurant" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors">
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
                tenantSlug={tenant.slug}
            />
        </div>
    )
}
