import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'

dotenv.config()

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
    console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables')
    process.exit(1)
}

async function migrateEmailListModels() {
    const client = createClient({
        url: TURSO_DATABASE_URL!,
        authToken: TURSO_AUTH_TOKEN!,
    })

    try {
        console.log('🔄 Migrating email list models to Turso database...\n')

        // 1. Add emailListIds column to Campaign table
        console.log('📝 Step 1: Adding emailListIds to Campaign table...')
        const campaignTableInfo = await client.execute(`PRAGMA table_info(Campaign)`)
        const emailListIdsExists = campaignTableInfo.rows.some((row: any) => row.name === 'emailListIds')

        if (!emailListIdsExists) {
            await client.execute({
                sql: `ALTER TABLE Campaign ADD COLUMN emailListIds TEXT NOT NULL DEFAULT '[]'`,
                args: [],
            })
            console.log('✅ Added emailListIds column')
        } else {
            console.log('✅ emailListIds column already exists')
        }

        // 2. Create EmailList table
        console.log('\n📝 Step 2: Creating EmailList table...')
        await client.execute({
            sql: `
                CREATE TABLE IF NOT EXISTS EmailList (
                    id TEXT PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL,
                    description TEXT,
                    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
            `,
            args: [],
        })
        console.log('✅ Created EmailList table')

        // 3. Create EmailListMember table
        console.log('\n📝 Step 3: Creating EmailListMember table...')
        await client.execute({
            sql: `
                CREATE TABLE IF NOT EXISTS EmailListMember (
                    id TEXT PRIMARY KEY NOT NULL,
                    listId TEXT NOT NULL,
                    userId TEXT,
                    email TEXT,
                    name TEXT,
                    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (listId) REFERENCES EmailList(id) ON DELETE CASCADE,
                    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
                    UNIQUE(listId, userId),
                    UNIQUE(listId, email)
                )
            `,
            args: [],
        })
        console.log('✅ Created EmailListMember table')

        // 4. Verify tables
        console.log('\n📋 Verifying tables...')

        const tables = await client.execute(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND (name = 'EmailList' OR name = 'EmailListMember')
            ORDER BY name
        `)

        console.log('Tables found:')
        tables.rows.forEach((row: any) => {
            console.log(`  ✅ ${row.name}`)
        })

        // 5. Verify Campaign table has emailListIds
        const verifyCampaign = await client.execute(`PRAGMA table_info(Campaign)`)
        const hasEmailListIds = verifyCampaign.rows.some((row: any) => row.name === 'emailListIds')
        console.log(`  ${hasEmailListIds ? '✅' : '❌'} Campaign.emailListIds`)

    } catch (error) {
        console.error('❌ Error migrating email list models:', error)
        throw error
    } finally {
        client.close()
    }
}

migrateEmailListModels()
    .then(() => {
        console.log('\n✅ Email list migration completed successfully')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Migration failed:', error)
        process.exit(1)
    })
