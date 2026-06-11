import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ChefHat, ChevronLeft } from 'lucide-react'

export default async function KdsPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
    const { tenantSlug } = await params
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-fade-in">
            <ChefHat size={64} className="text-slate-200" />
            <h2 className="text-2xl font-bold">Kitchen Display System (KDS)</h2>
            <p className="text-muted-foreground">This feature is coming soon to help your kitchen manage orders in real-time.</p>
            <Link href={`/dashboard/restaurant/${tenantSlug}`}>
                <Button className="rounded-xl flex items-center gap-2">
                    <ChevronLeft size={16} /> Back to Hub
                </Button>
            </Link>
        </div>
    )
}
