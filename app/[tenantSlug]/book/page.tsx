import { getTenantBySlug } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import BookingFlow from '@/components/tenant/cabinet/BookingFlow'
import { getCurrentUser } from '@/app/actions/auth'

interface Props {
    params: Promise<{ tenantSlug: string }>
    searchParams: Promise<{ service?: string }>
}

export default async function BookingPage({ params, searchParams }: Props) {
    const { tenantSlug } = await params
    const { service: initialServiceId } = await searchParams

    const tenant = await getTenantBySlug(tenantSlug)

    if (!tenant || !tenant.isActive || tenant.service?.slug !== 'cabinet-system') {
        // If not a cabinet tenant or doesn't exist, show not found
        // unless you want to support booking for other types later
        if (tenant?.service?.slug !== 'cabinet-system') {
            // For now we only support Cabinet booking flow
            notFound()
        }
        notFound()
    }

    const services = (tenant as any).cabinetServices || []
    const user = await getCurrentUser()

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900">{tenant.siteName}</h1>
                    <p className="text-slate-600 mt-2">Book your appointment in just a few steps</p>
                </div>

                <BookingFlow
                    tenantId={tenant.id}
                    services={services}
                    initialServiceId={initialServiceId}
                    primaryColor={tenant.primaryColor}
                />
            </div>
        </div>
    )
}
