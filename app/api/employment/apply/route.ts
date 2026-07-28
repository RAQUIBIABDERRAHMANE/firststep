import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { uploadImage } from '@/lib/r2'
import { sendEmploymentApplicationReceivedEmail } from '@/lib/mail'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const fullName = formData.get('fullName')?.toString()?.trim()
    const email = formData.get('email')?.toString()?.trim()
    const phone = formData.get('phone')?.toString()?.trim()
    const cin = formData.get('cin')?.toString()?.trim()
    const githubUrl = formData.get('githubUrl')?.toString()?.trim()
    const portfolioUrl = formData.get('portfolioUrl')?.toString()?.trim() || null
    const linkedinUrl = formData.get('linkedinUrl')?.toString()?.trim()
    const skillsRaw = formData.get('skills')?.toString() || '[]'
    const revenueShareRaw = formData.get('revenueShare')?.toString() || '0'

    const cvFile = formData.get('cv') as File | null
    const photoFile = formData.get('photo') as File | null

    if (!fullName || !email || !phone || !cin || !githubUrl || !linkedinUrl) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires.' },
        { status: 400 }
      )
    }

    if (!cvFile || cvFile.size === 0) {
      return NextResponse.json(
        { error: 'Veuillez fournir votre CV au format PDF.' },
        { status: 400 }
      )
    }

    // Validate CV PDF only
    const cvName = cvFile.name.toLowerCase()
    if (!cvName.endsWith('.pdf') && cvFile.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Le fichier CV doit obligatoirement être un document PDF.' },
        { status: 400 }
      )
    }

    if (!photoFile || photoFile.size === 0) {
      return NextResponse.json(
        { error: 'Veuillez fournir une photo d\'identité.' },
        { status: 400 }
      )
    }

    // Upload CV
    const cvBytes = await cvFile.arrayBuffer()
    const cvBuffer = Buffer.from(cvBytes)
    const cvFilename = `cv_${Date.now()}_${cvFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const cvUrl = await uploadImage(cvBuffer, cvFilename, 'application/pdf')

    // Upload Photo
    const photoBytes = await photoFile.arrayBuffer()
    const photoBuffer = Buffer.from(photoBytes)
    const photoFilename = `photo_${Date.now()}_${photoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const photoContentType = photoFile.type || 'image/jpeg'
    const photoUrl = await uploadImage(photoBuffer, photoFilename, photoContentType)

    const revenueShare = parseFloat(revenueShareRaw) || 0

    // Parse skills
    let skillsArray: string[] = []
    try {
      skillsArray = JSON.parse(skillsRaw)
    } catch {
      skillsArray = []
    }

    const application = await prisma.employmentApplication.create({
      data: {
        fullName,
        email,
        phone,
        cin,
        cvUrl,
        photoUrl,
        githubUrl,
        portfolioUrl,
        linkedinUrl,
        skills: JSON.stringify(skillsArray),
        revenueShare,
        status: 'PENDING',
      },
    })

    // Send receipt email to applicant asynchronously
    try {
      await sendEmploymentApplicationReceivedEmail(email, fullName)
    } catch (mailErr) {
      console.error('[EMPLOYMENT API] Failed to send receipt email:', mailErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Candidature enregistrée avec succès.',
      applicationId: application.id,
    })
  } catch (error: any) {
    console.error('[EMPLOYMENT API] Application submission error:', error)
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de la soumission de la candidature.' },
      { status: 500 }
    )
  }
}
