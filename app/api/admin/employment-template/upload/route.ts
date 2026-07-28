import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/app/actions/auth'
import fs from 'fs'
import path from 'path'

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

    const targetPath = path.join(process.cwd(), 'public', 'developer-employment-agreement.pdf')
    fs.writeFileSync(targetPath, buffer)

    return NextResponse.json({
      success: true,
      message: 'Votre modèle de contrat PDF a été téléchargé et mis à jour avec succès.',
    })
  } catch (error: any) {
    console.error('[UPLOAD EMPLOYMENT TEMPLATE ERROR]', error)
    return NextResponse.json(
      { error: error?.message || 'Échec du téléchargement du modèle PDF' },
      { status: 500 }
    )
  }
}
