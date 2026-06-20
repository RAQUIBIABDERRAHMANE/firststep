'use client'

import { Button } from '@/components/ui/Button'
import { Printer, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type InvoiceItem = { id: string; description: string; quantity: number; unitPrice: number; total: number }
type Invoice = {
    id: string; number: string; clientName: string; clientEmail: string | null
    clientPhone: string | null; clientAddress: string | null
    status: string; issueDate: Date; dueDate: Date | null
    subtotal: number; taxRate: number; taxAmount: number; total: number
    notes: string | null; items: InvoiceItem[]
}
type Settings = {
    companyName: string | null; companyAddress: string | null
    companyPhone: string | null; companyEmail: string | null
    currency: string; footerNote: string | null; bankDetails: string | null
} | null

const STATUS_LABELS: Record<string, string> = {
    DRAFT: 'Brouillon', SENT: 'Envoyée', PAID: 'Payée', CANCELLED: 'Annulée', OVERDUE: 'En retard'
}

export default function PrintInvoiceClient({ invoice, settings }: { invoice: Invoice; settings: Settings }) {
    const router = useRouter()
    const currency = settings?.currency ?? 'MAD'

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Toolbar (screen only) */}
            <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Retour
                </Button>
                <div className="flex gap-2">
                    <span className="text-sm text-slate-500 self-center">Facture {invoice.number}</span>
                    <Button onClick={() => window.print()}>
                        <Printer className="h-4 w-4 mr-2" /> Imprimer / Télécharger PDF
                    </Button>
                </div>
            </div>

            {/* A4 Invoice */}
            <div className="max-w-[794px] mx-auto my-8 print:my-0 bg-white shadow-lg print:shadow-none">
                <div className="p-12">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            {settings?.companyName && <h1 className="text-2xl font-bold text-gray-900">{settings.companyName}</h1>}
                            {settings?.companyAddress && <p className="text-sm text-gray-500 mt-1">{settings.companyAddress}</p>}
                            {settings?.companyPhone && <p className="text-sm text-gray-500">{settings.companyPhone}</p>}
                            {settings?.companyEmail && <p className="text-sm text-gray-500">{settings.companyEmail}</p>}
                        </div>
                        <div className="text-right">
                            <h2 className="text-4xl font-extrabold text-primary tracking-tight">FACTURE</h2>
                            <p className="text-lg font-semibold text-gray-700 mt-1">{invoice.number}</p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${invoice.status === 'PAID' ? 'bg-green-100 text-green-700' : invoice.status === 'SENT' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                {STATUS_LABELS[invoice.status] ?? invoice.status}
                            </span>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="flex gap-10 mb-10 text-sm">
                        <div>
                            <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Date d&apos;émission</span>
                            <p className="font-medium mt-0.5">{new Date(invoice.issueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        {invoice.dueDate && (
                            <div>
                                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wide">Date d&apos;échéance</span>
                                <p className="font-medium mt-0.5">{new Date(invoice.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        )}
                    </div>

                    {/* Bill To */}
                    <div className="mb-10 bg-gray-50 rounded-xl p-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Facturé à</p>
                        <p className="font-bold text-gray-800 text-base">{invoice.clientName}</p>
                        {invoice.clientEmail && <p className="text-sm text-gray-500">{invoice.clientEmail}</p>}
                        {invoice.clientPhone && <p className="text-sm text-gray-500">{invoice.clientPhone}</p>}
                        {invoice.clientAddress && <p className="text-sm text-gray-500">{invoice.clientAddress}</p>}
                    </div>

                    {/* Items Table */}
                    <table className="w-full mb-8 text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Description</th>
                                <th className="text-right py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide w-20">Qté</th>
                                <th className="text-right py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide w-28">Prix unit.</th>
                                <th className="text-right py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide w-28">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, i) => (
                                <tr key={item.id} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                                    <td className="py-3 text-gray-800">{item.description}</td>
                                    <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                                    <td className="py-3 text-right text-gray-600">{item.unitPrice.toFixed(0)} {currency}</td>
                                    <td className="py-3 text-right font-medium text-gray-800">{item.total.toFixed(0)} {currency}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end mb-10">
                        <div className="w-64 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Sous-total</span>
                                <span>{invoice.subtotal.toFixed(0)} {currency}</span>
                            </div>
                            {invoice.taxRate > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>TVA ({invoice.taxRate}%)</span>
                                    <span>{invoice.taxAmount.toFixed(0)} {currency}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-base text-gray-900 border-t pt-2 mt-2">
                                <span>TOTAL</span>
                                <span>{invoice.total.toFixed(0)} {currency}</span>
                            </div>
                            {invoice.status === 'PAID' && (
                                <div className="mt-3 text-center py-2 rounded-lg border-2 border-green-500 text-green-600 font-bold text-sm tracking-widest">
                                    ✓ PAYÉE
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bank details */}
                    {settings?.bankDetails && (
                        <div className="mb-6 bg-blue-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Coordonnées bancaires</p>
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">{settings.bankDetails}</pre>
                        </div>
                    )}

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="mb-6 bg-gray-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes</p>
                            <p className="text-sm text-gray-600">{invoice.notes}</p>
                        </div>
                    )}

                    {/* Footer */}
                    {settings?.footerNote && (
                        <div className="border-t pt-6 text-center text-xs text-gray-400">
                            {settings.footerNote}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @media print {
                    @page { size: A4; margin: 0; }
                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    )
}
