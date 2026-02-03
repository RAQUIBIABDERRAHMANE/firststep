import { createClient } from "@libsql/client";
import "dotenv/config";

async function migrate() {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        console.error("❌ TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing in .env");
        process.exit(1);
    }

    console.log("🚀 Connecting to Turso...");
    const client = createClient({ url, authToken });

    const statements = [
        `ALTER TABLE "Service" ADD COLUMN "icon" TEXT`,
        `ALTER TABLE "Service" ADD COLUMN "price" REAL`,
    ];

    console.log(`⚡ Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
        try {
            await client.execute(statements[i]);
            console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
        } catch (error: unknown) {
            if (error instanceof Error && error.message.includes('duplicate column name')) {
                console.log(`⚠️ Column already exists, skipping...`)
            } else {
                console.error(`❌ Error executing statement ${i + 1}:`, error instanceof Error ? error.message : error)
            }
        }
    }

    console.log("🎉 Migration completed!");
    process.exit(0);
}

migrate();
