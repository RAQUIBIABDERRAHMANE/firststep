import { getCurrentUser } from '@/app/actions/auth'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import RestaurantOnboardingWizard from '@/components/dashboard/restaurant/RestaurantOnboardingWizard'

export default async function RestaurantOnboardingPage({
    params,
}: {
    params: Promise<{ tenantSlug: string }>
}) {
    const { tenantSlug } = await params
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    const tenant = await getWebsiteBySlug(tenantSlug)
    if (!tenant) redirect(`/dashboard`)

    // Check if already configured — redirect if both menu and tables exist
    const [menuCount, tableCount] = await Promise.all([
        prisma.restaurantDish.count({ where: { category: { tenantId: tenant.id } } }),
        prisma.restaurantTable.count({ where: { tenantId: tenant.id } }),
    ])

    if (menuCount > 0 && tableCount > 0) {
        redirect(`/dashboard/restaurant/${tenantSlug}`)
    }

    const currentConfig = tenant.config ? JSON.parse(tenant.config) : {}

    return (
        <>
            {/* Blurred background — show the dashboard behind the wizard */}
            <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-50 via-amber-50 to-white">
                <div className="text-center text-slate-400 text-sm">Chargement du configurateur…</div>
            </div>

            {/* Overlay wizard */}
            <RestaurantOnboardingWizard
                tenantSlug={tenantSlug}
                siteName={tenant.siteName}
                currentConfig={currentConfig}
                currentDesign={tenant.designTemplate}
                currentColor={tenant.primaryColor}
            />
        </>
    )
}
