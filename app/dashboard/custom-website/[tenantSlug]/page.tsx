import { getWebsiteBySlug } from '@/app/actions/tenant'
import { getCurrentUser } from '@/app/actions/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Check, ClipboardList, PenSquare, Eye, ExternalLink, Calendar, MessageSquare, ArrowUpRight, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

interface Props {
    params: Promise<{ tenantSlug: string }>
}

export default async function CustomWebsiteStatusPage({ params }: Props) {
    const { tenantSlug } = await params
    const website = await getWebsiteBySlug(tenantSlug)

    if (!website || website.service.slug !== 'custom-website') {
        redirect('/dashboard')
    }

    const user = await getCurrentUser()
    if (!user) redirect('/login')

    const config = JSON.parse(website.config || '{}')
    
    // Status can be: 'REVIEW', 'DESIGNING', 'DEVELOPING', 'LIVE'
    const currentStatus = config.requestStatus || 'REVIEW'
    const adminNotes = config.adminNotes || []

    const statusSteps = [
        { key: 'REVIEW', label: 'Étude des besoins', desc: 'Analyse du cahier des charges et validation initiale.' },
        { key: 'DESIGNING', label: 'Maquette & UX/UI', desc: 'Conception graphique et validation esthétique de l\'interface.' },
        { key: 'DEVELOPING', label: 'Développement', desc: 'Codage sur mesure des pages et intégration des fonctionnalités.' },
        { key: 'LIVE', label: 'Mise en ligne', desc: 'Le site est déployé avec succès et disponible au public.' }
    ]

    const getStatusIndex = (status: string) => {
        const idx = statusSteps.findIndex(s => s.key === status)
        return idx !== -1 ? idx : 0
    }

    const currentStepIndex = getStatusIndex(currentStatus)

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        {website.siteName}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Suivi de création de votre site web entièrement personnalisé.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href={`/${website.slug}`} target="_blank">
                        <Button variant="outline" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Voir le site temporaire
                        </Button>
                    </Link>
                    {currentStatus === 'REVIEW' ? (
                        <Link href="/dashboard/website?type=custom-website">
                            <Button className="gap-2">
                                <PenSquare className="h-4 w-4" />
                                Modifier le cahier des charges
                            </Button>
                        </Link>
                    ) : (
                        <Button disabled variant="outline" className="gap-2 cursor-not-allowed bg-slate-50 text-slate-400">
                            <PenSquare className="h-4 w-4" />
                            Cahier des charges verrouillé
                        </Button>
                    )}
                </div>
            </div>

            {/* Stepper tracker */}
            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                    <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-600">
                        Statut d&apos;avancement du projet
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-10">
                    <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4">
                        {/* Connecting Line */}
                        <div className="absolute left-[19px] md:left-0 md:top-[19px] top-4 bottom-4 md:bottom-auto md:w-full md:h-[3px] bg-slate-100 z-0">
                            <div 
                                className="h-full md:h-full bg-blue-600 transition-all duration-500" 
                                style={{ 
                                    width: typeof window === 'undefined' ? '0%' : `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                                    height: '100%' 
                                }}
                            />
                        </div>

                        {statusSteps.map((step, idx) => {
                            const isCompleted = currentStepIndex > idx
                            const isActive = currentStepIndex === idx
                            const isPending = currentStepIndex < idx

                            return (
                                <div key={step.key} className="flex md:flex-col items-start md:items-center relative z-10 md:w-1/4 gap-4 md:gap-3 group">
                                    {/* Icon Circle */}
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shrink-0
                                        ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                                          isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110' : 'bg-white border-2 border-slate-200 text-slate-400'}
                                    `}>
                                        {isCompleted ? <Check className="h-5 w-5" /> : idx + 1}
                                    </div>

                                    {/* Step text */}
                                    <div className="md:text-center space-y-1">
                                        <h4 className={`text-sm font-bold transition-colors ${
                                            isActive ? 'text-blue-600 font-extrabold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                                        }`}>
                                            {step.label}
                                        </h4>
                                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal max-w-[200px] md:mx-auto">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Specs Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200/60 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-blue-600" />
                                Spécifications demandées
                            </CardTitle>
                            <CardDescription>
                                Résumé du cahier des charges que vous nous avez soumis.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="divide-y divide-slate-100 p-6 pt-0">
                            {/* Type & Style */}
                            <div className="py-4 grid grid-cols-3 gap-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type & Style</span>
                                <div className="col-span-2 space-y-2">
                                    <p className="text-sm font-semibold text-slate-800 capitalize">
                                        Type: {config.websiteType === 'showcase' ? 'Site Vitrine' : 
                                               config.websiteType === 'ecommerce' ? 'E-commerce' : 
                                               config.websiteType === 'portfolio' ? 'Portfolio' : 
                                               config.websiteType === 'landing' ? 'Landing Page' : config.websiteType || 'Non spécifié'}
                                    </p>
                                    <p className="text-sm text-slate-600 capitalize">
                                        Style visuel: {config.stylePreferences === 'modern' ? 'Moderne & Dynamique' : 
                                                      config.stylePreferences === 'minimalist' ? 'Minimaliste épuré' : 
                                                      config.stylePreferences === 'luxury' ? 'Sombre & Luxueux' : 
                                                      config.stylePreferences === 'creative' ? 'Créatif & Artistique' : config.stylePreferences || 'Non spécifié'}
                                    </p>
                                </div>
                            </div>

                            {/* Pages */}
                            <div className="py-4 grid grid-cols-3 gap-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pages demandées</span>
                                <div className="col-span-2 flex flex-wrap gap-1.5">
                                    {config.pages && config.pages.length > 0 ? (
                                        config.pages.map((p: string) => (
                                            <Badge key={p} variant="secondary" className="capitalize text-[10px] px-2 py-0.5 bg-slate-100 border-slate-200 text-slate-700">
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
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-500 italic">Aucune page spécifiée</span>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="py-4 grid grid-cols-3 gap-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fonctionnalités</span>
                                <div className="col-span-2 flex flex-wrap gap-1.5">
                                    {config.specialFeatures && config.specialFeatures.length > 0 ? (
                                        config.specialFeatures.map((f: string) => (
                                            <Badge key={f} className="text-[10px] px-2 py-0.5 bg-blue-50 border-blue-100 text-blue-700">
                                                {f === 'contact-form' ? 'Formulaire de contact' : 
                                                 f === 'booking-system' ? 'Réservations de RDV' : 
                                                 f === 'payment-gateway' ? 'Paiement en ligne' : 
                                                 f === 'chat-bot' ? 'Whatsapp Live Chat' : 
                                                 f === 'newsletter' ? 'Newsletter' : 
                                                 f === 'multilingual' ? 'Multi-langue' : 
                                                 f === 'custom-auth' ? 'Portail Client' : 
                                                 f === 'advanced-seo' ? 'Optimisation SEO' : f}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-500 italic">Aucune fonctionnalité demandée</span>
                                    )}
                                </div>
                            </div>

                            {/* Competitors */}
                            {config.competitors && (
                                <div className="py-4 grid grid-cols-3 gap-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inspirations</span>
                                    <span className="col-span-2 text-sm text-slate-600 font-medium">
                                        {config.competitors}
                                    </span>
                                </div>
                            )}

                            {/* Notes */}
                            {config.additionalNotes && (
                                <div className="py-4 grid grid-cols-3 gap-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instructions</span>
                                    <p className="col-span-2 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {config.additionalNotes}
                                    </p>
                                </div>
                            )}

                            {/* Contact Details */}
                            <div className="py-4 grid grid-cols-3 gap-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Public</span>
                                <div className="col-span-2 text-sm text-slate-600 space-y-1">
                                    <p><span className="font-semibold text-slate-700">Email:</span> {config.email || user.email}</p>
                                    {config.phone && <p><span className="font-semibold text-slate-700">Téléphone:</span> {config.phone}</p>}
                                    {config.address && <p><span className="font-semibold text-slate-700">Adresse:</span> {config.address}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Developer Updates / Notes Column */}
                <div className="space-y-6">
                    <Card className="border-slate-200/60 shadow-sm h-full">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                                Notes de l&apos;équipe
                            </CardTitle>
                            <CardDescription>
                                Suivi des échanges avec les développeurs de votre site.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            {adminNotes.length === 0 ? (
                                <div className="text-center py-8 bg-slate-50 border border-dashed rounded-2xl p-4">
                                    <HelpCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-slate-600">Aucune note pour le moment</p>
                                    <p className="text-[10px] text-slate-400 mt-1">L&apos;équipe de développement postera des messages ici au fur et à mesure.</p>
                                </div>
                            ) : (
                                <div className="relative border-l border-slate-100 pl-4 space-y-6">
                                    {adminNotes.map((note: any, index: number) => (
                                        <div key={index} className="relative group">
                                            {/* Timeline dot */}
                                            <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-600 border border-white" />
                                            
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(note.createdAt).toLocaleDateString('fr-FR', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-2xl leading-relaxed">
                                                    {note.note}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
