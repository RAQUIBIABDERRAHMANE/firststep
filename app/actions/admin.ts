'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'
import { revalidatePath } from 'next/cache'

export async function getAllUsersWithServices() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                role: 'CLIENT'
            },
            include: {
                services: {
                    include: {
                        service: true
                    }
                },
                paymentRequests: {
                    include: {
                        service: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                websites: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return users
    } catch (error) {
        console.error('Failed to fetch users with services:', error)
        return []
    }
}

export async function adminToggleUserService(userId: string, serviceId: string, action: 'add' | 'remove') {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    try {
        if (action === 'add') {
            // Check if service already exists
            const existingService = await prisma.userService.findFirst({
                where: {
                    userId: userId,
                    serviceId: serviceId
                }
            })

            if (existingService) {
                return { error: 'User already has this service' }
            }

            // Add service directly without payment
            await prisma.userService.create({
                data: {
                    userId: userId,
                    serviceId: serviceId,
                    notify: false
                }
            })

            // If there's a pending payment for this service, mark it as PAID
            await prisma.paymentRequest.updateMany({
                where: {
                    userId: userId,
                    serviceId: serviceId,
                    status: 'PENDING'
                },
                data: {
                    status: 'PAID',
                    confirmedAt: new Date(),
                    confirmedBy: user.id
                }
            })

        } else {
            // Remove service
            await prisma.userService.deleteMany({
                where: {
                    userId: userId,
                    serviceId: serviceId
                }
            })
        }

        revalidatePath('/admin/services')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Failed to toggle user service:', error)
        return { error: 'Failed to update service' }
    }
}

export async function adminCancelPaymentRequest(paymentId: string) {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    try {
        await prisma.paymentRequest.update({
            where: { id: paymentId },
            data: { 
                status: 'CANCELLED',
                confirmedAt: new Date(),
                confirmedBy: user.id
            }
        })

        revalidatePath('/admin/services')
        revalidatePath('/admin/payments')
        return { success: true }
    } catch (error) {
        console.error('Failed to cancel payment:', error)
        return { error: 'Failed to cancel payment' }
    }
}

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
                const notifications = interestedUsers.map((us: { userId: string }) => ({
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
