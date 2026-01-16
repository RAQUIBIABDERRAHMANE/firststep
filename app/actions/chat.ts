'use server'
/** SERVER_ACTION_RELOAD_FORCE: v2 **/

import Groq from 'groq-sdk'
import { getCategories, getTables, getOrders } from '@/app/actions/restaurant'
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
            prisma.restaurantCategory.findMany({ where: { tenantId: tenant.id }, include: { dishes: true } }),
            prisma.restaurantTable.findMany({ where: { tenantId: tenant.id } }),
            prisma.restaurantOrder.findMany({ where: { table: { tenantId: tenant.id } } })
        ])

        const menuSummary = categories.map((cat: any) =>
            `${cat.name}: ${cat.dishes?.map((d: any) => `${d.name} ($${d.price})`).join(', ') || 'No dishes'}`
        ).join('\n')

        const orderStats = {
            total: orders.length,
            pending: orders.filter((o: any) => o.status === 'PENDING').length,
            completed: orders.filter((o: any) => o.status === 'COMPLETED').length,
            totalRevenue: orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
        }

        return {
            menuSummary,
            tableCount: tables.length,
            activeTables: tables.filter((t: any) => t.isActive).length,
            orderStats
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
            prisma.cabinetService.findMany({ where: { tenantId: tenant.id } }),
            prisma.cabinetClient.findMany({ where: { tenantId: tenant.id } }),
            prisma.cabinetAppointment.findMany({ where: { tenantId: tenant.id } })
        ])

        return {
            serviceSummary: servicesRes.map((s: any) => `${s.name} ($${s.price})`).join(', '),
            clientCount: clientsRes.length,
            appointmentStats: {
                total: appointmentsRes.length,
                upcoming: appointmentsRes.filter((a: any) => a.status === 'SCHEDULED').length,
                completed: appointmentsRes.filter((a: any) => a.status === 'COMPLETED').length
            }
        }
    } catch (e) {
        return null
    }
}

const SYSTEM_PROMPT = `You are a friendly, universal AI assistant for business owners on the FirstStep platform. 
You help them manage their operations, understand their data, and provide actionable insights across all their active services.

Keep responses concise and helpful. Use emojis sparingly but appropriately.
If asked about specific data you don't have, suggest they check the relevant dashboard section.

Your current context covers any active services the user has (Restaurant, Professional Cabinet, etc.).`

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
        // Diagnostic log
        console.log('[AI Chat] Runtime Prisma Check - chatSession available:', !!(prisma as any).chatSession);

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

        const activeServiceSlugs = user.services.map((us: any) => us.service.slug)
        let contextMessage = `Owner Profile: ${user.companyName}\n`

        if (activeServiceSlugs.some((s: string) => s.includes('restaurant'))) {
            const restContext = await getRestaurantContext()
            if (restContext) {
                contextMessage += `
Restaurant Context:
- Menu: ${restContext.menuSummary || 'No items'}
- Tables: ${restContext.activeTables}/${restContext.tableCount}
- Orders: ${restContext.orderStats.total} total ($${restContext.orderStats.totalRevenue.toFixed(2)})
`
            }
        }

        if (activeServiceSlugs.some((s: string) => s.includes('cabinet'))) {
            const cabContext = await getCabinetContext()
            if (cabContext) {
                contextMessage += `
Professional Cabinet Context:
- Services: ${cabContext.serviceSummary || 'None set'}
- Clients: ${cabContext.clientCount} total
- Appointments: ${cabContext.appointmentStats.total} total (${cabContext.appointmentStats.upcoming} upcoming)
`
            }
        }

        const systemWithContext = SYSTEM_PROMPT + '\n\n' + contextMessage

        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemWithContext },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 1024,
        })

        const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

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
