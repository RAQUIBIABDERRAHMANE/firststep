import { getAllPendingPayments, confirmPayment, rejectPayment } from '@/app/actions/payments'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Clock, CreditCard, User, CheckCircle2, XCircle, AlertCircle, ArrowUpRight, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PendingPaymentsPage() {
    const pendingPayments = await getAllPendingPayments()

    const handleConfirm = async (paymentId: string) => {
        'use server'
        await confirmPayment(paymentId)
    }

    const handleReject = async (paymentId: string) => {
        'use server'
        await rejectPayment(paymentId)
    }

    const totalPendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0)

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-xs font-bold">
                            Finances & Encaissements
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            {pendingPayments.length} demande{pendingPayments.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                        Paiements & Virements
                    </h1>
                    <p className="text-sm text-slate-500 max-w-xl">
                        Vérifiez et validez les virements bancaires émis par vos clients pour activer leurs services.
                    </p>
                </div>

                {/* Amount Pill */}
                <div className="bg-white px-5 py-3 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 shrink-0">
                    <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">En attente de validation</div>
                        <div className="text-xl font-extrabold text-slate-900 font-sans tabular-nums">
                            {totalPendingAmount.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-400">MAD</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content List */}
            {pendingPayments.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-12 text-center space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">
                            Aucun virement en attente
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Toutes les demandes de paiement ont été validées ou traitées.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pendingPayments.map((payment) => {
                        const expiresAt = new Date(payment.expiresAt)
                        const isExpired = expiresAt < new Date()

                        return (
                            <div
                                key={payment.id}
                                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 p-6 space-y-5"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <h3 className="text-lg font-bold text-slate-900">
                                                {payment.service.name}
                                            </h3>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                                    isExpired
                                                        ? 'bg-rose-50 text-rose-700 border-rose-200/60'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200/60'
                                                }`}
                                            >
                                                {isExpired ? 'Expiré' : 'En attente de confirmation'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-400 shrink-0" />
                                                <span className="font-semibold text-slate-800">{payment.user.companyName || 'Sans entreprise'}</span>
                                                <span className="text-slate-400 truncate">({payment.user.email})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                                                <span>
                                                    Initié le {new Date(payment.createdAt).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {payment.transferReference && (
                                            <div className="mt-3 p-3 bg-cyan-50/60 border border-cyan-500/20 rounded-2xl flex items-center justify-between">
                                                <div className="text-xs text-cyan-900">
                                                    <span className="font-bold text-cyan-700 uppercase tracking-wider text-[10px] block">Référence de virement communiquée :</span>
                                                    <span className="font-mono font-bold text-sm">{payment.transferReference}</span>
                                                </div>
                                                <span className="text-[10px] text-cyan-600 font-semibold bg-cyan-100/60 px-2 py-0.5 rounded-md">
                                                    Virement Bancaire
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-left sm:text-right shrink-0">
                                        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                                            {payment.amount.toLocaleString('fr-FR')} <span className="text-sm font-semibold text-slate-400">MAD</span>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-0.5">
                                            Expiration : {expiresAt.toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                    <form action={handleReject.bind(null, payment.id)}>
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-semibold text-xs cursor-pointer"
                                        >
                                            <XCircle className="w-3.5 h-3.5 mr-1" />
                                            Rejeter
                                        </Button>
                                    </form>

                                    <form action={handleConfirm.bind(null, payment.id)}>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm hover:shadow-md cursor-pointer transition-all"
                                            disabled={isExpired}
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                            Confirmer & Activer Service
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}