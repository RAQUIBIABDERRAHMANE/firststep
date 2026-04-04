import { PrismaClient } from './src/generated/client/index.js';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    const adapter = new PrismaLibSql({
        url: tursoUrl,
        authToken: authToken,
    });

    const prisma = new PrismaClient({ adapter });
    
    try {
        console.log("Testing connection...");
        const count = await prisma.user.count();
        console.log("Connection successful. User count:", count);
    } catch (e) {
        console.error("Connection failed Error:", e);
    }
}

main();
