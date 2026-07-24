'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'
import { revalidatePath } from 'next/cache'
import { computeMonthlyAnalytics, generateReportPdf, type ReportLanguage } from '@/lib/restaurant-report'
import { sendMonthlyReportEmail } from '@/lib/mail'
import { uploadImage } from '@/lib/r2'

import { DEFAULT_TEMPLATE_COLORS } from '@/lib/theme-colors'

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
        tags?: string,
        prepStation?: string
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
        include: { space: true },
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

export async function updateTable(
    id: string, 
    data: { 
        number?: string, 
        capacity?: number, 
        isActive?: boolean,
        xPos?: number,
        yPos?: number,
        rotation?: number,
        shape?: string
    }, 
    slug?: string
) {
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
        if (slug) {
            revalidatePath(`/dashboard/restaurant/${slug}/kds`)
            revalidatePath(`/dashboard/restaurant/${slug}/orders`)
        }

        // Phase I: Auto-decrement inventory when an order is completed
        if (status === 'SERVED' || status === 'PAID') {
            await decrementInventoryForOrder(id)
        }

        return { success: true }
    } catch (e) {
        return { error: 'Failed to update order' }
    }
}

export async function updateRestaurantDesign(designTemplate: string, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    if (!['classic', 'modern', 'minimal', 'moroccan', 'light', 'luxury', 'italian'].includes(designTemplate)) {
        return { error: 'Invalid design template' }
    }

    try {
        const currentConfig = tenant.config ? JSON.parse(tenant.config) : {}
        const templatesConfigs = currentConfig.templatesConfigs || {}
        
        // Grab custom config for the selected template, or fall back to default colors
        const templateSpecificConfig = templatesConfigs[designTemplate] || {}
        const defaults = DEFAULT_TEMPLATE_COLORS[designTemplate] || DEFAULT_TEMPLATE_COLORS.classic
        
        const newConfig = {
            ...currentConfig,
            backgroundColor: templateSpecificConfig.backgroundColor || defaults.backgroundColor,
            textColor: templateSpecificConfig.textColor || defaults.textColor,
            cardColor: templateSpecificConfig.cardColor || defaults.cardColor,
            buttonBgColor: templateSpecificConfig.buttonBgColor || defaults.buttonBgColor,
            buttonTextColor: templateSpecificConfig.buttonTextColor || defaults.buttonTextColor,
            headerBgColor: templateSpecificConfig.headerBgColor || defaults.headerBgColor,
            headerTextColor: templateSpecificConfig.headerTextColor || defaults.headerTextColor,
            footerBgColor: templateSpecificConfig.footerBgColor || defaults.footerBgColor,
            footerTextColor: templateSpecificConfig.footerTextColor || defaults.footerTextColor,
            categoryBgColor: templateSpecificConfig.categoryBgColor || defaults.categoryBgColor,
            categoryHighlightColor: templateSpecificConfig.categoryHighlightColor || defaults.categoryHighlightColor,
            priceColor: templateSpecificConfig.priceColor || defaults.priceColor,
        }

        await prisma.tenantWebsite.update({
            where: { id: tenant.id },
            data: { 
                designTemplate,
                primaryColor: templateSpecificConfig.primaryColor || defaults.primaryColor || tenant.primaryColor,
                config: JSON.stringify(newConfig)
            } as any
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
    buttonBgColor?: string;
    buttonTextColor?: string;
    headerBgColor?: string;
    headerTextColor?: string;
    footerBgColor?: string;
    footerTextColor?: string;
    categoryBgColor?: string;
    categoryHighlightColor?: string;
    priceColor?: string;
    templatesConfigs?: any;
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
            ...(data.buttonBgColor !== undefined && { buttonBgColor: data.buttonBgColor }),
            ...(data.buttonTextColor !== undefined && { buttonTextColor: data.buttonTextColor }),
            ...(data.headerBgColor !== undefined && { headerBgColor: data.headerBgColor }),
            ...(data.headerTextColor !== undefined && { headerTextColor: data.headerTextColor }),
            ...(data.footerBgColor !== undefined && { footerBgColor: data.footerBgColor }),
            ...(data.footerTextColor !== undefined && { footerTextColor: data.footerTextColor }),
            ...(data.categoryBgColor !== undefined && { categoryBgColor: data.categoryBgColor }),
            ...(data.categoryHighlightColor !== undefined && { categoryHighlightColor: data.categoryHighlightColor }),
            ...(data.priceColor !== undefined && { priceColor: data.priceColor }),
            ...(data.templatesConfigs !== undefined && { templatesConfigs: data.templatesConfigs }),
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

// ─── Phase C: KDS ─────────────────────────────────────────────────────────────

/**
 * Fetch active orders for the Kitchen Display System.
 * Optionally filter by prepStation (dish-level field).
 * Returns only PENDING | COOKING | READY orders.
 */
export async function getOrdersForKDS(slug?: string, station?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return []

    const orders = await prisma.restaurantOrder.findMany({
        where: {
            table: { tenantId: tenant.id },
            status: { in: ['PENDING', 'COOKING', 'READY'] }
        },
        include: {
            table: true,
            items: true
        },
        orderBy: { createdAt: 'asc' }
    })

    // Fetch station map for all dish IDs in these orders
    const dishIds = [...new Set(orders.flatMap(o => o.items.map((i: any) => i.dishId)))]
    const dishes = await prisma.restaurantDish.findMany({
        where: { id: { in: dishIds } },
        select: { id: true, prepStation: true }
    })
    const stationMap = new Map(dishes.map(d => [d.id, d.prepStation]))

    const enriched = orders.map(order => ({
        ...order,
        items: order.items.map((item: any) => ({
            ...item,
            prepStation: stationMap.get(item.dishId) || 'KITCHEN'
        }))
    }))

    if (!station || station === 'ALL') return enriched

    return enriched
        .map(order => ({
            ...order,
            items: order.items.filter((item: any) => item.prepStation === station)
        }))
        .filter(order => order.items.length > 0)
}

// ─── Phase D: Waiter Shifts ───────────────────────────────────────────────────

export async function startWaiterShift(waiterId: string, tableIds: string[], tenantId: string) {
    try {
        // Close any existing active shift for this waiter
        await prisma.waiterShift.updateMany({
            where: { waiterId, isActive: true },
            data: { isActive: false, endTime: new Date() }
        })

        const shift = await prisma.waiterShift.create({
            data: {
                waiterId,
                tenantId,
                tableIds: JSON.stringify(tableIds),
                isActive: true
            }
        })
        return { success: true, shift }
    } catch (e) {
        console.error('[Restaurant Action] startWaiterShift Error:', e)
        return { error: 'Failed to start shift' }
    }
}

export async function endWaiterShift(waiterId: string) {
    try {
        await prisma.waiterShift.updateMany({
            where: { waiterId, isActive: true },
            data: { isActive: false, endTime: new Date() }
        })
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] endWaiterShift Error:', e)
        return { error: 'Failed to end shift' }
    }
}

export async function getActiveShift(waiterId: string) {
    try {
        const shift = await prisma.waiterShift.findFirst({
            where: { waiterId, isActive: true },
            orderBy: { startTime: 'desc' }
        })
        return { success: true, shift }
    } catch (e) {
        return { error: 'Failed to fetch shift' }
    }
}

// ─── Phase H: Bill Split ──────────────────────────────────────────────────────

export async function createBillSplit(
    orderId: string,
    type: 'EQUAL' | 'ITEMIZED',
    parts?: number,
    itemIds?: string[]
) {
    try {
        const split = await prisma.billSplit.create({
            data: {
                orderId,
                type,
                parts: parts ?? 1,
                itemsPaid: JSON.stringify(itemIds ?? []),
                status: 'PENDING'
            }
        })
        return { success: true, split }
    } catch (e) {
        console.error('[Restaurant Action] createBillSplit Error:', e)
        return { error: 'Failed to create bill split' }
    }
}

export async function getBillSplit(orderId: string) {
    try {
        const split = await prisma.billSplit.findFirst({
            where: { orderId },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, split }
    } catch (e) {
        return { error: 'Failed to fetch bill split' }
    }
}

export async function updateBillSplitPayment(splitId: string, paidItemIds: string[], amount: number) {
    try {
        const split = await prisma.billSplit.update({
            where: { id: splitId },
            data: {
                itemsPaid: JSON.stringify(paidItemIds),
                paidTotal: amount,
                status: paidItemIds.length > 0 ? 'PARTIALLY_PAID' : 'PENDING'
            }
        })
        return { success: true, split }
    } catch (e) {
        console.error('[Restaurant Action] updateBillSplitPayment Error:', e)
        return { error: 'Failed to update payment' }
    }
}

export async function getOrderDetails(orderId: string) {
    try {
        const order = await prisma.restaurantOrder.findUnique({
            where: { id: orderId },
            include: { items: true }
        })
        if (!order) return { error: 'Order not found' }
        return { success: true, order }
    } catch (e) {
        console.error('[Restaurant Action] getOrderDetails Error:', e)
        return { error: 'Failed to fetch order details' }
    }
}


// ─── Phase H: Shared Cart Sync ────────────────────────────────────────────────

export async function syncCartToServer(tableId: string, cartData: any[]) {
    try {
        await prisma.tableCartSession.upsert({
            where: { tableId },
            update: { cartData: JSON.stringify(cartData) },
            create: { tableId, cartData: JSON.stringify(cartData) }
        })
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] syncCartToServer Error:', e)
        return { error: 'Failed to sync cart' }
    }
}

export async function getCartFromServer(tableId: string) {
    try {
        const session = await prisma.tableCartSession.findUnique({ where: { tableId } })
        if (!session) return { success: true, cartData: [] }
        return { success: true, cartData: JSON.parse(session.cartData) }
    } catch (e) {
        return { error: 'Failed to fetch cart', cartData: [] }
    }
}

// ─── Phase I: Inventory ───────────────────────────────────────────────────────

export async function getInventory(slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return []

    return await prisma.ingredient.findMany({
        where: { tenantId: tenant.id },
        include: { recipes: { include: { dish: { select: { name: true, id: true } } } } },
        orderBy: { name: 'asc' }
    })
}

export async function createIngredient(
    data: { name: string; unit: string; stock: number; minStock: number },
    slug?: string
) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        const ingredient = await prisma.ingredient.create({
            data: { ...data, tenantId: tenant.id }
        })
        revalidatePath('/dashboard/restaurant', 'layout')
        return { success: true, ingredient }
    } catch (e) {
        console.error('[Restaurant Action] createIngredient Error:', e)
        return { error: 'Failed to create ingredient' }
    }
}

export async function updateIngredient(
    id: string,
    data: { name?: string; unit?: string; stock?: number; minStock?: number },
    slug?: string
) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        const ingredient = await prisma.ingredient.update({
            where: { id, tenantId: tenant.id },
            data
        })
        revalidatePath('/dashboard/restaurant', 'layout')
        return { success: true, ingredient }
    } catch (e) {
        console.error('[Restaurant Action] updateIngredient Error:', e)
        return { error: 'Failed to update ingredient' }
    }
}

