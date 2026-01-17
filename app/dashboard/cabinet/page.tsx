import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function CabinetDashboardIndex() {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    // Find first cabinet website instance
    const cabinetWebsite = await prisma.tenantWebsite.findFirst({
        where: {
            userId: user.id,
            service: {
                slug: { contains: 'cabinet' }
            }
        }
    })

    if (cabinetWebsite) {
        redirect(`/dashboard/cabinet/${cabinetWebsite.slug}`)
    }

    // If no instance, but has the service, go to setup
    const hasService = await prisma.userService.findFirst({
        where: {
            userId: user.id,
            service: {
                slug: { contains: 'cabinet' }
            }
        }
    })

    if (hasService) {
        redirect('/dashboard/website?type=cabinet')
    }

    // Fallback to dashboard
    redirect('/dashboard')
}
