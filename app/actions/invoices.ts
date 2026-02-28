'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { sendInvoiceEmail } from '@/lib/mail'

// ============= INVOICE SETTINGS =============

export async function getInvoiceSettings(tenantId: string) {
    try {
        const settings = await prisma.invoiceSettings.findUnique({ where: { tenantId } })
        return { success: true, settings }
    } catch {
        return { success: false, error: 'Failed to fetch settings' }
    }
}

export async function saveInvoiceSettings(data: {
    tenantId: string
    companyName?: string
    companyAddress?: string
    companyPhone?: string
    companyEmail?: string
    taxRate?: number
    currency?: string
    prefix?: string
    footerNote?: string
    bankDetails?: string
}, slug?: string) {
    try {
        const settings = await prisma.invoiceSettings.upsert({
            where: { tenantId: data.tenantId },
            update: {
                companyName: data.companyName,
                companyAddress: data.companyAddress,
                companyPhone: data.companyPhone,
                companyEmail: data.companyEmail,
                taxRate: data.taxRate ?? 0,
                currency: data.currency ?? 'MAD',
                prefix: data.prefix ?? 'FAC',
                footerNote: data.footerNote,
                bankDetails: data.bankDetails,
            },
            create: {
                tenantId: data.tenantId,
                companyName: data.companyName,
                companyAddress: data.companyAddress,
                companyPhone: data.companyPhone,
                companyEmail: data.companyEmail,
                taxRate: data.taxRate ?? 0,
                currency: data.currency ?? 'MAD',
                prefix: data.prefix ?? 'FAC',
                footerNote: data.footerNote,
                bankDetails: data.bankDetails,
            }
        })
        if (slug) revalidatePath(`/dashboard/cabinet/${slug}/invoices`)
        return { success: true, settings }
    } catch {
        return { success: false, error: 'Failed to save settings' }
    }
}

// ============= INVOICES =============

async function generateInvoiceNumber(tenantId: string): Promise<string> {
    const settings = await prisma.invoiceSettings.findUnique({ where: { tenantId } })
    const prefix = settings?.prefix ?? 'FAC'
    const nextNum = settings?.nextNumber ?? 1
    const year = new Date().getFullYear()
    const number = `${prefix}-${year}-${String(nextNum).padStart(4, '0')}`

    // Increment counter
    await prisma.invoiceSettings.upsert({
        where: { tenantId },
        update: { nextNumber: nextNum + 1 },
        create: { tenantId, nextNumber: nextNum + 1 }
    })

    return number
}

export async function getInvoices(tenantId: string) {
    try {
        const invoices = await prisma.invoice.findMany({
            where: { tenantId },
            include: {
                items: true,
                client: { select: { id: true, name: true, email: true, phone: true } }
            },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, invoices }
    } catch {
        return { success: false, error: 'Failed to fetch invoices' }
    }
}

export async function getInvoice(id: string) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                items: true,
                client: true,
                tenant: { include: { invoiceSettings: true } }
            }
        })
        return { success: true, invoice }
    } catch {
        return { success: false, error: 'Failed to fetch invoice' }
    }
}

export async function createInvoice(data: {
    tenantId: string
    clientId?: string
    clientName: string
    clientEmail?: string
    clientPhone?: string
    clientAddress?: string
    dueDate?: Date
    taxRate?: number
    notes?: string
    items: { description: string; quantity: number; unitPrice: number }[]
}, slug?: string) {
    try {
        const number = await generateInvoiceNumber(data.tenantId)

        const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
        const taxRate = data.taxRate ?? 0
        const taxAmount = subtotal * (taxRate / 100)
        const total = subtotal + taxAmount

        const invoice = await prisma.invoice.create({
            data: {
                tenantId: data.tenantId,
                clientId: data.clientId,
                number,
                clientName: data.clientName,
                clientEmail: data.clientEmail,
                clientPhone: data.clientPhone,
                clientAddress: data.clientAddress,
                dueDate: data.dueDate,
                taxRate,
                taxAmount,
                subtotal,
                total,
                notes: data.notes,
                items: {
                    create: data.items.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        total: item.quantity * item.unitPrice
                    }))
                }
            },
            include: { items: true }
        })

        if (slug) revalidatePath(`/dashboard/cabinet/${slug}/invoices`)
        return { success: true, invoice }
    } catch {
        
        return { success: false, error: 'Failed to create invoice' }
    }
}

