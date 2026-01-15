import { createClient } from '@libsql/client'
import 'dotenv/config'

async function migrate() {
    const url = process.env.TURSO_DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN

    if (!url || !authToken) {
        throw new Error('Missing TURSO credentials')
    }

    const client = createClient({ url, authToken })

    console.log('Adding designTemplate column to TenantWebsite...')

    try {
        await client.execute(`
            ALTER TABLE TenantWebsite 
            ADD COLUMN designTemplate TEXT DEFAULT 'classic'
        `)
        console.log('✅ Column added successfully!')
    } catch (e: any) {
        if (e.message.includes('duplicate column')) {
            console.log('Column already exists')
        } else {
            throw e
        }
    }

    process.exit(0)
}

migrate()
