// Prisma Client Singleton with Turso support
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import Database from 'better-sqlite3'

const prismaClientSingleton = () => {
    if (process.env.TURSO_DATABASE_URL) {
        // Production: Use Turso (libSQL)
        const libsql = createClient({
            url: process.env.TURSO_DATABASE_URL!,
            authToken: process.env.TURSO_AUTH_TOKEN,
        })
        const adapter = new PrismaLibSQL(libsql)
        return new PrismaClient({ adapter })
    } else {
        // Development: Use local SQLite
        const adapter = new PrismaBetterSqlite3({
            url: process.env.DATABASE_URL!
        })
        return new PrismaClient({ adapter })
    }
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma
}
