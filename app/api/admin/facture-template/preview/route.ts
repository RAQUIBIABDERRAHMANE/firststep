import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/app/actions/auth'
import { generateFacturePdf, getSampleFactureData } from '@/lib/facture-pdf'

export async function GET() {
  const user = await getCurrentUser()
  console.log('[API] GET /api/admin/facture-template/preview - user:', user ? `${user.email} (${user.role})` : 'null')
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sampleData = getSampleFactureData()
    const pdfBytes = await generateFacturePdf(sampleData)

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="facture-preview.pdf"',
      },
    })
  } catch (error) {
    console.error('Failed to generate preview:', error)
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 })
  }
}
