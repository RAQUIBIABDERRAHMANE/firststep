import { getTenant } from '@/app/actions/restaurant'
import DesignSelectionClient from './client'
import { redirect } from 'next/navigation'

export default async function DesignPage() {
    const tenant = await getTenant()

    if (!tenant) {
        redirect('/dashboard/restaurant')
    }

    return <DesignSelectionClient initialDesign={tenant.designTemplate || 'classic'} />
}
