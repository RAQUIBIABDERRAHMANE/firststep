import { getCurrentUser } from '@/app/actions/auth'
import { getAllUsersWithServices } from '@/app/actions/admin'
import { getServices } from '@/app/actions/services'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import AdminServiceControl from '@/components/admin/AdminServiceControl'
import { Layers, Users, CreditCard, Sparkles, CheckCircle2, Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminServicesPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const users = await getAllUsersWithServices()
    const allServices = await getServices()

    const totalActiveServices = users.reduce((acc, u) => acc + u.services.length, 0)
    const totalPendingPayments = users.reduce((acc, u) => acc + u.paymentRequests.filter(p => p.status === 'PENDING').length, 0)
    const availableServicesCount = allServices.filter(s => s.status === 'AVAILABLE').length

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-xs font-bold">
                            Catalogue & Souscriptions
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            {allServices.length} modules disponibles
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                        Gestion des Services & Accès
                    </h1>
                    <p className="text-sm text-slate-500 max-w-xl">
                        Activez, désactivez ou configurez les abonnements aux modules FirstStep pour chacun de vos clients.
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-3 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clients Inscrits</span>
                        <div className="h-9 w-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Users className="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 font-sans tabular-nums">{users.length}</div>
                    <p className="text-xs text-slate-400">Total comptes entreprises</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-3 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Services Actifs</span>
                        <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 font-sans tabular-nums text-emerald-600">{totalActiveServices}</div>
                    <p className="text-xs text-slate-400">Modules déployés en production</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-3 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Paiements en Attente</span>
                        <div className="h-9 w-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <CreditCard className="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 font-sans tabular-nums text-amber-600">{totalPendingPayments}</div>
                    <p className="text-xs text-slate-400">Demandes de virement</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-3 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Modules Catalogue</span>
                        <div className="h-9 w-9 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                            <Layers className="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 font-sans tabular-nums text-cyan-600">{availableServicesCount}</div>
                    <p className="text-xs text-slate-400">Solutions prêtes à l&apos;emploi</p>
                </div>
            </div>

            {/* User Services List */}
            <div className="space-y-6">
                {users.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
                        <Users className="w-10 h-10 text-slate-300 mx-auto" />
                        <h3 className="text-base font-bold text-slate-900">Aucun client trouvé</h3>
                        <p className="text-xs text-slate-500">Les entreprises inscrites apparaîtront ici.</p>
                    </div>
                ) : (
                    users.map((client) => (
                        <div
                            key={client.id}
                            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/80 flex items-center justify-center text-xs font-bold text-slate-700">
                                            {client.companyName?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">{client.companyName}</h3>
                                            <p className="text-xs text-slate-400 font-mono">
                                                {client.email} • Inscrit le {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 bg-cyan-50 text-cyan-700 border border-cyan-200/60 rounded-full text-xs font-bold">
                                        {client.services.length} Service{client.services.length > 1 ? 's' : ''} actif{client.services.length > 1 ? 's' : ''}
                                    </span>
                                    {client.paymentRequests.filter(p => p.status === 'PENDING').length > 0 && (
                                        <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full text-xs font-bold">
                                            {client.paymentRequests.filter(p => p.status === 'PENDING').length} Paiement en attente
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <AdminServiceControl
                                    userId={client.id}
                                    userServices={client.services}
                                    paymentRequests={client.paymentRequests}
                                    allServices={allServices}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
