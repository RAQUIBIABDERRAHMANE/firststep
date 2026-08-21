import Groq from 'groq-sdk'
import dotenv from 'dotenv'
dotenv.config()

async function testModels() {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const candidateModels = [
        'openai/gpt-oss-120b',
        'openai/gpt-oss-20b',
        'qwen/qwen3.6-27b',
        'groq/compound',
        'groq/compound-mini'
    ]

    for (const model of candidateModels) {
        try {
            console.log(`Testing model: ${model}...`)
            const res = await groq.chat.completions.create({
                model,
                messages: [{ role: 'user', content: 'Dis bonjour en 1 mot' }],
                max_tokens: 10
            })
            console.log(`✅ Model ${model} works! Output:`, res.choices[0]?.message?.content)
            return model
        } catch (e: any) {
            console.log(`❌ Model ${model} failed:`, e?.message)
        }
    }
}

testModels()
