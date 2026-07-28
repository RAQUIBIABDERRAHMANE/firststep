import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/app/actions/auth'
import fs from 'fs'
import path from 'path'
import { uploadToR2 } from '@/lib/r2'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier PDF fourni' }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Le fichier doit être au format PDF (.pdf)' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 1. Upload to Cloudflare R2
    const r2Url = await uploadToR2(buffer, 'employment/templates/developer-employment-agreement.pdf', 'application/pdf')

    // 2. Save locally for server rendering
    const targetPath = path.join(process.cwd(), 'public', 'developer-employment-agreement.pdf')
    try {
      fs.writeFileSync(targetPath, buffer)
    } catch {
      // Ignore if local fs is read-only
    }

    return NextResponse.json({
      success: true,
      message: 'Votre modèle de contrat PDF a été téléchargé et sauvegardé sur Cloudflare R2 avec succès.',
      r2Url,
    })

  } catch (error: any) {
    console.error('[UPLOAD EMPLOYMENT TEMPLATE ERROR]', error)
    return NextResponse.json(
      { error: error?.message || 'Échec du téléchargement du modèle PDF' },
      { status: 500 }
    )
  }
}
