'use server'

import { getCategories } from '@/app/actions/restaurant'
import MenuClient from '@/app/dashboard/restaurant/menu/MenuClient'

export default async function MenuManagementPage() {
    const categories = await getCategories()

    return (
        <MenuClient initialCategories={categories} />
    )
}
