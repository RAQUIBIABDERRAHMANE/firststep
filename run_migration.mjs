import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!tursoUrl || !authToken) {
        console.error("Missing Turso credentials");
        return;
    }

    const client = createClient({
        url: tursoUrl,
        authToken: authToken,
    });

    try {
        console.log("Creating RestaurantReservation table...");
        await client.execute(`
            CREATE TABLE IF NOT EXISTS "RestaurantReservation" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "tenantId" TEXT NOT NULL,
                "name" TEXT NOT NULL,
                "phone" TEXT NOT NULL,
                "email" TEXT,
                "date" DATETIME NOT NULL,
                "time" TEXT NOT NULL,
                "partySize" INTEGER NOT NULL,
                "notes" TEXT,
                "status" TEXT NOT NULL DEFAULT 'PENDING',
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "RestaurantReservation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);
        console.log("Creating indices...");
        await client.execute(`CREATE INDEX IF NOT EXISTS "RestaurantReservation_tenantId_idx" ON "RestaurantReservation"("tenantId");`);
        await client.execute(`CREATE INDEX IF NOT EXISTS "RestaurantReservation_date_idx" ON "RestaurantReservation"("date");`);
        console.log("Migration complete.");
    } catch (err) {
        console.error("Error migrating:", err);
    }
}

run();
