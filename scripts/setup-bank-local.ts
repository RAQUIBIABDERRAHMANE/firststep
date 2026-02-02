import { PrismaClient } from '../src/generated/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

async function createDefaultBankAccount() {
  // Force local SQLite connection
  const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
  const prisma = new PrismaClient({ adapter })

  try {
    console.log('📁 Using local SQLite database')
    
    // Check if bank account already exists
    const existingAccount = await prisma.bankAccount.findFirst({
      where: { isActive: true }
    })

    if (existingAccount) {
      console.log('✅ Bank account already exists:', existingAccount.accountName)
      return
    }

    // Create default bank account
    const account = await prisma.bankAccount.create({
      data: {
        accountName: 'FirstStep Solutions SARL',
        iban: 'FR76 1234 5678 9012 3456 7890 123',
        bic: 'BNPAFRPPXXX',
        bankName: 'BNP Paribas',
        isActive: true,
      }
    })

    console.log('✅ Default bank account created successfully:', account.accountName)
  } catch (error) {
    console.error('❌ Error creating bank account:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDefaultBankAccount()
