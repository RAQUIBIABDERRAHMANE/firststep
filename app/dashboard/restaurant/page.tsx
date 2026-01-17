import { getCurrentUser } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function RestaurantDashboardIndex() {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    // Find first restaurant website instance
    const restaurantWebsite = await prisma.tenantWebsite.findFirst({
        where: {
            userId: user.id,
            service: {
                slug: 'restaurant-website'
            }
        }
    })

    if (restaurantWebsite) {
        redirect(`/dashboard/restaurant/${restaurantWebsite.slug}`)
    }

    // If no instance, but has the service, go to setup
    const hasService = await prisma.userService.findFirst({
        where: {
            userId: user.id,
            service: {
                slug: { contains: 'restaurant' }
            }
        }
    })

    if (hasService) {
        redirect('/dashboard/website?type=restaurant')
    }

    // Fallback to dashboard
    redirect('/dashboard')
}
