import prisma from '@/lib/prisma'
import { Globe, User, Calendar, Mail, Phone, ExternalLink, ShieldCheck, ClipboardList, Clock, Sparkles } from 'lucide-react'
import CustomWebsiteRequestAdminControls from '@/components/admin/CustomWebsiteRequestAdminControls'

export const dynamic = 'force-dynamic'

export default async function AdminCustomRequestsPage() {
    const requests = await prisma.customWebsiteRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    })

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-xs font-bold">
                            Développement Web Sur Mesure
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            {requests.length} demande{requests.length > 1 ? 's' : ''} reçue{requests.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                        Demandes de Sites Web Sur Mesure
                    </h1>
                    <p className="text-sm text-slate-500 max-w-xl">
                        Gérez les cahiers des charges et les demandes de conception personnalisées transmises par les prospects et clients.
                    </p>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-12 text-center space-y-3">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Clock className="h-7 w-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Aucune demande reçue</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Les demandes de sites sur mesure soumises via le formulaire public apparaîtront ici.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {requests.map((request) => {
                        const pages = JSON.parse(request.pages || '[]')
                        const specialFeatures = JSON.parse(request.specialFeatures || '[]')
                        const adminNotes = JSON.parse(request.adminNotes || '[]')

                        return (
                            <div
                                key={request.id}
                                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2.5">
                                            <h3 className="text-base font-bold text-slate-900">
                                                {request.companyName}
                                            </h3>
                                            {request.userId && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full border border-blue-200/60 bg-blue-50 text-blue-700 font-bold flex items-center gap-1">
                                                    <User className="h-2.5 w-2.5" />
                                                    Client Enregistré
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            Soumis le {new Date(request.createdAt).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`
                                        px-3 py-1 rounded-full font-bold text-xs border
                                        ${request.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                                          request.status === 'REVIEWING' ? 'bg-purple-50 text-purple-700 border-purple-200/60' :
                                          request.status === 'IN_PROGRESS' ? 'bg-cyan-50 text-cyan-700 border-cyan-200/60' :
                                          'bg-emerald-50 text-emerald-700 border-emerald-200/60'}
                                    `}>
                                        {request.status === 'PENDING' ? 'Étude en cours' :
                                         request.status === 'REVIEWING' ? 'Maquette UX/UI' :
                                         request.status === 'IN_PROGRESS' ? 'Développement actif' :
                                         'Livré / En ligne'}
                                    </span>
                                </div>

                                <div className="p-6 space-y-5">
                                    {/* Info Grid */}
                                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-xs">
                                        <div className="space-y-1">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Contact</span>
                                            <span className="font-bold text-slate-800 block">{request.clientName}</span>
                                            {request.user && (
                                                <span className="text-[11px] text-slate-400 block truncate">Entreprise: {request.user.companyName}</span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Coordonnées</span>
                                            <a href={`mailto:${request.email}`} className="text-cyan-600 hover:underline block font-bold truncate">
                                                {request.email}
                                            </a>
                                            {request.phone && (
                                                <a href={`tel:${request.phone}`} className="text-slate-500 hover:underline block font-mono">
                                                    {request.phone}
                                                </a>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Type de Projet</span>
                                            <span className="font-bold text-slate-800 block capitalize">
                                                {request.websiteType || 'Site Web'}
                                            </span>
                                            {request.stylePreferences && (
                                                <span className="text-[11px] text-slate-400 block truncate">Style: {request.stylePreferences}</span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Concurrents / Références</span>
                                            <span className="text-slate-700 block truncate">
                                                {request.competitors || 'Aucune référence'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Project Additional Notes */}
                                    {request.additionalNotes && (
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">Notes & Demandes Complémentaires</span>
                                            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{request.additionalNotes}</p>
                                        </div>
                                    )}

                                    {/* Pages & Features Tags */}
                                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                                        {pages.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">Pages Souhaitées ({pages.length})</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {pages.map((page: string, i: number) => (
                                                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-semibold">
                                                            {page}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {specialFeatures.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">Fonctionnalités Spécifiques ({specialFeatures.length})</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {specialFeatures.map((feature: string, i: number) => (
                                                        <span key={i} className="px-2 py-0.5 bg-cyan-50 text-cyan-700 border border-cyan-200/60 rounded-lg text-[10px] font-semibold">
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Admin Action Controls */}
                                    <div className="pt-4 border-t border-slate-100">
                                        <CustomWebsiteRequestAdminControls
                                            requestId={request.id}
                                            currentStatus={request.status}
                                            adminNotes={adminNotes}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
