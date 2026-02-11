import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'

export async function GET() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const lists = await prisma.emailList.findMany({
            include: {
                _count: {
                    select: { members: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(lists)
    } catch (error) {
        console.error('Error fetching email lists:', error)
        return NextResponse.json({ error: 'Failed to fetch email lists' }, { status: 500 })
    }
}
