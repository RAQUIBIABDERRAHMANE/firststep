
import prisma from '@/lib/prisma'
import { cache } from 'react'
import { notFound } from 'next/navigation'

export const getTenantBySlug = cache(async (slug: string) => {
    const tenant = await prisma.tenantWebsite.findUnique({
        where: { slug },
        include: {
            user: {
                select: {
                    companyName: true,
                    email: true,
                },
            },
            service: true,
            categories: {
                where: { isActive: true },
                orderBy: { order: 'asc' },
                include: {
                    dishes: {
                        where: { isActive: true },
                        orderBy: { order: 'asc' }
                    }
                }
            },
            cabinetServices: {
                where: { isActive: true },
                orderBy: { createdAt: 'asc' }
            }
        },
    })

    return tenant
})

export async function validateSlug(slug: string) {
    const reservedSlugs = [
        'admin', 'dashboard', 'login', 'register', 'api',
        'services', 'auth', 'settings', 'profile'
    ]

    if (reservedSlugs.includes(slug.toLowerCase())) {
        return false
    }

    // Allow alphanumeric and hyphens, 3-50 chars
    const slugRegex = /^[a-z0-9-]{3,50}$/
    if (!slugRegex.test(slug)) {
        return false
    }

    const existing = await prisma.tenantWebsite.findUnique({
        where: { slug },
    })

    return !existing
}
