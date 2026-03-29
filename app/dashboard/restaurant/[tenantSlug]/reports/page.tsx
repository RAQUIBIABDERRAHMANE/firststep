import { getCurrentUser } from '@/app/actions/auth'
import { getReports } from '@/app/actions/restaurant'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import ReportsClient from './ReportsClient'
import { redirect } from 'next/navigation'

export default async function ReportsPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const user = await getCurrentUser()
    if (!user) redirect('/auth/login')

    const tenant = await getWebsiteBySlug(tenantSlug)
    if (!tenant) redirect(`/dashboard/restaurant`)

    const reports = await getReports(tenantSlug)

    return (
        <ReportsClient
            initialReports={reports}
            tenantSlug={tenantSlug}
            restaurantName={tenant.siteName}
            userEmail={user.email}
        />
    )
}
