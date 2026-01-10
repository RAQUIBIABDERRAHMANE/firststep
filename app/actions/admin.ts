'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'
import { revalidatePath } from 'next/cache'

export async function toggleServiceStatus(serviceId: string) {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
        })

        if (!service) {
            return { error: 'Service not found' }
        }

        const newStatus = service.status === 'AVAILABLE' ? 'COMING_SOON' : 'AVAILABLE'

        await prisma.service.update({
            where: { id: serviceId },
            data: { status: newStatus },
        })

        if (newStatus === 'AVAILABLE') {
            // Find interested users
            const interestedUsers = await prisma.userService.findMany({
                where: {
                    serviceId: serviceId,
                    notify: true,
                },
            })

            if (interestedUsers.length > 0) {
                // Create notifications
                const notifications = interestedUsers.map(us => ({
                    userId: us.userId,
                    title: 'Service Available',
                    message: `The service "${service.name}" is now available!`,
                }))

                await prisma.notification.createMany({
                    data: notifications,
                })

                // Reset notify flag
                await prisma.userService.updateMany({
                    where: {
                        serviceId: serviceId,
                        notify: true,
                    },
                    data: { notify: false },
                })
            }
        }

        // If status changes to AVAILABLE, we might want to notify interested users here
        // For now, just revalidate
        revalidatePath('/admin/services')
        revalidatePath('/dashboard/services')
        revalidatePath('/') // Landing page

        return { success: true, status: newStatus }
    } catch (error) {
        console.error('Failed to toggle service status:', error)
        return { error: 'Failed to update service status' }
    }
}