export async function deleteIngredient(id: string, slug?: string) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        await prisma.ingredient.delete({ where: { id, tenantId: tenant.id } })
        revalidatePath('/dashboard/restaurant', 'layout')
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] deleteIngredient Error:', e)
        return { error: 'Failed to delete ingredient' }
    }
}

export async function setDishRecipe(
    dishId: string,
    items: { ingredientId: string; quantity: number }[],
    slug?: string
) {
    const tenant = await getTenant(slug)
    if (!tenant) return { error: 'Not authenticated' }

    try {
        // Delete existing recipe items for this dish
        await prisma.recipeItem.deleteMany({ where: { dishId } })

        // Re-create with new items
        if (items.length > 0) {
            await prisma.recipeItem.createMany({
                data: items.map(i => ({ dishId, ingredientId: i.ingredientId, quantity: i.quantity }))
            })
        }
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] setDishRecipe Error:', e)
        return { error: 'Failed to set recipe' }
    }
}

/**
 * Decrement ingredient stock based on the recipe for each served item.
 * Call this internally when an order is marked SERVED or PAID.
 */
async function decrementInventoryForOrder(orderId: string) {
    try {
        const orderItems = await prisma.restaurantOrderItem.findMany({ where: { orderId } })
        for (const item of orderItems) {
            const recipes = await prisma.recipeItem.findMany({ where: { dishId: item.dishId } })
            for (const recipe of recipes) {
                await prisma.ingredient.update({
                    where: { id: recipe.ingredientId },
                    data: { stock: { decrement: recipe.quantity * item.quantity } }
                })
            }
        }
    } catch (e) {
        console.error('[Restaurant Action] decrementInventoryForOrder Error:', e)
    }
}

