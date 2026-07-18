import { getOrdersForKDS } from '@/app/actions/restaurant'
import KDSBoard from '@/components/dashboard/restaurant/kds/KDSBoard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function KdsPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const initialOrders = await getOrdersForKDS(tenantSlug) as any[]

    return <KDSBoard tenantSlug={tenantSlug} initialOrders={initialOrders} />
}
