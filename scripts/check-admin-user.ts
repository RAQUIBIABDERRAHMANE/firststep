
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

    const email = "admin@firststepco.com";

    try {
        console.log(`Checking for user: ${email}`);
        const rs = await client.execute({
            sql: "SELECT * FROM User WHERE email = ?",
            args: [email]
        });

        if (rs.rows.length > 0) {
            console.log("User found:", rs.rows[0]);
        } else {
            console.log("User NOT found.");
        }

    } catch (e) {
        console.error("Error querying User table:", e);
    } finally {
        client.close();
    }
}

main();
