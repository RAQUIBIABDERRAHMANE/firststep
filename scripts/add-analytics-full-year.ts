import 'dotenv/config'
import prisma from '../lib/prisma'
import { computeMonthlyAnalytics } from '../lib/restaurant-report'

async function main() {
    console.log('Generating fake analytics from March 2025 to March 2026...')

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

    // Target range
    const start = new Date(2025, 2, 1)    // March 1, 2025
    const end = new Date(2026, 2, 31, 23, 59, 59) // March 31, 2026

    // Clean all existing data for reports and orders to avoid duplication logic bugs
    console.log('Cleaning up old orders/reports in the time range...')
    await prisma.restaurantReport.deleteMany({
        where: { tenantId: tenant.id }
    })

    await prisma.restaurantOrder.deleteMany({
        where: {
            tableId: { in: tables.map(t => t.id) }
        }
    })

    // Generate data month by month
    for (let year = 2025; year <= 2026; year++) {
        const startMonth = year === 2025 ? 3 : 1; // Start in March for 2025
        const endMonth = year === 2026 ? 3 : 12;  // End in March for 2026

        for (let month = startMonth; month <= endMonth; month++) {
            console.log(`Generating data for ${month.toString().padStart(2, '0')}/${year}...`)
            
            const startOfMonth = new Date(year, month - 1, 1)
            const endOfMonth = new Date(year, month, 0, 23, 59, 59)
            
            let iterDate = new Date(startOfMonth)
            
            // Generate orders day by day
            const monthOrders = []
            
            while (iterDate <= endOfMonth && iterDate <= new Date()) {
                const isWeekend = iterDate.getDay() === 0 || iterDate.getDay() === 6
                // Generate a realistic amount of orders
                const numOrders = isWeekend ? Math.floor(Math.random() * 30) + 20 : Math.floor(Math.random() * 20) + 10
                
                for(let i = 0; i < numOrders; i++) {
                    const table = tables[Math.floor(Math.random() * tables.length)]
                    const numItems = Math.floor(Math.random() * 4) + 1
                    const items = []
                    let orderTotal = 0

                    for (let j = 0; j < numItems; j++) {
                        const dish = allDishes[Math.floor(Math.random() * allDishes.length)]
                        const quantity = Math.floor(Math.random() * 3) + 1
                        items.push({ dishId: dish.id, name: dish.name, price: dish.price, quantity })
                        orderTotal += dish.price * quantity
                    }

                    let status = 'PAID'
                    const rand = Math.random()
                    if (rand > 0.95) status = 'CANCELLED'
                    else if (rand > 0.8) status = 'COMPLETED'

                    const orderDate = new Date(iterDate)
                    orderDate.setHours(11 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60))

                    monthOrders.push({ 
                        tableId: table.id, 
                        status, 
                        totalAmount: orderTotal, 
                        createdAt: orderDate, 
                        updatedAt: orderDate, 
                        items: items 
                    })
                }
                iterDate.setDate(iterDate.getDate() + 1)
            }

            // Insert orders
            // We use standard Promise.all to insert orders since better-sqlite3 handles concurrent well,
            // or we chunk them to not overload memory
            const chunkSize = 50;
            for (let i = 0; i < monthOrders.length; i += chunkSize) {
                const chunk = monthOrders.slice(i, i + chunkSize);
                await Promise.all(chunk.map(o => prisma.restaurantOrder.create({
                    data: {
                        tableId: o.tableId,
                        status: o.status,
                        totalAmount: o.totalAmount,
                        createdAt: o.createdAt,
                        updatedAt: o.updatedAt,
                        items: { create: o.items }
                    }
                })))
            }

            // Compute analytics
            const monthData = await computeMonthlyAnalytics(tenant.id, month, year, tenant.siteName, 'fr')
            await prisma.restaurantReport.create({
                data: {
                    tenantId: tenant.id, 
                    month, 
                    year, 
                    status: 'GENERATED', 
                    language: 'fr',
                    data: JSON.stringify(monthData)
                }
            })
        }
    }
    console.log('✅ ALL DONE! Generated data for all requested months.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
