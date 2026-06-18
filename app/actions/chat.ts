'use server'
/** SERVER_ACTION_RELOAD_FORCE: v2 **/

import Groq from 'groq-sdk'
import {
    createCategory,
    updateCategory,
    deleteCategory,
    createDish,
    updateDish,
    deleteDish,
    createTable,
    updateTable,
    deleteTable,
    updateOrderStatus,
    updateRestaurantConfig
} from '@/app/actions/restaurant'
import {
    saveCabinetService,
    deleteCabinetService,
    saveCabinetClient,
    createCabinetAppointment,
    updateCabinetAppointmentStatus
} from '@/app/actions/cabinet'
import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

interface Message {
    role: 'user' | 'assistant' | 'system'
    content: string
}

async function getRestaurantContext() {
    try {
        const user = await getCurrentUser()
        if (!user) return null

        const restaurantService = await prisma.service.findUnique({
            where: { slug: 'restaurant-website' }
        })
        if (!restaurantService) return null

        const tenant = await prisma.tenantWebsite.findFirst({
            where: { userId: user.id, serviceId: restaurantService.id }
        })
        if (!tenant) return null

        const [categories, tables, orders] = await Promise.all([
            prisma.restaurantCategory.findMany({ where: { tenantId: tenant.id }, include: { dishes: true }, orderBy: { order: 'asc' } }),
            prisma.restaurantTable.findMany({ where: { tenantId: tenant.id }, orderBy: { number: 'asc' } }),
            prisma.restaurantOrder.findMany({ 
                where: { table: { tenantId: tenant.id } },
                include: { table: true },
                orderBy: { createdAt: 'desc' },
                take: 15
            })
        ])

        const menuSummary = categories.map((cat: any) =>
            `- Category: "${cat.name}" [ID: ${cat.id}] (Active: ${cat.isActive})\n` +
            (cat.dishes?.map((d: any) => `  * Dish: "${d.name}" [ID: ${d.id}] (${d.price} MAD, Active: ${d.isActive})`).join('\n') || '  (No dishes)')
        ).join('\n')

        const tablesSummary = tables.map((t: any) =>
            `- Table ${t.number} [ID: ${t.id}] (Capacity: ${t.capacity || 'N/A'}, Active: ${t.isActive})`
        ).join('\n')

        const ordersSummary = orders.map((o: any) =>
            `- Order [ID: ${o.id}] (Table: ${o.table?.number || 'N/A'}, Total: ${o.totalAmount} MAD, Status: ${o.status}, Date: ${new Date(o.createdAt).toLocaleString('fr-FR')})`
        ).join('\n')

        const orderStats = {
            total: orders.length,
            pending: orders.filter((o: any) => o.status === 'PENDING').length,
            completed: orders.filter((o: any) => o.status === 'COMPLETED').length,
            cancelled: orders.filter((o: any) => o.status === 'CANCELLED').length,
            totalRevenue: orders.reduce((sum: number, o: any) => sum + ((o.status === 'COMPLETED' || o.status === 'PAID') ? (o.totalAmount || 0) : 0), 0)
        }
        
        // Compute last 30 days analytics
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const recentOrders = orders.filter((o: any) => new Date(o.createdAt) >= thirtyDaysAgo && (o.status === 'PAID' || o.status === 'COMPLETED'))
        const cancelledRecentOrders = orders.filter((o: any) => new Date(o.createdAt) >= thirtyDaysAgo && o.status === 'CANCELLED')
        
        const successRate = recentOrders.length > 0 ? (recentOrders.length / (recentOrders.length + cancelledRecentOrders.length)) * 100 : 0
        const recentRevenue = recentOrders.reduce((sum: number, o: any) => sum + o.totalAmount, 0)
        const avgTicket = recentOrders.length > 0 ? recentRevenue / recentOrders.length : 0
        
        // Rush hours
        const rushHours: Record<string, number> = {}
        recentOrders.forEach((o: any) => {
            const hour = new Date(o.createdAt).getHours()
            rushHours[hour] = (rushHours[hour] || 0) + 1
        })
        const sortedHours = Object.entries(rushHours).sort((a,b) => b[1] - a[1])
        const peakHour = sortedHours.length > 0 ? `${sortedHours[0][0]}:00` : 'N/A'

        return {
            menuSummary,
            tablesSummary,
            ordersSummary,
            tableCount: tables.length,
            activeTables: tables.filter((t: any) => t.isActive).length,
            orderStats,
            analytics: {
                successRate: successRate.toFixed(1) + '%',
                recentRevenue: recentRevenue.toFixed(2) + ' MAD',
                avgTicket: avgTicket.toFixed(2) + ' MAD',
                peakHour,
                totalRecentOrders: recentOrders.length
            }
        }
    } catch (e) {
        return null
    }
}

