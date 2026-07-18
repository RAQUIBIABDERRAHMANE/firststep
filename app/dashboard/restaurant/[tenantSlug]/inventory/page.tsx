import { getInventory } from '@/app/actions/restaurant'
import InventoryClient from './InventoryClient'

export const dynamic = 'force-dynamic'

export default async function InventoryPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const ingredients = await getInventory(tenantSlug) as any[]

    return (
        <div className="p-6">
            <InventoryClient tenantSlug={tenantSlug} initialIngredients={ingredients} />
        </div>
    )
}
