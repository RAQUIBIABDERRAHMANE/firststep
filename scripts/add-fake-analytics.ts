import 'dotenv/config'
import prisma from '../lib/prisma'
import { computeMonthlyAnalytics } from '../lib/restaurant-report'

async function main() {
    console.log('Generating fake analytics for marketing account...')

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

    // Clean up previous fake orders if needed
    console.log('Cleaning up old orders for tenant tables...')
    await prisma.restaurantOrder.deleteMany({
        where: { tableId: { in: tables.map(t => t.id) } }
    })
    await prisma.restaurantReport.deleteMany({
        where: { tenantId: tenant.id }
    })

    const statuses = ['PENDING', 'COOKING', 'READY', 'SERVED', 'PAID', 'COMPLETED', 'CANCELLED']
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    console.log('Inserting orders over the last 30 days...')
    
    // Generate variable amount of orders each day
    let totalOrders = 0
    let totalRevenue = 0
    let iterDate = new Date(thirtyDaysAgo)

    while (iterDate <= today) {
        // More orders on weekends
        const isWeekend = iterDate.getDay() === 0 || iterDate.getDay() === 6
        const numOrders = isWeekend ? Math.floor(Math.random() * 25) + 15 : Math.floor(Math.random() * 15) + 5

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

            // High chance of order being PAID/COMPLETED since they are historical
            let status = 'PAID'
            const rand = Math.random()
            if (rand > 0.95) status = 'CANCELLED'
            else if (rand > 0.8) status = 'COMPLETED'
            
            // Random time during the day (e.g. between 11:00 and 23:00)
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

    // Now generate the previous month's report (and current month maybe)
    const currentMonth = today.getMonth() + 1
    const currentYear = today.getFullYear()
    
    let prevMonth = currentMonth - 1
    let prevYear = currentYear
    if (prevMonth === 0) {
        prevMonth = 12
        prevYear = currentYear - 1
    }

    console.log(`Generating reports for ${prevMonth}/${prevYear} and ${currentMonth}/${currentYear}...`)

    const prevMonthData = await computeMonthlyAnalytics(tenant.id, prevMonth, prevYear, tenant.siteName, 'fr')
    await prisma.restaurantReport.create({
        data: {
            tenantId: tenant.id,
            month: prevMonth,
            year: prevYear,
            status: 'GENERATED',
            language: 'fr',
            data: JSON.stringify(prevMonthData)
        }
    })

    const currMonthData = await computeMonthlyAnalytics(tenant.id, currentMonth, currentYear, tenant.siteName, 'fr')
    await prisma.restaurantReport.create({
        data: {
            tenantId: tenant.id,
            month: currentMonth,
            year: currentYear,
            status: 'GENERATED',
            language: 'fr',
            data: JSON.stringify(currMonthData)
        }
    })

    console.log('✅ Fake analytics created successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
