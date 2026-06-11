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
        console.log("Adding tableId column to RestaurantReservation in Turso...");
        await client.execute(`
            ALTER TABLE "RestaurantReservation" ADD COLUMN "tableId" TEXT;
        `);
        console.log("Adding index on tableId...");
        await client.execute(`
            CREATE INDEX IF NOT EXISTS "RestaurantReservation_tableId_idx" ON "RestaurantReservation"("tableId");
        `);
        console.log("Migration successful!");
    } catch (err) {
        if (err.message && err.message.includes("duplicate column name")) {
            console.log("Column tableId already exists.");
        } else {
            console.error("Error executing migration:", err);
        }
    } finally {
        client.close();
    }
}

run();
