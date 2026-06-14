import dotenv from 'dotenv'
import { PrismaClient } from '../src/generated/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

dotenv.config()

const tursoUrl = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!tursoUrl || !authToken) {
  console.error('❌ Missing TURSO env credentials')
  process.exit(1)
}

const adapter = new PrismaLibSql({
  url: tursoUrl,
  authToken: authToken,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const template = await prisma.factureTemplate.findFirst()
  console.log('Facture Template in Database:')
  console.log(JSON.stringify(template, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
