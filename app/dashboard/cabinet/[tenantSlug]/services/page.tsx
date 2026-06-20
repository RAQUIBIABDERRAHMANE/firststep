import { getCabinetServices } from '@/app/actions/cabinet'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import CabinetServicesClient from './CabinetServicesClient'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function CabinetServicesPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const website = await getWebsiteBySlug(tenantSlug)

    if (!website) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Services</h2>
                        <p className="text-sm text-slate-500">
                            Website instance not found
                        </p>
                    </div>
                </div>
                <div className="p-8 border rounded-lg text-center flex flex-col items-center gap-4">
                    <p className="text-slate-500">The requested cabinet instance was not found.</p>
                    <Link href="/dashboard">
                        <Button>Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const result = await getCabinetServices(website.id)
    const services = result.success ? result.services : []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Services</h2>
                    <p className="text-sm text-slate-500">
                        Manage your professional services and pricing
                    </p>
                </div>
            </div>

            <CabinetServicesClient services={services ?? []} tenantId={website.id} tenantSlug={tenantSlug} />
        </div>
    )
}
