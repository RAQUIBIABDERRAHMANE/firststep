'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Utensils, Store, Package, Car, Hotel, Hospital, Briefcase, Clock, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

type Service = {
    id: string
    name: string
    slug: string
    description: string | null
    status: string
    category: string | null
    price: number | null
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
    const sortedServices = [...services].sort((a, b) => {
        if (a.status === 'AVAILABLE' && b.status !== 'AVAILABLE') return -1
        if (a.status !== 'AVAILABLE' && b.status === 'AVAILABLE') return 1
        return 0
    })

    return (
        <section id="services" className="relative py-32 bg-[#050914]">
            {/* Subtle top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="max-w-xl mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        Nos Solutions
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                        Des outils taillés pour{' '}
                        <span className="text-blue-400">votre métier</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Modules indépendants, activables à la demande. Payez uniquement ce que vous utilisez.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedServices.map((service) => {
                        const isAvailable = service.status === 'AVAILABLE'
                        return (
                            <div key={service.id}
                                className="group relative bg-white/3 border border-white/[7%] rounded-2xl p-6 hover:border-blue-500/30 hover:bg-white/5 transition-all duration-300">
                                {/* Status dot */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className={`p-2.5 rounded-xl ${
                                        isAvailable ? 'bg-blue-500/10 text-blue-400' : 'bg-white/4 text-slate-600'
                                    }`}>
                                        {getServiceIcon(service.category)}
                                    </div>
                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                        isAvailable
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : 'bg-white/4 text-slate-600 border border-white/6'
                                    }`}>
                                        {isAvailable ? (
                                            <span className="flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                Disponible
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="h-3 w-3" />
                                                Bientôt
                                            </span>
                                        )}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                    {service.name}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">
                                    {service.description || 'Solution complète pour votre activité.'}
                                </p>

                                {isAvailable ? (
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-black text-white">{service.price?.toFixed(0) ?? '0'}</span>
                                        <span className="text-sm text-slate-500 font-medium">MAD / mois</span>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-600">Notifiez-moi du lancement →</p>
                                )}

                                {service.slug === 'restaurant-website' && (
                                    <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Offre de lancement −20%
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/services">
                        <Button variant="outline" className="gap-2 border-white/10 bg-white/3 text-slate-300 hover:bg-white/[7%] hover:text-white rounded-xl font-semibold">
                            Toutes les solutions
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
