import dotenv from 'dotenv'
import { generateFacturePdf, getSampleFactureData } from '../lib/facture-pdf'
import { sendPaymentApprovedEmail } from '../lib/mail'

// Load environment variables
dotenv.config()

async function testSendFacture() {
  console.log('🚀 [Test Mail] Starting test invoice email dispatch...')
  console.log(`📧 User: ${process.env.EMAIL_USER}`)
  console.log(`🏨 Host: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`)

  try {
    // 1. Generate sample facture PDF bytes
    console.log('📝 [Test Mail] Generating sample PDF invoice bytes...')
    const sampleData = getSampleFactureData()
    // Override sample values for testing
    sampleData.factureNumber = 'FS-2026-TEST'
    sampleData.clientName = 'Sales Team'
    sampleData.clientEmail = 'sales@firststepco.com'
    sampleData.clientCompany = 'FirstStep Sales Division'
    sampleData.serviceName = 'Premium Restaurant SaaS Sub'
    sampleData.servicePrice = '3,500.00 MAD'
    sampleData.subtotal = '3,500.00 MAD'
    sampleData.total = '3,500.00 MAD'

    const pdfBytes = await generateFacturePdf(sampleData)
    console.log(`✅ [Test Mail] Generated PDF successfully! Size: ${pdfBytes.length} bytes`)

    // 2. Dispatch email to sales@firststepco.com with invoice PDF attached
    console.log('📤 [Test Mail] Dispatching email to sales@firststepco.com...')
    const result = await sendPaymentApprovedEmail(
      'sales@firststepco.com',
      'FirstStep Sales Division',
      'Premium Restaurant SaaS Sub',
      3500,
      pdfBytes,
      'FS-2026-TEST'
    )

    if (result.success) {
      if ((result as any).logged) {
        console.log('⚠️ [Test Mail] Email was only logged to console because credentials are not fully set up.')
      } else {
        console.log('🎉 [Test Mail] Email successfully sent to sales@firststepco.com!')
      }
    } else {
      console.error('❌ [Test Mail] Failed to send email. Error details:', result.error)
    }
  } catch (error) {
    console.error('❌ [Test Mail] Unexpected error during test run:', error)
  }
}

testSendFacture()
