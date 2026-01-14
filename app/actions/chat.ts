'use server'

import Groq from 'groq-sdk'
import { getCategories, getTables, getOrders } from '@/app/actions/restaurant'
import { getCurrentUser } from '@/app/actions/auth'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

interface Message {
    role: 'user' | 'assistant' | 'system'
    content: string
}

async function getRestaurantContext() {
    const user = await getCurrentUser()
    if (!user) return null

    const categories = await getCategories()
    const tables = await getTables()
    const orders = await getOrders()

    const menuSummary = categories.map(cat =>
        `${cat.name}: ${cat.dishes?.map((d: any) => `${d.name} ($${d.price})`).join(', ') || 'No dishes'}`
    ).join('\n')

    const orderStats = {
        total: orders.length,
        pending: orders.filter((o: any) => o.status === 'PENDING').length,
        completed: orders.filter((o: any) => o.status === 'COMPLETED').length,
        totalRevenue: orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
    }

    return {
        companyName: user.companyName,
        menuSummary,
        tableCount: tables.length,
        activeTables: tables.filter((t: any) => t.isActive).length,
        orderStats
    }
}

const SYSTEM_PROMPT = `You are a friendly AI assistant for restaurant owners using the FirstStep platform. 
You help them manage their restaurant, understand their business data, and provide actionable insights.

Keep responses concise and helpful. Use emojis sparingly but appropriately.
If asked about specific data you don't have, suggest they check the relevant dashboard section.

You can help with:
- Menu management tips
- Order insights
- Table management
- Business growth suggestions
- Platform feature explanations`

export async function chat(messages: Message[]) {
    const user = await getCurrentUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    try {
        const context = await getRestaurantContext()

        const contextMessage = context ? `
Current Restaurant Context for ${context.companyName}:
- Menu Categories: ${context.menuSummary || 'No menu items yet'}
- Tables: ${context.activeTables}/${context.tableCount} active
- Orders: ${context.orderStats.total} total (${context.orderStats.pending} pending)
- Revenue: $${context.orderStats.totalRevenue.toFixed(2)}
` : ''

        const systemWithContext = SYSTEM_PROMPT + '\n\n' + contextMessage

        const completion = await groq.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [
                { role: 'system', content: systemWithContext },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 1024,
        })

        const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

        return { success: true, message: response }
    } catch (error) {
        console.error('[AI Chat] Error:', error)
        return { error: 'Failed to get AI response. Please try again.' }
    }
}
