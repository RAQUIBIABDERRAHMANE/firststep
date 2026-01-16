import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

async function deploy() {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        console.error("❌ TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing in .env");
        process.exit(1);
    }

    console.log("🚀 Connecting to Turso...");
    const client = createClient({ url, authToken });

    const sqlPath = path.join(process.cwd(), "prisma", "schema.sql");
    if (!fs.existsSync(sqlPath)) {
        console.error(`❌ SQL file not found at: ${sqlPath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(sqlPath, "utf-8");
    console.log("📄 Reading schema.sql...");

    // Remove comments and split by semicolons
    const sql = content.replace(/--.*$/gm, ""); // Remove -- comments
    const statements = sql
        .split(";")
        .map(s => s.trim())
        .filter(s => s.length > 0);

    console.log(`⚡ Executing ${statements.length} SQL statements...`);

    let count = 0;
    for (const statement of statements) {
        try {
            await client.execute(statement);
            count++;
            if (count % 10 === 0) console.log(`✅ Progress: ${count}/${statements.length}`);
        } catch (error: any) {
            // If table already exists, we can often ignore for a fresh sync
            if (error.message.includes("already exists")) {
                console.warn(`⚠️  Skip: ${error.message.split('\n')[0]}`);
            } else {
                console.error(`❌ Error executing statement: ${statement.substring(0, 100)}...`);
                console.error(error.message);
                // Depending on the error, we might want to continue or stop
                // For a schema sync, we might want to stop to avoid partial states
                process.exit(1);
            }
        }
    }

    console.log(`🎉 Deployment finished! Successfully executed ${count} statements.`);
}

deploy().catch(console.error);
