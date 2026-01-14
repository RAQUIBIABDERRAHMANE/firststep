import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Layers, Bell, ArrowUpRight } from 'lucide-react'

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) return null

    const userServices = await prisma.userService.findMany({
        where: { userId: user.id },
        include: { service: true },
    })

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
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
                        <CardTitle className="text-sm font-medium text-muted-foreground">Next Invoice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight text-foreground">--</div>
                        <p className="text-sm text-muted-foreground mt-1">No pending charges</p>
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
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">Your Services</h2>
                </div>

                {userServices.length === 0 ? (
                    <Card className="glass-card border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="rounded-full bg-primary/10 p-3 mb-4">
                                <span className="text-xl font-bold text-primary">?</span>
                            </div>
                            <h3 className="text-lg font-medium text-foreground">No active services</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
                                Get started by adding a service to your capability stack.
                            </p>
                            <Link href="/dashboard/services">
                                <Button>Browse Catalog</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {userServices.map((s: any) => (
                            <Card key={s.id} className="glass-card flex flex-col justify-between">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-base font-semibold">{s.service.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.service.description}</p>
                                        </div>
                                        <Badge variant={s.service.status === 'AVAILABLE' ? 'default' : 'secondary'} className="ml-2 capitalize">
                                            {s.service.status === 'AVAILABLE' ? 'active' : 'coming soon'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardFooter className="pt-0">
                                    {s.service.slug === 'restaurant-website' ? (
                                        <Link href="/dashboard/restaurant" className="w-full">
                                            <Button variant="default" size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                                                Restaurant Admin
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button variant="outline" size="sm" className="w-full">Manage</Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
