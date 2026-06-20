import { getMedicalRecords } from '@/app/actions/medical'
import { getCabinetClients } from '@/app/actions/cabinet'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import MedicalClient from './MedicalClient'

export default async function MedicalPage({ params }: { params: { tenantSlug: string } }) {
    const { tenantSlug } = await params
    const website = await getWebsiteBySlug(tenantSlug)

    if (!website) {
        return (
            <div className="p-8 border rounded-lg text-center">
                <p className="text-slate-500">Cabinet introuvable.</p>
                <Link href="/dashboard"><Button className="mt-4">Retour</Button></Link>
            </div>
        )
    }

    const [clientsResult, recordsResult] = await Promise.all([
        getCabinetClients(website.id),
        getMedicalRecords(website.id)
    ])

    return <MedicalClient
        clients={clientsResult.success ? clientsResult.clients ?? [] : []}
        records={recordsResult.success ? recordsResult.records ?? [] : []}
        tenantId={website.id}
        tenantSlug={tenantSlug}
    />
}
