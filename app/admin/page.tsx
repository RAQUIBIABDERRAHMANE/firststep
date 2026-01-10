import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Users, CreditCard, Activity, ArrowUpRight } from 'lucide-react'

export default async function AdminPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const users = await prisma.user.findMany({
        include: {
            services: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 10,
    })

    const totalUsers = await prisma.user.count()
    const totalSubscriptions = users.reduce((acc: number, user: any) => acc + user.services.length, 0)

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                    Admin <span className="text-primary">Overview</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Monitor platform growth and manage system modules.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="shadow-sm hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Service Subscriptions</CardTitle>
                        <CreditCard className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalSubscriptions}</div>
                        <p className="text-xs text-muted-foreground mt-1">Average 2.4 per user</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Systems</CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">14</div>
                        <p className="text-xs text-muted-foreground mt-1">Global platform health: 99.9%</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle>Recent User Activity</CardTitle>
                    <CardDescription>Latest business signups and their module interests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto rounded-md border">
                        <table className="w-full text-sm text-left text-muted-foreground">
                            <thead className="text-xs text-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Company / Email</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Services</th>
                                    <th className="px-6 py-4 font-semibold">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((u: any) => (
                                    <tr key={u.id} className="bg-background hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{u.companyName}</div>
                                            <div className="text-xs text-muted-foreground">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${u.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <span className="font-bold text-foreground">{u.services.length}</span>
                                                <span className="text-xs">modules</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
