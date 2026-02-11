
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
    console.log('Testing Prisma Adapter connection...');

    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!tursoUrl || !authToken) {
        console.error('Missing Turso credentials');
        return;
    }

    console.log('URL:', tursoUrl);

    console.log('URL:', tursoUrl);

    // Correct usage: Pass config directly to adapter
    const adapter = new PrismaLibSql({
        url: tursoUrl,
        authToken: authToken,
    });
    const prisma = new PrismaClient({ adapter });

    try {
        console.log('Querying users...');
        const users = await prisma.user.findMany();
        console.log(`Found ${users.length} users.`);
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));

        const admin = await prisma.user.findUnique({
            where: { email: 'admin@firststepco.com' }
        });
        console.log('Admin findUnique result:', admin);

        console.log('Querying campaigns...');
        const campaigns = await prisma.campaign.findMany();
        console.log(`Found ${campaigns.length} campaigns.`);
        campaigns.forEach(c => console.log(`- ${c.subject} (${c.status})`));

    } catch (e) {
        console.error('Prisma Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
