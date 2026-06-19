import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { Layers, ArrowUpRight, CreditCard, Globe, Activity, UtensilsCrossed, Briefcase, Users, CalendarDays, TrendingUp, ShoppingCart } from 'lucide-react'
import AutoRefresh from '@/components/dashboard/AutoRefresh'
import DashboardCharts from './DashboardCharts'

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) return null

    const [userServices, paidPayments] = await Promise.all([
        prisma.userService.findMany({
            where: { userId: user.id, isActive: true },
            include: { service: true },
        }),
        prisma.paymentRequest.findMany({
            where: { userId: user.id, status: 'PAID' },
            select: { amount: true, confirmedAt: true, createdAt: true, service: { select: { name: true } } },
            orderBy: { createdAt: 'asc' },
        }),
    ])

    const activeServiceIds = userServices.map(us => us.serviceId)
    const websiteInstances = await prisma.tenantWebsite.findMany({
        where: { userId: user.id, serviceId: { in: activeServiceIds } },
        include: { service: true },
    })

    const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0)

    // --- Service-specific analytics ---
    const tenantIds = websiteInstances.map(w => w.id)

    const [restaurantOrders, restaurantDishes, restaurantTables, cabinetClients, cabinetAppointments, cabinetServices] = await Promise.all([
        prisma.restaurantOrder.findMany({
            where: { table: { tenantId: { in: tenantIds } } },
            select: { totalAmount: true, status: true, createdAt: true },
        }),
        prisma.restaurantDish.count({ where: { category: { tenantId: { in: tenantIds } } } }),
        prisma.restaurantTable.count({ where: { tenantId: { in: tenantIds } } }),
        prisma.cabinetClient.count({ where: { tenantId: { in: tenantIds } } }),
        prisma.cabinetAppointment.findMany({
            where: { tenantId: { in: tenantIds } },
            select: { status: true, appointmentDate: true },
        }),
        prisma.cabinetService.count({ where: { tenantId: { in: tenantIds } } }),
    ])

    const hasRestaurant = userServices.some(us => us.service.slug.includes('restaurant'))
    const hasCabinet = userServices.some(us => us.service.slug.includes('cabinet') || us.service.slug.includes('professional'))

    const restaurantRevenue = restaurantOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    const completedOrders = restaurantOrders.filter(o => o.status === 'COMPLETED' || o.status === 'PAID').length

    const now = new Date()
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

    const upcomingAppointments = cabinetAppointments.filter(a => a.appointmentDate >= now && a.status === 'SCHEDULED').length
    const completedAppointments = cabinetAppointments.filter(a => a.status === 'COMPLETED').length

    // Restaurant orders per month (last 6 months)
    const orderChartData: { name: string; value: number }[] = []
    // Restaurant revenue per month (last 6 months)
    const restaurantRevenueChartData: { name: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
        const monthOrders = restaurantOrders.filter(o => o.createdAt >= date && o.createdAt < nextDate)
        orderChartData.push({ name: monthNames[date.getMonth()], value: monthOrders.length })
        restaurantRevenueChartData.push({ name: monthNames[date.getMonth()], value: Math.round(monthOrders.reduce((s, o) => s + o.totalAmount, 0)) })
    }

    // Cabinet appointments per month (last 6 months)
    const appointmentChartData: { name: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
        const count = cabinetAppointments.filter(a => a.appointmentDate >= date && a.appointmentDate < nextDate).length
        appointmentChartData.push({ name: monthNames[date.getMonth()], value: count })
    }

    // Monthly payment data (last 6 months)
    const paymentChartData: { name: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
        const monthAmount = paidPayments
            .filter(p => {
                const d = p.confirmedAt ?? p.createdAt
                return d >= date && d < nextDate
            })
            .reduce((sum, p) => sum + p.amount, 0)
        paymentChartData.push({ name: monthNames[date.getMonth()], value: Math.round(monthAmount) })
    }

    // Service distribution for donut
    const donutColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
    const serviceDistribution = userServices.map((us, i) => ({
        name: us.service.name,
        value: 1,
        color: donutColors[i % donutColors.length],
    }))

    return (
        <div className="space-y-8 max-w-7xl">
            <AutoRefresh />
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{user.companyName}</h1>
                <p className="text-sm text-slate-500 mt-1">Vue d&apos;ensemble de vos services</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Services actifs</span>
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Layers className="h-4 w-4 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900">{userServices.length}</div>
                    <p className="text-xs text-slate-400 mt-1">Abonnements en cours</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Sites web</span>
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Globe className="h-4 w-4 text-emerald-600" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900">{websiteInstances.length}</div>
                    <p className="text-xs text-slate-400 mt-1">Instances déployées</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Paiements</span>
                        <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-amber-600" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900">{totalPaid.toLocaleString('fr-FR')} <span className="text-sm font-medium text-slate-400">MAD</span></div>
                    <p className="text-xs text-slate-400 mt-1">{paidPayments.length} transactions</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</span>
                        <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-green-600" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-medium text-slate-900">Tous les systèmes opérationnels</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Disponibilité 99.9%</p>
                </div>
            </div>

            {/* Restaurant Analytics */}
            {hasRestaurant && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-orange-50 flex items-center justify-center">
                            <UtensilsCrossed className="h-3.5 w-3.5 text-orange-600" />
                        </div>
                        <h2 className="text-sm font-semibold text-slate-900">Restaurant</h2>
                    </div>
                    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-3 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                    <ShoppingCart className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-slate-500">Commandes</p>
                                    <p className="text-lg sm:text-xl font-bold text-slate-900">{restaurantOrders.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                                <TrendingUp className="h-3.5 w-3.5" />
                                <span>{completedOrders} complétées</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-3 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-slate-500">Revenu</p>
                                    <p className="text-base sm:text-xl font-bold text-slate-900">{restaurantRevenue.toLocaleString('fr-FR')} <span className="text-xs font-medium text-slate-400">MAD</span></p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-3 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                                    <UtensilsCrossed className="h-4 w-4 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-slate-500">Plats</p>
                                    <p className="text-lg sm:text-xl font-bold text-slate-900">{restaurantDishes}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-3 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <Layers className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-slate-500">Tables</p>
                                    <p className="text-lg sm:text-xl font-bold text-slate-900">{restaurantTables}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DashboardCharts
                        chartType="restaurant"
                        orderChartData={orderChartData}
                        restaurantRevenueChartData={restaurantRevenueChartData}
                    />
                </div>
            )}

            {/* Cabinet Analytics */}
            {hasCabinet && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-violet-50 flex items-center justify-center">
                            <Briefcase className="h-3.5 w-3.5 text-violet-600" />
                        </div>
                        <h2 className="text-sm font-semibold text-slate-900">Cabinet</h2>
                    </div>
                    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-3 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                                    <Users className="h-4 w-4 text-violet-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-slate-500">Clients</p>
                                    <p className="text-lg sm:text-xl font-bold text-slate-900">{cabinetClients}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-3 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <CalendarDays className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-slate-500">Rendez-vous</p>
                                    <p className="text-lg sm:text-xl font-bold text-slate-900">{cabinetAppointments.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="text-emerald-600">{completedAppointments} terminés</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-amber-600">{upcomingAppointments} à venir</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-3 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Briefcase className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-slate-500">Services</p>
                                    <p className="text-lg sm:text-xl font-bold text-slate-900">{cabinetServices}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-3 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                                    <Activity className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-slate-500">Taux complétion</p>
                                    <p className="text-lg sm:text-xl font-bold text-slate-900">{cabinetAppointments.length > 0 ? Math.round((completedAppointments / cabinetAppointments.length) * 100) : 0}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DashboardCharts
                        chartType="cabinet"
                        appointmentChartData={appointmentChartData}
                    />
                </div>
            )}

            {/* General Charts */}
            <DashboardCharts
                chartType="general"
                paymentChartData={paymentChartData}
                serviceDistribution={serviceDistribution}
            />

            {/* Website Instances */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-slate-900">Vos instances actives</h2>
                </div>

                {websiteInstances.length === 0 ? (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
                        <div className="rounded-full bg-slate-100 h-12 w-12 flex items-center justify-center mx-auto mb-4">
                            <Globe className="h-5 w-5 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900">Aucun site actif</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                            Configurez votre premier site web pour commencer.
                        </p>
                        <Link href="/dashboard/website">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">Configurer un site</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {websiteInstances.map((site) => (
                            <div key={site.id} className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 group hover:shadow-md hover:border-blue-200 transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{site.siteName}</h3>
                                        <span className="text-xs text-slate-400 bg-slate-50 rounded-full px-2 py-0.5 mt-1 inline-block">
                                            {site.service.name}
                                        </span>
                                    </div>
                                    <Badge className="bg-slate-100 text-slate-600 border-0 text-[10px] font-bold uppercase tracking-widest">
                                        {site.slug}
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                                    {site.description || "Gérez votre présence digitale et vos opérations."}
                                </p>
                                <div className="flex gap-2">
                                    {site.service.slug.includes('restaurant') ? (
                                        <Link href={`/dashboard/restaurant/${site.slug}`} className="flex-1">
                                            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                                                Restaurant Admin
                                            </Button>
                                        </Link>
                                    ) : (site.service.slug.includes('cabinet') || site.service.slug.includes('professional-services')) ? (
                                        <Link href={`/dashboard/cabinet/${site.slug}`} className="flex-1">
                                            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                                                Cabinet Admin
                                            </Button>
                                        </Link>
                                    ) : null}
                                    <Link href={`/${site.slug}`} target="_blank">
                                        <Button variant="outline" size="sm" className="px-3 border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200" title="Voir le site">
                                            <ArrowUpRight size={14} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {userServices.length > websiteInstances.length && (
                            <Link href="/dashboard/website">
                                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center group cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all h-full flex flex-col items-center justify-center">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                                        <Layers className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-sm text-slate-700">Configurer un service</h3>
                                    <p className="text-xs text-slate-400 mt-1">Activez vos autres abonnements</p>
                                </div>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