// ─── Spaces & Multi-Floor Management ──────────────────────────────────────────

export async function getSpaces(tenantSlug: string) {
    try {
        const website = await prisma.tenantWebsite.findUnique({
            where: { slug: tenantSlug }
        })
        if (!website) return { error: 'Tenant not found' }

        const spaces = await prisma.restaurantSpace.findMany({
            where: { tenantId: website.id },
            orderBy: { order: 'asc' },
            include: {
                tables: true
            }
        })
        return { success: true, spaces }
    } catch (e) {
        console.error('[Restaurant Action] getSpaces Error:', e)
        return { error: 'Failed to fetch spaces' }
    }
}

export async function createSpace(tenantSlug: string, name: string) {
    try {
        const website = await prisma.tenantWebsite.findUnique({
            where: { slug: tenantSlug }
        })
        if (!website) return { error: 'Tenant not found' }

        const count = await prisma.restaurantSpace.count({
            where: { tenantId: website.id }
        })

        const space = await prisma.restaurantSpace.create({
            data: {
                tenantId: website.id,
                name: name.trim(),
                order: count
            }
        })

        revalidatePath(`/dashboard/restaurant/${tenantSlug}/tables`)
        revalidatePath(`/dashboard/restaurant/${tenantSlug}/waiters`)
        revalidatePath(`/${tenantSlug}/waiter/dashboard`)
        return { success: true, space }
    } catch (e) {
        console.error('[Restaurant Action] createSpace Error:', e)
        return { error: 'Failed to create space' }
    }
}

