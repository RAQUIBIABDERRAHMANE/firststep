import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Bell, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Notification } from '../../../src/generated/client'

export default async function NotificationsPage() {
    const user = await getCurrentUser()

    if (!user) return null

    const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Notifications</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Updates</CardTitle>
                    <CardDescription>Stay updated with the latest service changes.</CardDescription>
                </CardHeader>
                <CardContent>
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <Bell className="h-12 w-12 mb-4 opacity-50" />
                            <p>You have no new notifications.</p>
                            <p className="text-sm">We&apos;ll notify you when your interested services become available.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification: Notification) => (
                                <div key={notification.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                                    <div className="mt-1">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
