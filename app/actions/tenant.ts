'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { validateSlug } from '@/lib/tenant'
import { revalidatePath } from 'next/cache'

// Get current user's website
export async function getMyWebsite() {
    const user = await getCurrentUser()
    if (!user) return null

    try {
        const website = await prisma.tenantWebsite.findFirst({
            where: { userId: user.id },
            include: { service: true }
        })
        return website
    } catch (error) {
        console.error('Failed to fetch website:', error)
        return null
    }
}

// Create or update website
export async function upsertWebsite(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: 'Not authenticated' }

    const siteName = formData.get('siteName') as string
    const description = formData.get('description') as string
    const slug = formData.get('slug') as string
    const primaryColor = formData.get('primaryColor') as string
    const serviceId = formData.get('serviceId') as string

    // New fields
    const logo = formData.get('logo') as string
    const coverImage = formData.get('coverImage') as string
    const address = formData.get('address') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string

    if (!siteName || !slug || !serviceId) {
        return { error: 'Missing required fields' }
    }

    // Check if slug is taken (if changed)
    const existingSite = await prisma.tenantWebsite.findFirst({
        where: { userId: user.id }
    })

    // If creating new or changing slug, validate it
    if (!existingSite || existingSite.slug !== slug) {
        const isValid = await validateSlug(slug)
        if (!isValid) {
            return { error: 'Slug is invalid or already taken' }
        }
    }

    // Prepare config (merging with existing if possible)
    const existingConfig = existingSite?.config ? JSON.parse(existingSite.config) : {}
    const newConfig = {
        ...existingConfig,
        address,
        phone,
        email: email || user.email,
        // Add defaults if missing
        hours: existingConfig.hours || "Mon-Fri: 9:00 AM - 10:00 PM\nSat-Sun: 10:00 AM - 11:00 PM",
        heroTitle: existingConfig.heroTitle || `Welcome to ${siteName}`,
        menu: existingConfig.menu || []
    }

    try {
        const website = await prisma.tenantWebsite.upsert({
            where: {
                id: existingSite?.id || 'new'
            },
            update: {
                siteName,
                description,
                slug,
                primaryColor,
                logo,
                coverImage,
                config: JSON.stringify(newConfig),
                isActive: true,
            },
            create: {
                userId: user.id,
                serviceId,
                siteName,
                description,
                slug,
                primaryColor,
                logo,
                coverImage,
                isActive: true,
                config: JSON.stringify(newConfig)
            }
        })

        revalidatePath('/dashboard/website')
        revalidatePath(`/${slug}`)
        return { success: true, website }
    } catch (error) {
        console.error('Failed to upsert website:', error)
        return { error: 'Failed to save website' }
    }
}
