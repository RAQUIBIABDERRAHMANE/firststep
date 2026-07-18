import CombosClient from './CombosClient'

export default async function CombosPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    return (
        <div className="p-6">
            <CombosClient tenantSlug={tenantSlug} />
        </div>
    )
}
