import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

function createPrismaClient() {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
    }

    const adapter = new PrismaLibSql({ url, authToken });
    return new PrismaClient({ adapter });
}

const PRISMA_DEV_KEY = 'prisma_v14_turso'
const g = globalThis as any
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = createPrismaClient()
} else {
    if (!g[PRISMA_DEV_KEY]) {
        g[PRISMA_DEV_KEY] = createPrismaClient();
    }
    prisma = g[PRISMA_DEV_KEY]
}

export default prisma
