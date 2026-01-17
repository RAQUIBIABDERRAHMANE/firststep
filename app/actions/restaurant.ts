'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'
import { revalidatePath } from 'next/cache'

export async function getTenant(slug?: string) {
    const user = await getCurrentUser()
    if (!user) return null

    if (slug) {
        return await prisma.tenantWebsite.findFirst({
            where: {
                slug,
                userId: user.id
            }
        })
    }

    // Find the tenant associated with the restaurant service
    const tenant = await prisma.tenantWebsite.findFirst({
        where: {
            userId: user.id,
            service: { slug: { contains: 'restaurant' } }
        }
    })

    if (!tenant) {
        // Fallback to the first tenant if no restaurant-specific one exists
        return await prisma.tenantWebsite.findFirst({ where: { userId: user.id } })
    }

    return tenant
}

// --- Categories ---

export async function getCategories(slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return []

    return await prisma.restaurantCategory.findMany({
        where: { tenantId: tenant.id },
        orderBy: { order: 'asc' },
        include: { dishes: true }
    })
}

export async function createCategory(name: string, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        const category = await prisma.restaurantCategory.create({
            data: {
                tenantId: tenant.id,
                name,
                order: 0,
                isActive: true
            } as any
        })
        revalidatePath('/dashboard/restaurant', 'layout')
        console.info('[Restaurant Action] Created category:', category.name)
        return { success: true, category }
    } catch (e) {
        console.error('[Restaurant Action] createCategory Error:', e)
        return { error: 'Failed to create category' }
    }
}

export async function updateCategory(id: string, data: { name?: string, isActive?: boolean, order?: number }, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        await prisma.restaurantCategory.update({
            where: { id, tenantId: tenant.id },
            data
        })
        revalidatePath('/dashboard/restaurant', 'layout')
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] updateCategory Error:', e)
        return { error: 'Failed to update category' }
    }
}

export async function deleteCategory(id: string, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        await prisma.restaurantCategory.delete({
            where: { id, tenantId: tenant.id }
        })
        revalidatePath('/dashboard/restaurant', 'layout')
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] deleteCategory Error:', e)
        return { error: 'Failed to delete category' }
    }
}

// --- Dishes ---

export async function createDish(categoryId: string, data: { name: string, description: string, price: number, image?: string }, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        const dish = await prisma.restaurantDish.create({
            data: {
                categoryId,
                ...data,
                isActive: true
            } as any
        })
        revalidatePath('/dashboard/restaurant', 'layout')
        console.info('[Restaurant Action] Created dish:', dish.name)
        return { success: true, dish }
    } catch (e) {
        console.error('[Restaurant Action] createDish Error:', e)
        return { error: 'Failed to create dish' }
    }
}

export async function updateDish(id: string, data: { name?: string, description?: string, price?: number, image?: string, isActive?: boolean, categoryId?: string, order?: number }, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        // Verify ownership via category
        const dish = await prisma.restaurantDish.findUnique({
            where: { id },
            include: { category: true }
        })

        if (dish?.category.tenantId !== tenant.id) return { error: 'Unauthorized' }

        await prisma.restaurantDish.update({
            where: { id },
            data
        })
        revalidatePath('/dashboard/restaurant', 'layout')
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] updateDish Error:', e)
        return { error: 'Failed to update dish' }
    }
}

export async function deleteDish(id: string, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        // Verify ownership via category
        const dish = await prisma.restaurantDish.findUnique({
            where: { id },
            include: { category: true }
        })

        if (dish?.category.tenantId !== tenant.id) return { error: 'Unauthorized' }

        await prisma.restaurantDish.delete({ where: { id } })
        revalidatePath('/dashboard/restaurant', 'layout')
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] deleteDish Error:', e)
        return { error: 'Failed to delete dish' }
    }
}

// --- Tables ---

export async function getTables(slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return []

    return await prisma.restaurantTable.findMany({
        where: { tenantId: tenant.id },
        orderBy: { number: 'asc' }
    })
}

export async function createTable(number: string, capacity?: number, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        const table = await prisma.restaurantTable.create({
            data: {
                tenantId: tenant.id,
                number,
                capacity,
                isActive: true
            } as any
        })
        revalidatePath('/dashboard/restaurant', 'layout')
        console.info('[Restaurant Action] Created table:', table.number)
        return { success: true, table }
    } catch (e) {
        console.error('[Restaurant Action] createTable Error:', e)
        return { error: 'Table already exists or invalid data' }
    }
}

export async function updateTable(id: string, data: { number?: string, capacity?: number, isActive?: boolean }, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        await prisma.restaurantTable.update({
            where: { id, tenantId: tenant.id },
            data
        })
        revalidatePath('/dashboard/restaurant', 'layout')
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] updateTable Error:', e)
        return { error: 'Failed to update table' }
    }
}

