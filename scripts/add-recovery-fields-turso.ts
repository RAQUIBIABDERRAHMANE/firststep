import 'dotenv/config'
import { createClient } from '@libsql/client'

async function main() {
    const url = process.env.TURSO_DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN

    if (!url || !authToken) {
        console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN')
        process.exit(1)
    }

    const client = createClient({ url, authToken })

    console.log('🔗 Connected to Turso:', url)

    // Check if columns already exist
    const tableInfo = await client.execute(`PRAGMA table_info("User")`)
    const columns = tableInfo.rows.map((r: any) => r.name)
    console.log('📋 Current User columns:', columns)

    const hasRecoveryEmail = columns.includes('recoveryEmail')
    const hasRecoveryCodes = columns.includes('recoveryCodes')

    if (hasRecoveryEmail && hasRecoveryCodes) {
        console.log('✅ Both columns already exist. Nothing to do.')
        return
    }

    if (!hasRecoveryEmail) {
        console.log('➕ Adding recoveryEmail column...')
        await client.execute(`ALTER TABLE "User" ADD COLUMN "recoveryEmail" TEXT`)
        console.log('✅ recoveryEmail added.')
    } else {
        console.log('⏭️  recoveryEmail already exists.')
    }

    if (!hasRecoveryCodes) {
        console.log('➕ Adding recoveryCodes column...')
        await client.execute(`ALTER TABLE "User" ADD COLUMN "recoveryCodes" TEXT NOT NULL DEFAULT '[]'`)
        console.log('✅ recoveryCodes added.')
    } else {
        console.log('⏭️  recoveryCodes already exists.')
    }

    // Verify
    const verify = await client.execute(`PRAGMA table_info("User")`)
    const newCols = verify.rows.map((r: any) => r.name)
    console.log('✅ Final User columns:', newCols)

    client.close()
}

main().catch(err => {
    console.error('❌ Migration failed:', err)
    process.exit(1)
})
