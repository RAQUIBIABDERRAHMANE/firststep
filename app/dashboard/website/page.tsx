import { getMyWebsite } from '@/app/actions/tenant'
import { getCurrentUser } from '@/app/actions/auth'
import WebsiteForm from '@/components/dashboard/WebsiteForm'
import CustomWebsiteForm from '@/components/dashboard/CustomWebsiteForm'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { redirect } from 'next/navigation'

export default async function WebsiteManagementPage({
    searchParams
}: {
    searchParams: Promise<{ type?: string }>
}) {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    const resolvedSearchParams = await searchParams
    const type = resolvedSearchParams.type || 'restaurant'
    
    let serviceSlug = 'restaurant-website'
    if (type === 'cabinet') {
        serviceSlug = 'cabinet-system'
    } else if (type === 'custom-website') {
        serviceSlug = 'custom-website'
    }

    // Get service ID for the requested type
    const service = await prisma.service.findUnique({
        where: { slug: serviceSlug }
    })

    if (!service) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-600">Error</h1>
                <p>Service {serviceSlug} not found.</p>
            </div>
        )
    }

    // Verify user has this service
    const hasService = await prisma.userService.findUnique({
        where: {
            userId_serviceId: {
                userId: user.id,
                serviceId: service.id
            }
        }
    })

    if (!hasService) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p>You do not have access to the {service.name} service.</p>
            </div>
        )
    }

    // Get existing website for THIS specific service
    const website = await prisma.tenantWebsite.findFirst({
        where: {
            userId: user.id,
            serviceId: service.id
        }
    })

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {type === 'custom-website'
                        ? 'Cahier des charges - Site Web Sur Mesure'
                        : type === 'cabinet'
                            ? 'Cabinet Setup'
                            : 'Restaurant Website Setup'}
                </h1>
                <p className="text-slate-500 mt-1 text-lg">
                    {type === 'custom-website'
                        ? 'Remplissez le formulaire ci-dessous pour nous transmettre vos exigences de développement de site web sur mesure.'
                        : type === 'cabinet'
                            ? 'Configure your professional clinic presence.'
                            : 'Configure your public restaurant website.'}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>
                        {website
                            ? `Edit your website settings at /${website.slug}`
                            : 'Set up your website address and basic information.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {type === 'custom-website' ? (
                        <CustomWebsiteForm
                            key={`${website?.id || 'new'}-${website?.updatedAt || '0'}`}
                            initialData={website}
                            serviceId={service.id}
                            serviceName={service.name}
                            userEmail={user.email}
                        />
                    ) : (
                        <WebsiteForm
                            key={`${website?.id || 'new'}-${website?.updatedAt || '0'}`}
                            initialData={website}
                            serviceId={service.id}
                            serviceName={service.name}
                            userEmail={user.email}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