export async function deleteSpace(spaceId: string, tenantSlug: string) {
    try {
        await prisma.restaurantSpace.delete({
            where: { id: spaceId }
        })
        revalidatePath(`/dashboard/restaurant/${tenantSlug}/tables`)
        revalidatePath(`/dashboard/restaurant/${tenantSlug}/waiters`)
        revalidatePath(`/${tenantSlug}/waiter/dashboard`)
        return { success: true }
    } catch (e) {
        console.error('[Restaurant Action] deleteSpace Error:', e)
        return { error: 'Failed to delete space' }
    }
}

export async function updateTableSpace(tableId: string, spaceId: string | null, tenantSlug: string) {
    try {
        const table = await prisma.restaurantTable.update({
            where: { id: tableId },
            data: { spaceId }
        })
        revalidatePath(`/dashboard/restaurant/${tenantSlug}/tables`)
        revalidatePath(`/dashboard/restaurant/${tenantSlug}/waiters`)
        revalidatePath(`/${tenantSlug}/waiter/dashboard`)
        return { success: true, table }
    } catch (e) {
        console.error('[Restaurant Action] updateTableSpace Error:', e)
        return { error: 'Failed to update table space' }
    }
}

// ─── Multiplayer / Shared Cart Actions ──────────────────────────────────────

export async function syncTableCart(tableId: string, cartData: any[]) {
    try {
        const cartSession = await prisma.tableCartSession.upsert({
            where: { tableId },
            update: {
                cartData: JSON.stringify(cartData)
            },
            create: {
                tableId,
                cartData: JSON.stringify(cartData)
            }
        })
        return { success: true, cartSession }
    } catch (e) {
        console.error('[Restaurant Action] syncTableCart Error:', e)
        return { error: 'Failed to sync cart' }
    }
}

export async function getTableCart(tableId: string) {
    try {
        const cartSession = await prisma.tableCartSession.findUnique({
            where: { tableId }
        })
        if (!cartSession) return { success: true, items: [] }
        
        const items = JSON.parse(cartSession.cartData || '[]')
        return { success: true, items }
    } catch (e) {
        console.error('[Restaurant Action] getTableCart Error:', e)
        return { error: 'Failed to fetch table cart' }
    }
}

// ─── Live Floor Plan Status Monitor ──────────────────────────────────────────

export async function getLiveFloorStatus(tenantSlug: string) {
    try {
        const website = await prisma.tenantWebsite.findUnique({
            where: { slug: tenantSlug }
        })
        if (!website) return { error: 'Tenant not found' }

        const tables = await prisma.restaurantTable.findMany({
            where: { tenantId: website.id },
            include: {
                space: true,
                orders: {
                    where: {
                        status: { in: ['PENDING', 'PREPARING', 'COOKING', 'READY'] }
                    },
                    include: {
                        items: true
                    }
                }
            }
        })

        // Also check print/bill requests & waiter calls
        const printRequests = await prisma.tablePrintRequest.findMany({
            where: {
                tenantId: website.id,
                status: 'PENDING'
            }
        })

        const activeTableIdsWithRequests = new Set(
            printRequests.flatMap(r => r.tableIds.split(',').map(id => id.trim()))
        )

        const tableStatuses = tables.map(t => {
            const activeOrder = t.orders[0] || null
            const hasBillOrWaiterCall = activeTableIdsWithRequests.has(t.id)

            return {
                id: t.id,
                number: t.number,
                capacity: t.capacity,
                xPos: t.xPos,
                yPos: t.yPos,
                rotation: t.rotation,
                shape: t.shape,
                spaceId: t.spaceId,
                spaceName: t.space?.name || 'Main Room',
                status: activeOrder ? activeOrder.status : 'FREE',
                activeOrderAmount: activeOrder ? activeOrder.totalAmount : 0,
                activeOrderId: activeOrder ? activeOrder.id : null,
                hasRequestAlert: hasBillOrWaiterCall
            }
        })

        return { success: true, tableStatuses }
    } catch (e) {
        console.error('[Restaurant Action] getLiveFloorStatus Error:', e)
        return { error: 'Failed to fetch live floor status' }
    }
}



