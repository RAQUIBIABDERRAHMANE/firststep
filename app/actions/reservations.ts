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

export async function assignTableToReservation(reservationId: string, tableId: string | null) {
    const user = await getCurrentUser()
    if (!user) return { error: 'Not authenticated' }

    try {
        const reservation = await prisma.restaurantReservation.findUnique({
            where: { id: reservationId },
            include: { tenant: { select: { userId: true } } },
        })
        if (!reservation) return { error: 'Reservation not found' }
        if (reservation.tenant.userId !== user.id) return { error: 'Not authorized' }

        await prisma.restaurantReservation.update({
            where: { id: reservationId },
            data: { tableId }
        })

        return { success: true }
    } catch (e) {
        console.error('[Reservation Action] assignTableToReservation Error:', e)
        return { error: 'Failed to assign table' }
    }
}

export async function autoAssignTable(reservationId: string) {
    const user = await getCurrentUser()
    if (!user) return { error: 'Not authenticated' }

    try {
        const reservation = await prisma.restaurantReservation.findUnique({
            where: { id: reservationId },
            include: { tenant: { select: { id: true, userId: true } } },
        })
        if (!reservation) return { error: 'Reservation not found' }
        if (reservation.tenant.userId !== user.id) return { error: 'Not authorized' }

        // Find active tables for the tenant
        const tables = await prisma.restaurantTable.findMany({
            where: { tenantId: reservation.tenant.id, isActive: true },
        })

        // Find other confirmed reservations on the same date/time that already have a table assigned
        const conflictingReservations = await prisma.restaurantReservation.findMany({
            where: {
                tenantId: reservation.tenant.id,
                status: 'CONFIRMED',
                date: reservation.date,
                time: reservation.time,
                tableId: { not: null },
                id: { not: reservation.id },
            },
            select: { tableId: true },
        })

        const assignedTableIds = conflictingReservations.map(r => r.tableId)

        // Filter out tables that are already assigned
        const availableTables = tables.filter(t => !assignedTableIds.includes(t.id))

        // Filter tables that can accommodate the party size
        const compatibleTables = availableTables.filter(t => t.capacity ? t.capacity >= reservation.partySize : true)

        if (compatibleTables.length === 0) {
            return { error: 'No compatible tables available for this time slot' }
        }

        // Best fit: sort by capacity ascending, or if no capacity, sort table number.
        compatibleTables.sort((a, b) => {
            const capA = a.capacity || 999;
            const capB = b.capacity || 999;
            if (capA !== capB) return capA - capB;
            return a.number.localeCompare(b.number);
        })

        const bestTable = compatibleTables[0]

        await prisma.restaurantReservation.update({
            where: { id: reservationId },
            data: { tableId: bestTable.id }
        })

        return { success: true, table: bestTable }
    } catch (e) {
        console.error('[Reservation Action] autoAssignTable Error:', e)
        return { error: 'Failed to auto-assign table' }
    }
}

