'use server'

import { getWaiters } from '@/app/actions/waiter'
import { getTables } from '@/app/actions/restaurant'
import WaitersClient from './WaitersClient'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default async function WaitersPage() {
    // Fetch data in parallel
    const [waiters, tables] = await Promise.all([
        getWaiters(),
        getTables()
    ])

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Waiter Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Create staff accounts and assign tables to them.
                    </p>
                </div>
            </div>

            <WaitersClient initialWaiters={waiters} initialTables={tables} />
        </div>
    )
}
