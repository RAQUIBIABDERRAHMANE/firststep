import 'dotenv/config'
import { createClient } from '@libsql/client'

async function syncTurso() {
    const url = process.env.TURSO_DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN

    if (!url || !authToken) {
        console.error('TURSO_DATABASE_URL or TURSO_AUTH_TOKEN missing!')
        return
    }

    console.log('Connecting to Turso DB at:', url)
    const client = createClient({ url, authToken })

    try {
        console.log('1. Creating RestaurantSpace table...')
        await client.execute(`
            CREATE TABLE IF NOT EXISTS "RestaurantSpace" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "tenantId" TEXT NOT NULL,
                "name" TEXT NOT NULL,
                "order" INTEGER NOT NULL DEFAULT 0,
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "RestaurantSpace_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
            )
        `)
        console.log('✓ RestaurantSpace table created or exists')

        console.log('2. Creating index on RestaurantSpace.tenantId...')
        await client.execute(`
            CREATE INDEX IF NOT EXISTS "RestaurantSpace_tenantId_idx" ON "RestaurantSpace"("tenantId")
        `)
        console.log('✓ Index created')

        console.log('3. Adding spaceId column to RestaurantTable if missing...')
        try {
            await client.execute(`
                ALTER TABLE "RestaurantTable" ADD COLUMN "spaceId" TEXT
            `)
            console.log('✓ Added spaceId column to RestaurantTable')
        } catch (e: any) {
            console.log('spaceId column note:', e.message)
        }

        console.log('🎉 Turso schema sync completed successfully!')
    } catch (e) {
        console.error('Failed to sync Turso schema:', e)
    }
}

syncTurso()
