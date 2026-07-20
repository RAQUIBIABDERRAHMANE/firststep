import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Globe, User, Calendar, Mail, Phone, ExternalLink, ShieldCheck, ClipboardList, Clock } from 'lucide-react'
import CustomWebsiteRequestAdminControls from '@/components/admin/CustomWebsiteRequestAdminControls'

export default async function AdminCustomRequestsPage() {
    const requests = await prisma.customWebsiteRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    })

    return (
        <div className="space-y-6 max-w-6xl">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-syne">Demandes de Site Web Sur Mesure</h1>
                <p className="text-sm text-slate-500 mt-1">Gérez les demandes de développement personnalisées reçues via le formulaire public.</p>
            </div>

            {requests.length === 0 ? (
                <Card className="border-slate-200/60 shadow-sm p-10 text-center">
                    <div className="rounded-full bg-slate-100 h-12 w-12 flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-5 w-5 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Aucune demande reçue</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Les demandes de site sur mesure soumises par vos clients apparaîtront ici.
                    </p>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {requests.map((request) => {
                        const pages = JSON.parse(request.pages || '[]')
                        const specialFeatures = JSON.parse(request.specialFeatures || '[]')
                        const adminNotes = JSON.parse(request.adminNotes || '[]')

                        return (
                            <Card key={request.id} className="border-slate-200/60 shadow-sm hover:border-slate-300 transition-all">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100/60 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-base font-bold text-slate-900">
                                                {request.companyName}
                                            </CardTitle>
                                            {request.userId && (
                                                <Badge variant="outline" className="text-[9px] px-2 py-0.5 rounded-full border-blue-100 bg-blue-50 text-blue-600 font-semibold flex items-center gap-1">
                                                    <User className="h-2.5 w-2.5" />
                                                    Client Enregistré
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription className="text-xs">
                                            Demande soumise le {new Date(request.createdAt).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`
                                            px-2.5 py-1 border-0 rounded-full font-bold text-[10px]
                                            ${request.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' :
                                              request.status === 'REVIEWING' ? 'bg-purple-500/10 text-purple-600' :
                                              request.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-600' :
                                              'bg-emerald-500/10 text-emerald-600'}
                                        `}>
                                            {request.status === 'PENDING' ? 'Étude en cours' :
                                             request.status === 'REVIEWING' ? 'Maquette UX/UI' :
                                             request.status === 'IN_PROGRESS' ? 'Développement actif' :
                                             'Livré / En ligne'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    {/* Info Grid */}
                                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-xs">
                                        <div className="space-y-1">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Client</span>
                                            <span className="font-bold text-slate-700 block">{request.clientName}</span>
                                            {request.user && (
                                                <span className="text-[10px] text-slate-400 block truncate">Entreprise: {request.user.companyName}</span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Contact</span>
                                            <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline block font-semibold truncate">
                                                {request.email}
                                            </a>
                                            {request.phone && (
                                                <a href={`tel:${request.phone}`} className="text-slate-500 hover:underline block font-medium">
                                                    {request.phone}
                                                </a>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Type de site</span>
                                            <span className="font-bold text-slate-700 block capitalize">
                                                {request.websiteType === 'showcase' ? 'Site Vitrine' : 
                                                 request.websiteType === 'ecommerce' ? 'E-commerce' : 
                                                 request.websiteType === 'portfolio' ? 'Portfolio' : 
                                                 request.websiteType === 'landing' ? 'Landing Page' : request.websiteType}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Ambiance visuelle</span>
                                            <span className="font-bold text-slate-700 block capitalize">
                                                {request.stylePreferences === 'modern' ? 'Moderne & Dynamique' : 
                                                 request.stylePreferences === 'minimalist' ? 'Minimaliste épuré' : 
                                                 request.stylePreferences === 'luxury' ? 'Sombre & Luxueux' : 
                                                 request.stylePreferences === 'creative' ? 'Créatif & Artistique' : request.stylePreferences}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Pages & Features Tags */}
                                    <div className="grid gap-4 sm:grid-cols-2 text-xs border-t border-slate-100 pt-3">
                                        <div className="space-y-1.5">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Pages ({pages.length})</span>
                                            <div className="flex flex-wrap gap-1">
                                                {pages.map((p: string) => (
                                                    <Badge key={p} variant="outline" className="text-[9px] px-1.5 py-0">
                                                        {p === 'home' ? 'Accueil' : 
                                                         p === 'about' ? 'À propos' : 
                                                         p === 'services' ? 'Services' : 
                                                         p === 'contact' ? 'Contact' : 
                                                         p === 'faq' ? 'FAQ' : 
                                                         p === 'portfolio' ? 'Portfolio' : 
                                                         p === 'blog' ? 'Blog' : 
                                                         p === 'testimonials' ? 'Témoignages' : 
                                                         p === 'team' ? 'Équipe' : p}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Fonctionnalités ({specialFeatures.length})</span>
                                            <div className="flex flex-wrap gap-1">
                                                {specialFeatures.map((f: string) => (
                                                    <Badge key={f} variant="outline" className="text-[9px] px-1.5 py-0 bg-blue-50/50 text-blue-700 border-blue-100">
                                                        {f === 'contact-form' ? 'Formulaire contact' : 
                                                         f === 'booking-system' ? 'Réservations RDV' : 
                                                         f === 'payment-gateway' ? 'Paiement en ligne' : 
                                                         f === 'chat-bot' ? 'Whatsapp Live Chat' : 
                                                         f === 'newsletter' ? 'Newsletter' : 
                                                         f === 'multilingual' ? 'Multi-langue' : 
                                                         f === 'custom-auth' ? 'Portail Client' : 
                                                         f === 'advanced-seo' ? 'Optimisation SEO' : f}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Inspirations & Notes */}
                                    {(request.competitors || request.additionalNotes) && (
                                        <div className="border-t border-slate-100 pt-3 text-xs space-y-2.5">
                                            {request.competitors && (
                                                <div>
                                                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Inspirations / Concurrents</span>
                                                    <span className="text-slate-600 block mt-0.5 italic">{request.competitors}</span>
                                                </div>
                                            )}
                                            {request.additionalNotes && (
                                                <div>
                                                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Instructions client</span>
                                                    <p className="whitespace-pre-wrap text-[11px] text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-xl mt-1 leading-normal">
                                                        {request.additionalNotes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Interactive Admin Controls */}
                                    <CustomWebsiteRequestAdminControls 
                                        requestId={request.id}
                                        currentStatus={request.status}
                                        adminNotes={adminNotes}
                                    />
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
