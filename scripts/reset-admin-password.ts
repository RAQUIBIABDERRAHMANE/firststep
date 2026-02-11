
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";

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
    const newPassword = "Password123!";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        console.log(`Resetting password for user: ${email}`);
        await client.execute({
            sql: "UPDATE User SET password = ? WHERE email = ?",
            args: [hashedPassword, email]
        });
        console.log("Password reset successfully.");
    } catch (e) {
        console.error("Error updating password:", e);
    } finally {
        client.close();
    }
}

main();
