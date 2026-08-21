import prisma from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FileText, Download, User, Calendar, ExternalLink, RefreshCw, Receipt, CheckCircle2 } from 'lucide-react'
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
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-xs font-bold">
              Comptabilité & Documents
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {totalCount} facture{totalCount > 1 ? 's' : ''}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Factures Émises
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Consultez, recherchez et téléchargez les factures PDF officielles générées automatiquement lors des encaissements.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-5 py-3 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Facturé</div>
              <div className="text-lg font-extrabold text-slate-900 font-sans tabular-nums">
                {totalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-xs font-semibold text-slate-400">MAD</span>
              </div>
            </div>
          </div>

          <div className="bg-white px-5 py-3 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Factures</div>
              <div className="text-lg font-extrabold text-slate-900 font-sans tabular-nums">
                {totalCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Registre des Factures</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
              {totalCount}
            </span>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Stockage Cloud R2 Connecté
          </span>
        </div>

        {factures.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Aucune facture émise</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Les factures apparaîtront ici automatiquement dès qu&apos;un paiement sera validé.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/40 text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="text-left px-6 py-3.5">N° Facture</th>
                  <th className="text-left px-6 py-3.5">Client & Entreprise</th>
                  <th className="text-left px-6 py-3.5">Service</th>
                  <th className="text-left px-6 py-3.5">Montant TTC</th>
                  <th className="text-left px-6 py-3.5">Date d&apos;émission</th>
                  <th className="text-right px-6 py-3.5">Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {factures.map((facture) => (
                  <tr key={facture.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-600 text-xs">
                      {facture.number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {facture.clientName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono mt-0.5">{facture.clientEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                      {facture.serviceName}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-900 tabular-nums">
                      {facture.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
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
                      {facture.pdfUrl ? (
                        <a
                          href={facture.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold text-xs transition-colors cursor-pointer border border-cyan-200/60"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Non disponible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
