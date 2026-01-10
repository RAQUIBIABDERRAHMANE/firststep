import { getServices } from '@/app/actions/services'
import { AdminServiceList } from '@/components/admin/AdminServiceList'

export default async function AdminServicesPage() {
    const services = await getServices()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Manage Services</h1>
            </div>
            <AdminServiceList initialServices={services} />
        </div>
    )
}