export async function deleteTable(id: string, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        await prisma.restaurantTable.delete({
            where: { id, tenantId: tenant.id }
        })
        revalidatePath('/dashboard/restaurant', 'layout')
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] deleteTable Error:', e)
        return { error: 'Failed to delete table' }
    }
}

// --- Orders ---

export async function createOrder(tableNumber: string, items: { id: string, name: string, price: number, quantity: number }[]) {
    // This is a public action - table is identified by its number from the QR code
    const table = await prisma.restaurantTable.findFirst({
        where: { number: tableNumber }
    })

    if (!table || !(table as any).isActive) {
        console.error('[Restaurant Action] createOrder: Invalid table number:', tableNumber)
        return { error: 'Invalid or inactive table' }
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    try {
        const order = await prisma.restaurantOrder.create({
            data: {
                tableId: table.id, // Use the actual table ID from the lookup
                totalAmount,
                status: 'PENDING',
                items: {
                    create: items.map(item => ({
                        dishId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }))
                }
            }
        })

        // In a real app, we'd trigger a websocket or notification here
        return { success: true, orderId: order.id }
    } catch (e) {
        console.error(e)
        return { error: 'Failed to place order' }
    }
}

export async function callWaiter(tableNumber: string) {
    try {
        const table = await prisma.restaurantTable.findFirst({
            where: { number: tableNumber }
        })

        if (!table) return { error: 'Invalid table' }

        // Create a special 0-amount order
        await prisma.restaurantOrder.create({
            data: {
                tableId: table.id,
                totalAmount: 0,
                status: 'PENDING',
                items: {
                    create: [{
                        dishId: 'call-waiter', // Dummy ID
                        name: '🔔 CALL WAITER',
                        price: 0,
                        quantity: 1
                    }]
                }
            }
        })

        revalidatePath('/dashboard/restaurant/orders')
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] callWaiter Error:', e)
        return { error: 'Failed to call waiter' }
    }
}

export async function getOrderStatus(orderId: string) {
    try {
        const order = await prisma.restaurantOrder.findUnique({
            where: { id: orderId },
            select: { status: true }
        })

        if (!order) return { error: 'Order not found' }
        return { success: true, status: order.status }
    } catch (e) {
        return { error: 'Failed to fetch status' }
    }
}

export async function getOrders(slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return []

    return await prisma.restaurantOrder.findMany({
        where: {
            table: { tenantId: tenant.id }
        },
        include: {
            table: true,
            items: true
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function updateOrderStatus(id: string, status: string, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        await prisma.restaurantOrder.update({
            where: { id },
            data: { status }
        })
        revalidatePath('/dashboard/restaurant')
        return { success: true }
    } catch (e) {
        return { error: 'Failed to update order' }
    }
}

export async function updateRestaurantDesign(designTemplate: string, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    if (!['classic', 'modern', 'minimal'].includes(designTemplate)) {
        return { error: 'Invalid design template' }
    }

    try {
        await prisma.tenantWebsite.update({
            where: { id: tenant.id },
            data: { designTemplate } as any
        })
        revalidatePath(`/${tenant.slug}`)
        revalidatePath('/dashboard/restaurant/design')
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] updateRestaurantDesign Error:', e)
        return { error: 'Failed to update design' }
    }
}

export async function updateRestaurantConfig(data: {
    primaryColor?: string;
    description?: string;
    logo?: string;
    coverImage?: string;
    heroTitle?: string;
    address?: string;
    phone?: string;
    hours?: string;
    pageTitle?: string;
}, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        const currentConfig = tenant.config ? JSON.parse(tenant.config) : {}

        const newConfig = {
            ...currentConfig,
            ...(data.heroTitle !== undefined && { heroTitle: data.heroTitle }),
            ...(data.address !== undefined && { address: data.address }),
            ...(data.phone !== undefined && { phone: data.phone }),
            ...(data.hours !== undefined && { hours: data.hours }),
            ...(data.pageTitle !== undefined && { pageTitle: data.pageTitle }),
        }

        await prisma.tenantWebsite.update({
            where: { id: tenant.id },
            data: {
                ...(data.primaryColor && { primaryColor: data.primaryColor }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.logo !== undefined && { logo: data.logo }),
                ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
                config: JSON.stringify(newConfig)
            }
        })

        revalidatePath(`/${tenant.slug}`)
        revalidatePath('/dashboard/restaurant/design')
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] updateRestaurantConfig Error:', e)
        return { error: 'Failed to update configuration' }
    }
}
