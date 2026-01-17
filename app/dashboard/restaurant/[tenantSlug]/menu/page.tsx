'use server'

import { getCategories } from '@/app/actions/restaurant'
import MenuClient from './MenuClient'

export default async function MenuManagementPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const categories = await getCategories(tenantSlug)

    return (
        <MenuClient initialCategories={categories} tenantSlug={tenantSlug} />
    )
}
