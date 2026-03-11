'use client'

import { Utensils, Store, Package, Car, Hotel, Hospital, Briefcase, Clock, ArrowRight } from 'lucide-react'
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
    const cls = 'h-5 w-5'
    switch (category) {
        case 'restaurant': return <Utensils className={cls} />
        case 'inventory': return <Package className={cls} />
        case 'rental': return <Car className={cls} />
        case 'hospitality': return <Hotel className={cls} />
        case 'healthcare': return <Hospital className={cls} />
        case 'professional-services': return <Briefcase className={cls} />
        default: return <Store className={cls} />
    }
}

export default function ServicesOverview({ services }: ServicesOverviewProps) {
    const sortedServices = [...services].sort((a, b) => {
        if (a.status === 'AVAILABLE' && b.status !== 'AVAILABLE') return -1
        if (a.status !== 'AVAILABLE' && b.status === 'AVAILABLE') return 1
        return 0
    })

    return (
        <section id="services" className="relative py-32 bg-[#030712] overflow-hidden">

            {/* Top separator */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />

            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.018]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                }} />

            <div className="relative max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-px w-10 bg-cyan-400" />
                            <span className="font-figtree text-[11px] font-semibold text-cyan-400 uppercase tracking-[0.25em]">Nos Solutions</span>
                        </div>
                        <h2 className="font-syne font-black text-white leading-tight">
                            <span className="block text-4xl md:text-5xl">Des outils taillés</span>
                            <span className="block text-4xl md:text-5xl text-cyan-400">pour votre métier</span>
                        </h2>
                    </div>
                    <p className="font-figtree text-slate-400 text-[16px] leading-relaxed max-w-sm md:text-right">
                        Modules indépendants, activables à la carte.
                        <br />Payez uniquement ce que vous utilisez.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedServices.map((service, idx) => {
                        const isAvailable = service.status === 'AVAILABLE'
                        return (
                            <div
                                key={service.id}
                                className="group relative rounded-xl border border-white/5 bg-[#060c18] hover:border-cyan-800/50 transition-all duration-300 overflow-hidden"
                            >
                                {/* Hover top accent */}
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Card index watermark */}
                                <div className="absolute top-4 right-5 font-syne text-5xl font-black text-white/[0.04] select-none pointer-events-none">
                                    {String(idx + 1).padStart(2, '0')}
                                </div>

                                <div className="relative p-6">
                                    {/* Icon + status */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`p-2.5 rounded-lg border ${
                                            isAvailable
                                                ? 'bg-cyan-500/8 text-cyan-400 border-cyan-800/40'
                                                : 'bg-white/3 text-slate-600 border-white/5'
                                        }`}>
                                            {getServiceIcon(service.category)}
                                        </div>
                                        <span className={`font-figtree text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                                            isAvailable
                                                ? 'bg-emerald-500/8 text-emerald-400 border-emerald-800/40'
                                                : 'bg-white/3 text-slate-500 border-white/5'
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

                                    <h3 className="font-syne font-bold text-[17px] text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                                        {service.name}
                                    </h3>
                                    <p className="font-figtree text-[13px] text-slate-500 leading-relaxed mb-6 line-clamp-2">
                                        {service.description || 'Solution complète pour votre activité professionnelle.'}
                                    </p>

                                    {/* Price footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        {isAvailable ? (
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="font-syne text-2xl font-black text-white">{service.price?.toFixed(0) ?? '0'}</span>
                                                <span className="font-figtree text-[12px] text-slate-500">MAD / mois</span>
                                            </div>
                                        ) : (
                                            <span className="font-figtree text-[12px] text-slate-600">Lancement imminent</span>
                                        )}
                                        {isAvailable && (
                                            <Link href="#signup">
                                                <button className="inline-flex items-center gap-1 font-figtree text-[12px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
                                                    Activer <ArrowRight className="h-3 w-3" />
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* All services CTA */}
                <div className="mt-12 flex justify-center">
                    <Link href="/services">
                        <button className="inline-flex items-center gap-2 px-6 py-3 font-figtree font-semibold text-[13px] text-slate-300 hover:text-white border border-white/8 hover:border-cyan-800/50 rounded-xl transition-all duration-300 hover:bg-cyan-950/20">
                            Toutes les solutions
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

