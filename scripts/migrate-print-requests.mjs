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
        console.log("Creating TablePrintRequest table in Turso...");
        await client.execute(`
            CREATE TABLE IF NOT EXISTS "TablePrintRequest" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "tenantId" TEXT NOT NULL,
                "tableIds" TEXT NOT NULL,
                "status" TEXT NOT NULL DEFAULT 'PENDING',
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE
            );
        `);
        
        console.log("Creating index on tenantId...");
        await client.execute(`
            CREATE INDEX IF NOT EXISTS "TablePrintRequest_tenantId_idx" ON "TablePrintRequest"("tenantId");
        `);

        console.log("Migration successful!");
    } catch (err) {
        console.error("Error executing migration:", err);
    } finally {
        client.close();
    }
}

run();
