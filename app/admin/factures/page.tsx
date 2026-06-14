import prisma from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FileText, Download, User, Calendar, ExternalLink, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminFacturesPage() {
  // Fetch all invoices from database
  const factures = await prisma.factureRecord.findMany({
    orderBy: { generatedAt: 'desc' },
  })

  // Calculations
  const totalAmount = factures.reduce((sum, f) => sum + (f.amount || 0), 0)
  const totalCount = factures.length

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            Factures Émises
          </h1>
          <p className="text-gray-600 mt-2">
            Consultez et téléchargez les factures générées pour les services de la plateforme
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="text-xs text-slate-500 font-medium">Total facturé</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {totalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
            </div>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="text-xs text-slate-500 font-medium">Nombre de factures</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{totalCount}</div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900">Historique des facturations</h2>
          <Badge variant="secondary">R2 Object Storage Actif</Badge>
        </div>

        {factures.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune facture émise</h3>
            <p className="text-gray-500">Les factures apparaîtront ici dès qu&apos;un paiement sera validé.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/20 text-slate-500 font-medium">
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold">N° Facture</th>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold">Client</th>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold">Service</th>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold">Montant</th>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold">Date d&apos;émission</th>
                  <th className="text-right px-6 py-4 text-xs uppercase tracking-wider font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {factures.map((facture) => (
                  <tr key={facture.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">
                      {facture.number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {facture.clientName}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">{facture.clientEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {facture.serviceName}
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-semibold">
                      {facture.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(facture.generatedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {facture.pdfUrl ? (
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 mr-2 flex items-center gap-1">
                            ☁️ R2 Storage
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50 mr-2 flex items-center gap-1">
                            <RefreshCw className="h-2.5 w-2.5 animate-spin" /> Dynamique
                          </Badge>
                        )}
                        <Link
                          href={`/api/admin/factures/${facture.id}/download`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-xl text-xs transition-colors border border-blue-100"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Télécharger PDF
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
