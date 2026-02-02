import prisma from '@/lib/prisma'

async function createDefaultBankAccount() {
  try {
    // Check if bank account already exists
    const existingAccount = await prisma.bankAccount.findFirst({
      where: { isActive: true }
    })

    if (existingAccount) {
      console.log('Bank account already exists')
      return
    }

    // Create default bank account
    await prisma.bankAccount.create({
      data: {
        accountName: 'FirstStep Solutions SARL',
        iban: 'FR76 1234 5678 9012 3456 7890 123',
        bic: 'BNPAFRPPXXX',
        bankName: 'BNP Paribas',
        isActive: true,
      }
    })

    console.log('Default bank account created successfully')
  } catch (error) {
    console.error('Error creating bank account:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDefaultBankAccount()