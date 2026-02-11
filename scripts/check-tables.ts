
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

    const client = createClient({
        url,
        authToken,
    });

    try {
        console.log(`Connected to: ${url}`);
        const rs = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
        console.log("Tables found:");
        rs.rows.forEach(row => {
            console.log(`- ${row.name}`);
        });

        // Check specifically for Campaign
        const campaignCheck = await client.execute("SELECT count(*) as count FROM Campaign");
        console.log("Campaign count:", campaignCheck.rows[0]);

    } catch (e) {
        console.error("Error querying tables:", e);
    } finally {
        client.close();
    }
}

main();
