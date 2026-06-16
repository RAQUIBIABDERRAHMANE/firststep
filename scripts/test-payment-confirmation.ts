import prisma from '../lib/prisma'
import { generateFacturePdf } from '../lib/facture-pdf'
import { sendPaymentApprovedEmail } from '../lib/mail'

async function runTest() {
    console.log('🚀 [Diagnostic] Starting payment confirmation simulation...')
    
    try {
        // Find or create a pending payment request
        let payment = await prisma.paymentRequest.findFirst({
            where: { status: 'PENDING' },
            include: { user: true, service: true }
        })

        if (!payment) {
            console.log('📝 [Diagnostic] No pending payments found. Creating a mock user, service, and pending payment...')
            // Find an existing user or create one
            let user = await prisma.user.findFirst()
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: 'test-client@firststepco.com',
                        password: 'password123',
                        companyName: 'Test Client Company',
                        role: 'CLIENT'
                    }
                })
            }

            // Find an existing service or create one
            let service = await prisma.service.findFirst()
            if (!service) {
                service = await prisma.service.create({
                    data: {
                        name: 'SaaS Test Service',
                        slug: 'saas-test-service',
                        description: 'Test service description',
                        status: 'ACTIVE',
                        price: 1500
                    }
                })
            }

            payment = await prisma.paymentRequest.create({
                data: {
                    userId: user.id,
                    serviceId: service.id,
                    amount: 1500,
                    status: 'PENDING',
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                },
                include: { user: true, service: true }
            })
        }

        console.log(`📍 Found/Created Pending Payment Request ID: ${payment.id}`)
        console.log(`🏨 Client Email: ${payment.user.email}`)
        console.log(`🏨 Service Name: ${payment.service.name}`)
        console.log(`💰 Amount: ${payment.amount} MAD`)

        // 1. Simulate confirmPayment logic
        console.log('⚡ [Diagnostic] Updating status in database...')
        await prisma.paymentRequest.update({
            where: { id: payment.id },
            data: {
                status: 'PAID',
                confirmedAt: new Date(),
                confirmedBy: 'mock-admin-id'
            }
        })

        console.log('⚡ [Diagnostic] Ensuring UserService is created...')
        // Delete first if exists to avoid unique constraint error during test rerun
        await prisma.userService.deleteMany({
            where: {
                userId: payment.userId,
                serviceId: payment.serviceId
            }
        })
        await prisma.userService.create({
            data: {
                userId: payment.userId,
                serviceId: payment.serviceId,
                notify: false
            }
        })

        console.log('⚡ [Diagnostic] Generating Facture PDF...')
        const { generateNextFactureNumber } = await import('../lib/facture-pdf')
        const factureNumber = await generateNextFactureNumber()
        console.log(`📝 Generated Facture Number: ${factureNumber}`)

        const factureData = {
            factureNumber,
            date: new Date().toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
            clientName: payment.user.companyName || 'Client',
            clientEmail: payment.user.email,
            clientCompany: payment.user.companyName || '',
            serviceName: payment.service.name,
            servicePrice: `${payment.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD`,
            subtotal: `${payment.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD`,
            total: `${payment.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD`
        }

        const facturePdf = await generateFacturePdf(factureData)
        console.log(`✅ Facture PDF generated successfully (${facturePdf.length} bytes)`)

        // Upload PDF to Cloudflare R2
        console.log('⚡ [Diagnostic] Uploading PDF to R2...')
        let pdfUrl: string | undefined
        try {
            const { uploadImage } = await import('../lib/r2')
            const filename = `factures/${factureNumber}.pdf`
            pdfUrl = await uploadImage(Buffer.from(facturePdf), filename, 'application/pdf')
            console.log(`☁️ PDF upload URL: ${pdfUrl}`)
        } catch (uploadError) {
            console.error('❌ PDF upload failed:', uploadError)
        }

        // Save facture record
        console.log('⚡ [Diagnostic] Saving Facture Record in database...')
        // Delete first if exists
        await prisma.factureRecord.deleteMany({
            where: { paymentId: payment.id }
        })
        const record = await prisma.factureRecord.create({
            data: {
                number: factureNumber,
                paymentId: payment.id,
                userId: payment.userId,
                serviceName: payment.service.name,
                clientName: payment.user.companyName || 'Client',
                clientEmail: payment.user.email,
                amount: payment.amount,
                pdfUrl: pdfUrl || null
            }
        })
        console.log(`✅ Facture Record saved! ID: ${record.id}`)

        // Send email
        console.log('⚡ [Diagnostic] Sending email to client...')
        const emailResult = await sendPaymentApprovedEmail(
            payment.user.email,
            payment.user.companyName || 'Client',
            payment.service.name,
            payment.amount,
            facturePdf,
            factureNumber
        )
        console.log('📧 Email Dispatch Result:', emailResult)
        
        // Reset payment status back to PENDING so database is clean
        await prisma.paymentRequest.update({
            where: { id: payment.id },
            data: { status: 'PENDING' }
        })
        console.log('✅ [Diagnostic] Reverted payment status back to PENDING.')
        console.log('🎉 [Diagnostic] Test simulation finished successfully!')
        
    } catch (e) {
        console.error('❌ [Diagnostic] CRITICAL FAILURE IN FLOW:', e)
    } finally {
        await prisma.$disconnect()
    }
}

runTest()
