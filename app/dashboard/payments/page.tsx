import { getCurrentUser } from '@/app/actions/auth'
import { getUserPaymentRequests } from '@/app/actions/payments'
import { redirect } from 'next/navigation'
import { CheckCircle2, Clock, XCircle, CreditCard, TrendingUp, AlertCircle, type LucideIcon } from 'lucide-react'

export default async function PaymentsPage() {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    const payments = await getUserPaymentRequests()

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
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-slate-900">Paiements</h1>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-50 rounded-xl">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </div>
                        <span className="text-sm text-slate-500">Total payé</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalPaid.toLocaleString()} MAD</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-slate-500">Transactions</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalTransactions}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-50 rounded-xl">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <span className="text-sm text-slate-500">En attente</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-semibold text-slate-900">Historique des paiements</h2>
                </div>
                {payments.length === 0 ? (
                    <div className="px-6 py-12 text-center text-slate-400">
                        Aucun paiement trouvé.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Montant</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Référence</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {payments.map((payment) => {
                                    const config = statusConfig[payment.status] || statusConfig.PENDING
                                    const StatusIcon = config.icon
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
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
