import { getCabinetAppointments } from '@/app/actions/cabinet'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import CabinetCalendarClient from './CabinetCalendarClient'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function CabinetCalendarPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const website = await getWebsiteBySlug(tenantSlug)

    if (!website) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Calendar</h2>
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

    // Get appointments for the current year
    const now = new Date()
    const startDate = new Date(now.getFullYear(), 0, 1)
    const endDate = new Date(now.getFullYear(), 11, 31)

    const result = await getCabinetAppointments(website.id, {
        startDate,
        endDate,
    })
    const appointments = result.success ? result.appointments : []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
                    <p className="text-sm text-muted-foreground">
                        View and manage your appointments
                    </p>
                </div>
            </div>

            <CabinetCalendarClient appointments={appointments ?? []} tenantSlug={tenantSlug} />
        </div>
    )
}
