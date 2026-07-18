'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getTenant } from './restaurant'

// --- Admin Actions ---

export async function getWaiters(slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return []

    // @ts-ignore - Prisma client might be stale
    return await prisma.restaurantWaiter.findMany({
        where: { tenantId: tenant.id },
        include: {
            tables: true
        },
        orderBy: { name: 'asc' }
    })
}

export async function createWaiter(name: string, pin: string, tableIds: string[], slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    if (!name || !pin || pin.length !== 4) return { error: 'Invalid name or PIN' }

    try {
        // @ts-ignore
        await prisma.restaurantWaiter.create({
            data: {
                tenantId: tenant.id,
                name,
                pin, // In a real app, hash this!
                tables: {
                    connect: tableIds.map(id => ({ id }))
                }
            }
        })

        revalidatePath('/dashboard/restaurant/[tenantSlug]/waiters', 'page')
        return { success: true }
    } catch (e) {
        console.error('Error creating waiter:', e)
        return { error: 'Failed to create waiter' }
    }
}

export async function updateWaiter(id: string, name: string, pin: string, tableIds: string[], slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    if (!name || (pin !== '' && pin.length !== 4)) return { error: 'Invalid name or PIN' }

    try {
        const updateData: any = {
            name,
            tables: {
                set: tableIds.map(tableId => ({ id: tableId }))
            }
        }
        
        if (pin && pin.length === 4) {
            updateData.pin = pin
        }

        // @ts-ignore
        await prisma.restaurantWaiter.update({
            where: { id, tenantId: tenant.id },
            data: updateData
        })

        revalidatePath('/dashboard/restaurant/[tenantSlug]/waiters', 'page')
        return { success: true }
    } catch (e) {
        console.error('Error updating waiter:', e)
        return { error: 'Failed to update waiter' }
    }
}

export async function deleteWaiter(id: string, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        // @ts-ignore
        await prisma.restaurantWaiter.delete({
            where: { id, tenantId: tenant.id }
        })

        revalidatePath('/dashboard/restaurant/[tenantSlug]/waiters', 'page')
        return { success: true }
    } catch (e) {
        return { error: 'Failed to delete waiter' }
    }
}

// --- Waiter Actions ---

export async function loginWaiter(pin: string, tenantSlug: string) {
    try {
        // @ts-ignore
        const waiter = await prisma.restaurantWaiter.findFirst({
            where: {
                pin,
                tenant: { slug: tenantSlug },
                isActive: true
            },
            include: { tenant: true }
        })

        if (!waiter) return { error: 'Invalid PIN' }

        return { success: true, waiter }
    } catch (e) {
        return { error: 'Login failed' }
    }
}

export async function getWaiterOrders(waiterId: string) {
    try {
        // @ts-ignore
        const waiter = await prisma.restaurantWaiter.findUnique({
            where: { id: waiterId },
            include: { 
                tables: true,
                tenant: true
            }
        })

        if (!waiter) return { orders: [], tables: [], allTables: [], config: null, noActiveShift: true, menu: [] }

        // Fetch menu
        const menu = await prisma.restaurantCategory.findMany({
            where: { tenantId: waiter.tenantId, isActive: true },
            include: {
                dishes: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { order: 'asc' }
        })

        // Check if there is an active shift
        // @ts-ignore
        const activeShift = await prisma.waiterShift.findFirst({
            where: { waiterId, isActive: true },
            orderBy: { startTime: 'desc' }
        })

        if (!activeShift) {
            return { 
                orders: [], 
                tables: [], 
                allTables: waiter.tables, 
                config: waiter.tenant?.config || null, 
                noActiveShift: true,
                tenantId: waiter.tenantId,
                menu
            }
        }

        const shiftTableIds = JSON.parse(activeShift.tableIds || '[]') as string[]

        // Find orders for these tables
        const orders = await prisma.restaurantOrder.findMany({
            where: {
                tableId: { in: shiftTableIds },
                status: { not: 'PAID' } // Show active orders
            },
            include: {
                table: true,
                items: true
            },
            orderBy: { createdAt: 'desc' }
        })

        // Find tables assigned for this shift
        const tables = await prisma.restaurantTable.findMany({
            where: { id: { in: shiftTableIds } }
        })
        
        return { 
            orders, 
            tables, 
            allTables: waiter.tables, 
            config: waiter.tenant?.config || null, 
            noActiveShift: false,
            activeShiftId: activeShift.id,
            tenantId: waiter.tenantId,
            menu
        }
    } catch (e) {
        console.error('Error fetching waiter orders:', e)
        return { orders: [], tables: [], allTables: [], config: null, noActiveShift: true, menu: [] }
    }
}


