
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.development.local') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log('URL:', url ? 'Found' : 'Missing');
console.log('Token:', authToken ? 'Found' : 'Missing');

if (!url || !authToken) {
    console.error('Missing TURSO credentials');
    process.exit(1);
}

const client = createClient({
    url,
    authToken,
});

async function main() {
    console.log('Migrating Turso Schema for Waiters...');

    // 1. Add waiterId to RestaurantTable
    try {
        await client.execute('ALTER TABLE RestaurantTable ADD COLUMN waiterId TEXT');
        console.log('✅ Added waiterId to RestaurantTable');
    } catch (e: any) {
        if (e.message.includes('duplicate column')) {
            console.log('ℹ️ waiterId already exists in RestaurantTable');
        } else {
            console.error('❌ Error adding waiterId to RestaurantTable:', e.message);
        }
    }

    // 2. Create RestaurantWaiter table
    try {
        await client.execute(`
            CREATE TABLE IF NOT EXISTS RestaurantWaiter (
                id TEXT NOT NULL PRIMARY KEY,
                tenantId TEXT NOT NULL,
                name TEXT NOT NULL,
                pin TEXT NOT NULL,
                isActive BOOLEAN NOT NULL DEFAULT true,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT RestaurantWaiter_tenantId_fkey FOREIGN KEY (tenantId) REFERENCES TenantWebsite (id) ON DELETE CASCADE ON UPDATE CASCADE
            )
        `);
        console.log('✅ Created RestaurantWaiter table');

        await client.execute('CREATE INDEX IF NOT EXISTS RestaurantWaiter_tenantId_idx ON RestaurantWaiter(tenantId)');
        console.log('✅ Created index on RestaurantWaiter(tenantId)');
    } catch (e: any) {
        console.error('❌ Error creating RestaurantWaiter:', e.message);
    }
}

main();
