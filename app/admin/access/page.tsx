import { getCurrentUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import AdminClientAccess from '@/components/admin/AdminClientAccess'
import { Users, Globe, CheckCircle2, ExternalLink } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminClientAccessPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const clients = await prisma.user.findMany({
        where: {
            role: 'CLIENT'
        },
        include: {
            websites: {
                include: {
                    service: {
                        select: {
                            slug: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        },
        orderBy: {
            companyName: 'asc'
        }
    })

    const activeWebsites = clients.reduce((acc, client) => 
        acc + client.websites.filter(w => w.isActive).length, 0
    )
    const totalWebsites = clients.reduce((acc, c) => acc + c.websites.length, 0)

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-xs font-bold">
                            Accès & Supervision
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            {clients.length} comptes clients
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                        Accès Directs Clients
                    </h1>
                    <p className="text-sm text-slate-500 max-w-xl">
                        Accédez en 1 clic aux espaces de gestion et sites web en direct pour assister vos clients.
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-3 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clients Inscrits</span>
                        <div className="h-9 w-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Users className="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 font-sans tabular-nums">{clients.length}</div>
                    <p className="text-xs text-slate-400">Total entreprises</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-3 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sites Créés</span>
                        <div className="h-9 w-9 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                            <Globe className="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 font-sans tabular-nums text-cyan-600">{totalWebsites}</div>
                    <p className="text-xs text-slate-400">Instances configurées</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-3 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sites Actifs</span>
                        <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900 font-sans tabular-nums text-emerald-600">{activeWebsites}</div>
                    <p className="text-xs text-slate-400">En ligne & accessibles au public</p>
                </div>
            </div>

            {/* Client Access Component */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
                <AdminClientAccess clients={clients} />
            </div>
        </div>
    )
}
