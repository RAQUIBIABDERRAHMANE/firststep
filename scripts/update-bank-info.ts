import prisma from '../lib/prisma'

async function updateBankAccount() {
    console.log('🔄 Updating bank account information...\n')

    try {
        // Get the first bank account (assuming there's only one)
        const existingAccount = await prisma.bankAccount.findFirst()

        if (!existingAccount) {
            console.log('❌ No bank account found. Creating new one...')
            
            const newAccount = await prisma.bankAccount.create({
                data: {
                    accountName: 'Abderrahmane Raquibi',
                    iban: '0000000013350982',
                    rib: '350810000000001335098279',
                    bankName: 'AL BARID BANK'
                }
            })
            
            console.log('✅ Bank account created successfully!')
            console.log(`   Account Name: ${newAccount.accountName}`)
            console.log(`   IBAN: ${newAccount.iban}`)
            console.log(`   Bank Name: ${newAccount.bankName}`)
        } else {
            const updatedAccount = await prisma.bankAccount.update({
                where: { id: existingAccount.id },
                data: {
                    accountName: 'Abderrahmane Raquibi',
                    iban: '0000000013350982',
                    rib: '350810000000001335098279',
                    bankName: 'AL BARID BANK',
                    bic: null
                }
            })

            console.log('✅ Bank account updated successfully!')
            console.log(`   Account Name: ${updatedAccount.accountName}`)
            console.log(`   IBAN: ${updatedAccount.iban}`)
            console.log(`   Bank Name: ${updatedAccount.bankName}`)
        }

        console.log('\n📋 New Bank Details:')
        console.log('   Titulaire: Abderrahmane Raquibi')
        console.log('   RIB: 350810000000001335098279')
        console.log('   Numéro de compte: 0000000013350982')
        console.log('   Bank Name: AL BARID BANK')

    } catch (error) {
        console.error('❌ Error updating bank account:', error)
        throw error
    }
}

updateBankAccount()
    .then(() => {
        console.log('\n✨ Done!')
        process.exit(0)
    })
    .catch((err) => {
        console.error('Fatal error:', err)
        process.exit(1)
    })
