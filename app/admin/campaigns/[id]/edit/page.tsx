import { getCurrentUser } from '@/app/actions/auth'
import { getCampaign } from '@/app/actions/campaigns'
import { redirect, notFound } from 'next/navigation'
import { CheckCircle2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { CampaignForm } from '@/app/admin/campaigns/new/campaign-form'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditCampaignPage({ params }: PageProps) {
    const user = await getCurrentUser()
    const { id } = await params

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const campaign = await getCampaign(id)

    if (!campaign) {
        notFound()
    }

    if (campaign.status === 'SENT' || campaign.status === 'SENDING') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <h1 className="text-2xl font-bold">Campaign Already Sent</h1>
                <p className="text-muted-foreground">You cannot edit a campaign that has already been sent.</p>
                <Link href="/admin/campaigns" className="text-primary hover:underline">
                    Return to Campaigns
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <Link href="/admin/campaigns" className="text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                        Edit <span className="text-primary">Campaign</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Update your email broadcast details.
                    </p>
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-lg p-6 shadow-sm">
                <CampaignForm initialData={campaign} />
            </div>
        </div>
    )
}
