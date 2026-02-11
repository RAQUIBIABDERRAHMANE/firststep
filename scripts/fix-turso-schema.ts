
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
        process.exit(1);
    }

    console.log(`Connecting to Turso: ${url}`);
    const client = createClient({
        url,
        authToken,
    });

    const sql = `
    CREATE TABLE IF NOT EXISTS "Campaign" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "subject" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'DRAFT',
        "sentAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        "recipientCount" INTEGER NOT NULL DEFAULT 0,
        "successCount" INTEGER NOT NULL DEFAULT 0,
        "failureCount" INTEGER NOT NULL DEFAULT 0
    );
  `;

    try {
        console.log("Creating Campaign table...");
        await client.execute(sql);
        console.log("Campaign table created or already exists.");
    } catch (e) {
        console.error("Error creating Campaign table:", e);
    } finally {
        client.close();
    }
}

main();
