import { getTenantBySlug } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import RestaurantTemplate from '@/components/tenant/restaurant/RestaurantTemplate'
import CabinetTemplate from '@/components/tenant/cabinet/CabinetTemplate'
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

    const user = await getCurrentUser()
    const isOwner = user?.id === tenant.userId

    // Route based on service type
    const serviceSlug = tenant.service?.slug || ''

    if (serviceSlug.includes('cabinet') || serviceSlug.includes('professional-services')) {
        return (
            <CabinetTemplate
                siteName={tenant.siteName}
                description={tenant.description}
                coverImage={tenant.coverImage}
                logo={tenant.logo}
                config={config}
                services={(tenant as any).cabinetServices || []}
                isOwner={isOwner}
                primaryColor={(tenant as any).primaryColor}
                designTemplate={(tenant as any).designTemplate}
                tenantSlug={tenantSlug}
            />
        )
    }

    // Default to Restaurant template
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

