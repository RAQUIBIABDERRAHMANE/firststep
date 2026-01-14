'use server'

import { getCategories } from '@/app/actions/restaurant'
import MenuClient from '@/app/dashboard/restaurant/menu/MenuClient'
import Link from 'next/link'
import { ChevronLeft, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default async function MenuManagementPage() {
    const categories = await getCategories()

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Utensils className="text-blue-600" /> Menu Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Organize your categories and dishes to build a premium guest experience.
                    </p>
                </div>
            </div>

            <MenuClient initialCategories={categories} />
        </div>
    )
}
