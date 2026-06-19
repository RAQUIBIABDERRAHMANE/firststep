import { getCurrentUser } from '@/app/actions/auth'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import RestaurantSubNav from '@/components/dashboard/RestaurantSubNav'

export default async function RestaurantLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ tenantSlug: string }>
}) {
    const { tenantSlug } = await params
    const user = await getCurrentUser()
    if (!user) return null

    const tenant = await getWebsiteBySlug(tenantSlug)

    return (
        <div className="-mt-6 -mx-4 sm:-mx-6 lg:-mx-8 flex flex-col min-h-full min-w-0">
            {/* Tab bar — sits flush, outside the content padding */}
            <RestaurantSubNav
                tenantSlug={tenantSlug}
                siteName={tenant?.siteName ?? 'Restaurant'}
            />

            <div className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto">
                {children}
            </div>
        </div>
    )
}
