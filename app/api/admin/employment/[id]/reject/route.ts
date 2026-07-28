import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'

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
    const updated = await prisma.employmentApplication.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Candidature refusée.',
      application: updated,
    })
  } catch (error: any) {
    console.error('[REJECT CANDIDATE ERROR]', error)
    return NextResponse.json(
      { error: error?.message || 'Erreur lors du refus de la candidature.' },
      { status: 500 }
    )
  }
}
