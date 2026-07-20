import { getTenantBySlug } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import RestaurantTemplate from '@/components/tenant/restaurant/RestaurantTemplate'
import CabinetTemplate from '@/components/tenant/cabinet/CabinetTemplate'
import ServiceDownPage from '@/components/tenant/ServiceDownPage'
import { getCurrentUser } from '@/app/actions/auth'

interface Props {
    params: Promise<{ tenantSlug: string }>
}

export default async function TenantPage({ params }: Props) {
    const { tenantSlug } = await params
    const tenant = await getTenantBySlug(tenantSlug)

    // Site inexistant
    if (!tenant) {
        return <ServiceDownPage />
    }

    // Site désactivé ou service supprimé par l'admin
    if (!tenant.isActive || (tenant as any).serviceDisabled) {
        return <ServiceDownPage />
    }

    // Parse config safely
    let config = {}
    try {
        const rawConfig = JSON.parse(tenant.config)
        const template = tenant.designTemplate || 'classic'
        const templateSpecificConfig = rawConfig.templatesConfigs?.[template] || {}
        config = {
            ...rawConfig,
            ...templateSpecificConfig
        }
        console.log('[TenantPage Debug] Template:', template)
        console.log('[TenantPage Debug] Raw Config Keys:', Object.keys(rawConfig))
        console.log('[TenantPage Debug] Template Specific Config:', templateSpecificConfig)
        console.log('[TenantPage Debug] Merged Config BackgroundColor:', (config as any).backgroundColor)
    } catch (e) {
        console.error('Failed to parse tenant config', e)
    }

    const user = await getCurrentUser()
    const isOwner = user?.id === tenant.userId

    // Route based on service type
    const serviceSlug = tenant.service?.slug || ''

    if (serviceSlug === 'custom-website') {
        notFound()
    }

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
                primaryColor={(config as any).primaryColor || tenant.primaryColor}
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
            primaryColor={(config as any).primaryColor || tenant.primaryColor}
        />
    )
}

