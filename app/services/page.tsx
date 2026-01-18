import { getServices } from '@/app/actions/services'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Utensils, Store, Package, Car, Hotel, Hospital, Briefcase, Sparkles, Clock, Check, ArrowRight, Zap, Shield, Headphones, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'

const getServiceIcon = (category: string | null) => {
    const iconClass = "h-8 w-8"
    switch (category) {
        case 'restaurant':
            return <Utensils className={iconClass} />
        case 'inventory':
            return <Package className={iconClass} />
        case 'rental':
            return <Car className={iconClass} />
        case 'hospitality':
            return <Hotel className={iconClass} />
        case 'healthcare':
            return <Hospital className={iconClass} />
        case 'professional-services':
            return <Briefcase className={iconClass} />
        default:
            return <Store className={iconClass} />
    }
}

const getServiceFeatures = (category: string | null): string[] => {
    switch (category) {
        case 'restaurant':
            return [
                'Site web moderne et responsive',
                'Menu digital interactif',
                'Système de réservation en ligne',
                'Gestion multi-langues',
                'Intégration des réseaux sociaux',
                'Analytics et statistiques',
            ]
        case 'professional-services':
            return [
                'Page de services professionnels',
                'Système de prise de rendez-vous',
                'Galerie portfolio',
                'Témoignages clients',
                'Formulaire de contact',
                'Tableau de bord analytique',
            ]
        case 'inventory':
            return [
                'Suivi et contrôle des stocks',
                'Alertes de stock bas',
                'Catégorisation des produits',
                'Intégration code-barres',
                'Analytique des mouvements',
                'Rapports automatisés',
            ]
        case 'rental':
            return [
                'Gestion de flotte véhicules',
                'Réservations en ligne',
                'Règles de tarification flexibles',
                'Profils clients et chauffeurs',
                'Calendrier de disponibilité',
                'Contrats automatisés',
            ]
        case 'hospitality':
            return [
                'Tableau de bord chambres',
                'Moteur de réservation',
                'Processus check-in/out',
                'Facturation automatique',
                'Gestion profils clients',
                'Intégration services',
            ]
        case 'healthcare':
            return [
                'Inscription patients',
                'Dossiers médicaux',
                'Planification rendez-vous',
                'Facturation & assurances',
                'Stock pharmacie',
                'Rappels automatiques',
            ]
        default:
            return [
                'Solution de gestion complète',
                'Tableau de bord en temps réel',
                'Gestion des clients',
                'Rapports et statistiques',
                'Support technique dédié',
                'Mises à jour régulières',
            ]
    }
}

