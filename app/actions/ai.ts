'use server'

import Groq from 'groq-sdk'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

export async function generateWebsiteSuggestions(type: string = 'professional cabinet', context?: string) {
    try {
        const prompt = `You are a professional branding expert for small businesses. 
        Generate 3 high-end, professional site names and corresponding short taglines/descriptions for a "${type}".
        ${context ? `The user provided this context: "${context}". Please build upon or refine this.` : ''}
        
        Focus on clinical excellence, trust, precision, and care.
        Format the response as a JSON array of objects with "siteName" and "description" fields.
        Example: [{"siteName": "Elite Medical", "description": "High-precision therapeutic care"}]
        Return ONLY the JSON. No other text.`

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            response_format: { type: 'json_object' }
        })

        const content = chatCompletion.choices[0]?.message?.content
        if (!content) return { error: 'No response from AI' }

        const data = JSON.parse(content)
        // Handle both direct array or wrapped in an object
        let suggestions = Array.isArray(data) ? data : (data.suggestions || Object.values(data)[0])

        if (!Array.isArray(suggestions)) {
            // Fallback for some LLM formats
            suggestions = [data]
        }

        return { success: true, suggestions: suggestions.slice(0, 3) }
    } catch (error) {
        console.error('AI Generation Failed:', error)
        return { error: 'Failed to generate suggestions' }
    }
}
