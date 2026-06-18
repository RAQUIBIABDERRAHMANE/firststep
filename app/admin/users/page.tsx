import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AdminUsersClient from './AdminUsersClient'

export default async function AdminUsersPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const users = await prisma.user.findMany({
        include: {
            services: {
                include: { service: true }
            },
            websites: true,
        },
        orderBy: { createdAt: 'desc' },
    })

    return <AdminUsersClient users={users as any} currentAdminId={user.id} />
}
