'use server'

import prisma from '@/lib/prisma'

export async function unsubscribeUser(email: string) {
    if (!email) return { success: false, message: 'Email required' }

    try {
        // Update User if exists
        await prisma.user.updateMany({
            where: { email },
            data: { unsubscribed: true }
        })

        // Update EmailListMember
        await prisma.emailListMember.updateMany({
            where: { email },
            data: { unsubscribed: true }
        })

        return { success: true, message: 'You have been successfully unsubscribed from our mailing list.' }
    } catch (error) {
        console.error('Error unsubscribing:', error)
        return { success: false, message: 'Failed to unsubscribe. Please try again later.' }
    }
}
