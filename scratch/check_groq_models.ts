import Groq from 'groq-sdk'
import dotenv from 'dotenv'
dotenv.config()

async function listModels() {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    console.log('Fetching Groq models with key:', process.env.GROQ_API_KEY?.slice(0, 10) + '...')
    try {
        const list = await groq.models.list()
        console.log('Available models:', list.data.map(m => m.id))
    } catch (e: any) {
        console.error('Error fetching Groq models:', e?.message || e)
    }
}

listModels()
