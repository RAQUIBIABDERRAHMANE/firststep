// Prisma Client Singleton
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'

const prismaClientSingleton = () => {
    const adapter = new PrismaBetterSqlite3({
        url: process.env.DATABASE_URL!
    })
    const instance = new PrismaClient({ adapter })
    console.log('PRISMA INSTANCE KEYS:', Object.keys(instance).filter(k => !k.startsWith('_')))
    return instance
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
// const prisma = prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma
}
