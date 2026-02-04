'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { sendPaymentRequestEmail } from '@/lib/mail'
import { getBankAccount } from './payments'

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

        // Check if user already has this service
        const existingUserService = await prisma.userService.findFirst({
            where: {
                userId: user.id,
                serviceId: serviceId,
            }
        })

        if (existingUserService) {
            return { error: 'Vous avez déjà accès à ce service' }
        }

        // For coming soon services, just add notification
        if (service.status === 'COMING_SOON') {
            await prisma.userService.create({
                data: {
                    userId: user.id,
                    serviceId: serviceId,
                    notify: true,
                },
            })
            revalidatePath('/dashboard')
            revalidatePath('/dashboard/services')
            return { success: true, type: 'notification' }
        }

        // Check if user already has a pending payment for this service
        const existingPayment = await prisma.paymentRequest.findFirst({
            where: {
                userId: user.id,
                serviceId: serviceId,
                status: 'PENDING'
            }
        })

        if (existingPayment) {
            // Return existing payment request instead of creating new one
            revalidatePath('/dashboard')
            revalidatePath('/dashboard/services')
            return { success: true, type: 'payment', paymentId: existingPayment.id }
        }

        // For available services, create payment request
        // Use price from database, fallback to default if not set
        const servicePrice = service.price || 99.00
        
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

        const paymentRequest = await prisma.paymentRequest.create({
            data: {
                userId: user.id,
                serviceId: serviceId,
                amount: servicePrice,
                expiresAt: expiresAt,
            },
        })

        console.log('[SERVICE] Payment request created, sending email...')
        
        // Get bank account details and send email
        const bankAccount = await getBankAccount()
        if (bankAccount) {
            const emailResult = await sendPaymentRequestEmail(
                user.email,
                user.companyName || 'Client',
                service.name,
                servicePrice,
                {
                    accountName: bankAccount.accountName,
                    accountNumber: bankAccount.iban || '',
                    rib: bankAccount.rib || '',
                    bankName: bankAccount.bankName
                }
            )
            console.log('[SERVICE] Email result:', emailResult)
        } else {
            console.log('[SERVICE] No bank account found, skipping email')
        }

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/services')
        return { success: true, type: 'payment', paymentId: paymentRequest.id }
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
