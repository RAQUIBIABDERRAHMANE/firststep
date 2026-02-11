import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendCampaign } from '@/app/actions/campaigns'

export async function GET() {
    try {
        const campaigns = await prisma.campaign.findMany({
            where: {
                status: 'SCHEDULED',
                scheduledAt: {
                    lte: new Date(),
                },
            },
        })

        if (campaigns.length === 0) {
            return NextResponse.json({ message: 'No scheduled campaigns to process' })
        }

        const results = await Promise.all(
            campaigns.map(async (campaign) => {
                try {
                    console.log(`Processing scheduled campaign: ${campaign.id}`)
                    return await sendCampaign(campaign.id)
                } catch (error) {
                    console.error(`Failed to process campaign ${campaign.id}:`, error)
                    return { success: false, campaignId: campaign.id, error }
                }
            })
        )

        return NextResponse.json({
            success: true,
            processed: campaigns.length,
            results
        })
    } catch (error) {
        console.error('Error processing scheduled campaigns:', error)
        return NextResponse.json({ error: 'Failed to process campaigns' }, { status: 500 })
    }
}
