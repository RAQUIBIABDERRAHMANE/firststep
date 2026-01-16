import { getCabinetClients } from '@/app/actions/cabinet'
import { getCurrentUser } from '@/app/actions/auth'
import { getMyCabinetWebsite } from '@/app/actions/tenant'
import CabinetClientsClient from './CabinetClientsClient'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function CabinetClientsPage() {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    const website = await getMyCabinetWebsite()

    if (!website) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
                        <p className="text-sm text-muted-foreground">
                            You need to set up your Cabinet website first
                        </p>
                    </div>
                </div>
                <div className="p-8 border rounded-lg text-center flex flex-col items-center gap-4">
                    <p className="text-muted-foreground">Please configure your Cabinet website in the settings first.</p>
                    <Link href="/dashboard/cabinet/settings">
                        <Button>Go to Settings</Button>
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

            <CabinetClientsClient clients={clients ?? []} tenantId={website.id} />
        </div>
    )
}
