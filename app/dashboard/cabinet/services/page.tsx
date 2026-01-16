import { getCabinetServices } from '@/app/actions/cabinet'
import { getCurrentUser } from '@/app/actions/auth'
import { getMyCabinetWebsite } from '@/app/actions/tenant'
import CabinetServicesClient from './CabinetServicesClient'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function CabinetServicesPage() {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    // Get user's Cabinet website
    const website = await getMyCabinetWebsite()

    if (!website) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Services</h2>
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

    const result = await getCabinetServices(website.id)
    const services = result.success ? result.services : []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Services</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your professional services and pricing
                    </p>
                </div>
            </div>

            <CabinetServicesClient services={services ?? []} tenantId={website.id} />
        </div>
    )
}