export async function updateInvoice(id: string, data: {
    clientName?: string
    clientEmail?: string
    clientPhone?: string
    clientAddress?: string
    dueDate?: Date
    taxRate?: number
    notes?: string
    status?: string
    items?: { description: string; quantity: number; unitPrice: number }[]
}, slug?: string) {
    try {
        let updateData: Record<string, unknown> = {
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            clientPhone: data.clientPhone,
            clientAddress: data.clientAddress,
            dueDate: data.dueDate,
            notes: data.notes,
            status: data.status,
        }

        if (data.items) {
            const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
            const taxRate = data.taxRate ?? 0
            const taxAmount = subtotal * (taxRate / 100)
            const total = subtotal + taxAmount

            updateData = {
                ...updateData,
                subtotal,
                taxRate,
                taxAmount,
                total,
                items: {
                    deleteMany: {},
                    create: data.items.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        total: item.quantity * item.unitPrice
                    }))
                }
            }
        }

        const invoice = await prisma.invoice.update({
            where: { id },
            data: updateData,
            include: { items: true }
        })

        if (slug) revalidatePath(`/dashboard/cabinet/${slug}/invoices`)
        return { success: true, invoice }
    } catch (error) {
        console.error('[createInvoice]', error)
        return { success: false, error: 'Failed to update invoice' }
    }
}

export async function updateInvoiceStatus(id: string, status: string, slug?: string) {
    try {
        const data: Record<string, unknown> = { status }
        if (status === 'SENT') data.sentAt = new Date()
        if (status === 'PAID') data.paidAt = new Date()

        const updated = await prisma.invoice.update({ where: { id }, data })

        let emailSent = false
        let emailError: string | undefined

        if (status === 'SENT') {
            // Fetch full invoice with items and settings for email
            const full = await prisma.invoice.findUnique({
                where: { id },
                include: {
                    items: true,
                    tenant: { include: { invoiceSettings: true } },
                },
            })

            if (full && full.clientEmail) {
                const settings = full.tenant?.invoiceSettings ?? null
                const result = await sendInvoiceEmail(
                    {
                        number: full.number,
                        issueDate: full.issueDate,
                        dueDate: full.dueDate,
                        clientName: full.clientName,
                        clientEmail: full.clientEmail,
                        subtotal: full.subtotal,
                        taxRate: full.taxRate,
                        taxAmount: full.taxAmount,
                        total: full.total,
                        notes: full.notes,
                        items: full.items.map(i => ({
                            description: i.description,
                            quantity: i.quantity,
                            unitPrice: i.unitPrice,
                            total: i.total,
                        })),
                    },
                    settings
                        ? {
                            companyName: settings.companyName,
                            companyAddress: settings.companyAddress,
                            companyPhone: settings.companyPhone,
                            companyEmail: settings.companyEmail,
                            currency: settings.currency,
                            footerNote: settings.footerNote,
                            bankDetails: settings.bankDetails,
                        }
                        : null
                )
                emailSent = result.success
                if (!result.success) emailError = 'Échec de l\'envoi de l\'email'
            } else if (full && !full.clientEmail) {
                emailError = 'Aucune adresse email client'
            }
        }

        if (slug) revalidatePath(`/dashboard/cabinet/${slug}/invoices`)
        return { success: true, invoice: updated, emailSent, emailError }
    } catch {
        return { success: false, error: 'Failed to update status', emailSent: false }
    }
}

export async function deleteInvoice(id: string, slug?: string) {
    try {
        await prisma.invoice.delete({ where: { id } })
        if (slug) revalidatePath(`/dashboard/cabinet/${slug}/invoices`)
        return { success: true }
    } catch {
        return { success: false, error: 'Failed to delete invoice' }
    }
}