export default async function ServicesPage() {
    const services = await getServices()

    // Sort services: available first, then coming soon
    const sortedServices = [...services].sort((a, b) => {
        if (a.status === 'AVAILABLE' && b.status !== 'AVAILABLE') return -1;
        if (a.status !== 'AVAILABLE' && b.status === 'AVAILABLE') return 1;
        return 0;
    });

    const availableCount = services.filter(s => s.status === 'AVAILABLE').length;
    const comingSoonCount = services.filter(s => s.status === 'COMING_SOON').length;

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
                <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
                
                {/* Grid pattern */}
                <div 
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                         linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-medium text-violet-300 mb-8">
                            <Zap className="h-4 w-4" />
                            {availableCount} service{availableCount > 1 ? 's' : ''} actif{availableCount > 1 ? 's' : ''} • {comingSoonCount} à venir
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
                            Toutes nos{' '}
                            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                solutions
                            </span>
                        </h1>
                        
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Des outils professionnels conçus pour propulser votre entreprise. 
                            Choisissez les modules adaptés à vos besoins et évoluez à votre rythme.
                        </p>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Shield className="h-5 w-5 text-emerald-400" />
                                    <span className="text-2xl font-bold text-white">100%</span>
                                </div>
                                <span className="text-sm text-slate-500">Sécurisé</span>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Headphones className="h-5 w-5 text-violet-400" />
                                    <span className="text-2xl font-bold text-white">24/7</span>
                                </div>
                                <span className="text-sm text-slate-500">Support</span>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <TrendingUp className="h-5 w-5 text-indigo-400" />
                                    <span className="text-2xl font-bold text-white">+40%</span>
                                </div>
                                <span className="text-sm text-slate-500">Productivité</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid Section */}
            <section className="relative py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {sortedServices.map((service) => {
                            const isAvailable = service.status === 'AVAILABLE'
                            const features = getServiceFeatures(service.category)

                            return (
                                <div
                                    key={service.id}
                                    className={`
                                        group relative overflow-hidden rounded-3xl p-8
                                        bg-white/[0.02] backdrop-blur-sm border border-white/[0.05]
                                        hover:bg-white/[0.05] hover:border-violet-500/30
                                        transition-all duration-500
                                    `}
                                >
                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent" />
                                    </div>

                                    <div className="relative z-10">
                                        {/* Header */}
                                        <div className="flex items-start gap-5 mb-6">
                                            <div className={`
                                                p-4 rounded-2xl transition-all duration-300
                                                ${isAvailable 
                                                    ? 'bg-violet-500/20 text-violet-400 group-hover:bg-violet-500 group-hover:text-white' 
                                                    : 'bg-white/5 text-slate-500'
                                                }
                                            `}>
                                                {getServiceIcon(service.category)}
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">
                                                        {service.name}
                                                    </h3>
                                                    <Badge className={`
                                                        text-[10px] font-semibold px-3 py-1.5 border-0 ml-3
                                                        ${isAvailable 
                                                            ? 'bg-emerald-500/20 text-emerald-400' 
                                                            : 'bg-white/5 text-slate-500'
                                                        }
                                                    `}>
                                                        {isAvailable ? (
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                                ACTIF
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1.5">
                                                                <Clock className="h-3 w-3" />
                                                                BIENTÔT
                                                            </span>
                                                        )}
                                                    </Badge>
                                                </div>
                                                <p className="text-slate-500 leading-relaxed">
                                                    {service.description || 'Solution complète de gestion pour votre activité.'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Features List */}
                                        <div className="mb-8">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="h-px w-8 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    Fonctionnalités
                                                </h4>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {features.map((feature, idx) => (
                                                    <div 
                                                        key={idx}
                                                        className="flex items-start gap-3 text-sm"
                                                    >
                                                        <div className={`
                                                            mt-0.5 p-1 rounded-md
                                                            ${isAvailable ? 'bg-violet-500/20' : 'bg-white/5'}
                                                        `}>
                                                            <Check className={`h-3 w-3 ${isAvailable ? 'text-violet-400' : 'text-slate-600'}`} />
                                                        </div>
                                                        <span className="text-slate-400">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price & CTA */}
                                        {isAvailable ? (
                                            <div className="space-y-5">
                                                <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                                                    <div>
                                                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
                                                            À partir de
                                                        </p>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-4xl font-bold text-white">2,500</span>
                                                            <span className="text-lg text-slate-500">DH</span>
                                                            <span className="text-xs text-slate-600 ml-1">
                                                                {service.slug === 'restaurant-website' ? '/ à vie' : '/ mois'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {service.slug === 'restaurant-website' && (
                                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs font-bold">
                                                            <Sparkles className="h-3 w-3 mr-1" />
                                                            À vie
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Special Offer */}
                                                {service.slug === 'restaurant-website' && (
                                                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                                        <div className="flex items-start gap-3">
                                                            <Sparkles className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm font-bold text-emerald-400 mb-1">
                                                                    🎁 Offre de lancement
                                                                </p>
                                                                <p className="text-sm text-slate-400">
                                                                    Abonnez-vous maintenant et obtenez <strong className="text-emerald-400">-20%</strong> sur le POS Restaurant lors de sa sortie !
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <Link href="/#signup" className="block">
                                                    <Button className="w-full h-14 font-bold text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 gap-2 group/btn">
                                                        <Sparkles className="h-5 w-5" />
                                                        Démarrer avec {service.name.split(' ')[0]}
                                                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                                    <p className="text-sm text-slate-500 text-center">
                                                        Ce service sera bientôt disponible. Inscrivez-vous pour être notifié.
                                                    </p>
                                                </div>
                                                <Button 
                                                    disabled 
                                                    variant="outline" 
                                                    className="w-full h-14 font-bold text-base bg-white/5 border-white/10 text-slate-500 cursor-not-allowed gap-2"
                                                >
                                                    <Clock className="h-5 w-5" />
                                                    Me notifier du lancement
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-violet-950/20 to-slate-950" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Prêt à transformer votre entreprise ?
                        </h2>
                        <p className="text-lg text-slate-400 mb-10">
                            Rejoignez des centaines d&apos;entreprises qui utilisent déjà FirstStep pour optimiser leurs opérations.
                        </p>
                        <Link href="/#signup">
                            <Button 
                                size="lg" 
                                className="px-10 h-14 text-base font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 gap-2"
                            >
                                <Sparkles className="h-5 w-5" />
                                Commencer gratuitement
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/[0.05] py-8 bg-slate-950">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 text-sm">
                            © 2025 FirstStep. Tous droits réservés.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/login" className="text-sm text-slate-500 hover:text-white transition-colors">
                                Connexion
                            </Link>
                            <Link href="/#signup" className="text-sm text-slate-500 hover:text-white transition-colors">
                                S&apos;inscrire
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
