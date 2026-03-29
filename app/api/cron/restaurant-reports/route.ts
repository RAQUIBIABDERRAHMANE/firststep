import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { computeMonthlyAnalytics, generateReportPdf } from '@/lib/restaurant-report'
import { sendMonthlyReportEmail } from '@/lib/mail'

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const reportDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const month = reportDate.getMonth() + 1
    const year = reportDate.getFullYear()

    console.log(`[CRON] Generating monthly reports for ${month}/${year}`)

    const restaurantService = await prisma.service.findFirst({
        where: { slug: { contains: 'restaurant' } },
    })

    if (!restaurantService) {
        return NextResponse.json({ error: 'Restaurant service not found' }, { status: 500 })
    }

    const tenants = await prisma.tenantWebsite.findMany({
        where: { serviceId: restaurantService.id, isActive: true },
        include: { user: { select: { email: true } } },
    })

    const results: { tenantId: string; slug: string; status: string }[] = []

    for (const tenant of tenants) {
        try {
            const language = 'fr' as const
            const data = await computeMonthlyAnalytics(tenant.id, month, year, tenant.siteName, language)
            const pdfBytes = await generateReportPdf(data)

            const report = await prisma.restaurantReport.upsert({
                where: { tenantId_month_year: { tenantId: tenant.id, month, year } },
                update: { status: 'GENERATING', data: JSON.stringify(data), language },
                create: { tenantId: tenant.id, month, year, language, status: 'GENERATING', data: JSON.stringify(data) },
            })

            await sendMonthlyReportEmail(
                tenant.user.email,
                tenant.siteName,
                month,
                year,
                language,
                data,
                pdfBytes
            )

            await prisma.restaurantReport.update({
                where: { id: report.id },
                data: { status: 'SENT' },
            })

            results.push({ tenantId: tenant.id, slug: tenant.slug, status: 'SENT' })
            console.log(`[CRON] ✅ Report sent for ${tenant.siteName}`)
        } catch (e) {
            console.error(`[CRON] ❌ Failed for tenant ${tenant.slug}:`, e)
            results.push({ tenantId: tenant.id, slug: tenant.slug, status: 'FAILED' })
        }
    }

    return NextResponse.json({
        success: true,
        period: `${month}/${year}`,
        processed: tenants.length,
        results,
    })
}
