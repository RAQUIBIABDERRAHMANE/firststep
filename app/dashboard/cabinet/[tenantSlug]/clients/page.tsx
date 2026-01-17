import { getCabinetClients } from '@/app/actions/cabinet'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import CabinetClientsClient from './CabinetClientsClient'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function CabinetClientsPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const website = await getWebsiteBySlug(tenantSlug)

    if (!website) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Clients</h2>
                        <p className="text-sm text-muted-foreground">
                            Website instance not found
                        </p>
                    </div>
                </div>
                <div className="p-8 border rounded-lg text-center flex flex-col items-center gap-4">
                    <p className="text-muted-foreground">The requested cabinet instance was not found.</p>
                    <Link href="/dashboard">
                        <Button>Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const result = await getCabinetClients(website.id)
    const clients = result.success ? result.clients : []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your client records and appointment history
                    </p>
                </div>
            </div>

            <CabinetClientsClient clients={clients ?? []} tenantId={website.id} tenantSlug={tenantSlug} />
        </div>
    )
}
