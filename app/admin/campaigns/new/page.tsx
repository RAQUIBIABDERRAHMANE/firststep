import { getCurrentUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronLeft } from 'lucide-react'
import { CampaignForm } from './campaign-form'

export default async function NewCampaignPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/campaigns">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        New Campaign
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Draft a new email broadcast.
                    </p>
                </div>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle>Campaign Details</CardTitle>
                    <CardDescription>Compose your email. You can use HTML for content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CampaignForm />
                </CardContent>
            </Card>
        </div>
    )
}
