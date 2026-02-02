import { getCurrentUser } from '@/app/actions/auth'
import { getAllUsersWithServices } from '@/app/actions/admin'
import { getServices } from '@/app/actions/services'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import AdminServiceControl from '@/components/admin/AdminServiceControl'

export default async function AdminServicesPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const users = await getAllUsersWithServices()
    const allServices = await getServices()

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                    Service <span className="text-primary">Management</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Manage all user services and subscriptions
                </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {users.reduce((acc, u) => acc + u.services.length, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-500">
                            {users.reduce((acc, u) => acc + u.paymentRequests.filter(p => p.status === 'PENDING').length, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Available Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-500">
                            {allServices.filter(s => s.status === 'AVAILABLE').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Services List */}
            <div className="space-y-6">
                {users.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No clients found
                        </CardContent>
                    </Card>
                ) : (
                    users.map((client) => (
                        <Card key={client.id} className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{client.companyName}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {client.email} • Joined {new Date(client.createdAt).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                            {client.services.length} Services
                                        </span>
                                        {client.paymentRequests.filter(p => p.status === 'PENDING').length > 0 && (
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                                {client.paymentRequests.filter(p => p.status === 'PENDING').length} Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <AdminServiceControl
                                    userId={client.id}
                                    userServices={client.services}
                                    paymentRequests={client.paymentRequests}
                                    allServices={allServices}
                                />
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
