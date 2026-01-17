import { getWebsiteBySlug } from '@/app/actions/tenant'
import DesignSelectionClient from './client'
import { redirect } from 'next/navigation'

export default async function DesignPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const tenant = await getWebsiteBySlug(tenantSlug)

    if (!tenant) {
        redirect('/dashboard')
    }

    return <DesignSelectionClient initialData={tenant} />
}
