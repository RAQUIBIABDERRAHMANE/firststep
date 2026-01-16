import { getMyCabinetWebsite } from '@/app/actions/tenant'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function CabinetDashboardPage() {
    const website = await getMyCabinetWebsite()
    const publicUrl = website ? `/${website.slug}` : null
    const bookingUrl = website ? `/${website.slug}/book` : null

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Welcome to Cabinet Management</h2>
                    <p className="text-muted-foreground mt-2">
                        Get started by managing your services, clients, and appointments
                    </p>
                </div>
                <div className="flex gap-2">
                    {publicUrl ? (
                        <>
                            <Link href={publicUrl} target="_blank">
                                <Button variant="outline" className="gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    View Website
                                </Button>
                            </Link>
                            <Link href={bookingUrl!} target="_blank">
                                <Button className="gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Booking Page
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Link href="/dashboard/cabinet/settings">
                            <Button className="gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Setup Website
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <a
                    href="/dashboard/cabinet/services"
                    className="group p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all"
                >
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        Services
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your professional services, pricing, and duration
                    </p>
                </a>
                <a
                    href="/dashboard/cabinet/clients"
                    className="group p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all"
                >
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        Clients
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        View and manage your client records and history
                    </p>
                </a>
                <a
                    href="/dashboard/cabinet/calendar"
                    className="group p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all"
                >
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        Calendar
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        View upcoming appointments and manage schedules
                    </p>
                </a>
            </div>
        </div>
    )
}
