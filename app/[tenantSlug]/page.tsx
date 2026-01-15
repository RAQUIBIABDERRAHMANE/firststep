import { getTenantBySlug } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import RestaurantTemplate from '@/components/tenant/restaurant/RestaurantTemplate'
import { getCurrentUser } from '@/app/actions/auth'

interface Props {
    params: Promise<{ tenantSlug: string }>
}

export default async function TenantPage({ params }: Props) {
    const { tenantSlug } = await params
    const tenant = await getTenantBySlug(tenantSlug)

    if (!tenant || !tenant.isActive) {
        notFound()
    }

    // Parse config safely
    let config = {}
    try {
        config = JSON.parse(tenant.config)
    } catch (e) {
        console.error('Failed to parse tenant config', e)
    }

    // Determine template based on service type
    // For now we assume Restaurant Website if service slug matches
    // or default to restaurant template as it's the only one

    // You might want to check tenant.service.slug here

    const user = await getCurrentUser()
    const isOwner = user?.id === tenant.userId

    return (
        <RestaurantTemplate
            siteName={tenant.siteName}
            description={tenant.description}
            coverImage={tenant.coverImage}
            logo={tenant.logo}
            config={config}
            categories={(tenant as any).categories || []}
            isOwner={isOwner}
            designTemplate={(tenant as any).designTemplate || 'classic'}
            primaryColor={(tenant as any).primaryColor}
        />
    )
}
