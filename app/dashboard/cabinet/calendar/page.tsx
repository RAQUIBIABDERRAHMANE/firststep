import { getCabinetAppointments } from '@/app/actions/cabinet'
import { getCurrentUser } from '@/app/actions/auth'
import { getMyCabinetWebsite } from '@/app/actions/tenant'
import CabinetCalendarClient from './CabinetCalendarClient'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function CabinetCalendarPage() {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    const website = await getMyCabinetWebsite()

    if (!website) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
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

            <CabinetCalendarClient appointments={appointments ?? []} />
        </div>
    )
}
