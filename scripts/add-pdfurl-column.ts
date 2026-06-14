import dotenv from 'dotenv'
import { PrismaClient } from '../src/generated/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

dotenv.config()

const tursoUrl = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!tursoUrl || !authToken) {
  console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in environment variables.')
  process.exit(1)
}

console.log('🔄 Initializing Prisma client with Turso adapter...')
const adapter = new PrismaLibSql({
  url: tursoUrl,
  authToken: authToken,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('⚡ Running ALTER TABLE DDL on Turso database...')

  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "FactureRecord" ADD COLUMN "pdfUrl" TEXT;
    `)
    console.log('✅ Column "pdfUrl" successfully added to "FactureRecord" table!')
  } catch (err: any) {
    if (err.message && err.message.includes('duplicate column name')) {
      console.log('ℹ️ Column "pdfUrl" already exists in "FactureRecord" table.')
    } else {
      console.error('❌ Error executing DDL query:', err)
      process.exit(1)
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
