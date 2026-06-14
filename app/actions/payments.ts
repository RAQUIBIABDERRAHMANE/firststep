'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { sendPaymentRequestEmail, sendPaymentApprovedEmail, sendPaymentDeclinedEmail } from '@/lib/mail'

export async function createPaymentRequest(serviceId: string, amount: number) {
    const user = await getCurrentUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    try {
        // Check if service exists
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
        })

        if (!service) {
            return { error: 'Service not found' }
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
            return { error: 'Vous avez déjà une demande de paiement en attente pour ce service' }
        }

        // Create payment request (expires in 7 days)
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        const paymentRequest = await prisma.paymentRequest.create({
            data: {
                userId: user.id,
                serviceId: serviceId,
                amount: amount,
                expiresAt: expiresAt,
            },
        })

        // Get bank account details
        const bankAccount = await getBankAccount()
        
        console.log('[PAYMENT] Sending email to:', user.email)
        console.log('[PAYMENT] Bank account found:', !!bankAccount)
        
        // Send email with bank details to the client
        if (bankAccount) {
            const emailResult = await sendPaymentRequestEmail(
                user.email,
                user.companyName || 'Client',
                service.name,
                amount,
                {
                    accountName: bankAccount.accountName,
                    accountNumber: bankAccount.iban || '',
                    rib: bankAccount.rib || '',
                    bankName: bankAccount.bankName
                }
            )
            console.log('[PAYMENT] Email result:', emailResult)
        } else {
            console.log('[PAYMENT] No bank account found, skipping email')
        }

        revalidatePath('/services')
        revalidatePath('/dashboard')
        return { success: true, paymentId: paymentRequest.id }
    } catch (error) {
        console.error('Failed to create payment request:', error)
        return { error: 'Failed to create payment request' }
    }
}

export async function getPaymentRequest(paymentId: string) {
    const user = await getCurrentUser()

    if (!user) {
        return null
    }

    try {
        const paymentRequest = await prisma.paymentRequest.findUnique({
            where: { id: paymentId },
            include: {
                service: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        category: true,
                        status: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        companyName: true
                    }
                },
            },
        })

        // Check if user owns this payment request
        if (paymentRequest?.userId !== user.id) {
            return null
        }

        return paymentRequest
    } catch (error) {
        console.error('Failed to fetch payment request:', error)
        return null
    }
}

export async function getBankAccount() {
    try {
        const bankAccount = await prisma.bankAccount.findFirst({
            where: { isActive: true },
            select: {
                id: true,
                accountName: true,
                iban: true,
                rib: true,
                bic: true,
                bankName: true,
                createdAt: true
            }
        })
        return bankAccount
    } catch (error) {
        console.error('Failed to fetch bank account:', error)
        return null
    }
}

export async function updateTransferReference(paymentId: string, reference: string) {
    const user = await getCurrentUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    try {
        const paymentRequest = await prisma.paymentRequest.findUnique({
            where: { id: paymentId },
        })

        if (!paymentRequest || paymentRequest.userId !== user.id) {
            return { error: 'Payment request not found' }
        }

        await prisma.paymentRequest.update({
            where: { id: paymentId },
            data: { transferReference: reference },
        })

        return { success: true }
    } catch (error) {
        console.error('Failed to update transfer reference:', error)
        return { error: 'Failed to update transfer reference' }
    }
}

// Admin functions
export async function getAllPendingPayments() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        return []
    }

    try {
        const payments = await prisma.paymentRequest.findMany({
            where: { status: 'PENDING' },
            include: {
                user: true,
                service: true,
            },
            orderBy: { createdAt: 'desc' },
        })

        return payments
    } catch (error) {
        console.error('Failed to fetch pending payments:', error)
        return []
    }
}

