import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    Users,
    CreditCard,
    TrendingUp,
    CheckCircle2,
    ArrowUpRight,
    Briefcase,
    Receipt,
    Layers,
    Mail,
    Sparkles,
    Shield,
    Activity,
    UserCheck,
    Clock,
} from 'lucide-react'
import AdminCharts from './AdminCharts'

export default async function AdminPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    // Parallel data fetching
    const [
        totalUsers,
        totalActiveSubscriptions,
        paidPayments,
        revenueAgg,
        recentUsers,
        allUsers,
        allPaidPayments,
        serviceSubscriptions,
        pendingApplications,
        customRequestsCount,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.userService.count({ where: { isActive: true } }),
        prisma.paymentRequest.count({ where: { status: 'PAID' } }),
        prisma.paymentRequest.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
        prisma.user.findMany({
            include: { services: true },
            orderBy: { createdAt: 'desc' },
            take: 8,
        }),
        prisma.user.findMany({ select: { createdAt: true }, orderBy: { createdAt: 'asc' } }),
        prisma.paymentRequest.findMany({
            where: { status: 'PAID' },
            select: { amount: true, confirmedAt: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
        }),
        prisma.userService.findMany({
            where: { isActive: true },
            include: { service: true },
        }),
        prisma.employmentApplication.count({ where: { status: 'PENDING' } }).catch(() => 0),
        prisma.customWebsiteRequest.count({ where: { status: 'PENDING' } }).catch(() => 0),
    ])

    const totalRevenue = revenueAgg._sum.amount ?? 0

    // Build monthly user growth data (last 6 months)
    const now = new Date()
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
    const userGrowthData: { name: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
        const count = allUsers.filter(u => u.createdAt >= date && u.createdAt < nextDate).length
        userGrowthData.push({ name: monthNames[date.getMonth()], value: count })
    }

    // Build monthly revenue data (last 6 months)
    const revenueData: { name: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
        const monthRevenue = allPaidPayments
            .filter(p => {
                const d = p.confirmedAt ?? p.createdAt
                return d >= date && d < nextDate
            })
            .reduce((sum, p) => sum + p.amount, 0)
        revenueData.push({ name: monthNames[date.getMonth()], value: Math.round(monthRevenue) })
    }

    // Build service distribution for donut chart
    const serviceMap = new Map<string, { name: string; count: number }>()
    serviceSubscriptions.forEach(sub => {
        const name = sub.service.name
        const existing = serviceMap.get(name)
        if (existing) {
            existing.count++
        } else {
            serviceMap.set(name, { name, count: 1 })
        }
    })
    const donutColors = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6']
    const serviceDistribution = Array.from(serviceMap.values()).map((s, i) => ({
        name: s.name,
        value: s.count,
        color: donutColors[i % donutColors.length],
    }))

    // Formatted current date string in French
    const dateFormatted = now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    // Average transaction amount
    const avgTicket = paidPayments > 0 ? Math.round(totalRevenue / paidPayments) : 0

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Hero Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#0f172a] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
                {/* Subtle background glow effect */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                FirstStep Platform Management
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs capitalize">
                                {dateFormatted}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                            Tableau de Bord Administrateur
                        </h1>
                        <p className="text-sm text-slate-400 max-w-2xl">
                            Supervisez la croissance, pilotez les abonnements, suivez les encaissements et gérez les recrutements en temps réel.
                        </p>
                    </div>

                    {/* Quick Stats Badges */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        {pendingApplications > 0 && (
                            <Link
                                href="/admin/employment"
                                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-all cursor-pointer"
                            >
                                <Briefcase className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                                <span>{pendingApplications} Candidature{pendingApplications > 1 ? 's' : ''} en attente</span>
                            </Link>
                        )}
                        {customRequestsCount > 0 && (
                            <Link
                                href="/admin/custom-requests"
                                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs font-semibold transition-all cursor-pointer"
                            >
                                <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                                <span>{customRequestsCount} Demande{customRequestsCount > 1 ? 's' : ''} sur mesure</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* KPI Cards Grid with Micro-interactions */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Users Card */}
                <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 hover:shadow-md hover:border-blue-500/30 hover:-translate-y-0.5 transition-all duration-200 cursor-default relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Utilisateurs
                        </span>
                        <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-xs">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                            {totalUsers}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-400">Total comptes inscrits</span>
                            <span className="font-semibold text-blue-600 flex items-center gap-0.5">
                                Actifs <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Subscriptions Card */}
                <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 hover:shadow-md hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200 cursor-default relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Abonnements
                        </span>
                        <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200 shadow-xs">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                            {totalActiveSubscriptions}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-400">Services & modules actifs</span>
                            <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                                En service <UserCheck className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Total Revenue Card */}
                <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 hover:shadow-md hover:border-amber-500/30 hover:-translate-y-0.5 transition-all duration-200 cursor-default relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Revenus Confirmés
                        </span>
                        <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-200 shadow-xs">
                            <CreditCard className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans truncate">
                            {totalRevenue.toLocaleString('fr-FR')} <span className="text-sm font-semibold text-slate-400">MAD</span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-400">Total encaissé</span>
                            <span className="font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                                Panier moy. {avgTicket} DH
                            </span>
                        </div>
                    </div>
                </div>

                {/* Paid Transactions Card */}
                <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 hover:shadow-md hover:border-violet-500/30 hover:-translate-y-0.5 transition-all duration-200 cursor-default relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Paiements
                        </span>
                        <div className="h-10 w-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-200 shadow-xs">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                            {paidPayments}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-400">Virements confirmés</span>
                            <span className="font-semibold text-violet-600 flex items-center gap-0.5">
                                100% Validé
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Charts Section */}
            <AdminCharts
                userGrowthData={userGrowthData}
                revenueData={revenueData}
                serviceDistribution={serviceDistribution}
            />

            {/* Quick Actions & Navigation Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                    href="/admin/employment-template"
                    className="group bg-white p-5 rounded-3xl border border-slate-200/70 hover:border-purple-500/40 hover:shadow-md transition-all duration-200 flex items-center gap-4 cursor-pointer"
                >
                    <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-xs">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Modèle Contrat</h4>
                        <p className="text-xs text-slate-400 truncate">Éditeur visuel PDF</p>
                    </div>
                </Link>

                <Link
                    href="/admin/services"
                    className="group bg-white p-5 rounded-3xl border border-slate-200/70 hover:border-cyan-500/40 hover:shadow-md transition-all duration-200 flex items-center gap-4 cursor-pointer"
                >
                    <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors shadow-xs">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">Services & Tarifs</h4>
                        <p className="text-xs text-slate-400 truncate">Configurer le catalogue</p>
                    </div>
                </Link>

                <Link
                    href="/admin/factures"
                    className="group bg-white p-5 rounded-3xl border border-slate-200/70 hover:border-blue-500/40 hover:shadow-md transition-all duration-200 flex items-center gap-4 cursor-pointer"
                >
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                        <Receipt className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Factures</h4>
                        <p className="text-xs text-slate-400 truncate">Historique & Émission</p>
                    </div>
                </Link>

                <Link
                    href="/admin/marketing"
                    className="group bg-white p-5 rounded-3xl border border-slate-200/70 hover:border-indigo-500/40 hover:shadow-md transition-all duration-200 flex items-center gap-4 cursor-pointer"
                >
                    <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-xs">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Assistant IA</h4>
                        <p className="text-xs text-slate-400 truncate">Générateur marketing</p>
                    </div>
                </Link>
            </div>

            {/* Recent Users Table Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-cyan-600" />
                            Dernières Inscriptions & Activité
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Comptes récemment créés et abonnements aux modules.
                        </p>
                    </div>

                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                        <span>Voir tous les utilisateurs</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Entreprise / Utilisateur</th>
                                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Rôle</th>
                                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Services Actifs</th>
                                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date d&apos;inscription</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">
                                        Aucun utilisateur inscrit pour le moment.
                                    </td>
                                </tr>
                            ) : (
                                recentUsers.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3.5">
                                                <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/80 flex items-center justify-center text-xs font-bold text-slate-700 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                                                    {u.companyName?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-slate-900 text-sm truncate">
                                                        {u.companyName || 'Sans entreprise'}
                                                    </div>
                                                    <div className="text-xs text-slate-400 truncate font-mono">
                                                        {u.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${
                                                u.role === 'ADMIN'
                                                    ? 'bg-cyan-500/10 text-cyan-700 border border-cyan-500/20'
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                                            }`}>
                                                {u.role === 'ADMIN' && <Shield className="w-3 h-3 text-cyan-600" />}
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-900 font-bold text-xs">
                                                    {u.services.length}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    module{u.services.length > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {new Date(u.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
