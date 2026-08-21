import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { uploadImage } from '@/lib/r2'
import {
  sendEmploymentApplicationReceivedEmail,
  sendAdminNewEmploymentAlert
} from '@/lib/mail'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const roleType = (formData.get('roleType')?.toString()?.trim() || 'DEVELOPER').toUpperCase()
    const fullName = formData.get('fullName')?.toString()?.trim()
    const email = formData.get('email')?.toString()?.trim()
    const phone = formData.get('phone')?.toString()?.trim()
    const cin = formData.get('cin')?.toString()?.trim()
    const githubUrl = formData.get('githubUrl')?.toString()?.trim() || ''
    const portfolioUrl = formData.get('portfolioUrl')?.toString()?.trim() || ''
    const linkedinUrl = formData.get('linkedinUrl')?.toString()?.trim() || ''
    const skillsRaw = formData.get('skills')?.toString() || '[]'
    const revenueShareRaw = formData.get('revenueShare')?.toString() || '0'

    const cvFile = formData.get('cv') as File | null
    const photoFile = formData.get('photo') as File | null

    if (!fullName || !email || !phone || !cin) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires (Nom, Email, Téléphone, CIN).' },
        { status: 400 }
      )
    }

    if (roleType === 'DEVELOPER' && !githubUrl) {
      return NextResponse.json(
        { error: 'Veuillez renseigner votre lien GitHub pour la candidature Développeur.' },
        { status: 400 }
      )
    }

    if (roleType === 'VIDEO_EDITOR' && !portfolioUrl) {
      return NextResponse.json(
        { error: 'Veuillez renseigner le lien de votre Showreel ou Portfolio (YouTube, Vimeo, Google Drive, etc.).' },
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
        roleType: roleType === 'VIDEO_EDITOR' ? 'VIDEO_EDITOR' : 'DEVELOPER',
        fullName,
        email,
        phone,
        cin,
        cvUrl,
        photoUrl,
        githubUrl: githubUrl || '',
        portfolioUrl: portfolioUrl || '',
        linkedinUrl: linkedinUrl || '',
        skills: JSON.stringify(skillsArray),
        revenueShare,
        status: 'PENDING',
      },
    })

    const roleLabel = roleType === 'VIDEO_EDITOR' ? 'Monteur Vidéo' : 'Développeur'

    // 1. Send receipt email to candidate
    try {
      await sendEmploymentApplicationReceivedEmail(email, fullName, roleType)
    } catch (mailErr) {
      console.error('[EMPLOYMENT API] Failed to send receipt email to applicant:', mailErr)
    }

    // 2. In-App Notification & Email Alert to Admin(s)
    try {
      // Find all admin users
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, email: true },
      })

      // Create In-App Notifications for all admins
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            title: `Nouvelle Candidature : ${roleLabel}`,
            message: `${fullName} a postulé au poste de ${roleLabel} (CIN: ${cin}, Tel: ${phone}, Part: ${revenueShare}%).`,
            read: false,
          })),
        })
      }

      // Collect admin email addresses
      const adminEmails = admins.map((a) => a.email).filter(Boolean)
      if (process.env.ADMIN_EMAIL) {
        adminEmails.push(process.env.ADMIN_EMAIL)
      }
      if (process.env.EMAIL_USER) {
        adminEmails.push(process.env.EMAIL_USER)
      }

      // Send Email Alert to Admin(s)
      await sendAdminNewEmploymentAlert({
        adminEmails,
        candidateName: fullName,
        roleType,
        email,
        phone,
        cin,
        skills: skillsArray,
        revenueShare,
        showreelOrGithubUrl: roleType === 'VIDEO_EDITOR' ? portfolioUrl : githubUrl,
        portfolioUrl: roleType === 'VIDEO_EDITOR' ? githubUrl : portfolioUrl,
        cvUrl,
        photoUrl,
      })
    } catch (adminErr) {
      console.error('[EMPLOYMENT API] Failed to notify admins:', adminErr)
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
