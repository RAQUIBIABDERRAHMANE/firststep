'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { sendHtmlEmail } from '@/lib/mail'
import { getCurrentUser } from './auth'
import { replaceVariables } from '@/lib/variables'

export async function createCampaign(prevState: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { message: 'Unauthorized' }
    }

    const subject = formData.get('subject') as string
    const content = formData.get('content') as string

    if (!subject || !content) {
        return { message: 'Subject and content are required' }
    }

    try {
        await prisma.campaign.create({
            data: {
                subject,
                content,
                status: 'DRAFT',
            },
        })
    } catch (error) {
        return { message: 'Failed to create campaign' }
    }

    revalidatePath('/admin/campaigns')
    redirect('/admin/campaigns')
}

export async function getCampaigns() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    return await prisma.campaign.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export async function getCampaign(id: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    return await prisma.campaign.findUnique({
        where: { id },
    })
}

export async function deleteCampaign(id: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    await prisma.campaign.delete({
        where: { id }
    })

    revalidatePath('/admin/campaigns')
}

export async function updateCampaignRecipients(campaignId: string, selectedRecipients: string[]) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    await prisma.campaign.update({
        where: { id: campaignId },
        data: {
            selectedRecipients: JSON.stringify(selectedRecipients),
        },
    })

    revalidatePath(`/admin/campaigns/${campaignId}`)
    revalidatePath('/admin/campaigns')
}

export async function sendCampaign(id: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { success: false, message: 'Unauthorized' }
    }

    const campaign = await prisma.campaign.findUnique({
        where: { id },
    })

    if (!campaign) {
        return { success: false, message: 'Campaign not found' }
    }

    if (campaign.status === 'SENT' || campaign.status === 'SENDING') {
        return { success: false, message: 'Campaign already sent or sending' }
    }

    // Update status to SENDING
    await prisma.campaign.update({
        where: { id },
        data: { status: 'SENDING' },
    })

    try {
        // Parse selected recipients
        const selectedRecipientIds = JSON.parse(campaign.selectedRecipients || '[]')

        if (selectedRecipientIds.length === 0) {
            return { success: false, message: 'No recipients selected' }
        }

        // Fetch only selected users
        const users = await prisma.user.findMany({
            where: {
                id: { in: selectedRecipientIds },
            },
            select: {
                id: true,
                email: true,
                companyName: true,
                createdAt: true,
            },
        })

        let successCount = 0
        let failureCount = 0

        for (const u of users) {
            // Prepare data for variable replacement
            const userData = {
                email: u.email,
                companyName: u.companyName || '',
                name: u.companyName || '',
                registrationDate: u.createdAt,
            }

            // Replace variables in both subject and content
            const personalizedSubject = replaceVariables(campaign.subject, userData)
            const personalizedContent = replaceVariables(campaign.content, userData)

            // Wrap in HTML template
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <body style="font-family: sans-serif; color: #333; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        ${personalizedContent.replace(/\n/g, '<br>')}
                        
                        <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #999;">
                            You are receiving this email because you are a registered user of FirstStep SaaS.
                        </p>
                    </div>
                </body>
                </html>
            `

            const result = await sendHtmlEmail(u.email, personalizedSubject, htmlContent)
            if (result.success) {
                successCount++
            } else {
                failureCount++
            }
        }

        await prisma.campaign.update({
            where: { id },
            data: {
                status: 'SENT',
                sentAt: new Date(),
                recipientCount: users.length,
                successCount,
                failureCount,
            },
        })

        revalidatePath('/admin/campaigns')
        return { success: true, message: `Campaign sent to ${successCount} users` }

    } catch (error) {
        console.error('Campaign sending error:', error)
        await prisma.campaign.update({
            where: { id },
            data: { status: 'FAILED' },
        })
        return { success: false, message: 'Failed to send campaign' }
    }
}
