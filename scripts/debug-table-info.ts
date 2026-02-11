import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    const client = createClient({
        url: url!,
        authToken: authToken!,
    });

    try {
        const result = await client.execute("PRAGMA table_info(Campaign)");
        console.table(result.rows);
    } catch (e) {
        console.error(e);
    } finally {
        client.close();
    }
}

main();