async function getCabinetContext() {
    try {
        const user = await getCurrentUser()
        if (!user) return null

        const cabinetService = await prisma.service.findUnique({
            where: { slug: 'cabinet-system' }
        })
        if (!cabinetService) return null

        const tenant = await prisma.tenantWebsite.findFirst({
            where: { userId: user.id, serviceId: cabinetService.id }
        })
        if (!tenant) return null

        const [servicesRes, clientsRes, appointmentsRes] = await Promise.all([
            prisma.cabinetService.findMany({ where: { tenantId: tenant.id }, orderBy: { createdAt: 'desc' } }),
            prisma.cabinetClient.findMany({ where: { tenantId: tenant.id }, orderBy: { createdAt: 'desc' }, take: 15 }),
            prisma.cabinetAppointment.findMany({ 
                where: { tenantId: tenant.id },
                include: { client: true, service: true },
                orderBy: { appointmentDate: 'desc' },
                take: 15
            })
        ])

        const completedAppts = appointmentsRes.filter((a: any) => a.status === 'COMPLETED')
        const totalCabinetRevenue = completedAppts.reduce((sum: number, a: any) => sum + ((a.service?.price || 0)), 0)
        
        const upcomingAppts = appointmentsRes
            .filter((a: any) => a.status === 'SCHEDULED' && new Date(a.appointmentDate) >= new Date())
            .sort((a: any, b: any) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
            .slice(0, 3)
            .map((a: any) => `${a.client?.name || 'Inconnu'} - ${a.service?.name} le ${new Date(a.appointmentDate).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}`)
            .join(' | ')

        const servicesSummary = servicesRes.map((s: any) =>
            `- Service: "${s.name}" [ID: ${s.id}] (Price: ${s.price} MAD, Duration: ${s.duration} min, Active: ${s.isActive})`
        ).join('\n')

        const clientsSummary = clientsRes.map((c: any) =>
            `- Client: "${c.name}" [ID: ${c.id}] (Email: ${c.email || 'N/A'}, Phone: ${c.phone || 'N/A'}, CNI: ${c.cni || 'N/A'}, Age: ${c.age || 'N/A'})`
        ).join('\n')

        const appointmentsSummary = appointmentsRes.map((a: any) =>
            `- Appointment [ID: ${a.id}] (Client: ${a.client?.name || 'N/A'}, Service: ${a.service?.name || 'N/A'}, Date: ${new Date(a.appointmentDate).toLocaleString('fr-FR')}, Status: ${a.status})`
        ).join('\n')

        return {
            serviceSummary: servicesSummary,
            clientSummary: clientsSummary,
            appointmentSummary: appointmentsSummary,
            serviceCount: servicesRes.length,
            clientCount: clientsRes.length,
            appointmentStats: {
                total: appointmentsRes.length,
                upcoming: appointmentsRes.filter((a: any) => a.status === 'SCHEDULED').length,
                completed: completedAppts.length,
                cancelled: appointmentsRes.filter((a: any) => a.status === 'CANCELLED').length
            },
            analytics: {
                revenue: totalCabinetRevenue.toFixed(2) + ' MAD',
                nextAppointments: upcomingAppts || 'Aucun rdv prévu',
                avgRevenuePerClient: clientsRes.length > 0 ? (totalCabinetRevenue / clientsRes.length).toFixed(0) + ' MAD' : '0 MAD'
            }
        }
    } catch (e) {
        return null
    }
}

const TOOLS_DEFINITION = [
    // Restaurant - Categories
    {
        type: 'function' as const,
        function: {
            name: 'createCategory',
            description: 'Create a new dish category for the restaurant (e.g. "Starters", "Desserts")',
            parameters: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'The name of the category' }
                },
                required: ['name']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'updateCategory',
            description: 'Update an existing category name, active status, or order',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'The database ID of the category' },
                    name: { type: 'string', description: 'New name for the category (optional)' },
                    isActive: { type: 'boolean', description: 'Toggle visibility of this category (optional)' },
                    order: { type: 'integer', description: 'Sort order index (optional)' }
                },
                required: ['id']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'deleteCategory',
            description: 'Delete a category by its database ID',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'The database ID of the category' }
                },
                required: ['id']
            }
        }
    },
    // Restaurant - Dishes
    {
        type: 'function' as const,
        function: {
            name: 'createDish',
            description: 'Create a new dish under a category in the restaurant menu',
            parameters: {
                type: 'object',
                properties: {
                    categoryId: { type: 'string', description: 'The database ID of the category this dish belongs to' },
                    name: { type: 'string', description: 'The name of the dish' },
                    description: { type: 'string', description: 'Description of the dish' },
                    price: { type: 'number', description: 'Price of the dish in MAD' }
                },
                required: ['categoryId', 'name', 'description', 'price']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'updateDish',
            description: 'Update details of an existing dish (price, description, name, isActive status)',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'The database ID of the dish to update' },
                    name: { type: 'string', description: 'New name of the dish (optional)' },
                    description: { type: 'string', description: 'New description (optional)' },
                    price: { type: 'number', description: 'New price in MAD (optional)' },
                    isActive: { type: 'boolean', description: 'Toggle active status (optional)' }
                },
                required: ['id']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'deleteDish',
            description: 'Delete a dish by its database ID',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'The database ID of the dish' }
                },
                required: ['id']
            }
        }
    },
    // Restaurant - Tables
    {
        type: 'function' as const,
        function: {
            name: 'createTable',
            description: 'Create a new dining table in the restaurant',
            parameters: {
                type: 'object',
                properties: {
                    number: { type: 'string', description: 'Table number/name (e.g. "Table 5" or "Terrace 2")' },
                    capacity: { type: 'integer', description: 'Seating capacity of the table (optional)' }
                },
                required: ['number']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'updateTable',
            description: 'Update an existing table number, capacity, or active status',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'The database ID of the table' },
                    number: { type: 'string', description: 'New table number/identifier (optional)' },
                    capacity: { type: 'integer', description: 'New seating capacity (optional)' },
                    isActive: { type: 'boolean', description: 'Toggle active status (optional)' }
                },
                required: ['id']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'deleteTable',
            description: 'Delete a table by its database ID',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'The database ID of the table' }
                },
                required: ['id']
            }
        }
    },
    // Restaurant - Orders
    {
        type: 'function' as const,
        function: {
            name: 'updateOrderStatus',
            description: 'Change status of a restaurant order (e.g., mark as COMPLETED, PAID, PENDING, CANCELLED)',
            parameters: {
                type: 'object',
                properties: {
                    orderId: { type: 'string', description: 'The database ID of the order' },
                    status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'CANCELLED', 'PAID'], description: 'The new order status' }
                },
                required: ['orderId', 'status']
            }
        }
    },
    // Restaurant - Config Design
    {
        type: 'function' as const,
        function: {
            name: 'updateRestaurantConfig',
            description: 'Update configuration settings of the restaurant website like colors, hero text, opening hours, etc.',
            parameters: {
                type: 'object',
                properties: {
                    primaryColor: { type: 'string', description: 'Primary theme color hex code (e.g., "#E11D48")' },
                    description: { type: 'string', description: 'Short description of the restaurant' },
                    heroTitle: { type: 'string', description: 'Hero title shown on the website' },
                    address: { type: 'string', description: 'Physical address' },
                    phone: { type: 'string', description: 'Phone number' },
                    hours: { type: 'string', description: 'Opening hours summary' },
                    pageTitle: { type: 'string', description: 'Website browser tab title' }
                }
            }
        }
    },
    // Cabinet - Services
    {
        type: 'function' as const,
        function: {
            name: 'createCabinetService',
            description: 'Create a service offered by the Professional Cabinet (e.g., "General consultation")',
            parameters: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'The name of the service' },
                    description: { type: 'string', description: 'Service description (optional)' },
                    price: { type: 'number', description: 'Price of the service in MAD' },
                    duration: { type: 'integer', description: 'Duration of the service in minutes' }
                },
                required: ['name', 'price', 'duration']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'updateCabinetService',
            description: 'Update name, price, duration, description, or status of an existing cabinet service',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'The database ID of the cabinet service' },
                    name: { type: 'string', description: 'New name of the service (optional)' },
                    description: { type: 'string', description: 'New description (optional)' },
                    price: { type: 'number', description: 'New price in MAD (optional)' },
                    duration: { type: 'integer', description: 'New duration in minutes (optional)' },
                    isActive: { type: 'boolean', description: 'Toggle active status (optional)' }
                },
                required: ['id']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'deleteCabinetService',
            description: 'Delete a cabinet service by its database ID',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'The database ID of the service' }
                },
                required: ['id']
            }
        }
    },
    // Cabinet - Clients
    {
        type: 'function' as const,
        function: {
            name: 'createCabinetClient',
            description: 'Create/register a new client/patient in the cabinet system',
            parameters: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'Full name of the client' },
                    email: { type: 'string', description: 'Email address (optional)' },
                    phone: { type: 'string', description: 'Phone number (optional)' },
                    notes: { type: 'string', description: 'Observations or medical history notes (optional)' },
                    age: { type: 'integer', description: 'Age of the client (optional)' },
                    cni: { type: 'string', description: 'National identity card number/CNI (optional)' }
                },
                required: ['name']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'updateCabinetClient',
            description: 'Update notes, phone, email, name, age, or CNI of an existing cabinet client',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'The database ID of the client' },
                    name: { type: 'string', description: 'Full name of the client (optional)' },
                    email: { type: 'string', description: 'Email address (optional)' },
                    phone: { type: 'string', description: 'Phone number (optional)' },
                    notes: { type: 'string', description: 'Notes (optional)' },
                    age: { type: 'integer', description: 'Age (optional)' },
                    cni: { type: 'string', description: 'CNI (optional)' }
                },
                required: ['id']
            }
        }
    },
    // Cabinet - Appointments
    {
        type: 'function' as const,
        function: {
            name: 'createCabinetAppointment',
            description: 'Schedule a new appointment for a client in the cabinet',
            parameters: {
                type: 'object',
                properties: {
                    serviceId: { type: 'string', description: 'The database ID of the service to schedule' },
                    clientName: { type: 'string', description: 'Name of the client' },
                    appointmentDate: { type: 'string', description: 'Date and time of the appointment in ISO format (e.g. "2026-06-25T14:30:00Z")' },
                    clientId: { type: 'string', description: 'ID of client if they are already registered (optional)' },
                    clientEmail: { type: 'string', description: 'Email of the client (optional)' },
                    clientPhone: { type: 'string', description: 'Phone of the client (optional)' },
                    clientAge: { type: 'integer', description: 'Age of the client (optional)' },
                    clientCni: { type: 'string', description: 'CNI of the client (optional)' },
                    notes: { type: 'string', description: 'Appointment specific notes (optional)' }
                },
                required: ['serviceId', 'clientName', 'appointmentDate']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'updateCabinetAppointmentStatus',
            description: 'Update the status of a cabinet appointment (e.g. mark as COMPLETED, CANCELLED, or SCHEDULED)',
            parameters: {
                type: 'object',
                properties: {
                    appointmentId: { type: 'string', description: 'The database ID of the appointment' },
                    status: { type: 'string', enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'], description: 'The new appointment status' }
                },
                required: ['appointmentId', 'status']
            }
        }
    }
]

const SYSTEM_PROMPT = `You are a friendly, universal AI assistant for business owners on the FirstStep platform. 
You help them manage their operations, understand their data, and provide actionable insights across all their active services.

Keep responses concise and helpful. Use emojis sparingly but appropriately.
If asked about specific data you don't have, suggest they check the relevant dashboard section.

Your current context covers any active services the user has (Restaurant, Professional Cabinet, etc.).

YOU HAVE DYNAMIC TOOLS TO CONTROL AND EDIT USER SERVICES.
- Always use the tools when a user requests to make a change (e.g. creating/deleting categories, adding dishes, updating prices, modifying orders, adding appointments, or changing statuses).
- Identifying entities: Look at the provided context (which contains name, description, price, isActive status, and database IDs) to find the correct IDs of categories, dishes, tables, orders, cabinet services, clients, or appointments.
- If the user refers to an item by name (e.g. "Moroccan Tagine"), lookup its ID in the context and call the tool with that ID. If it does not exist, ask the user or create it first.
- Always confirm the action to the user (e.g. "I've updated the price of Moroccan Tagine to 120 MAD.").`

export async function getChatHistory() {
    const user = await getCurrentUser()
    if (!user) return { messages: [] }

    try {
        const lastSession = await prisma.chatSession.findFirst({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    take: 50 // Last 50 messages
                }
            }
        })

        if (!lastSession) return { messages: [] }

        return {
            success: true,
            sessionId: lastSession.id,
            messages: lastSession.messages.map((m: any) => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            }))
        }
    } catch (error) {
        console.error('[AI History] Error:', error)
        return { messages: [] }
    }
}

