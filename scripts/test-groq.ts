import Groq from 'groq-sdk'
import 'dotenv/config'

async function testGroq() {
    const apiKey = process.env.GROQ_API_KEY
    console.log('Testing Groq with API Key:', apiKey ? 'FOUND (starts with ' + apiKey.substring(0, 5) + '...)' : 'MISSING')

    if (!apiKey) {
        console.error('GROQ_API_KEY is missing from .env')
        process.exit(1)
    }

    const groq = new Groq({ apiKey })

    try {
        console.log('Sending request to Groq (llama-3.1-8b-instant)...')
        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'user', content: 'Hello, this is a test.' }
            ],
            max_tokens: 10
        })

        console.log('Response received:', completion.choices[0]?.message?.content)
        process.exit(0)
    } catch (error) {
        console.error('Groq API Error:', error)
        process.exit(1)
    }
}

testGroq()
