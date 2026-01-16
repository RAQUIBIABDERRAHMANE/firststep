// Prisma Client Singleton (v7.2.0 - Unified - Local Source)
import "dotenv/config";
import { PrismaClient } from '../src/generated/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

function createPrismaClient() {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    // 1. If using Turso/LibSQL (Prioritize remote cloud DB)
    if (tursoUrl && authToken) {
        console.log('🌐 [Prisma] Initializing with Turso/LibSQL adapter');
        const adapter = new PrismaLibSql({ url: tursoUrl, authToken });
        return new PrismaClient({ adapter });
    }

    const url = process.env.DATABASE_URL || 'file:./dev.db';

    // 2. If using local SQLite (BetterSqlite3)
    if (url.startsWith('file:')) {
        console.log(`📁 [Prisma] Initializing with local SQLite adapter: ${url}`);
        const adapter = new PrismaBetterSqlite3({ url });
        return new PrismaClient({ adapter });
    }

    // 3. Fallback
    console.log('⚠️ [Prisma] Initializing with standard client (no adapter)');
    return new PrismaClient();
}

const PRISMA_DEV_KEY = 'prisma_v18_unified'
const g = globalThis as any
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = createPrismaClient()
} else {
    if (!g[PRISMA_DEV_KEY]) {
        g[PRISMA_DEV_KEY] = createPrismaClient();
    }
    prisma = g[PRISMA_DEV_KEY]

    // Diagnostic check
    if (!(prisma as any).chatSession) {
        console.warn('[Prisma] chatSession MISSING in cached instance. Re-initializing...');
        g[PRISMA_DEV_KEY] = createPrismaClient();
        prisma = g[PRISMA_DEV_KEY];
    }
}

export default prisma

