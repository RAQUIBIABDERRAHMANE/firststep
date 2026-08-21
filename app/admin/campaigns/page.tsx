import { getCurrentUser } from '@/app/actions/auth'
import { getCampaigns, deleteCampaign } from '@/app/actions/campaigns'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Mail, Send, Trash2, Eye, CheckCircle2, Users, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CampaignsPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const campaigns = await getCampaigns()

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-xs font-bold">
                            Diffusion & Marketing
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            {campaigns.length} campagne{campaigns.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                        Campagnes Emails & Broadcast
                    </h1>
                    <p className="text-sm text-slate-500 max-w-xl">
                        Rédigez, planifiez et envoyez des annonces et lettres d&apos;information à vos listes d&apos;utilisateurs.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link href="/admin/email-lists">
                        <Button variant="outline" className="rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold px-4 py-2.5 cursor-pointer">
                            <Mail className="mr-1.5 h-3.5 w-3.5" />
                            Gérer les Listes
                        </Button>
                    </Link>
                    <Link href="/admin/campaigns/new">
                        <Button className="rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2.5 shadow-xs hover:shadow-md cursor-pointer transition-all">
                            <Plus className="mr-1.5 h-3.5 w-3.5" />
                            Nouvelle Campagne
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">Historique des Envois</h2>
                    <span className="text-xs text-slate-400 font-mono">
                        {campaigns.length} enregistrement{campaigns.length > 1 ? 's' : ''}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <th className="px-6 py-3.5 text-left">Objet de l&apos;email</th>
                                <th className="px-6 py-3.5 text-left">Statut</th>
                                <th className="px-6 py-3.5 text-left">Destinataires</th>
                                <th className="px-6 py-3.5 text-left">Date de création</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campaigns.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs">
                                        Aucune campagne email créée pour le moment.
                                    </td>
                                </tr>
                            ) : (
                                campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="hover:bg-slate-50/70 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-slate-900 text-xs">
                                            {campaign.subject}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border
                                                ${campaign.status === 'SENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                                                    campaign.status === 'SENDING' ? 'bg-cyan-50 text-cyan-700 border-cyan-200/60' :
                                                        campaign.status === 'FAILED' ? 'bg-rose-50 text-rose-700 border-rose-200/60' :
                                                            'bg-slate-100 text-slate-600 border-slate-200/60'}`}>
                                                {campaign.status === 'SENT' ? 'Envoyé' :
                                                 campaign.status === 'SENDING' ? 'En cours d\'envoi' :
                                                 campaign.status === 'FAILED' ? 'Échoué' :
                                                 'Brouillon'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                                            {campaign.status === 'SENT' ? (
                                                <span title={`${campaign.successCount} envoyés, ${campaign.failureCount} échoués`}>
                                                    {campaign.recipientCount} destinataire(s)
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {new Date(campaign.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/campaigns/${campaign.id}`}>
                                                    <Button variant="ghost" size="icon" title="Voir les détails" className="h-8 w-8 text-slate-400 hover:text-cyan-600 rounded-xl cursor-pointer">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
