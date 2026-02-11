'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { sendHtmlEmail } from '@/lib/mail'
import { getCurrentUser } from './auth'
import { replaceVariables } from '@/lib/variables'
import path from 'path'

export async function createCampaign(prevState: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { message: 'Unauthorized' }
    }

    const subject = formData.get('subject') as string
    const content = formData.get('content') as string
    const action = formData.get('action') as string
    const testRecipient = formData.get('testRecipient') as string
    const scheduledAtStr = formData.get('scheduledAt') as string
    const attachmentsStr = formData.get('attachments') as string || '[]'

    if (!subject || !content) {
        return { message: 'Subject and content are required' }
    }

    // Handle Test Email
    if (action === 'test') {
        if (!testRecipient) {
            return { message: 'Test recipient email is required' }
        }

        try {
            // Replace variables with dummy data for test
            const dummyData = {
                email: testRecipient,
                companyName: 'Test Company',
                name: 'Test User',
                registrationDate: new Date().toLocaleDateString(),
            }

            const personalizedSubject = replaceVariables(subject, dummyData)
            const personalizedContent = replaceVariables(content, dummyData)

            // Prepare attachments
            const attachments = JSON.parse(attachmentsStr).map((a: any) => ({
                filename: a.name,
                path: path.join(process.cwd(), 'public', a.url)
            }))

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <body style="font-family: sans-serif; color: #333; line-height: 1.6;">
                    <div style="background: #f0f9ff; padding: 10px; text-align: center; border-bottom: 1px solid #bae6fd; color: #0369a1; font-size: 14px;">
                        <strong>TEST EMAIL</strong> - This is a preview of your campaign.
                    </div>
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        ${personalizedContent.replace(/\n/g, '<br>')}
                        <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #999;">
                            You are receiving this email because you are subscribed to updates from FirstStep SaaS.
                        </p>
                    </div>
                </body>
                </html>
            `

            await sendHtmlEmail(testRecipient, `[TEST] ${personalizedSubject}`, htmlContent, attachments)
            return { message: `Test email sent to ${testRecipient}` }
        } catch (error) {
            console.error('Error sending test email:', error)
            return { message: 'Failed to send test email' }
        }
    }

    try {
        const scheduledAt = scheduledAtStr ? new Date(scheduledAtStr) : null
        const status = scheduledAt ? 'SCHEDULED' : 'DRAFT'

        await prisma.campaign.create({
            data: {
                subject,
                content,
                status,
                scheduledAt,
                attachments: attachmentsStr
            },
        })
    } catch (error) {
        console.error('Error creating campaign:', error)
        return { message: 'Failed to create campaign' }
    }

    revalidatePath('/admin/campaigns')
    redirect('/admin/campaigns')
}

export async function updateCampaign(id: string, prevState: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { message: 'Unauthorized' }
    }

    const subject = formData.get('subject') as string
    const content = formData.get('content') as string
    const action = formData.get('action') as string
    const testRecipient = formData.get('testRecipient') as string
    const scheduledAtStr = formData.get('scheduledAt') as string
    const attachmentsStr = formData.get('attachments') as string || '[]'

    if (!subject || !content) {
        return { message: 'Subject and content are required' }
    }

    // Handle Test Email (Copy-paste logic from create or refactor? For now copy-paste for speed, refactor later if needed)
    if (action === 'test') {
        // ... Same test email logic ...
        // Actually, we can reuse the test email logic if we extract it, but for now let's just implement it to avoid breaking changes elsewhere first.
        // Or better yet, since test email doesn't save, we can maybe share the logic?
        // Let's copy it for now to ensure it works exactly the same.
        if (!testRecipient) {
            return { message: 'Test recipient email is required' }
        }

        try {
            const dummyData = {
                email: testRecipient,
                companyName: 'Test Company',
                name: 'Test User',
                registrationDate: new Date().toLocaleDateString(),
            }

            const personalizedSubject = replaceVariables(subject, dummyData)
            const personalizedContent = replaceVariables(content, dummyData)

            const attachments = JSON.parse(attachmentsStr).map((a: any) => ({
                filename: a.name,
                path: path.join(process.cwd(), 'public', a.url)
            }))

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <body style="font-family: sans-serif; color: #333; line-height: 1.6;">
                    <div style="background: #f0f9ff; padding: 10px; text-align: center; border-bottom: 1px solid #bae6fd; color: #0369a1; font-size: 14px;">
                        <strong>TEST EMAIL</strong> - This is a preview of your campaign.
                    </div>
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        ${personalizedContent.replace(/\n/g, '<br>')}
                        <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #999;">
                            You are receiving this email because you are subscribed to updates from FirstStep SaaS.
                        </p>
                    </div>
                </body>
                </html>
            `

            await sendHtmlEmail(testRecipient, `[TEST] ${personalizedSubject}`, htmlContent, attachments)
            return { message: `Test email sent to ${testRecipient}` }
        } catch (error) {
            console.error('Error sending test email:', error)
            return { message: 'Failed to send test email' }
        }
    }

    try {
        const campaign = await prisma.campaign.findUnique({ where: { id } })
        if (!campaign) return { message: 'Campaign not found' }

        if (campaign.status === 'SENT' || campaign.status === 'SENDING') {
            return { message: 'Cannot edit a campaign that is sent or sending' }
        }

        const scheduledAt = scheduledAtStr ? new Date(scheduledAtStr) : null

        // If it was failed, resetting it to draft/scheduled is fine.
        // If it was draft/scheduled, updating it is fine.
        const status = scheduledAt ? 'SCHEDULED' : 'DRAFT'

        await prisma.campaign.update({
            where: { id },
            data: {
                subject,
                content,
                status,
                scheduledAt,
                attachments: attachmentsStr
            },
        })
    } catch (error) {
        console.error('Error updating campaign:', error)
        return { message: 'Failed to update campaign' }
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

export async function updateCampaignEmailLists(campaignId: string, emailListIds: string[]) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    await prisma.campaign.update({
        where: { id: campaignId },
        data: {
            emailListIds: JSON.stringify(emailListIds),
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
        // Parse selected recipients and email lists and attachments
        const selectedRecipientIds = JSON.parse(campaign.selectedRecipients || '[]')
        const emailListIds = JSON.parse(campaign.emailListIds || '[]')
        const attachments = JSON.parse(campaign.attachments || '[]').map((a: any) => ({
            filename: a.name,
            path: path.join(process.cwd(), 'public', a.url)
        }))

        // Collect all email recipients with their data
        const recipientMap = new Map<string, {
            email: string
            companyName: string
            name: string
            registrationDate: Date | string
        }>()

        // 1. Add individually selected users
        if (selectedRecipientIds.length > 0) {
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

            for (const u of users) {
                recipientMap.set(u.email, {
                    email: u.email,
                    companyName: u.companyName || '',
                    name: u.companyName || '',
                    registrationDate: u.createdAt,
                })
            }
        }

        // 2. Add users from email lists
        if (emailListIds.length > 0) {
            const listMembers = await prisma.emailListMember.findMany({
                where: {
                    listId: { in: emailListIds },
                },
                include: {
                    user: {
                        select: {
                            email: true,
                            companyName: true,
                            createdAt: true,
                        }
                    }
                }
            })

            for (const member of listMembers) {
                if (member.user) {
                    // Member is an existing user
                    // We overwrite if exists (or keep existing? Map.set overwrites)
                    // If a user is both selected individually and in a list, they are the same person.
                    recipientMap.set(member.user.email, {
                        email: member.user.email,
                        companyName: member.user.companyName || '',
                        name: member.user.companyName || '',
                        registrationDate: member.user.createdAt,
                    })
                } else if (member.email) {
                    // Member is a custom email
                    // Only add if not already present (prioritize User record if email matches?)
                    // Map.set overwrites. If a custom email matches a user email, we might want the user data.
                    // But here, we process lists after individual users.
                    // If a custom email in a list duplicates a user email, we might overwrite with custom data (which might be less complete).
                    // However, email lists are generally explicit.
                    // Let's check if it exists first to preserve User data if available?
                    // Actually, if I have `test@example.com` as a User, and also add `test@example.com` as a custom member to a list...
                    // The User record has `companyName` etc. Custom might just be email.
                    // Better to keep User data.

                    if (!recipientMap.has(member.email)) {
                        recipientMap.set(member.email, {
                            email: member.email,
                            companyName: member.name || member.email.split('@')[0],
                            name: member.name || member.email.split('@')[0],
                            registrationDate: 'N/A',
                        })
                    }
                }
            }
        }

        if (recipientMap.size === 0) {
            await prisma.campaign.update({
                where: { id },
                data: { status: 'DRAFT' },
            })
            return { success: false, message: 'No recipients selected' }
        }

        let successCount = 0
        let failureCount = 0

        const recipients = Array.from(recipientMap.values())

        for (const recipient of recipients) {
            // Prepare data for variable replacement
            const userData = {
                email: recipient.email,
                companyName: recipient.companyName,
                name: recipient.name,
                registrationDate: recipient.registrationDate,
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
                            You are receiving this email because you are subscribed to updates from FirstStep SaaS.
                            <br>
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?email=${recipient.email}" style="color: #999; text-decoration: underline;">Unsubscribe</a>
                        </p>
                    </div>
                </body>
                </html>
            `

            try {
                const result = await sendHtmlEmail(recipient.email, personalizedSubject, htmlContent, attachments)
                if (result.success) {
                    successCount++
                } else {
                    console.error(`Failed to send to ${recipient.email}: ${result.error}`)
                    failureCount++
                }
            } catch (error) {
                console.error(`Failed to send to ${recipient.email}:`, error)
                failureCount++
            }
        }

        // Update campaign with final stats
        await prisma.campaign.update({
            where: { id },
            data: {
                status: 'SENT',
                sentAt: new Date(),
                recipientCount: recipientMap.size,
                successCount,
                failureCount,
            },
        })

        revalidatePath('/admin/campaigns')
        revalidatePath(`/admin/campaigns/${id}`)

        return {
            success: true,
            message: `Campaign sent to ${successCount} recipients. ${failureCount} failed.`
        }
    } catch (error) {
        console.error('Error sending campaign:', error)

        // Revert status to DRAFT on error
        await prisma.campaign.update({
            where: { id },
            data: { status: 'DRAFT' },
        })

        return { success: false, message: 'Failed to send campaign' }
    }
}
