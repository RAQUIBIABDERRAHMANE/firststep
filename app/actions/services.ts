'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'

export async function getServices() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { createdAt: 'asc' },
        })
        return services
    } catch (error) {
        console.error('Failed to fetch services:', error)
        return []
    }
}

export async function getUserServices() {
    const user = await getCurrentUser()

    if (!user) return []

    try {
        const userServices = await prisma.userService.findMany({
            where: { userId: user.id },
            include: { service: true },
            orderBy: { selectedAt: 'desc' },
        })
        return userServices
    } catch (error) {
        console.error('Failed to fetch user services:', error)
        return []
    }
}

export async function addUserService(serviceId: string) {
    const user = await getCurrentUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    try {
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
        })

        if (!service) {
            return { error: 'Service not found' }
        }

        await prisma.userService.create({
            data: {
                userId: user.id,
                serviceId: serviceId,
                notify: service.status === 'COMING_SOON',
            },
        })

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/services')
        return { success: true }
    } catch (error) {
        console.error('Failed to add service:', error)
        return { error: 'Failed to add service' }
    }
}

export async function removeUserService(serviceId: string) {
    const user = await getCurrentUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    try {
        await prisma.userService.deleteMany({
            where: {
                userId: user.id,
                serviceId: serviceId,
            },
        })

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/services')
        return { success: true }
    } catch (error) {
        console.error('Failed to remove service:', error)
        return { error: 'Failed to remove service' }
    }
}
