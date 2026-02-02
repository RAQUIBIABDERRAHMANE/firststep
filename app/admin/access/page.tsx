import { getCurrentUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import AdminClientAccess from '@/components/admin/AdminClientAccess'

export default async function AdminClientAccessPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const clients = await prisma.user.findMany({
        where: {
            role: 'CLIENT'
        },
        include: {
            websites: {
                include: {
                    service: {
                        select: {
                            slug: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        },
        orderBy: {
            companyName: 'asc'
        }
    })

    const activeWebsites = clients.reduce((acc, client) => 
        acc + client.websites.filter(w => w.isActive).length, 0
    )

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                    Client <span className="text-primary">Access</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Quick access to all client websites and dashboards
                </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{clients.length}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Websites</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {clients.reduce((acc, c) => acc + c.websites.length, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Websites</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-500">{activeWebsites}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Client Access Component */}
            <AdminClientAccess clients={clients} />
        </div>
    )
}
