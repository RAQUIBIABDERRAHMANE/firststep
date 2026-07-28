import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/app/actions/auth'
import { generateEmploymentAgreementPdf, getSampleEmploymentData } from '@/lib/employment-pdf'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sampleData = getSampleEmploymentData()
    const pdfBytes = await generateEmploymentAgreementPdf(sampleData)

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="employment-agreement-preview.pdf"',
      },
    })
  } catch (error: any) {
    console.error('[EMPLOYMENT TEMPLATE PREVIEW ERROR]', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate agreement preview' },
      { status: 500 }
    )
  }
}
