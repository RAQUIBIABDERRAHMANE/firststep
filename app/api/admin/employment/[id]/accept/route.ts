import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'
import { generateEmploymentAgreementPdf } from '@/lib/employment-pdf'
import { uploadImage } from '@/lib/r2'
import { sendEmploymentApplicationAcceptedEmail } from '@/lib/mail'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const application = await prisma.employmentApplication.findUnique({
      where: { id },
    })

    if (!application) {
      return NextResponse.json({ error: 'Candidature introuvable.' }, { status: 404 })
    }

    const todayStr = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

    // Generate Agreement PDF using configured template positions
    const pdfBytes = await generateEmploymentAgreementPdf({
      date: todayStr,
      employeeName: application.fullName,
      employeeCin: application.cin,
      startDate: todayStr,
      revenueShare: String(application.revenueShare),
      employeeSignName: application.fullName,
      employeeSignDate: todayStr,
    })

    const pdfBuffer = Buffer.from(pdfBytes)
    const filename = `Agreement_${application.fullName.replace(/\s+/g, '_')}_${Date.now()}.pdf`
    const agreementPdfUrl = await uploadImage(pdfBuffer, filename, 'application/pdf')

    // Update application in DB
    const updated = await prisma.employmentApplication.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        agreementPdfUrl: agreementPdfUrl,
      },
    })

    // Send Acceptance email with PDF attachment
    const isVideo = application.roleType === 'VIDEO_EDITOR'
    const agreementDocName = isVideo ? 'Video_Editor_Employment_Agreement' : 'Developer_Employment_Agreement'
    try {
      await sendEmploymentApplicationAcceptedEmail(
        application.email,
        application.fullName,
        pdfBuffer,
        `${agreementDocName}_${application.fullName.replace(/\s+/g, '_')}.pdf`,
        agreementPdfUrl,
        application.roleType
      )
    } catch (mailErr) {
      console.error('[ACCEPT CANDIDATE] Failed to send acceptance email:', mailErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Candidat accepté avec succès. Contrat généré et email envoyé.',
      application: updated,
    })
  } catch (error: any) {
    console.error('[ACCEPT CANDIDATE ERROR]', error)
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de l\'acceptation du candidat.' },
      { status: 500 }
    )
  }
}
