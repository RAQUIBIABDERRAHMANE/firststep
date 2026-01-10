import { getServices, getUserServices, addUserService, removeUserService } from '@/app/actions/services'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
// Client component wrapper might be needed for interactivity, 
// or use server actions directly in form buttons.
// Let's use a client component for the service list to handle loading states better.
import { ServiceList } from '@/components/dashboard/ServiceList'

export default async function ServicesPage() {
    const allServices = await getServices()
    const userServices = await getUserServices()

    // Create a map of selected services for ID lookup
    const selectedServiceIds: Set<string> = new Set(userServices.map((us: any) => us.serviceId))

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Manage Services</h1>
            </div>
            <ServiceList
                allServices={allServices}
                selectedServiceIds={Array.from(selectedServiceIds)}
            />
        </div>
    )
}
