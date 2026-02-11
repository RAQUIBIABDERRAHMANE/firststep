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

    try {
        // 1. Check if Campaign table exists
        const checkTable = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Campaign'");

        if (checkTable.rows.length === 0) {
            console.log("Campaign table does not exist. Creating it...");
            await client.execute(`
                CREATE TABLE "Campaign" (
                    "id" TEXT NOT NULL PRIMARY KEY,
                    "subject" TEXT NOT NULL,
                    "content" TEXT NOT NULL,
                    "status" TEXT NOT NULL DEFAULT 'DRAFT',
                    "sentAt" DATETIME,
                    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    "updatedAt" DATETIME NOT NULL,
                    "recipientCount" INTEGER NOT NULL DEFAULT 0,
                    "successCount" INTEGER NOT NULL DEFAULT 0,
                    "failureCount" INTEGER NOT NULL DEFAULT 0,
                    "selectedRecipients" TEXT NOT NULL DEFAULT '[]',
                    "emailListIds" TEXT NOT NULL DEFAULT '[]',
                    "scheduledAt" DATETIME,
                    "attachments" TEXT DEFAULT '[]'
                );
            `);
            console.log("Campaign table created.");
        } else {
            console.log("Campaign table exists. Checking for missing columns...");

            const columnsToAdd = [
                { name: "selectedRecipients", type: "TEXT NOT NULL DEFAULT '[]'" },
                { name: "emailListIds", type: "TEXT NOT NULL DEFAULT '[]'" },
                { name: "scheduledAt", type: "DATETIME" },
                { name: "attachments", type: "TEXT DEFAULT '[]'" }
            ];

            for (const col of columnsToAdd) {
                try {
                    await client.execute(`ALTER TABLE "Campaign" ADD COLUMN "${col.name}" ${col.type}`);
                    console.log(`Added column ${col.name} to Campaign table.`);
                } catch (e: any) {
                    if (e.message.includes("duplicate column name")) {
                        console.log(`Column ${col.name} already exists in Campaign table.`);
                    } else {
                        console.error(`Error adding column ${col.name}:`, e.message);
                    }
                }
            }
        }

        // 2. Add unsubscribed to User
        console.log("Checking User table...");
        try {
            await client.execute('ALTER TABLE "User" ADD COLUMN "unsubscribed" BOOLEAN NOT NULL DEFAULT false');
            console.log('Added unsubscribed column to User table.');
        } catch (e: any) {
            if (e.message.includes("duplicate column name")) {
                console.log('Column unsubscribed already exists in User table.');
            } else {
                console.error('Error adding unsubscribed to User:', e.message);
            }
        }

        // 3. Add unsubscribed to EmailListMember
        console.log("Checking EmailListMember table...");
        try {
            await client.execute('ALTER TABLE "EmailListMember" ADD COLUMN "unsubscribed" BOOLEAN NOT NULL DEFAULT false');
            console.log('Added unsubscribed column to EmailListMember table.');
        } catch (e: any) {
            if (e.message.includes("duplicate column name")) {
                console.log('Column unsubscribed already exists in EmailListMember table.');
            } else if (e.message.includes("no such table")) {
                console.log('EmailListMember table does not exist. Please check if EmailList migration was run.');
            } else {
                console.error('Error adding unsubscribed to EmailListMember:', e.message);
            }
        }

        console.log("Schema update complete.");

    } catch (e) {
        console.error("Error updating schema:", e);
    } finally {
        client.close();
    }
}

main();