export async function clearChatHistory() {
    const user = await getCurrentUser()
    if (!user) return { success: false }

    try {
        await prisma.chatSession.deleteMany({
            where: { userId: user.id }
        })
        return { success: true }
    } catch (error) {
        console.error('[AI Clear] Error:', error)
        return { success: false }
    }
}

export async function chat(messages: Message[]) {
    const user = await getCurrentUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    try {
        // Ensure we have a session to save to
        let session = await (prisma as any).chatSession.findFirst({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' }
        })

        if (!session) {
            session = await prisma.chatSession.create({
                data: {
                    userId: user.id,
                    title: `Chat ${new Date().toLocaleDateString()}`
                }
            })
        }

        // Save user message (the last one in the array)
        const lastUserMessage = messages[messages.length - 1]
        if (lastUserMessage && lastUserMessage.role === 'user') {
            await prisma.chatMessage.create({
                data: {
                    sessionId: session.id,
                    role: 'user',
                    content: lastUserMessage.content
                }
            })
        }

        const userWebsites = await prisma.tenantWebsite.findMany({
            where: { userId: user.id },
            include: { service: true }
        })

        const restaurantTenant = userWebsites.find((w: any) => w.service?.slug.includes('restaurant'))
        const cabinetTenant = userWebsites.find((w: any) => w.service?.slug.includes('cabinet'))

        const activeServiceSlugs = user.services.map((us: any) => us.service.slug)
        let contextMessage = `Owner Profile: ${user.companyName}\n`

        if (activeServiceSlugs.some((s: string) => s.includes('restaurant'))) {
            const restContext = await getRestaurantContext()
            if (restContext) {
                contextMessage += `
Restaurant Context:
- Menu:\n${restContext.menuSummary || 'No items'}
- Tables Config:\n${restContext.tablesSummary || 'No tables'}
- Active Tables: ${restContext.activeTables}/${restContext.tableCount}
- Orders Summary:\n${restContext.ordersSummary || 'No recent orders'}
- Last 30 Days Analytics: 
   * Revenue: ${restContext.analytics.recentRevenue} 
   * Success Rate: ${restContext.analytics.successRate}
   * Average Ticket: ${restContext.analytics.avgTicket}
   * Peak Rush Hour: ${restContext.analytics.peakHour}
   * Total Recent Orders: ${restContext.analytics.totalRecentOrders}
`
            }
        }

        if (activeServiceSlugs.some((s: string) => s.includes('cabinet'))) {
            const cabContext = await getCabinetContext()
            if (cabContext) {
                contextMessage += `
Professional Cabinet Context:
- Services:\n${cabContext.serviceSummary || 'None set'}
- Clients:\n${cabContext.clientSummary || 'None set'}
- Appointments Summary:\n${cabContext.appointmentSummary || 'None set'}
- Clients Count: ${cabContext.clientCount} total
- Appointments Stats: ${cabContext.appointmentStats.total} total (${cabContext.appointmentStats.upcoming} upcoming, ${cabContext.appointmentStats.completed} completed, ${cabContext.appointmentStats.cancelled} cancelled)
- Analytical Insights:
   * Total Cabinet Revenue: ${cabContext.analytics.revenue}
   * Average Rev. per Client: ${cabContext.analytics.avgRevenuePerClient}
- Next 3 Upcoming Appointments: ${cabContext.analytics.nextAppointments}
`
            }
        }

        const systemWithContext = SYSTEM_PROMPT + '\n\n' + contextMessage

        // Construct initial messages for Groq API call
        const currentMessages: any[] = [
            { role: 'system', content: systemWithContext },
            ...messages.map(m => ({ role: m.role, content: m.content }))
        ]

        let responseMessage = null
        let toolCalls = []
        let loopCount = 0
        const maxLoops = 5

        while (loopCount < maxLoops) {
            loopCount++
            const completion = await groq.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: currentMessages,
                tools: TOOLS_DEFINITION,
                temperature: 0.7,
                max_tokens: 1024,
            })

            const message = completion.choices[0]?.message
            if (!message) {
                break
            }

            responseMessage = message.content
            toolCalls = message.tool_calls || []

            // If there are no tool calls, we are done
            if (toolCalls.length === 0) {
                break
            }

            // Append assistant tool_calls message to context history
            currentMessages.push({
                role: 'assistant',
                content: message.content || null,
                tool_calls: toolCalls
            })

            // Execute each tool call
            for (const toolCall of toolCalls) {
                const name = toolCall.function.name
                const args = JSON.parse(toolCall.function.arguments)
                let toolResult = null

                try {
                    if (name === 'createCategory') {
                        if (!restaurantTenant) throw new Error('No active Restaurant service found')
                        toolResult = await createCategory(args.name, restaurantTenant.slug)
                    } else if (name === 'updateCategory') {
                        if (!restaurantTenant) throw new Error('No active Restaurant service found')
                        toolResult = await updateCategory(args.id, args, restaurantTenant.slug)
                    } else if (name === 'deleteCategory') {
                        if (!restaurantTenant) throw new Error('No active Restaurant service found')
                        toolResult = await deleteCategory(args.id, restaurantTenant.slug)
                    } else if (name === 'createDish') {
                        if (!restaurantTenant) throw new Error('No active Restaurant service found')
                        toolResult = await createDish(args.categoryId, {
                            name: args.name,
                            description: args.description,
                            price: Number(args.price)
                        }, restaurantTenant.slug)
                    } else if (name === 'updateDish') {
                        if (!restaurantTenant) throw new Error('No active Restaurant service found')
                        toolResult = await updateDish(args.id, {
                            name: args.name,
                            description: args.description,
                            price: args.price !== undefined ? Number(args.price) : undefined,
                            isActive: args.isActive
                        }, restaurantTenant.slug)
                    } else if (name === 'deleteDish') {
                        if (!restaurantTenant) throw new Error('No active Restaurant service found')
                        toolResult = await deleteDish(args.id, restaurantTenant.slug)
                    } else if (name === 'createTable') {
                        if (!restaurantTenant) throw new Error('No active Restaurant service found')
                        toolResult = await createTable(args.number, args.capacity !== undefined ? Number(args.capacity) : undefined, restaurantTenant.slug)
                    } else if (name === 'updateTable') {
                        if (!restaurantTenant) throw new Error('No active Restaurant service found')
                        toolResult = await updateTable(args.id, {
                            number: args.number,
                            capacity: args.capacity !== undefined ? Number(args.capacity) : undefined,
                            isActive: args.isActive
                        }, restaurantTenant.slug)
                    } else if (name === 'deleteTable') {
                        if (!restaurantTenant) throw new Error('No active Restaurant service found')
                        toolResult = await deleteTable(args.id, restaurantTenant.slug)
                    } else if (name === 'updateOrderStatus') {
                        if (!restaurantTenant) throw new Error('No active Restaurant service found')
                        toolResult = await updateOrderStatus(args.orderId, args.status, restaurantTenant.slug)
                    } else if (name === 'updateRestaurantConfig') {
                        if (!restaurantTenant) throw new Error('No active Restaurant service found')
                        toolResult = await updateRestaurantConfig(args, restaurantTenant.slug)
                    } else if (name === 'createCabinetService') {
                        if (!cabinetTenant) throw new Error('No active Professional Cabinet service found')
                        toolResult = await saveCabinetService({
                            tenantId: cabinetTenant.id,
                            name: args.name,
                            description: args.description,
                            price: Number(args.price),
                            duration: Number(args.duration)
                        }, cabinetTenant.slug)
                    } else if (name === 'updateCabinetService') {
                        if (!cabinetTenant) throw new Error('No active Professional Cabinet service found')
                        const existingService = await prisma.cabinetService.findUnique({
                            where: { id: args.id }
                        })
                        if (!existingService) throw new Error('Cabinet service not found')
                        toolResult = await saveCabinetService({
                            id: args.id,
                            tenantId: cabinetTenant.id,
                            name: args.name !== undefined ? args.name : existingService.name,
                            description: args.description !== undefined ? args.description : (existingService.description || undefined),
                            price: args.price !== undefined ? Number(args.price) : existingService.price,
                            duration: args.duration !== undefined ? Number(args.duration) : existingService.duration,
                            isActive: args.isActive !== undefined ? args.isActive : existingService.isActive
                        }, cabinetTenant.slug)
                    } else if (name === 'deleteCabinetService') {
                        if (!cabinetTenant) throw new Error('No active Professional Cabinet service found')
                        toolResult = await deleteCabinetService(args.id, cabinetTenant.slug)
                    } else if (name === 'createCabinetClient') {
                        if (!cabinetTenant) throw new Error('No active Professional Cabinet service found')
                        toolResult = await saveCabinetClient({
                            tenantId: cabinetTenant.id,
                            name: args.name,
                            email: args.email,
                            phone: args.phone,
                            notes: args.notes,
                            age: args.age !== undefined ? Number(args.age) : undefined,
                            cni: args.cni
                        }, cabinetTenant.slug)
                    } else if (name === 'updateCabinetClient') {
                        if (!cabinetTenant) throw new Error('No active Professional Cabinet service found')
                        const existingClient = await prisma.cabinetClient.findUnique({
                            where: { id: args.id }
                        })
                        if (!existingClient) throw new Error('Cabinet client not found')
                        toolResult = await saveCabinetClient({
                            id: args.id,
                            tenantId: cabinetTenant.id,
                            name: args.name !== undefined ? args.name : existingClient.name,
                            email: args.email !== undefined ? args.email : (existingClient.email || undefined),
                            phone: args.phone !== undefined ? args.phone : (existingClient.phone || undefined),
                            notes: args.notes !== undefined ? args.notes : (existingClient.notes || undefined),
                            age: args.age !== undefined ? Number(args.age) : (existingClient.age || undefined),
                            cni: args.cni !== undefined ? args.cni : (existingClient.cni || undefined)
                        }, cabinetTenant.slug)
                    } else if (name === 'createCabinetAppointment') {
                        if (!cabinetTenant) throw new Error('No active Professional Cabinet service found')
                        toolResult = await createCabinetAppointment({
                            tenantId: cabinetTenant.id,
                            serviceId: args.serviceId,
                            clientId: args.clientId,
                            clientName: args.clientName,
                            clientEmail: args.clientEmail,
                            clientPhone: args.clientPhone,
                            clientAge: args.clientAge !== undefined ? Number(args.clientAge) : undefined,
                            clientCni: args.clientCni,
                            appointmentDate: new Date(args.appointmentDate),
                            notes: args.notes
                        }, cabinetTenant.slug)
                    } else if (name === 'updateCabinetAppointmentStatus') {
                        if (!cabinetTenant) throw new Error('No active Professional Cabinet service found')
                        toolResult = await updateCabinetAppointmentStatus(args.appointmentId, args.status, cabinetTenant.slug)
                    } else {
                        throw new Error(`Tool ${name} is not implemented`)
                    }
                } catch (err: any) {
                    console.error(`[AI Tool Execution] Error running tool ${name}:`, err)
                    toolResult = { error: err.message || 'Error executing tool action' }
                }

                currentMessages.push({
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    name: name,
                    content: JSON.stringify(toolResult)
                })
            }
        }

        const response = responseMessage || 'Sorry, I could not generate a response.'

        // Save AI response
        await prisma.chatMessage.create({
            data: {
                sessionId: session.id,
                role: 'assistant',
                content: response
            }
        })

        // Update session timestamp
        await prisma.chatSession.update({
            where: { id: session.id },
            data: { updatedAt: new Date() }
        })

        return { success: true, message: response }
    } catch (error: any) {
        console.error('[AI Chat] Detailed Error:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        })
        return { error: `AI Error: ${error.message || 'Unknown error'}` }
    }
}
