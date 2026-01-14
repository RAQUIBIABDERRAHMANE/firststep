import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'

/**
 * Creates a new PrismaClient with the appropriate adapter based on the environment.
 */
function createPrismaClient() {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoToken = process.env.TURSO_AUTH_TOKEN;

    // 1. Check for Turso (Remote LibSQL)
    if (tursoUrl && tursoToken && tursoUrl.startsWith('libsql:')) {
        console.info('[Prisma] Initializing with Turso adapter');
        const adapter = new PrismaLibSql({
            url: tursoUrl,
            authToken: tursoToken,
        })
        return new PrismaClient({ adapter })
    }

    // 2. Fallback to Better-SQLite3 (Local SQLite)
    console.info('[Prisma] Initializing with local SQLite adapter');
    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || 'dev.db';
    const db = new Database(dbPath);
    const adapter = new PrismaBetterSqlite3(db as any);

    return new PrismaClient({ adapter })
}

// Hard-reset the global prisma instance to ensure new models are picked up
const PRISMA_DEV_KEY = 'prisma_v6_turso_fixed'

const g = globalThis as any

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = createPrismaClient()
} else {
    // In dev, we force a specific key but we also want to be able to "BUMP" it
    // to force a true restart of the client if schema changes
    if (!g[PRISMA_DEV_KEY]) {
        console.info('[Prisma] Initializing persistent development client:', PRISMA_DEV_KEY);
        g[PRISMA_DEV_KEY] = createPrismaClient();
    }

    // EXTREME RESET: If we still have issues, we can uncomment the line below 
    // to force a NEW client on EVERY file reload (slower but 100% fresh)
    // g[PRISMA_DEV_KEY] = createPrismaClient(); 

    prisma = g[PRISMA_DEV_KEY]
}

// Diagnostic check
if (process.env.NODE_ENV !== 'production' && !prisma.restaurantTable) {
    console.error('[Prisma] FATAL: restaurantTable still missing even in fresh client!');
}

export default prisma
