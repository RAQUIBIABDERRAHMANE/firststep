import { redirect } from 'next/navigation'

export default async function RestaurantWebsiteRedirect({ 
    params 
}: { 
    params: Promise<{ tenantSlug: string; path?: string[] }> 
}) {
    const { tenantSlug, path } = await params
    const pathString = path && path.length > 0 ? `/${path.join('/')}` : ''
    redirect(`/dashboard/restaurant/${tenantSlug}${pathString}`)
}
