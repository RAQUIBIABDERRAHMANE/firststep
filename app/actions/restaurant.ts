'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'
import { revalidatePath } from 'next/cache'
import { computeMonthlyAnalytics, generateReportPdf, type ReportLanguage } from '@/lib/restaurant-report'
import { sendMonthlyReportEmail } from '@/lib/mail'
import { uploadImage } from '@/lib/r2'

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

export async function createDish(
    categoryId: string, 
    data: { 
        name: string, 
        description: string, 
        price: number, 
        image?: string,
        options?: string,
        addons?: string,
        tags?: string
    }, 
    slug?: string
) {
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

export async function updateDish(
    id: string, 
    data: { 
        name?: string, 
        description?: string, 
        price?: number, 
        image?: string, 
        isActive?: boolean, 
        categoryId?: string, 
        order?: number,
        options?: string,
        addons?: string,
        tags?: string
    }, 
    slug?: string
) {
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

export async function createBulkTables(count: number, prefix: string, startNumber: number, capacity?: number, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    if (count <= 0 || count > 500) {
        return { error: 'Please specify a valid quantity (1-500)' }
    }

    try {
        const tablesToCreate = Array.from({ length: count }).map((_, i) => ({
            tenantId: tenant.id,
            number: `${prefix}${startNumber + i}`.trim(),
            capacity: capacity || null,
            isActive: true
        }))

        // SQLite createMany is supported in newer Prisma versions, but skipDuplicates is not supported for SQLite
        await prisma.restaurantTable.createMany({
            data: tablesToCreate
        })

        revalidatePath('/dashboard/restaurant', 'layout')
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] createBulkTables Error:', e)
        return { error: 'Failed to bulk create tables' }
    }
}

// --- Orders ---

export async function createOrder(
    tableId: string, 
    items: { 
        id: string, 
        name: string, 
        price: number, 
        quantity: number,
        selectedOptions?: { group: string, choice: string, priceModifier: number }[],
        selectedAddons?: { name: string, price: number }[]
    }[]
) {
    // This is a public action - table is identified by its persistent CUID from the QR code
    const table = await prisma.restaurantTable.findUnique({
        where: { id: tableId }
    })

    if (!table || !table.isActive) {
        console.error('[Restaurant Action] createOrder: Invalid table ID:', tableId)
        return { error: 'Invalid or inactive table' }
    }

    // Secure price computation:
    // Load all unique dishes in the order to check their base price, options, and addons.
    const dishIds = [...new Set(items.map(i => i.id))]
    const dbDishes = await prisma.restaurantDish.findMany({
        where: { id: { in: dishIds } }
    })
    const dishMap = new Map(dbDishes.map(d => [d.id, d]))

    let calculatedTotalAmount = 0
    const orderItemsData = []

    for (const item of items) {
        const dbDish = dishMap.get(item.id)
        if (!dbDish) {
            return { error: `Dish not found: ${item.name}` }
        }

        // Calculate item unit price securely
        let unitPrice = dbDish.price

        const selectedOptions = item.selectedOptions || []
        const selectedAddons = item.selectedAddons || []

        // Verify options price modifiers
        let allowedOptions = []
        try {
            allowedOptions = JSON.parse(dbDish.options || '[]')
        } catch {}

        for (const selOpt of selectedOptions) {
            const group = allowedOptions.find((g: any) => g.name === selOpt.group)
            if (group) {
                const choice = group.choices?.find((c: any) => c.name === selOpt.choice)
                if (choice) {
                    unitPrice += choice.priceModifier || 0
                }
            }
        }

        // Verify addons prices
        let allowedAddons = []
        try {
            allowedAddons = JSON.parse(dbDish.addons || '[]')
        } catch {}

        for (const selAddon of selectedAddons) {
            const addon = allowedAddons.find((a: any) => a.name === selAddon.name)
            if (addon) {
                unitPrice += addon.price || 0
            }
        }

        calculatedTotalAmount += unitPrice * item.quantity

        orderItemsData.push({
            dishId: item.id,
            name: item.name,
            price: unitPrice, // Save final computed price
            quantity: item.quantity,
            selectedOptions: JSON.stringify(selectedOptions),
            selectedAddons: JSON.stringify(selectedAddons)
        })
    }

    try {
        const order = await prisma.restaurantOrder.create({
            data: {
                tableId: table.id,
                totalAmount: calculatedTotalAmount,
                status: 'PENDING',
                items: {
                    create: orderItemsData
                }
            }
        })

        revalidatePath('/dashboard/restaurant/orders')
        return { success: true, orderId: order.id }
    } catch (e) {
        console.error(e)
        return { error: 'Failed to place order' }
    }
}

export async function callWaiter(tableId: string) {
    try {
        const table = await prisma.restaurantTable.findUnique({
            where: { id: tableId }
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

    if (!['classic', 'modern', 'minimal', 'moroccan'].includes(designTemplate)) {
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
    backgroundColor?: string;
    textColor?: string;
    cardColor?: string;
    reservationOpenTime?: string;
    reservationCloseTime?: string;
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
            ...(data.backgroundColor !== undefined && { backgroundColor: data.backgroundColor }),
            ...(data.textColor !== undefined && { textColor: data.textColor }),
            ...(data.cardColor !== undefined && { cardColor: data.cardColor }),
            ...(data.reservationOpenTime !== undefined && { reservationOpenTime: data.reservationOpenTime }),
            ...(data.reservationCloseTime !== undefined && { reservationCloseTime: data.reservationCloseTime }),
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

// ─── Reports ────────────────────────────────────────────────────────────────

export async function getReports(slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return []

    return await prisma.restaurantReport.findMany({
        where: { tenantId: tenant.id },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
    })
}

export async function generateMonthlyReport(
    month: number,
    year: number,
    language: ReportLanguage = 'fr',
    slug?: string
) {
    const user = await getCurrentUser()
    if (!user) return { error: 'Not authenticated' }

    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Tenant not found' }

    try {
        const data = await computeMonthlyAnalytics(tenant.id, month, year, tenant.siteName, language)
        const pdfBytes = await generateReportPdf(data)

        // Upsert the report
        const report = await prisma.restaurantReport.upsert({
            where: { tenantId_month_year: { tenantId: tenant.id, month, year } },
            update: {
                status: 'GENERATED',
                language,
                data: JSON.stringify(data),
            },
            create: {
                tenantId: tenant.id,
                month,
                year,
                language,
                status: 'GENERATED',
                data: JSON.stringify(data),
            },
        })

        // Send email
        await prisma.restaurantReport.update({
            where: { id: report.id },
            data: { status: 'SENDING' },
        })

        const emailResult = await sendMonthlyReportEmail(
            user.email,
            tenant.siteName,
            month,
            year,
            language,
            data,
            pdfBytes
        )

        await prisma.restaurantReport.update({
            where: { id: report.id },
            data: { status: emailResult.success ? 'SENT' : 'GENERATED' },
        })

        revalidatePath(`/dashboard/restaurant/${slug}/reports`)
        console.info(`[Report] Generated report for ${tenant.siteName} — ${month}/${year}`)
        return { success: true, reportId: report.id }
    } catch (e) {
        console.error('[Report] generateMonthlyReport Error:', e)
        return { error: 'Failed to generate report' }
    }
}

export async function resendReportEmail(reportId: string, slug?: string) {
    const user = await getCurrentUser()
    if (!user) return { error: 'Not authenticated' }

    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Tenant not found' }

    try {
        const report = await prisma.restaurantReport.findFirst({
            where: { id: reportId, tenantId: tenant.id },
        })
        if (!report) return { error: 'Report not found' }

        const data = JSON.parse(report.data)
        const pdfBytes = await generateReportPdf(data)

        await sendMonthlyReportEmail(
            user.email,
            tenant.siteName,
            report.month,
            report.year,
            report.language as ReportLanguage,
            data,
            pdfBytes
        )

        await prisma.restaurantReport.update({
            where: { id: reportId },
            data: { status: 'SENT' },
        })

        revalidatePath(`/dashboard/restaurant/${slug}/reports`)
        return { success: true }
    } catch (e) {
        console.error('[Report] resendReportEmail Error:', e)
        return { error: 'Failed to resend email' }
    }
}

export async function downloadReportPdf(reportId: string, slug?: string): Promise<{ error: string } | { pdfBase64: string; filename: string }> {
    const user = await getCurrentUser()
    if (!user) return { error: 'Not authenticated' }

    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Tenant not found' }

    try {
        const report = await prisma.restaurantReport.findFirst({
            where: { id: reportId, tenantId: tenant.id },
        })
        if (!report) return { error: 'Report not found' }

        const data = JSON.parse(report.data)
        const pdfBytes = await generateReportPdf(data)
        const pdfBase64 = Buffer.from(pdfBytes).toString('base64')
        const filename = `rapport-${report.year}-${String(report.month).padStart(2, '0')}-${tenant.siteName.toLowerCase().replace(/\s+/g, '-')}.pdf`

        return { pdfBase64, filename }
    } catch (e) {
        console.error('[Report] downloadReportPdf Error:', e)
        return { error: 'Failed to generate PDF' }
    }
}

export async function deleteReport(reportId: string, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        await prisma.restaurantReport.delete({
            where: { id: reportId, tenantId: tenant.id },
        })
        revalidatePath(`/dashboard/restaurant/${slug}/reports`)
        return { success: true }
    } catch (e) {
        console.error('[Report] deleteReport Error:', e)
        return { error: 'Failed to delete report' }
    }
}

export async function requestBill(tableId: string) {
    try {
        const table = await prisma.restaurantTable.findUnique({
            where: { id: tableId }
        })

        if (!table) return { error: 'Invalid table' }

        // Create a special 0-amount order representing a bill request
        await prisma.restaurantOrder.create({
            data: {
                tableId: table.id,
                totalAmount: 0,
                status: 'PENDING',
                items: {
                    create: [{
                        dishId: 'request-bill', // Dummy ID
                        name: '🔔 REQUEST BILL',
                        price: 0,
                        quantity: 1
                    }]
                }
            }
        })

        revalidatePath('/dashboard/restaurant/orders')
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] requestBill Error:', e)
        return { error: 'Failed to request bill' }
    }
}

export async function saveFloorPlanLayout(slug: string, layoutJson: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        const currentConfig = tenant.config ? JSON.parse(tenant.config) : {}
        const newConfig = {
            ...currentConfig,
            floorPlan: JSON.parse(layoutJson)
        }

        await prisma.tenantWebsite.update({
            where: { id: tenant.id },
            data: {
                config: JSON.stringify(newConfig)
            }
        })

        revalidatePath(`/${tenant.slug}`)
        revalidatePath(`/dashboard/restaurant/${tenant.slug}/tables`)
        revalidatePath(`/dashboard/restaurant/${tenant.slug}/orders`)
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] saveFloorPlanLayout Error:', e)
        return { error: 'Failed to save floor plan layout' }
    }
}

export async function createPrintRequest(tableIds: string[], slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    if (!tableIds || tableIds.length === 0) {
        return { error: 'No tables selected' }
    }

    try {
        const req = await prisma.tablePrintRequest.create({
            data: {
                tenantId: tenant.id,
                tableIds: tableIds.join(','),
                status: 'PENDING'
            }
        })
        
        revalidatePath(`/dashboard/restaurant/${tenant.slug}/tables`)
        return { success: true, requestId: req.id }
    } catch (e) {
        console.error('[Restaurant Action] createPrintRequest Error:', e)
        return { error: 'Failed to submit print request' }
    }
}

export async function uploadDishImage(formData: FormData) {
    const file = formData.get('imageFile') as File
    if (!file || file.size === 0) return { error: 'No file uploaded' }

    try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        const path = require('path')
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const fileExt = path.extname(file.name) || '.jpg'
        const filename = `dish-${uniqueSuffix}${fileExt}`
        const contentType = file.type || 'image/jpeg'
        
        const publicUrl = await uploadImage(buffer, filename, contentType)
        return { success: true, url: publicUrl }
    } catch (e) {
        console.error('[Restaurant Action] uploadDishImage Error:', e)
        return { error: 'Failed to save uploaded image' }
    }
}

