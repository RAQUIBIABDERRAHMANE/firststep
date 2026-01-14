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
    LayoutDashboard
} from 'lucide-react'

export default async function RestaurantDashboardPage() {
    // Force re-evaluation of imports
    const user = await getCurrentUser()
    if (!user) return null

    const tenant = await prisma.tenantWebsite.findFirst({
        where: { userId: user.id }
    })

    if (!tenant) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <Utensils size={64} className="text-slate-200" />
                <h2 className="text-2xl font-bold">No Website Found</h2>
                <p className="text-muted-foreground">You need to set up your website first before managing your restaurant.</p>
                <Link href="/dashboard/website">
                    <Button>Set Up Website</Button>
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

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <LayoutDashboard className="text-blue-600" /> Restaurant Admin
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your digital menu, floor plan, and incoming orders.
                    </p>
                </div>
                <Link href={`/${tenant.slug}`} target="_blank">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        View Live Site <ExternalLink size={14} />
                    </Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card shadow-none border-slate-200/60 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Active Tables</CardTitle>
                        <MapPin size={18} className="text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">{tableCount}</div>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp size={12} className="text-emerald-500" /> Managed physical points
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card shadow-none border-slate-200/60 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Menu Items</CardTitle>
                        <Utensils size={18} className="text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">{menuCount}</div>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp size={12} className="text-emerald-500" /> Live products
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card shadow-none border-slate-200/60 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Total Orders</CardTitle>
                        <ClipboardList size={18} className="text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">{orderCount}</div>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp size={12} className="text-emerald-500" /> Transactions processed
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Management Portal */}
            <div className="grid gap-6 md:grid-cols-2">
                <Link href="/dashboard/restaurant/menu">
                    <Card className="glass-card shadow-none border-slate-200/60 hover:border-blue-500/50 hover:bg-blue-50/10 transition-all group p-6 h-full">
                        <div className="flex gap-6 items-start">
                            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-transform duration-500 group-hover:scale-110">
                                <Utensils size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    Menu Management <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Edit your dishes, categories, and pricing in real-time. Changes reflect instantly on your website.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="/dashboard/restaurant/tables">
                    <Card className="glass-card shadow-none border-slate-200/60 hover:border-blue-500/50 hover:bg-blue-50/10 transition-all group p-6 h-full">
                        <div className="flex gap-6 items-start">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm transition-transform duration-500 group-hover:scale-110">
                                <MapPin size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    Table Management <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Assign QR codes to your physical tables so customers can scan and order directly from their phone.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="/dashboard/restaurant/orders" className="md:col-span-2">
                    <Card className="glass-card shadow-none border-slate-200/60 hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all group p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="h-20 w-20 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0 transition-transform duration-500 group-hover:scale-110">
                                <ClipboardList size={40} />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-black mb-3 flex items-center justify-center md:justify-start gap-3">
                                    Live Orders Monitor <ChevronRight size={24} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                </h3>
                                <p className="text-slate-500 text-lg">
                                    Track incoming orders across all your tables. Update statuses from cooking to served in real-time.
                                </p>
                            </div>
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 h-16 px-10 rounded-2xl text-xl font-black shadow-xl shadow-emerald-500/20 active:scale-95">
                                Launch Monitor
                            </Button>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
