import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Users, CreditCard, TrendingUp, CheckCircle2 } from 'lucide-react'
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
    const donutColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']
    const serviceDistribution = Array.from(serviceMap.values()).map((s, i) => ({
        name: s.name,
        value: s.count,
        color: donutColors[i % donutColors.length],
    }))

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Vue d&apos;ensemble
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Surveillez la croissance et gérez les modules de la plateforme.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Utilisateurs</span>
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{totalUsers}</div>
                    <p className="text-xs text-slate-400 mt-1">Total inscrits</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Abonnements</span>
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{totalActiveSubscriptions}</div>
                    <p className="text-xs text-slate-400 mt-1">Services actifs</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Revenus</span>
                        <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-amber-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{totalRevenue.toLocaleString('fr-FR')} <span className="text-base font-medium text-slate-400">MAD</span></div>
                    <p className="text-xs text-slate-400 mt-1">Revenu total confirmé</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Paiements</span>
                        <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-violet-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{paidPayments}</div>
                    <p className="text-xs text-slate-400 mt-1">Confirmés</p>
                </div>
            </div>

            {/* Charts */}
            <AdminCharts
                userGrowthData={userGrowthData}
                revenueData={revenueData}
                serviceDistribution={serviceDistribution}
            />

            {/* Recent Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="px-6 py-5 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-900">Activité récente</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Dernières inscriptions et services souscrits.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Entreprise</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Rôle</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Services</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Inscription</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentUsers.map((u: any) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {u.companyName?.[0] || '?'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 text-sm">{u.companyName}</div>
                                                <div className="text-xs text-slate-400">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${u.role === 'ADMIN' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className="font-semibold text-slate-900">{u.services.length}</span>
                                        <span className="text-slate-400 ml-1 text-xs">modules</span>
                                    </td>
                                    <td className="px-6 py-3.5 text-xs text-slate-500">
                                        {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
