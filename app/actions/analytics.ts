'use server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'

export async function getRestaurantAnalytics(tenantSlug: string, period: 'day' | 'month' | 'year', isoDate: string) {
    const user = await getCurrentUser()
    if (!user) throw new Error('Unauthorized')

    const tenant = await prisma.tenantWebsite.findFirst({
        where: { slug: tenantSlug, userId: user.id },
        select: { id: true }
    })
    if (!tenant) throw new Error('Tenant not found')

    const targetDate = new Date(isoDate)
    let startDate: Date
    let endDate: Date

    if (period === 'day') {
        startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0)
        endDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59)
    } else if (period === 'month') {
        startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1, 0, 0, 0)
        endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59)
    } else {
        startDate = new Date(targetDate.getFullYear(), 0, 1, 0, 0, 0)
        endDate = new Date(targetDate.getFullYear(), 11, 31, 23, 59, 59)
    }

    const orders = await prisma.restaurantOrder.findMany({
        where: {
            table: { tenantId: tenant.id },
            createdAt: { gte: startDate, lte: endDate },
            status: { not: 'PENDING' } // consider PAID, COMPLETED, CANCELLED
        },
        include: { items: true }
    })

    const completedOrders = orders.filter(o => o.status === 'PAID' || o.status === 'COMPLETED')
    const cancelledOrders = orders.filter(o => o.status === 'CANCELLED')

    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    const successCount = completedOrders.length
    const cancelCount = cancelledOrders.length
    
    // New metrics: items
    const totalItemsSold = completedOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)
    const avgItemsPerOrder = successCount > 0 ? (totalItemsSold / successCount) : 0;

    // Grouping for main chart
    const groupedData: Record<string, { revenue: number, orders: number, index: number }> = {}
    
    // Rush hours tracking (for radar/heatmap)
    const rushHours: Record<string, number> = {}
    for(let i=0; i<24; i++) rushHours[`${i.toString().padStart(2, '0')}:00`] = 0;

    completedOrders.forEach(o => {
        let key = ''
        let index = 0

        // main chart grouping
        if (period === 'day') {
            key = `${o.createdAt.getHours().toString().padStart(2, '0')}:00`
            index = o.createdAt.getHours()
        } else if (period === 'month') {
            key = o.createdAt.getDate().toString()
            index = o.createdAt.getDate()
        } else {
            key = o.createdAt.toLocaleString('fr-FR', { month: 'short' })
            key = key.charAt(0).toUpperCase() + key.slice(1) // E.g., "Janv."
            index = o.createdAt.getMonth()
        }

        if (!groupedData[key]) groupedData[key] = { revenue: 0, orders: 0, index }
        groupedData[key].revenue += o.totalAmount
        groupedData[key].orders += 1
        
        // rush hours grouping
        const hour = `${o.createdAt.getHours().toString().padStart(2, '0')}:00`
        rushHours[hour] += 1
    })

    let chartData = Object.entries(groupedData).map(([label, data]) => ({
        label,
        revenue: data.revenue,
        orders: data.orders,
        index: data.index
    }))

    // Sort chart data chronologically
    chartData.sort((a, b) => a.index - b.index)
    
    // Peak hours array
    const peakHoursData = Object.entries(rushHours).map(([hour, count]) => ({
        hour,
        count
    }))

    // Top items
    const itemMap: Record<string, { name: string, quantity: number, revenue: number }> = {}
    completedOrders.forEach(o => {
        o.items.forEach(i => {
            if (!itemMap[i.dishId]) itemMap[i.dishId] = { name: i.name, quantity: 0, revenue: 0 }
            itemMap[i.dishId].quantity += i.quantity
            itemMap[i.dishId].revenue += i.price * i.quantity
        })
    })

    const allItems = Object.values(itemMap).sort((a, b) => b.revenue - a.revenue)
    const topItems = allItems.slice(0, 6)
    
    // Calculate status breakdown
    const totalOrders = orders.length;
    const statusData = [
        { name: 'Complétées/Payées', value: successCount, color: '#10b981' }, // green
        { name: 'Annulées', value: cancelCount, color: '#f43f5e' } // red
    ].filter(s => s.value > 0);

    return {
        metrics: {
            totalRevenue,
            successCount,
            cancelCount,
            avgOrderValue: successCount > 0 ? (totalRevenue / successCount) : 0,
            totalItemsSold,
            avgItemsPerOrder,
            totalOrders
        },
        chartData,
        topItems,
        peakHoursData,
        statusData
    }
}
