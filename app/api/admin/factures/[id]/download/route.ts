import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'
import { generateFacturePdf } from '@/lib/facture-pdf'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params // Next.js 16 requires awaiting params
    const record = await prisma.factureRecord.findUnique({
      where: { id },
    })

    if (!record) {
      return NextResponse.json({ error: 'Facture not found' }, { status: 404 })
    }

    // Security: Only admin or the client who owns the invoice can download it
    if (user.role !== 'ADMIN' && record.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // 1. If pdfUrl exists, proxy the file securely from Cloudflare R2
    if (record.pdfUrl) {
      try {
        console.log(`☁️ [Download] Proxying PDF from R2: ${record.pdfUrl}`)
        const response = await fetch(record.pdfUrl)
        if (response.ok) {
          const pdfBuffer = await response.arrayBuffer()
          return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `inline; filename="Facture-${record.number}.pdf"`,
            },
          })
        }
        console.warn(`⚠️ [Download] R2 fetch returned status ${response.status}. Regenerating PDF...`)
      } catch (fetchErr) {
        console.error('❌ [Download] Failed to proxy PDF from R2, falling back to dynamic generation:', fetchErr)
      }
    }

    // 2. Fallback / Self-Healing: Regenerate PDF dynamically if missing
    console.log(`⚙️ [Download] Regenerating facture PDF dynamically for: ${record.number}`)
    const paymentRequest = await prisma.paymentRequest.findUnique({
      where: { id: record.paymentId },
      include: { user: true },
    })

    const factureData = {
      factureNumber: record.number,
      date: new Date(record.generatedAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      clientName: record.clientName,
      clientEmail: record.clientEmail,
      clientCompany: paymentRequest?.user?.companyName || record.clientName,
      serviceName: record.serviceName,
      servicePrice: `${record.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD`,
      subtotal: `${record.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD`,
      total: `${record.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD`,
    }

    const pdfBytes = await generateFacturePdf(factureData)

    // Save regenerated PDF to Cloudflare R2 to heal the database record
    try {
      const { uploadImage } = await import('@/lib/r2')
      const filename = `factures/${record.number}.pdf`
      const uploadedUrl = await uploadImage(Buffer.from(pdfBytes), filename, 'application/pdf')
      await prisma.factureRecord.update({
        where: { id: record.id },
        data: { pdfUrl: uploadedUrl },
      })
      console.log(`✅ [Self-Healing] Uploaded missing PDF to R2 and updated DB: ${uploadedUrl}`)
    } catch (healErr) {
      console.error('❌ [Self-Healing] Failed to upload regenerated PDF:', healErr)
    }

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Facture-${record.number}.pdf"`,
      },
    })
  } catch (error) {
    console.error('❌ [Download] Error handling download route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
