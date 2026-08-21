import prisma from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Globe, User, Calendar, ExternalLink, Mail, Building2, Layers, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminWebsitesPage() {
    const websites = await prisma.tenantWebsite.findMany({
        include: {
            user: true,
            service: true,
            categories: {
                include: {
                    dishes: true
                }
            },
            tables: true,
            waiters: true,
            cabinetServices: true,
            cabinetClients: true,
            cabinetAppointments: true,
        },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-xs font-bold">
                            Instances & Déploiements
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            {websites.length} site{websites.length > 1 ? 's' : ''} en ligne
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                        Sites Web des Utilisateurs
                    </h1>
                    <p className="text-sm text-slate-500 max-w-xl">
                        Supervisez et accédez à tous les sites web, menus digitaux et plateformes de réservation créés par vos clients.
                    </p>
                </div>
            </div>

            {websites.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-12 text-center space-y-3">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Globe className="h-7 w-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Aucun site web trouvé</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Les sites créés par les utilisateurs apparaîtront ici.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {websites.map((website) => (
                        <div
                            key={website.id}
                            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 p-6 space-y-5"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            {website.siteName}
                                        </h3>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                                website.isActive
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                                    : 'bg-slate-100 text-slate-600 border-slate-200/60'
                                            }`}
                                        >
                                            {website.isActive ? 'Actif' : 'Inactif'}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200/60">
                                            Template: {website.designTemplate}
                                        </span>
                                    </div>
                                    
                                    {website.description && (
                                        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                                            {website.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <User className="h-4 w-4 text-slate-400 shrink-0" />
                                            <div>
                                                <div className="font-bold text-slate-900">
                                                    {website.user.companyName}
                                                </div>
                                                <div className="text-[11px] text-slate-400 font-mono">{website.user.email}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Layers className="h-4 w-4 text-slate-400 shrink-0" />
                                            <div>
                                                <div className="font-bold text-slate-900">
                                                    {website.service.name}
                                                </div>
                                                <div className="text-[11px] text-slate-400">Service souscrit</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                                            <div>
                                                <div className="font-bold text-slate-900">
                                                    {new Date(website.createdAt).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="text-[11px] text-slate-400">Date de création</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Link
                                        href={`/sites/${website.slug}`}
                                        target="_blank"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <span>Visiter le site</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}