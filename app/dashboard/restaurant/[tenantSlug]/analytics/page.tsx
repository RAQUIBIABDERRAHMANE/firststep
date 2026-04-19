import { getCurrentUser } from '@/app/actions/auth'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import { redirect } from 'next/navigation'
import AnalyticsClient from './AnalyticsClient'

export default async function AnalyticsPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const user = await getCurrentUser()
    if (!user) redirect('/auth/login')

    const tenant = await getWebsiteBySlug(tenantSlug)
    if (!tenant) redirect('/dashboard/restaurant')

    return <AnalyticsClient tenantSlug={tenantSlug} />
}
