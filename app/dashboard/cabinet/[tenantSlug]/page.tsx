import { getWebsiteBySlug } from '@/app/actions/tenant'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import AutoRefresh from '@/components/dashboard/AutoRefresh'

export default async function CabinetDashboardPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const website = await getWebsiteBySlug(tenantSlug)
    if (!website) return <div>No website found</div>

    const publicUrl = `/${website.slug}`
    const bookingUrl = `/${website.slug}/book`

    return (
        <div className="space-y-6">
            <AutoRefresh />
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome to Cabinet Management</h2>
                    <p className="text-muted-foreground mt-2">
                        Get started by managing your services, clients, and appointments
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href={publicUrl} target="_blank">
                        <Button variant="outline" className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            View Website
                        </Button>
                    </Link>
                    <Link href={bookingUrl} target="_blank">
                        <Button className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Booking Page
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Link
                    href={`/dashboard/cabinet/${tenantSlug}/services`}
                    className="group p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all"
                >
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        Services
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your professional services, pricing, and duration
                    </p>
                </Link>
                <Link
                    href={`/dashboard/cabinet/${tenantSlug}/clients`}
                    className="group p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all"
                >
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        Clients
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        View and manage your client records and history
                    </p>
                </Link>
                <Link
                    href={`/dashboard/cabinet/${tenantSlug}/calendar`}
                    className="group p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all"
                >
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        Calendar
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        View upcoming appointments and manage schedules
                    </p>
                </Link>
            </div>
        </div>
    )
}
