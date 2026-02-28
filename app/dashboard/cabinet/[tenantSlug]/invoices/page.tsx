import { getInvoices, getInvoiceSettings } from '@/app/actions/invoices'
import { getCabinetClients } from '@/app/actions/cabinet'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import InvoicesClient from './InvoicesClient'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function InvoicesPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const website = await getWebsiteBySlug(tenantSlug)

    if (!website) {
        return (
            <div className="p-8 border rounded-lg text-center">
                <p className="text-muted-foreground">Cabinet introuvable.</p>
                <Link href="/dashboard"><Button className="mt-4">Retour</Button></Link>
            </div>
        )
    }

    const [invoicesResult, clientsResult, settingsResult] = await Promise.all([
        getInvoices(website.id),
        getCabinetClients(website.id),
        getInvoiceSettings(website.id),
    ])

    return (
        <InvoicesClient
            invoices={invoicesResult.success ? invoicesResult.invoices ?? [] : []}
            clients={clientsResult.success ? clientsResult.clients ?? [] : []}
            settings={settingsResult.success ? settingsResult.settings : null}
            tenantId={website.id}
            tenantSlug={tenantSlug}
        />
    )
}