export async function confirmPayment(paymentId: string) {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        const paymentRequest = await prisma.paymentRequest.findUnique({
            where: { id: paymentId },
            include: {
                user: true,
                service: true,
            }
        })

        if (!paymentRequest) {
            return { error: 'Payment request not found' }
        }

        // Update payment status
        await prisma.paymentRequest.update({
            where: { id: paymentId },
            data: {
                status: 'PAID',
                confirmedAt: new Date(),
                confirmedBy: user.id,
            },
        })

        // Add service to user
        await prisma.userService.create({
            data: {
                userId: paymentRequest.userId,
                serviceId: paymentRequest.serviceId,
                notify: false,
            },
        })

        // Generate facture PDF
        let facturePdf: Uint8Array | undefined
        let factureNumber: string | undefined

        try {
            const { generateFacturePdf, generateNextFactureNumber } = await import('@/lib/facture-pdf')

            factureNumber = await generateNextFactureNumber()

            const factureData = {
                factureNumber,
                date: new Date().toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }),
                clientName: paymentRequest.user.companyName || 'Client',
                clientEmail: paymentRequest.user.email,
                clientCompany: paymentRequest.user.companyName || '',
                serviceName: paymentRequest.service.name,
                servicePrice: `${paymentRequest.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD`,
                subtotal: `${paymentRequest.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD`,
                total: `${paymentRequest.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD`,
            }

            facturePdf = await generateFacturePdf(factureData)

            // Upload PDF to Cloudflare R2
            let pdfUrl: string | undefined
            if (facturePdf) {
                try {
                    const { uploadImage } = await import('@/lib/r2')
                    const filename = `factures/${factureNumber}.pdf`
                    pdfUrl = await uploadImage(Buffer.from(facturePdf), filename, 'application/pdf')
                    console.log(`[PAYMENT] Facture PDF uploaded to R2: ${pdfUrl}`)
                } catch (uploadError) {
                    console.error('[PAYMENT] Failed to upload facture PDF to R2:', uploadError)
                }
            }

            // Save facture record with R2 URL
            await prisma.factureRecord.create({
                data: {
                    number: factureNumber,
                    paymentId: paymentRequest.id,
                    userId: paymentRequest.userId,
                    serviceName: paymentRequest.service.name,
                    clientName: paymentRequest.user.companyName || 'Client',
                    clientEmail: paymentRequest.user.email,
                    amount: paymentRequest.amount,
                    pdfUrl: pdfUrl || null,
                },
            })

            console.log(`[PAYMENT] Facture ${factureNumber} generated for payment ${paymentId}`)
        } catch (factureError) {
            console.error('[PAYMENT] Failed to generate facture PDF:', factureError)
            // Continue without facture - don't block payment confirmation
        }

        // Send approval email to the client (with facture PDF if generated)
        console.log('[PAYMENT] Sending approval email to:', paymentRequest.user.email)
        const approvalResult = await sendPaymentApprovedEmail(
            paymentRequest.user.email,
            paymentRequest.user.companyName || 'Client',
            paymentRequest.service.name,
            paymentRequest.amount,
            facturePdf,
            factureNumber
        )
        console.log('[PAYMENT] Approval email result:', approvalResult)

        revalidatePath('/admin')
        revalidatePath('/dashboard')
        return { success: true, factureNumber }
    } catch (error) {
        console.error('Failed to confirm payment:', error)
        return { error: 'Failed to confirm payment' }
    }
}

export async function rejectPayment(paymentId: string) {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        const paymentRequest = await prisma.paymentRequest.findUnique({
            where: { id: paymentId },
            include: {
                user: true,
                service: true,
            }
        })

        if (!paymentRequest) {
            return { error: 'Payment request not found' }
        }

        await prisma.paymentRequest.update({
            where: { id: paymentId },
            data: {
                status: 'CANCELLED',
                confirmedBy: user.id,
            },
        })

        // Send decline email to the client
        console.log('[PAYMENT] Sending declined email to:', paymentRequest.user.email)
        const declineResult = await sendPaymentDeclinedEmail(
            paymentRequest.user.email,
            paymentRequest.user.companyName || 'Client',
            paymentRequest.service.name,
            paymentRequest.amount
        )
        console.log('[PAYMENT] Decline email result:', declineResult)

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to reject payment:', error)
        return { error: 'Failed to reject payment' }
    }
}

export async function getUserPaymentRequests() {
    const user = await getCurrentUser()

    if (!user) {
        return []
    }

    try {
        const payments = await prisma.paymentRequest.findMany({
            where: { userId: user.id },
            include: { service: true },
            orderBy: { createdAt: 'desc' },
        })

        return payments
    } catch (error) {
        console.error('Failed to fetch user payment requests:', error)
        return []
    }
}
