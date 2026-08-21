import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/app/actions/auth'
import { generateEmploymentAgreementPdf, getSampleEmploymentData, EmploymentTemplatePositions } from '@/lib/employment-pdf'

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
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
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

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const customPositions: Partial<EmploymentTemplatePositions> | undefined = body.positions || body
    const sampleData = body.sampleData ? { ...getSampleEmploymentData(), ...body.sampleData } : getSampleEmploymentData()

    const pdfBytes = await generateEmploymentAgreementPdf(sampleData, customPositions)

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="employment-agreement-preview.pdf"',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error: any) {
    console.error('[EMPLOYMENT TEMPLATE PREVIEW POST ERROR]', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate real-time agreement preview' },
      { status: 500 }
    )
  }
}
