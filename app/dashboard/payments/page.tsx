import { getCurrentUser } from '@/app/actions/auth'
import { getUserPaymentRequests } from '@/app/actions/payments'
import { redirect } from 'next/navigation'
import { CheckCircle2, Clock, XCircle, CreditCard, TrendingUp, AlertCircle, Download, type LucideIcon } from 'lucide-react'
import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PaymentsPage() {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    const payments = await getUserPaymentRequests()
    const factures = await prisma.factureRecord.findMany({
        where: { userId: user.id },
    })

    const factureMap = new Map(factures.map(f => [f.paymentId, f]))

    const totalPaid = payments
        .filter(p => p.status === 'PAID')
        .reduce((sum, p) => sum + (p.amount || 0), 0)

    const totalTransactions = payments.filter(p => p.status === 'PAID').length
    const pendingCount = payments.filter(p => p.status === 'PENDING').length

    const statusConfig: Record<string, { label: string; class: string; icon: LucideIcon }> = {
        PAID: { label: 'Payé', class: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: CheckCircle2 },
        PENDING: { label: 'En attente', class: 'bg-amber-50 text-amber-700 border border-amber-200', icon: Clock },
        CANCELLED: { label: 'Annulé', class: 'bg-red-50 text-red-700 border border-red-200', icon: XCircle },
    }

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Paiements</h1>

            {/* KPI Cards — 2-col on mobile, 3-col on sm+ */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-xl shrink-0">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="text-[10px] sm:text-sm text-slate-500">Total payé</span>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-slate-900">
                        {totalPaid.toLocaleString()} <span className="text-xs sm:text-sm font-medium text-slate-400">MAD</span>
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-1.5 sm:p-2 bg-blue-50 rounded-xl shrink-0">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-[10px] sm:text-sm text-slate-500">Transactions</span>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-slate-900">{totalTransactions}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-1.5 sm:p-2 bg-amber-50 rounded-xl shrink-0">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                        </div>
                        <span className="text-[10px] sm:text-sm text-slate-500">En attente</span>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-slate-900">{pendingCount}</p>
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100">
                    <h2 className="font-semibold text-slate-900 text-sm sm:text-base">Historique des paiements</h2>
                </div>

                {payments.length === 0 ? (
                    <div className="px-6 py-12 text-center text-slate-400 text-sm">
                        Aucun paiement trouvé.
                    </div>
                ) : (
                    <>
                        {/* Mobile card list (hidden on md+) */}
                        <div className="divide-y divide-slate-100 md:hidden">
                            {payments.map((payment) => {
                                const config = statusConfig[payment.status] || statusConfig.PENDING
                                const StatusIcon = config.icon
                                const facture = factureMap.get(payment.id)
                                return (
                                    <div key={payment.id} className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 text-sm truncate">
                                                    {payment.service?.name || 'Service'}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                                                    {payment.transferReference || '—'}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold shrink-0 ${config.class}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {config.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-base font-bold text-slate-900">
                                                    {payment.amount?.toLocaleString()} MAD
                                                </span>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {new Date(payment.createdAt).toLocaleDateString('fr-FR', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            {facture ? (
                                                <Link
                                                    href={`/api/admin/factures/${facture.id}/download`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-xl text-xs transition-colors border border-blue-100"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                    PDF
                                                </Link>
                                            ) : (
                                                <span className="text-slate-300 text-xs">—</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Desktop table (hidden on mobile) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Montant</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Référence</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Facture</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {payments.map((payment) => {
                                        const config = statusConfig[payment.status] || statusConfig.PENDING
                                        const StatusIcon = config.icon
                                        const facture = factureMap.get(payment.id)
                                        return (
                                            <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {payment.service?.name || 'Service'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-700 font-semibold">
                                                    {payment.amount?.toLocaleString()} MAD
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.class}`}>
                                                        <StatusIcon className="h-3.5 w-3.5" />
                                                        {config.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                                    {payment.transferReference || '—'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {new Date(payment.createdAt).toLocaleDateString('fr-FR', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {facture ? (
                                                        <Link
                                                            href={`/api/admin/factures/${facture.id}/download`}
                                                            target="_blank"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-xl text-xs transition-colors border border-blue-100"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                            PDF
                                                        </Link>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
