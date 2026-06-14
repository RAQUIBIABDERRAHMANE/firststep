// Prisma Client Singleton (v7.2.0 - Unified - Local Source)
import "dotenv/config";
import { PrismaClient } from '../src/generated/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'
import helper from 'better-sqlite3'

function withRetry(client: PrismaClient): PrismaClient {
    return client.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    let retries = 4;
                    let delay = 200; // ms
                    while (retries > 0) {
                        try {
                            return await query(args);
                        } catch (err: any) {
                            const errStr = String(err?.message || err || '');
                            const isNetworkError = 
                                errStr.includes('fetch failed') || 
                                errStr.includes('ECONNRESET') || 
                                errStr.includes('timeout') ||
                                errStr.includes('ConnectTimeoutError') ||
                                errStr.includes('undici') ||
                                err?.code === 'P2024' || // Connection timeout
                                err?.name === 'DriverAdapterError';

                            if (isNetworkError && retries > 1) {
                                console.warn(`⚠️ [Prisma Retry] Network error on ${model}.${operation}: ${errStr.slice(0, 120)}. Retrying in ${delay}ms... (${retries - 1} attempts left)`);
                                await new Promise(resolve => setTimeout(resolve, delay));
                                retries--;
                                delay *= 2; // Exponential backoff
                            } else {
                                throw err;
                            }
                        }
                    }
                }
            }
        }
    }) as any;
}

function createPrismaClient() {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    // 1. If using Turso/LibSQL (Prioritize remote cloud DB)
    if (tursoUrl && authToken) {
        console.log('[Prisma Debug] Using Turso Adapter. URL:', tursoUrl);
        const { PrismaLibSql } = require('@prisma/adapter-libsql');

        console.log('🌐 [Prisma] Initializing with Turso/LibSQL adapter');
        const adapter = new PrismaLibSql({
            url: tursoUrl,
            authToken: authToken,
        });

        return withRetry(new PrismaClient({ adapter }));
    }

    const url = process.env.DATABASE_URL || 'file:./dev.db';

    // 2. If using local SQLite (BetterSqlite3)
    if (url.startsWith('file:')) {
        let filePath = url.slice(5); // Remove 'file:' prefix

        // Resolve absolute path to avoid CWD issues
        if (!path.isAbsolute(filePath)) {
            filePath = path.resolve(process.cwd(), filePath);
        }

        console.log(`📁 [Prisma] Current Directory: ${process.cwd()}`);
        console.log(`📁 [Prisma] Initializing with local SQLite adapter at: ${filePath}`);

        // Use better-sqlite3 with the absolute path
        console.log('[Prisma Debug] Using Local SQLite Adapter. Path:', filePath);
        const adapter = new PrismaBetterSqlite3({ url: filePath });
        return new PrismaClient({ adapter });
    }

    // 3. Fallback
    console.log('⚠️ [Prisma] Initializing with standard client (no adapter)');
    console.log('[Prisma Debug] Standard Client Fallback. URL:', process.env.DATABASE_URL);
    return new PrismaClient();
}

const PRISMA_DEV_KEY = 'prisma_v21_restaurant_reports'
const g = globalThis as any
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = createPrismaClient()
} else {
    if (!g[PRISMA_DEV_KEY]) {
        g[PRISMA_DEV_KEY] = createPrismaClient();
    }
    prisma = g[PRISMA_DEV_KEY]

    // Diagnostic check — if any key model is missing, re-initialize
    if (!(prisma as any).chatSession || !(prisma as any).emailList || !(prisma as any).restaurantReport) {
        console.warn('[Prisma] Missing models in cached instance. Re-initializing...');
        g[PRISMA_DEV_KEY] = createPrismaClient();
        prisma = g[PRISMA_DEV_KEY];
    }
}

console.log('[Prisma Debug] Keys on prisma instance:', Object.keys(prisma || {}));
if (!(prisma as any).emailList) {
    console.error('[Prisma CRITICAL] emailList is MISSING on prisma instance!');
} else {
    console.log('[Prisma Debug] emailList exists on prisma instance.');
}

export default prisma
