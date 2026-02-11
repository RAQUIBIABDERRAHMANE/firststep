import { getCurrentUser } from '@/app/actions/auth'
import { getCampaign, sendCampaign } from '@/app/actions/campaigns'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, Send, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { RecipientSelectorWrapper } from './RecipientSelectorWrapper'

export default async function CampaignDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const user = await getCurrentUser()
    const { id } = await params

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const campaign = await getCampaign(id)

    if (!campaign) {
        redirect('/admin/campaigns')
    }

    // Parse selected recipients
    const selectedRecipients = JSON.parse(campaign.selectedRecipients || '[]')
    const hasRecipients = selectedRecipients.length > 0

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/campaigns">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {campaign.subject}
                            </h1>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                ${campaign.status === 'SENT' ? 'bg-green-100 text-green-800 border-green-200' :
                                    campaign.status === 'SENDING' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                        campaign.status === 'FAILED' ? 'bg-red-100 text-red-800 border-red-200' :
                                            'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                {campaign.status}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Created on {new Date(campaign.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {campaign.status === 'DRAFT' && (
                    <div className="flex flex-col items-end gap-2">
                        {!hasRecipients && (
                            <p className="text-sm text-amber-600 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                Please select recipients before sending
                            </p>
                        )}
                        <form action={async () => {
                            'use server'
                            await sendCampaign(campaign.id)
                        }}>
                            <Button type="submit" className="w-full md:w-auto" disabled={!hasRecipients}>
                                <Send className="mr-2 h-4 w-4" />
                                Send Campaign
                            </Button>
                        </form>
                    </div>
                )}
            </div>

            {campaign.status === 'DRAFT' && (
                <RecipientSelectorWrapper
                    campaignId={campaign.id}
                    initialSelectedIds={selectedRecipients}
                />
            )}

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Recipients</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{campaign.recipientCount}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Successful Deliveries</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{campaign.successCount}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Failed Deliveries</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{campaign.failureCount}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle>Email Content</CardTitle>
                    <CardDescription>Preview of the email content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted/30 p-6 rounded-lg border border-border">
                        <div
                            className="prose prose-sm max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: campaign.content.replace(/\n/g, '<br>') }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
