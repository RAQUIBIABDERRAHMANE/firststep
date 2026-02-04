import { createClient } from '@libsql/client'
import 'dotenv/config'

async function addRibColumn() {
    const url = process.env.TURSO_DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN

    if (!url || !authToken) {
        console.error('❌ TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing in .env')
        process.exit(1)
    }

    console.log('🔄 Adding RIB column to Turso database...')

    try {
        const client = createClient({
            url,
            authToken
        })

        // Add RIB column to BankAccount table
        await client.execute('ALTER TABLE BankAccount ADD COLUMN rib TEXT;')
        
        console.log('✅ RIB column added successfully!')

        // Update existing bank account with RIB value
        const result = await client.execute({
            sql: 'UPDATE BankAccount SET rib = ? WHERE id = (SELECT id FROM BankAccount LIMIT 1);',
            args: ['350810000000001335098279']
        })

        console.log(`✅ Updated ${result.rowsAffected} bank account(s) with RIB value`)

    } catch (error) {
        console.error('❌ Error adding RIB column:', error)
        throw error
    }
}

addRibColumn()
    .then(() => {
        console.log('\n✨ Done!')
        process.exit(0)
    })
    .catch((err) => {
        console.error('Fatal error:', err)
        process.exit(1)
    })