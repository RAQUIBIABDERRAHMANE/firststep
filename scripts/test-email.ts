import 'dotenv/config'
import { sendPaymentRequestEmail, sendPaymentApprovedEmail, sendPaymentDeclinedEmail } from '../lib/mail'

async function testEmail() {
    console.log('🔄 Testing email sending...\n')
    
    console.log('Environment variables:')
    console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST}`)
    console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT}`)
    console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`)
    console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✓ Set' : '✗ Not set'}`)
    console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✓ Set' : '✗ Not set'}`)
    console.log(`EMAIL_SECURE: ${process.env.EMAIL_SECURE}\n`)

    // Demander quelle adresse email utiliser
    const testEmail = process.argv[2] || 'test@example.com'
    console.log(`📧 Test email will be sent to: ${testEmail}\n`)

    try {
        console.log('=== Test 1: Payment Request Email ===')
        const result1 = await sendPaymentRequestEmail(
            testEmail,
            'Test Company',
            'Restaurant Website & Online Ordering',
            4500,
            {
                accountName: 'Abderrahmane Raquibi',
                accountNumber: '0000000013350982',
                rib: '350810000000001335098279',
                bankName: 'AL BARID BANK'
            }
        )
        console.log('Result:', result1)
        console.log('')

        console.log('=== Test 2: Payment Approved Email ===')
        const result2 = await sendPaymentApprovedEmail(
            testEmail,
            'Test Company',
            'Restaurant Website & Online Ordering',
            4500
        )
        console.log('Result:', result2)
        console.log('')

        console.log('=== Test 3: Payment Declined Email ===')
        const result3 = await sendPaymentDeclinedEmail(
            testEmail,
            'Test Company',
            'Restaurant Website & Online Ordering',
            4500
        )
        console.log('Result:', result3)
        console.log('')

        if (result1.success && result2.success && result3.success) {
            console.log('✅ All emails sent successfully!')
            if (result1.logged) {
                console.log('⚠️  Emails were logged to console (not actually sent - missing env vars)')
            }
        } else {
            console.log('❌ Some emails failed to send')
        }
    } catch (error) {
        console.error('❌ Error:', error)
    }
}

console.log('Usage: npx tsx scripts/test-email.ts [email@example.com]')
console.log('If no email provided, will use test@example.com\n')

testEmail()
    .then(() => {
        console.log('\n✨ Test completed!')
        process.exit(0)
    })
    .catch((err) => {
        console.error('Fatal error:', err)
        process.exit(1)
    })
