import { redirect } from 'next/navigation'

export default async function CabinetSystemRedirect({ 
    params 
}: { 
    params: Promise<{ tenantSlug: string; path?: string[] }> 
}) {
    const { tenantSlug, path } = await params
    const pathString = path && path.length > 0 ? `/${path.join('/')}` : ''
    redirect(`/dashboard/cabinet/${tenantSlug}${pathString}`)
}
