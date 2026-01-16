import { getMyWebsite } from '@/app/actions/tenant'
import { getCurrentUser } from '@/app/actions/auth'
import WebsiteForm from '@/components/dashboard/WebsiteForm'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { redirect } from 'next/navigation'

export default async function WebsiteManagementPage() {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    const website = await getMyWebsite()

    // Get service ID for restaurant website
    const service = await prisma.service.findUnique({
        where: { slug: 'restaurant-website' }
    })

    // Verify user has this service
    const hasService = await prisma.userService.findUnique({
        where: {
            userId_serviceId: {
                userId: user.id,
                serviceId: service?.id || ''
            }
        }
    })

    if (!service || !hasService) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p>You do not have access to the Restaurant Website service.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Website Management</h1>
                <p className="text-muted-foreground mt-1">
                    Configure your public restaurant website.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                        Basic configuration for your website at {website ? `firststepco.com/${website.slug}` : '...'}
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
