import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status && status !== 'ALL') {
      where.status = status
    }

    const applications = await prisma.employmentApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      applications,
    })
  } catch (error: any) {
    console.error('[ADMIN EMPLOYMENT API] Failed to list applications:', error)
    return NextResponse.json(
      { error: error?.message || 'Erreur lors du chargement des candidatures.' },
      { status: 500 }
    )
  }
}
