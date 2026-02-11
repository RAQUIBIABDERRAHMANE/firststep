
import prisma from '../lib/prisma'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
    console.log('Using shared Prisma Client from lib/prisma...')

    // Wait for connection/init if needed (it's lazy)

    console.log('Attempting to create a campaign...')

    try {
        const campaign = await prisma.campaign.create({
            data: {
                subject: 'Test Campaign Debug',
                content: '<p>This is a debug campaign.</p>',
                status: 'DRAFT',
                scheduledAt: null,
                attachments: '[]',
                // Explicitly omitting default fields to see if they are filled
            },
        })
        console.log('Campaign created successfully:', campaign)
    } catch (e: any) {
        console.error('Error creating campaign:', e)
        console.error(JSON.stringify(e, null, 2))
    } finally {
        await prisma.$disconnect()
    }
}

main()
