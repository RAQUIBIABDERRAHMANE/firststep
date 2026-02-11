import { getCurrentUser } from '@/app/actions/auth'
import { getCampaigns, deleteCampaign } from '@/app/actions/campaigns'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Mail, Send, Trash2, Eye } from 'lucide-react'

export default async function CampaignsPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const campaigns = await getCampaigns()

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                        Email <span className="text-primary">Campaigns</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Manage and send email broadcasts to your users.
                    </p>
                </div>
                <Link href="/admin/campaigns/new">
                    <Button className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        New Campaign
                    </Button>
                </Link>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle>Campaign History</CardTitle>
                    <CardDescription>View status and performance of your email campaigns.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto rounded-md border">
                        <table className="w-full text-sm text-left text-muted-foreground">
                            <thead className="text-xs text-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Subject</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Recipients</th>
                                    <th className="px-6 py-4 font-semibold">Created At</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {campaigns.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            No campaigns created yet.
                                        </td>
                                    </tr>
                                ) : (
                                    campaigns.map((campaign) => (
                                        <tr key={campaign.id} className="bg-background hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                {campaign.subject}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                    ${campaign.status === 'SENT' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        campaign.status === 'SENDING' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                            campaign.status === 'FAILED' ? 'bg-red-100 text-red-800 border-red-200' :
                                                                'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                    {campaign.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {campaign.status === 'SENT' ? (
                                                    <span title={`${campaign.successCount} sent, ${campaign.failureCount} failed`}>
                                                        {campaign.recipientCount} users
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                {new Date(campaign.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/campaigns/${campaign.id}`}>
                                                        <Button variant="ghost" size="icon" title="View Details">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {campaign.status === 'DRAFT' && (
                                                        <form action={async () => {
                                                            'use server'
                                                            await deleteCampaign(campaign.id)
                                                        }}>
                                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" title="Delete">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </form>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
