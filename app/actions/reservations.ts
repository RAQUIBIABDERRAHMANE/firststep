'use server'

import prisma from '@/lib/prisma'
import { getTenantBySlug } from '@/lib/tenant'
import { getCurrentUser } from './auth'

export async function createReservation(data: {
    tenantId: string
    name: string
    phone: string
    email?: string
    date: string
    time: string
    partySize: number
    notes?: string
}) {
    if (!data.tenantId) return { error: 'Restaurant ID missing' }

    try {
        const reservation = await prisma.restaurantReservation.create({
            data: {
                tenantId: data.tenantId,
                name: data.name,
                phone: data.phone,
                email: data.email || null,
                date: new Date(data.date),
                time: data.time,
                partySize: data.partySize,
                notes: data.notes || null,
                status: 'PENDING',
            },
        })
        return { success: true, reservation }
    } catch (e) {
        console.error(e)
        return { error: 'Failed to create reservation' }
    }
}

export async function getReservations(slug: string) {
    const user = await getCurrentUser()
    if (!user) return { error: 'Not authenticated' }

    const tenant = await prisma.tenantWebsite.findUnique({
        where: { slug },
        select: { id: true, userId: true },
    })
    if (!tenant || tenant.userId !== user.id) return { error: 'Not authorized' }

    const reservations = await prisma.restaurantReservation.findMany({
        where: { tenantId: tenant.id },
        orderBy: { date: 'asc' },
    })
    return { success: true, reservations }
}

export async function updateReservationStatus(id: string, status: 'CONFIRMED' | 'CANCELLED') {
    const user = await getCurrentUser()
    if (!user) return { error: 'Not authenticated' }

    const reservation = await prisma.restaurantReservation.findUnique({
        where: { id },
        include: { tenant: { select: { userId: true } } },
    })
    if (!reservation) return { error: 'Not found' }
    if (reservation.tenant.userId !== user.id) return { error: 'Not authorized' }

    await prisma.restaurantReservation.update({ where: { id }, data: { status } })
    return { success: true }
}

export async function deleteReservation(id: string) {
    const user = await getCurrentUser()
    if (!user) return { error: 'Not authenticated' }

    const reservation = await prisma.restaurantReservation.findUnique({
        where: { id },
        include: { tenant: { select: { userId: true } } },
    })
    if (!reservation) return { error: 'Not found' }
    if (reservation.tenant.userId !== user.id) return { error: 'Not authorized' }

    await prisma.restaurantReservation.delete({ where: { id } })
    return { success: true }
}
