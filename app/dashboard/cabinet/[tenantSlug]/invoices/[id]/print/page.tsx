import { getInvoice, getInvoiceSettings } from '@/app/actions/invoices'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import { notFound } from 'next/navigation'
import PrintInvoiceClient from './PrintInvoiceClient'

export default async function PrintInvoicePage({ params }: { params: { tenantSlug: string; id: string } }) {
    const { tenantSlug, id } = await params
    const website = await getWebsiteBySlug(tenantSlug)
    if (!website) notFound()

    const [invoiceResult, settingsResult] = await Promise.all([
        getInvoice(id),
        getInvoiceSettings(website.id)
    ])

    if (!invoiceResult.success || !invoiceResult.invoice) notFound()

    return <PrintInvoiceClient invoice={invoiceResult.invoice} settings={settingsResult.settings ?? null} />
}
