'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'

export async function createCustomWebsiteRequest(formData: FormData) {
    try {
        const clientName = formData.get('clientName') as string
        const companyName = formData.get('companyName') as string
        const email = formData.get('email') as string
        const phone = formData.get('phone') as string
        const websiteType = formData.get('websiteType') as string
        const stylePreferences = formData.get('stylePreferences') as string
        const competitors = formData.get('competitors') as string
        const additionalNotes = formData.get('additionalNotes') as string
        
        // Arrays
        const pages = formData.getAll('pages') as string[]
        const specialFeatures = formData.getAll('specialFeatures') as string[]

        if (!clientName || !companyName || !email || !websiteType || !stylePreferences) {
            return { error: 'Veuillez remplir tous les champs obligatoires (*).' }
        }

        // Try to get logged in user (optional)
        const user = await getCurrentUser()
        const userId = user ? user.id : null

        const request = await prisma.customWebsiteRequest.create({
            data: {
                userId,
                clientName,
                companyName,
                email,
                phone: phone || null,
                websiteType,
                stylePreferences,
                pages: JSON.stringify(pages),
                specialFeatures: JSON.stringify(specialFeatures),
                competitors: competitors || null,
                additionalNotes: additionalNotes || null,
                status: 'PENDING',
                adminNotes: '[]'
            }
        })

        revalidatePath('/admin/custom-requests')
        if (userId) {
            revalidatePath('/dashboard')
            revalidatePath('/dashboard/custom-website')
        }

        return { success: true, requestId: request.id }
    } catch (error) {
        console.error('Failed to create custom website request:', error)
        return { error: 'Une erreur est survenue lors de l\'enregistrement de votre demande.' }
    }
}
