import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
    Utensils,
    MapPin,
    ClipboardList,
    ExternalLink,
    ChevronRight,
    TrendingUp,
    Users,
    LayoutDashboard,
    Paintbrush,
    UserCheck,
    BarChart3,
    CalendarCheck,
    Rocket,
    Sparkles,
    Check,
} from 'lucide-react'
import { getWebsiteBySlug } from '@/app/actions/tenant'
import AutoRefresh from '@/components/dashboard/AutoRefresh'

export default async function RestaurantDashboardPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    const user = await getCurrentUser()
    if (!user) return null

    const tenant = await getWebsiteBySlug(tenantSlug)

    if (!tenant) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <Utensils size={64} className="text-slate-200" />
                <h2 className="text-2xl font-bold">No Website Found</h2>
                <p className="text-slate-500">The requested restaurant instance was not found.</p>
                <Link href="/dashboard">
                    <Button>Back to Dashboard</Button>
                </Link>
            </div>
        )
    }

    // Stats
    const tableCount = await prisma.restaurantTable.count({ where: { tenantId: tenant.id } })
    const menuCount = await prisma.restaurantDish.count({
        where: { category: { tenantId: tenant.id } }
    })
    const orderCount = await prisma.restaurantOrder.count({
        where: { table: { tenantId: tenant.id } }
    })
    // @ts-ignore
    const waiterCount = await prisma.restaurantWaiter.count({ where: { tenantId: tenant.id } })
    const pendingReservations = await prisma.restaurantReservation.count({
        where: { tenantId: tenant.id, status: 'PENDING' }
    })

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <AutoRefresh />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2 sm:gap-3">
                        <LayoutDashboard className="text-blue-600 h-5 w-5 sm:h-6 sm:w-6" /> Restaurant Admin
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">
                        Manage your digital menu, floor plan, and incoming orders.
                    </p>
                </div>
                <Link href={`/${tenant.slug}`} target="_blank" className="self-start sm:self-auto">
                    <Button variant="outline" className="gap-2 rounded-xl text-sm h-9">
                        View Live Site <ExternalLink size={14} />
                    </Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
                <Card className="shadow-none border-slate-200 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Active Tables</CardTitle>
                        <MapPin size={18} className="text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">{tableCount}</div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp size={12} className="text-emerald-500" /> Managed physical points
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-slate-200 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Menu Items</CardTitle>
                        <Utensils size={18} className="text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">{menuCount}</div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp size={12} className="text-emerald-500" /> Live products
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-slate-200 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total Orders</CardTitle>
                        <ClipboardList size={18} className="text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">{orderCount}</div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp size={12} className="text-emerald-500" /> Transactions processed
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-slate-200 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Waiters</CardTitle>
                        <UserCheck size={18} className="text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">{waiterCount}</div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp size={12} className="text-emerald-500" /> Staff members
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-slate-200 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Reservations</CardTitle>
                        <CalendarCheck size={18} className="text-pink-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">{pendingReservations}</div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp size={12} className="text-pink-500" /> Pending requests
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* ── Onboarding Setup Banner (shown when not fully configured) ── */}
            {(menuCount === 0 || tableCount === 0) && (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 p-6 sm:p-8 shadow-xl shadow-orange-200">
                    {/* Background decoration */}
                    <div className="absolute right-0 top-0 h-full w-48 opacity-10">
                        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white" />
                        <div className="absolute -right-4 bottom-0 h-28 w-28 rounded-full bg-white" />
                    </div>

                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                            <Rocket className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles size={14} className="text-white/80" />
                                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Configuration en cours</span>
                            </div>
                            <h3 className="text-xl font-black text-white">
                                {menuCount === 0 && tableCount === 0
                                    ? 'Votre restaurant n\'est pas encore configuré'
                                    : menuCount === 0
                                    ? 'Votre menu est vide'
                                    : 'Aucune table n\'est encore créée'}
                            </h3>
                            <p className="text-white/80 text-sm mt-1">
                                {menuCount === 0 && tableCount === 0
                                    ? 'Utilisez le wizard d\'installation guidée pour configurer votre menu, vos tables et votre design en quelques minutes.'
                                    : menuCount === 0
                                    ? 'Ajoutez vos plats pour que vos clients puissent commander depuis leur téléphone.'
                                    : 'Créez vos tables et générez leurs QR codes pour démarrer les commandes.'}
                            </p>
                        </div>
                        <Link href={`/dashboard/restaurant/${tenantSlug}/onboarding`} className="shrink-0 w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-white text-orange-600 font-bold hover:bg-orange-50 rounded-xl px-6 py-3 h-auto shadow-lg hover:shadow-xl transition-all active:scale-95">
                                <Rocket size={15} className="mr-2" />
                                Lancer le wizard
                            </Button>
                        </Link>
                    </div>

                    {/* Progress pills */}
                    <div className="relative flex flex-wrap gap-2 mt-5 pt-5 border-t border-white/20">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${menuCount > 0 ? 'bg-white/30 text-white' : 'bg-white/10 text-white/60'}`}>
                            {menuCount > 0 ? <Check size={11} /> : <span className="h-2 w-2 rounded-full bg-white/40" />}
                            Menu ({menuCount} plats)
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${tableCount > 0 ? 'bg-white/30 text-white' : 'bg-white/10 text-white/60'}`}>
                            {tableCount > 0 ? <Check size={11} /> : <span className="h-2 w-2 rounded-full bg-white/40" />}
                            Tables ({tableCount})
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/30 text-white">
                            <Check size={11} />
                            Design configuré
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-3 sm:gap-6 md:grid-cols-2">
                <Link href={`/dashboard/restaurant/${tenantSlug}/menu`}>
                    <Card className="shadow-none border-slate-200 hover:border-blue-500/50 hover:bg-blue-50/10 transition-all group p-4 sm:p-6 h-full">
                        <div className="flex gap-3 sm:gap-6 items-start">
                            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-transform duration-500 group-hover:scale-110 shrink-0">
                                <Utensils size={20} className="sm:h-7 sm:w-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
                                    Menu Management <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                                </h3>
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                                    Edit your dishes, categories, and pricing in real-time. Changes reflect instantly on your website.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href={`/dashboard/restaurant/${tenantSlug}/tables`}>
                    <Card className="shadow-none border-slate-200 hover:border-blue-500/50 hover:bg-blue-50/10 transition-all group p-4 sm:p-6 h-full">
                        <div className="flex gap-3 sm:gap-6 items-start">
                            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm transition-transform duration-500 group-hover:scale-110 shrink-0">
                                <MapPin size={20} className="sm:h-7 sm:w-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
                                    Table Management <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                                </h3>
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                                    Assign QR codes to your physical tables so customers can scan and order directly from their phone.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href={`/dashboard/restaurant/${tenantSlug}/design`}>
                    <Card className="shadow-none border-slate-200 hover:border-purple-500/50 hover:bg-purple-50/10 transition-all group p-4 sm:p-6 h-full">
                        <div className="flex gap-3 sm:gap-6 items-start">
                            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm transition-transform duration-500 group-hover:scale-110 shrink-0">
                                <Paintbrush size={20} className="sm:h-7 sm:w-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
                                    Design Studio <ChevronRight size={16} className="text-slate-300 group-hover:text-purple-500 transition-colors shrink-0" />
                                </h3>
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                                    Customize your restaurant&apos;s look and feel. Choose from premium templates.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href={`/dashboard/restaurant/${tenantSlug}/waiters`}>
                    <Card className="shadow-none border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-50/10 transition-all group p-4 sm:p-6 h-full">
                        <div className="flex gap-3 sm:gap-6 items-start">
                            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm transition-transform duration-500 group-hover:scale-110 shrink-0">
                                <Users size={20} className="sm:h-7 sm:w-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
                                    Waiter Management <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                                </h3>
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                                    Create staff accounts with PINs and assign tables so waiters can manage their own orders.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href={`/dashboard/restaurant/${tenantSlug}/reservations`}>
                    <Card className="shadow-none border-slate-200 hover:border-pink-500/50 hover:bg-pink-50/10 transition-all group p-4 sm:p-6 h-full">
                        <div className="flex gap-3 sm:gap-6 items-start">
                            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-sm transition-transform duration-500 group-hover:scale-110 shrink-0">
                                <CalendarCheck size={20} className="sm:h-7 sm:w-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
                                    Table Reservations <ChevronRight size={16} className="text-slate-300 group-hover:text-pink-500 transition-colors shrink-0" />
                                </h3>
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                                    Manage incoming booking requests from your customers. Approve or cancel reservations.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href={`/dashboard/restaurant/${tenantSlug}/reports`}>
                    <Card className="shadow-none border-slate-200 hover:border-violet-500/50 hover:bg-violet-50/10 transition-all group p-4 sm:p-6 h-full">
                        <div className="flex gap-3 sm:gap-6 items-start">
                            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 shadow-sm transition-transform duration-500 group-hover:scale-110 shrink-0">
                                <BarChart3 size={20} className="sm:h-7 sm:w-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
                                    Rapports Mensuels <ChevronRight size={16} className="text-slate-300 group-hover:text-violet-500 transition-colors shrink-0" />
                                </h3>
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                                    Rapports PDF envoyés par email le 1er de chaque mois.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href={`/dashboard/restaurant/${tenantSlug}/orders`} className="md:col-span-2">
                    <Card className="shadow-none border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all group p-4 sm:p-8">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
                            <div className="h-12 w-12 sm:h-20 sm:w-20 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0 transition-transform duration-500 group-hover:scale-110">
                                <ClipboardList size={24} className="sm:h-10 sm:w-10" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg sm:text-2xl font-black mb-1 sm:mb-3 flex items-center gap-2 sm:gap-3">
                                    Live Orders Monitor <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                                </h3>
                                <p className="text-slate-500 text-sm sm:text-lg">
                                    Track incoming orders across all your tables. Update statuses from cooking to served in real-time.
                                </p>
                            </div>
                            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 h-11 sm:h-16 px-6 sm:px-10 rounded-xl sm:rounded-2xl text-base sm:text-xl font-black shadow-xl shadow-emerald-500/20 active:scale-95 shrink-0">
                                Launch Monitor
                            </Button>
                        </div>
                    </Card>
                </Link>

                <Link href={`/dashboard/restaurant/${tenantSlug}/analytics`} className="md:col-span-2">
                    <Card className="shadow-none border-slate-200 hover:border-cyan-500/50 hover:bg-cyan-50/10 transition-all group p-4 sm:p-8">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
                            <div className="h-12 w-12 sm:h-20 sm:w-20 rounded-3xl bg-cyan-100 flex items-center justify-center text-cyan-600 shadow-sm shrink-0 transition-transform duration-500 group-hover:scale-110">
                                <TrendingUp size={24} className="sm:h-10 sm:w-10" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg sm:text-2xl font-black mb-1 sm:mb-3 flex items-center gap-2 sm:gap-3">
                                    Analytique Live <ChevronRight size={20} className="text-slate-300 group-hover:text-cyan-500 transition-colors shrink-0" />
                                </h3>
                                <p className="text-slate-500 text-sm sm:text-lg">
                                    Explorez vos revenus, ventes par tranche avec filtre jour, mois, année.
                                </p>
                            </div>
                            <Button className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 h-11 sm:h-16 px-6 sm:px-10 rounded-xl sm:rounded-2xl text-base sm:text-xl font-black shadow-xl shadow-cyan-500/20 active:scale-95 shrink-0">
                                Voir Rapports
                            </Button>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
