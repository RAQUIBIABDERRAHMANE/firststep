import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'

dotenv.config()

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
    console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables')
    process.exit(1)
}

async function addCampaignRecipientsColumn() {
    const client = createClient({
        url: TURSO_DATABASE_URL!,
        authToken: TURSO_AUTH_TOKEN!,
    })

    try {
        console.log('🔄 Adding selectedRecipients column to Campaign table...')

        // Check if column already exists
        const tableInfo = await client.execute(`PRAGMA table_info(Campaign)`)
        const columnExists = tableInfo.rows.some((row: any) => row.name === 'selectedRecipients')

        if (columnExists) {
            console.log('✅ Column selectedRecipients already exists in Campaign table')
            return
        }

        // Add the column with default value
        await client.execute({
            sql: `ALTER TABLE Campaign ADD COLUMN selectedRecipients TEXT NOT NULL DEFAULT '[]'`,
            args: [],
        })

        console.log('✅ Successfully added selectedRecipients column to Campaign table')

        // Verify the column was added
        const verifyTableInfo = await client.execute(`PRAGMA table_info(Campaign)`)
        console.log('\n📋 Campaign table columns:')
        verifyTableInfo.rows.forEach((row: any) => {
            console.log(`  - ${row.name} (${row.type})`)
        })

    } catch (error) {
        console.error('❌ Error updating Campaign table:', error)
        throw error
    } finally {
        client.close()
    }
}

addCampaignRecipientsColumn()
    .then(() => {
        console.log('\n✅ Migration completed successfully')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Migration failed:', error)
        process.exit(1)
    })
