import { getWebsiteBySlug } from '@/app/actions/tenant'
import { getCurrentUser } from '@/app/actions/auth'
import WebsiteForm from '@/components/dashboard/WebsiteForm'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { redirect } from 'next/navigation'

export default async function CabinetSettingsPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    const website = await getWebsiteBySlug(tenantSlug)

    // Get service ID for cabinet system (flexible lookup)
    const service = await prisma.service.findFirst({
        where: {
            OR: [
                { slug: 'cabinet-system' },
                { category: 'professional-services' },
                { slug: { contains: 'cabinet' } }
            ]
        }
    })

    if (!service) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-600">Error</h1>
                <p>Cabinet service not found in the database.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Cabinet Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Configure your professional presence and public booking link.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Professional Website</CardTitle>
                    <CardDescription>
                        Configuration for your professional booking link at {website ? `firststepco.com/${website.slug}` : '...'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <WebsiteForm
                        key={`${website?.id || 'new'}-${website?.updatedAt || '0'}`}
                        initialData={website}
                        serviceId={service.id}
                        serviceName={service.name}
                        userEmail={user.email}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
