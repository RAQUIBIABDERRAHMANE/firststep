import { getClientMedicalProfile } from '@/app/actions/medical'
import { getCabinetClients } from '@/app/actions/cabinet'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import { notFound } from 'next/navigation'
import PatientProfileClient from './PatientProfileClient'

export default async function PatientProfilePage({ params }: { params: { tenantSlug: string; clientId: string } }) {
    const { tenantSlug, clientId } = await params
    const website = await getWebsiteBySlug(tenantSlug)
    if (!website) notFound()

    const [profileResult, clientsResult] = await Promise.all([
        getClientMedicalProfile(clientId, website.id),
        getCabinetClients(website.id)
    ])

    const client = clientsResult.success ? (clientsResult.clients ?? []).find((c: { id: string }) => c.id === clientId) : null
    if (!client) notFound()

    const profile = profileResult.success
        ? { records: profileResult.records ?? [], history: profileResult.history ?? [] }
        : { records: [], history: [] }

    return <PatientProfileClient client={client} profile={profile} tenantSlug={tenantSlug} />
}
