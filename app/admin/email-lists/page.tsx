import { getCurrentUser } from '@/app/actions/auth'
import { getEmailLists, deleteEmailList } from '@/app/actions/email-lists'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Mail, Users, Trash2, Edit, ChevronRight, Zap } from 'lucide-react'
import SyncButton from './SyncButton'

export const dynamic = 'force-dynamic'

export default async function EmailListsPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const result = await getEmailLists()

    if ('error' in result) {
        return (
            <div className="p-8">
                <p className="text-rose-600 font-bold">Erreur: {result.error}</p>
            </div>
        )
    }

    const lists = result.lists || []

    const handleDelete = async (listId: string) => {
        'use server'
        await deleteEmailList(listId)
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-xs font-bold">
                            Destinataires & Segments
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            {lists.length} liste{lists.length > 1 ? 's' : ''} configurée{lists.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                        Listes de Diffusion Emails
                    </h1>
                    <p className="text-sm text-slate-500 max-w-xl">
                        Créez et organisez des segments d&apos;utilisateurs réutilisables pour vos campagnes d&apos;annonces et de prospection.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <SyncButton />
                    <Link href="/admin/email-lists/new">
                        <Button className="rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2.5 shadow-xs hover:shadow-md cursor-pointer transition-all">
                            <Plus className="mr-1.5 h-3.5 w-3.5" />
                            Créer une Liste
                        </Button>
                    </Link>
                </div>
            </div>

            {lists.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-12 text-center space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Mail className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-base font-bold text-slate-900">Aucune liste d&apos;emails pour le moment</h2>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Créez votre première liste de diffusion pour regrouper les destinataires de vos futures campagnes.
                        </p>
                    </div>
                    <Link href="/admin/email-lists/new">
                        <Button className="rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-5 py-2.5">
                            <Plus className="mr-1.5 h-3.5 w-3.5" />
                            Créer ma première liste
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {lists.map((list) => {
                        const isAuto = list.name.startsWith('[AUTO]')
                        const displayName = isAuto ? list.name.replace(/^\[AUTO\]\s*/, '') : list.name
                        const count = list._count?.members ?? 0
                        return (
                            <div
                                key={list.id}
                                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between space-y-5"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <h3 className="text-base font-bold text-slate-900">{displayName}</h3>
                                                {isAuto && (
                                                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 text-[10px] font-bold flex items-center gap-1">
                                                        <Zap className="w-2.5 h-2.5" /> Auto
                                                    </span>
                                                )}
                                            </div>
                                            {list.description && (
                                                <p className="text-xs text-slate-500 line-clamp-2">
                                                    {list.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5 text-slate-500" />
                                            {count} contact{count > 1 ? 's' : ''}
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            Créé le {new Date(list.createdAt).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <Link
                                        href={`/admin/email-lists/${list.id}`}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-700 hover:underline"
                                    >
                                        <span>Gérer les contacts</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>

                                    {!isAuto && (
                                        <form action={handleDelete.bind(null, list.id)}>
                                            <button
                                                type="submit"
                                                title="Supprimer cette liste"
                                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
