import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Layers, Bell, ArrowUpRight } from 'lucide-react'
import AutoRefresh from '@/components/dashboard/AutoRefresh'

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) return null

    const userServices = await prisma.userService.findMany({
        where: { userId: user.id },
        include: { service: true },
    })

    const websiteInstances = await prisma.tenantWebsite.findMany({
        where: { userId: user.id },
        include: { service: true }
    })

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <AutoRefresh />
            {/* Header: Clean and authoritative */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{user.companyName}</h1>
                <p className="text-muted-foreground mt-1 text-lg">
                    System Overview
                </p>
            </div>

            {/* Metrics: Solid, clean numbers */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight text-foreground">{userServices.length}</div>
                        <p className="text-sm text-muted-foreground mt-1">Operational modules</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Website Instances</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight text-foreground">{websiteInstances.length}</div>
                        <p className="text-sm text-muted-foreground mt-1">Live digital assets</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm font-medium text-foreground">All Systems Normal</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content: Clean list */}
            <div className="grid gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">Your Active Instances</h2>
                </div>

                {websiteInstances.length === 0 ? (
                    <Card className="glass-card border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="rounded-full bg-primary/10 p-3 mb-4">
                                <span className="text-xl font-bold text-primary">?</span>
                            </div>
                            <h3 className="text-lg font-medium text-foreground">No active websites</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
                                Get started by setting up your first service website.
                            </p>
                            <Link href="/dashboard/website">
                                <Button>Setup Website</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {websiteInstances.map((site) => (
                            <Card key={site.id} className="glass-card flex flex-col justify-between group hover:border-primary/50 transition-all shadow-none">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{site.siteName}</CardTitle>
                                            <p className="text-xs font-medium text-muted-foreground bg-slate-100 rounded-full py-0.5 px-2 w-fit">
                                                {site.service.name}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">
                                            {site.slug}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                                        {site.description || "Manage your digital presence and operations."}
                                    </p>
                                </CardHeader>
                                <CardFooter className="pt-0 flex gap-2">
                                    {site.service.slug.includes('restaurant') ? (
                                        <Link href={`/dashboard/restaurant/${site.slug}`} className="flex-1">
                                            <Button variant="default" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 font-bold">
                                                Restaurant Admin
                                            </Button>
                                        </Link>
                                    ) : (site.service.slug.includes('cabinet') || site.service.slug.includes('professional-services')) ? (
                                        <Link href={`/dashboard/cabinet/${site.slug}`} className="flex-1">
                                            <Button variant="default" size="sm" className="w-full font-bold">
                                                Cabinet Admin
                                            </Button>
                                        </Link>
                                    ) : null}
                                    <Link href={`/${site.slug}`} target="_blank">
                                        <Button variant="outline" size="sm" className="px-3" title="View Site">
                                            <ArrowUpRight size={16} />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}

                        {/* Setup new instance CTA */}
                        {userServices.length > websiteInstances.length && (
                            <Link href="/dashboard/website">
                                <Card className="glass-card border-dashed flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:bg-slate-50 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                        <Layers size={20} />
                                    </div>
                                    <h3 className="font-bold text-sm">Setup Missing Service</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Configure your other subscribed services</p>
                                </Card>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
