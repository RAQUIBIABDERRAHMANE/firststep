'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Utensils, Store, Package, Car, Hotel, Hospital, Briefcase, Sparkles, Clock, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

type Service = {
    id: string
    name: string
    slug: string
    description: string | null
    status: string
    category: string | null
}

interface ServicesOverviewProps {
    services: Service[]
}

const getServiceIcon = (category: string | null) => {
    const iconClass = "h-7 w-7"
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

export default function ServicesOverview({ services }: ServicesOverviewProps) {
    // Sort services: available first, then coming soon
    const sortedServices = [...services].sort((a, b) => {
        if (a.status === 'AVAILABLE' && b.status !== 'AVAILABLE') return -1;
        if (a.status !== 'AVAILABLE' && b.status === 'AVAILABLE') return 1;
        return 0;
    });

    return (
        <section id="services" className="relative py-32 overflow-hidden bg-slate-900">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
            
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
                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-medium text-violet-300 mb-6">
                        <Zap className="h-4 w-4" />
                        Nos Solutions
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Des outils <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">puissants</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Des solutions modulaires conçues pour un impact immédiat. Activez ce dont vous avez besoin, quand vous en avez besoin.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedServices.map((service, index) => {
                        const isAvailable = service.status === 'AVAILABLE';

                        return (
                            <div
                                key={service.id}
                                className={`
                                    group relative overflow-hidden rounded-2xl p-6
                                    bg-white/[0.03] backdrop-blur-sm border border-white/[0.05]
                                    hover:bg-white/[0.06] hover:border-violet-500/30
                                    transition-all duration-500 hover:-translate-y-1
                                `}
                            >
                                {/* Hover glow effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                                </div>

                                <div className="relative z-10">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-5">
                                        <div className={`
                                            p-3 rounded-xl transition-all duration-300
                                            ${isAvailable 
                                                ? 'bg-violet-500/20 text-violet-400 group-hover:bg-violet-500 group-hover:text-white' 
                                                : 'bg-white/5 text-slate-500'
                                            }
                                        `}>
                                            {getServiceIcon(service.category)}
                                        </div>
                                        
                                        <Badge className={`
                                            text-[10px] font-semibold px-2.5 py-1 border-0
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

                                    {/* Content */}
                                    <div className="space-y-3 mb-6">
                                        <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                                            {service.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                                            {service.description || 'Solution complète de gestion pour votre activité.'}
                                        </p>
                                    </div>

                                    {/* Price & CTA */}
                                    {isAvailable ? (
                                        <div className="space-y-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-white">2,500</span>
                                                <span className="text-slate-500 font-medium">DH</span>
                                                <span className="text-xs text-slate-600 ml-1">
                                                    {service.slug === 'restaurant-website' ? '/ à vie' : '/ mois'}
                                                </span>
                                            </div>
                                            
                                            {service.slug === 'restaurant-website' && (
                                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                                    <p className="text-xs text-emerald-400 flex items-center gap-2">
                                                        <Sparkles className="h-3.5 w-3.5" />
                                                        <span><strong>-20%</strong> sur le POS Restaurant au lancement</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-xs text-slate-600">
                                                Soyez notifié du lancement →
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-16">
                    <Link href="/services">
                        <Button 
                            size="lg" 
                            variant="outline" 
                            className="px-8 font-semibold bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 group"
                        >
                            Voir toutes les solutions
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
