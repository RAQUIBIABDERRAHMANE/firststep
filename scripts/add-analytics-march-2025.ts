import 'dotenv/config'
import prisma from '../lib/prisma'
import { computeMonthlyAnalytics } from '../lib/restaurant-report'

async function main() {
    console.log('Generating fake analytics for March 2025...')

    const tenantSlug = 'firststep'
    const tenant = await prisma.tenantWebsite.findUnique({
        where: { slug: tenantSlug },
        include: {
            categories: {
                include: { dishes: true }
            },
            tables: true
        }
    })

    if (!tenant) {
        console.error('Tenant not found!')
        process.exit(1)
    }

    const tables = tenant.tables
    const allDishes = tenant.categories.flatMap(c => c.dishes)

    if (tables.length === 0 || allDishes.length === 0) {
        console.error('No tables or dishes found to create orders.')
        process.exit(1)
    }

    // Mars 2025 = month index 2 in JavaScript Date
    const startOfMarch = new Date(2025, 2, 1)
    const endOfMarch = new Date(2025, 2, 31, 23, 59, 59)

    // Remove old orders for this specific period just in case
    console.log('Cleaning up old orders in March 2025...')
    await prisma.restaurantOrder.deleteMany({
        where: {
            tableId: { in: tables.map(t => t.id) },
            createdAt: { gte: startOfMarch, lte: endOfMarch }
        }
    })
    
    // Remove old report for March 2025
    await prisma.restaurantReport.deleteMany({
        where: { tenantId: tenant.id, month: 3, year: 2025 }
    })

    console.log('Inserting orders for March 2025...')
    
    let totalOrders = 0
    let totalRevenue = 0
    let iterDate = new Date(startOfMarch)

    while (iterDate <= endOfMarch) {
        const isWeekend = iterDate.getDay() === 0 || iterDate.getDay() === 6
        // Un peu plus de commandes pour "booster" le marketing
        const numOrders = isWeekend ? Math.floor(Math.random() * 40) + 20 : Math.floor(Math.random() * 25) + 10

        for (let i = 0; i < numOrders; i++) {
            const table = tables[Math.floor(Math.random() * tables.length)]
            const numItems = Math.floor(Math.random() * 4) + 1
            const items = []
            let orderTotal = 0

            for (let j = 0; j < numItems; j++) {
                const dish = allDishes[Math.floor(Math.random() * allDishes.length)]
                const quantity = Math.floor(Math.random() * 3) + 1
                items.push({
                    dishId: dish.id,
                    name: dish.name,
                    price: dish.price,
                    quantity: quantity
                })
                orderTotal += dish.price * quantity
            }

            let status = 'PAID'
            const rand = Math.random()
            if (rand > 0.95) status = 'CANCELLED'
            else if (rand > 0.8) status = 'COMPLETED'
            
            const orderDate = new Date(iterDate)
            orderDate.setHours(11 + Math.floor(Math.random() * 12))
            orderDate.setMinutes(Math.floor(Math.random() * 60))

            totalOrders++
            if (status !== 'CANCELLED') totalRevenue += orderTotal

            await prisma.restaurantOrder.create({
                data: {
                    tableId: table.id,
                    status: status,
                    totalAmount: orderTotal,
                    createdAt: orderDate,
                    updatedAt: orderDate,
                    items: {
                        create: items
                    }
                }
            })
        }
        iterDate.setDate(iterDate.getDate() + 1)
    }

    console.log(`Created ${totalOrders} fake orders. Estimated Revenue: ${totalRevenue.toFixed(2)} MAD`)

    console.log(`Generating report for March (03) 2025...`)

    const marchData = await computeMonthlyAnalytics(tenant.id, 3, 2025, tenant.siteName, 'fr')
    await prisma.restaurantReport.create({
        data: {
            tenantId: tenant.id,
            month: 3,
            year: 2025,
            status: 'GENERATED',
            language: 'fr',
            data: JSON.stringify(marchData)
        }
    })

    console.log('✅ Analytics for March 2025 created successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
