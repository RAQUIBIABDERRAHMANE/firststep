import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default async function AdminUsersPage() {
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
    })

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    User Directory
                </h1>
                <p className="text-muted-foreground text-lg">
                    Manage and view all registered businesses on the platform.
                </p>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle>All Users ({users.length})</CardTitle>
                    <CardDescription>Complete list of platform accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto rounded-md border">
                        <table className="w-full text-sm text-left text-muted-foreground">
                            <thead className="text-xs text-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Company / Email</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Active Services</th>
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
