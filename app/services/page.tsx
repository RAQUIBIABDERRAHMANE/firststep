import { getServices, getUserServices } from '@/app/actions/services'
import { getCurrentUser } from '@/app/actions/auth'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import ServiceButton from '@/components/ui/ServiceButton'
import {
    Utensils, Store, Package, Car, Hotel, Hospital, Briefcase,
    Sparkles, Clock, Check, ArrowRight, Zap, Shield, Headphones, TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'

const getServiceIcon = (category: string | null) => {
    const iconClass = "h-8 w-8"
    switch (category) {
        case 'restaurant': return <Utensils className={iconClass} />
        case 'inventory': return <Package className={iconClass} />
        case 'rental': return <Car className={iconClass} />
        case 'hospitality': return <Hotel className={iconClass} />
        case 'healthcare': return <Hospital className={iconClass} />
        case 'professional-services': return <Briefcase className={iconClass} />
        default: return <Store className={iconClass} />
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

const C = '0, 102, 255'

export default async function ServicesPage() {
    const [services, user, userServices] = await Promise.all([
        getServices(),
        getCurrentUser(),
        getCurrentUser().then(user => user ? getUserServices() : [])
    ])

    const sortedServices = [...services].sort((a, b) => {
        if (a.status === 'AVAILABLE' && b.status !== 'AVAILABLE') return -1;
        if (a.status !== 'AVAILABLE' && b.status === 'AVAILABLE') return 1;
        return 0;
    });

    const availableCount = services.filter(s => s.status === 'AVAILABLE').length;
    const comingSoonCount = services.filter(s => s.status === 'COMING_SOON').length;

    return (
        <div className="min-h-screen bg-[#030712]">
            <style>{`
                /* ── Liquid glass card ── */
                .srv-glass {
                    background: rgba(6,12,24,0.65);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.35s ease, box-shadow 0.35s ease;
                }
                .srv-glass::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    padding: 1px;
                    border-radius: inherit;
                    background: linear-gradient(
                        160deg,
                        rgba(${C},0.35) 0%,
                        rgba(${C},0.08) 30%,
                        transparent 55%,
                        rgba(${C},0.06) 80%,
                        rgba(${C},0.2) 100%
                    );
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                    transition: background 0.35s ease;
                }
                .srv-glass:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 0 60px rgba(${C},0.13), 0 24px 48px rgba(0,0,0,0.5);
                }
                .srv-glass:hover::before {
                    background: linear-gradient(
                        160deg,
                        rgba(${C},0.6) 0%,
                        rgba(${C},0.2) 30%,
                        transparent 55%,
                        rgba(${C},0.12) 80%,
                        rgba(${C},0.4) 100%
                    );
                }

                /* stat pill glass */
                .stat-pill {
                    background: rgba(6,12,24,0.6);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    position: relative;
                }
                .stat-pill::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    padding: 1px;
                    border-radius: inherit;
                    background: linear-gradient(180deg, rgba(${C},0.35) 0%, rgba(${C},0.08) 50%, transparent 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }

                /* cta glass */
                .cta-glass {
                    background: rgba(6,12,24,0.75);
                    backdrop-filter: blur(40px);
                    -webkit-backdrop-filter: blur(40px);
                    position: relative;
                }
                .cta-glass::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    padding: 1px;
                    border-radius: inherit;
                    background: linear-gradient(135deg, rgba(${C},0.5) 0%, rgba(${C},0.15) 30%, transparent 60%, rgba(${C},0.35) 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }

                @keyframes srv-fade-up {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .srv-reveal { animation: srv-fade-up 0.8s cubic-bezier(.22,1,.36,1) both; }

                @keyframes shimmer-sweep {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                .shimmer-cyan-text {
                    background: linear-gradient(105deg, #5E9FFF 0%, #0066FF 25%, #ffffff 48%, #0066FF 72%, #0044CC 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer-sweep 5s linear infinite;
                }
            `}</style>

            <Navbar user={user} />

            {/* ── Hero ── */}
            <section className="relative pt-36 pb-24 overflow-hidden">

                {/* Background */}
                <div className="absolute inset-0 bg-[#030712]" />

                {/* Background dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `radial-gradient(rgba(${C},0.5) 1px, transparent 1px)`,
                        backgroundSize: '48px 48px',
                    }}
                />

                {/* Atmospheric orbs */}
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ backgroundColor: `rgba(${C},0.07)` }} />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ backgroundColor: `rgba(${C},0.05)` }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-cyan-950/20 blur-[160px]" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">

                        {/* Eyebrow pill */}
                        <div className="srv-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                            style={{
                                background: `rgba(${C},0.07)`,
                                backdropFilter: 'blur(12px)',
                                boxShadow: `inset 0 1px 1px rgba(${C},0.12), 0 0 0 1px rgba(${C},0.18)`,
                            }}
                        >
                            <Zap className="h-4 w-4" style={{ color: '#0066FF' }} />
                            <span className="text-sm font-medium font-figtree" style={{ color: '#0066FF' }}>
                                {availableCount} service{availableCount > 1 ? 's' : ''} actif{availableCount > 1 ? 's' : ''} &bull; {comingSoonCount} à venir
                            </span>
                        </div>

                        {/* H1 */}
                        <h1 className="srv-reveal font-syne text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight" style={{ animationDelay: '80ms' }}>
                            Toutes nos{' '}
                            <span className="shimmer-cyan-text">solutions</span>
                        </h1>

                        <p className="srv-reveal font-figtree text-xl text-slate-400 max-w-2xl mx-auto mb-14 leading-relaxed" style={{ animationDelay: '160ms' }}>
                            Des outils professionnels conçus pour propulser votre entreprise.
                            Choisissez les modules adaptés à vos besoins et évoluez à votre rythme.
                        </p>

                        {/* Stats row */}
                        <div className="srv-reveal flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: '240ms' }}>
                            {[
                                { icon: Shield, value: '100%', label: 'Sécurisé', color: '#10b981' },
                                { icon: Headphones, value: '24/7', label: 'Support', color: '#0066FF' },
                                { icon: TrendingUp, value: '+40%', label: 'Productivité', color: '#0066FF' },
                            ].map(({ icon: Icon, value, label, color }) => (
                                <div key={label} className="stat-pill rounded-2xl px-8 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Icon className="h-5 w-5" style={{ color }} />
                                        <span className="text-2xl font-black text-white font-syne">{value}</span>
                                    </div>
                                    <span className="text-sm text-slate-500 font-figtree">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Services Grid ── */}
            <section className="relative py-20 overflow-hidden">

                {/* Separator */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${C},0.25), transparent)` }} />

                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {sortedServices.map((service, idx) => {
                            const isAvailable = service.status === 'AVAILABLE'
                            const features = getServiceFeatures(service.category)

                            return (
                                <div
                                    key={service.id}
                                    className="srv-glass srv-reveal rounded-3xl p-8"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    {/* Top hover glow line */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, rgba(${C},0.6), transparent)` }} />

                                    <div className="relative z-10">
                                        {/* Header */}
                                        <div className="flex items-start gap-5 mb-6">
                                            <div className="p-4 rounded-2xl transition-all duration-300 shrink-0"
                                                style={isAvailable ? {
                                                    color: '#0066FF',
                                                    background: `rgba(${C},0.08)`,
                                                    boxShadow: `0 0 20px rgba(${C},0.1), inset 0 1px 1px rgba(${C},0.12)`,
                                                } : {
                                                    color: '#64748b',
                                                    background: 'rgba(255,255,255,0.03)',
                                                }}
                                            >
                                                {getServiceIcon(service.category)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <h3 className={`font-syne text-2xl font-bold transition-colors ${
                                                        isAvailable ? 'text-white' : 'text-slate-400'
                                                    }`}>
                                                        {service.name}
                                                    </h3>
                                                    <Badge className={`shrink-0 text-[10px] font-semibold px-3 py-1.5 border-0 rounded-full ${
                                                        isAvailable
                                                            ? 'bg-emerald-500/15 text-emerald-400'
                                                            : 'bg-white/5 text-slate-500'
                                                    }`}>
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
                                                <p className="font-figtree text-slate-500 leading-relaxed text-[14px]">
                                                    {service.description || 'Solution complète de gestion pour votre activité.'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="mb-8">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="h-px w-8 rounded-full" style={{ background: `linear-gradient(90deg, #0066FF, transparent)` }} />
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-figtree">
                                                    Fonctionnalités
                                                </h4>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 text-sm">
                                                        <div className={`mt-0.5 p-1 rounded-md shrink-0 ${
                                                            isAvailable ? 'bg-cyan-500/12' : 'bg-white/4'
                                                        }`}>
                                                            <Check className={`h-3 w-3 ${isAvailable ? 'text-[#0066FF]' : 'text-slate-600'}`} />
                                                        </div>
                                                        <span className="font-figtree text-slate-400">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price & CTA */}
                                        {isAvailable ? (
                                            <div className="space-y-4">
                                                <div
                                                    className="flex items-center justify-between p-5 rounded-2xl"
                                                    style={{
                                                        background: `rgba(${C},0.04)`,
                                                        boxShadow: `inset 0 1px 1px rgba(${C},0.08), 0 0 0 1px rgba(${C},0.10)`,
                                                    }}
                                                >
                                                    <div>
                                                        <p className="font-figtree text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
                                                            À partir de
                                                        </p>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="font-syne text-4xl font-black text-white">
                                                                {service.price?.toFixed(0) ?? '0'}
                                                            </span>
                                                            <span className="font-figtree text-lg text-slate-500">MAD</span>
                                                            <span className="font-figtree text-xs text-slate-600 ml-1">/ mois</span>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-xs font-bold rounded-full">
                                                        <Sparkles className="h-3 w-3 mr-1" />
                                                        Actif
                                                    </Badge>
                                                </div>

                                                {service.slug === 'custom-website' ? (
                                                    <Link href="/services/custom-website/request" className="block">
                                                        <Button className="w-full h-14 font-syne font-bold text-base text-black border-0 gap-2 group/btn rounded-xl transition-all duration-300"
                                                            style={{
                                                                backgroundColor: '#0066FF',
                                                                boxShadow: `0 0 30px rgba(${C},0.25)`,
                                                            }}
                                                        >
                                                            <Sparkles className="h-5 w-5" />
                                                            Demander mon site
                                                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </Link>
                                                ) : user ? (
                                                    <ServiceButton
                                                        service={service}
                                                        userHasService={userServices.some(us => us.serviceId === service.id)}
                                                    />
                                                ) : (
                                                    <Link href="/login" className="block">
                                                        <Button className="w-full h-14 font-syne font-bold text-base text-black border-0 gap-2 group/btn rounded-xl transition-all duration-300"
                                                            style={{
                                                                backgroundColor: '#0066FF',
                                                                boxShadow: `0 0 30px rgba(${C},0.25)`,
                                                            }}
                                                        >
                                                            <Sparkles className="h-5 w-5" />
                                                            Se connecter pour acheter
                                                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                                                    <p className="font-figtree text-sm text-slate-500 text-center">
                                                        Ce service sera bientôt disponible.
                                                    </p>
                                                </div>
                                                {user ? (
                                                    <ServiceButton
                                                        service={service}
                                                        userHasService={userServices.some(us => us.serviceId === service.id)}
                                                    />
                                                ) : (
                                                    <Button
                                                        disabled
                                                        variant="outline"
                                                        className="w-full h-14 font-syne font-bold text-base bg-white/4 border border-white/8 text-slate-500 cursor-not-allowed gap-2 rounded-xl"
                                                    >
                                                        <Clock className="h-5 w-5" />
                                                        Me notifier du lancement
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="relative py-28 overflow-hidden">

                {/* Separator */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${C},0.25), transparent)` }} />

                {/* Orbs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[140px]" style={{ backgroundColor: `rgba(${C},0.07)` }} />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <div className="cta-glass rounded-3xl p-14 text-center">
                            {/* Top accent bar */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5" style={{ background: `linear-gradient(90deg, transparent, #0066FF, transparent)` }} />

                            <h2 className="font-syne text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                                Prêt à transformer <br />
                                <span className="shimmer-cyan-text">votre entreprise ?</span>
                            </h2>
                            <p className="font-figtree text-lg text-slate-400 mb-10 leading-relaxed">
                                Rejoignez des centaines d&apos;entreprises qui utilisent déjà FirstStep pour optimiser leurs opérations.
                            </p>
                            <Link href="/#signup">
                                <button
                                    className="inline-flex items-center gap-3 px-10 h-14 font-syne font-bold text-base text-black rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    style={{
                                        backgroundColor: '#0066FF',
                                        boxShadow: `0 0 40px rgba(${C},0.3)`,
                                    }}
                                >
                                    <Sparkles className="h-5 w-5" />
                                    Commencer gratuitement
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="relative border-t border-cyan-900/20 py-10 bg-[#030712]">
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${C},0.2), transparent)` }} />
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="font-figtree text-slate-600 text-sm">
                            &copy; 2026 FirstStep. Tous droits réservés.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/login" className="font-figtree text-sm text-slate-500 hover:text-[#0066FF] transition-colors">
                                Connexion
                            </Link>
                            <Link href="/#signup" className="font-figtree text-sm text-slate-500 hover:text-[#0066FF] transition-colors">
                                S&apos;inscrire
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
