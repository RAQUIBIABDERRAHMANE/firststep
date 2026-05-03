import { getWebsiteBySlug } from '@/app/actions/tenant'
import { redirect } from 'next/navigation'
import ReservationsClient from './reservations-client'
import { getReservations } from '@/app/actions/reservations'

export default async function ReservationsPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const tenant = await getWebsiteBySlug(tenantSlug)

    if (!tenant) {
        redirect('/dashboard')
    }

    const { reservations } = await getReservations(tenantSlug)

    return <ReservationsClient tenantSlug={tenantSlug} initialReservations={reservations || []} />
}
