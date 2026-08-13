'use client'

import { Utensils, Store, Package, Car, Hotel, Hospital, Briefcase, Clock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

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
    const cls = 'h-5.5 w-5.5'
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
        <section id="services" className="relative z-10 py-28 md:py-36 bg-[#FAFBFD] text-slate-900 overflow-hidden">
            {/* Top divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            
            {/* Ambient background radial Orbs */}
            <div className="absolute top-[15%] right-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-400/10 via-sky-300/5 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-[10%] left-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-emerald-300/10 via-blue-200/5 to-transparent blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6">
                
                {/* Header with Spinning Gradient Pill */}
                <ScrollReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        {/* Spinning Gradient Border Eyebrow */}
                        <div className="rotating-border-wrapper mb-5 shadow-sm shadow-blue-500/10 inline-flex">
                            <div className="rotating-border-inner inline-flex items-center gap-2 px-3.5 py-1">
                                <Sparkles className="h-3.5 w-3.5 text-[#0066FF]" />
                                <span className="font-figtree text-[11px] font-bold uppercase tracking-[0.2em] text-[#0066FF]">
                                    Nos Solutions
                                </span>
                            </div>
                        </div>

                        <h2 className="font-syne font-black text-slate-900 leading-tight">
                            <span className="block text-3xl md:text-5xl">Des outils taillés</span>
                            <span className="block text-3xl md:text-5xl text-[#0066FF]">pour votre métier</span>
                        </h2>
                    </div>
                    <p className="font-figtree text-slate-600 text-[15.5px] leading-relaxed max-w-sm md:text-right font-medium">
                        Modules indépendants, activables à la carte.
                        <br />Payez uniquement ce que vous utilisez.
                    </p>
                </ScrollReveal>

                {/* 3D Glass Card Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedServices.map((service, idx) => {
                        const isAvailable = service.status === 'AVAILABLE'
                        const isFeatured = idx === 0 && isAvailable

                        return (
                            <ScrollReveal
                                key={service.id}
                                delay={idx * 75}
                                direction="up"
                                className={`group relative rounded-3xl p-7 transition-all duration-300 ${
                                    isFeatured
                                        ? 'bg-gradient-to-b from-white via-blue-50/50 to-white border-2 border-[#0066FF]/40 shadow-xl shadow-blue-500/10 md:col-span-2 lg:col-span-1'
                                        : 'bg-gradient-to-b from-white/95 via-white/90 to-slate-50/60 backdrop-blur-xl border border-slate-200/90 shadow-md shadow-slate-900/5 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/50 hover:-translate-y-2'
                                }`}
                            >
                                {/* Watermark number */}
                                <div className="absolute top-4 right-6 font-syne text-5xl font-black text-slate-100/90 select-none pointer-events-none group-hover:text-blue-100/60 transition-colors">
                                    {String(idx + 1).padStart(2, '0')}
                                </div>

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        {/* Icon box + status badge */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div
                                                className={`p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                                                    isAvailable
                                                        ? 'bg-blue-50/90 text-[#0066FF] border border-blue-100 shadow-sm shadow-blue-500/10'
                                                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                                                }`}
                                            >
                                                {getServiceIcon(service.category)}
                                            </div>
                                            <span
                                                className={`font-figtree text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${
                                                    isAvailable
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                                                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                }`}
                                            >
                                                {isAvailable ? (
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
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

                                        {/* Title & Description */}
                                        <h3
                                            className={`font-syne font-extrabold text-xl mb-2 transition-colors duration-200 ${
                                                isAvailable ? 'text-slate-900 group-hover:text-[#0066FF]' : 'text-slate-500'
                                            }`}
                                        >
                                            {service.name}
                                        </h3>
                                        <p className="font-figtree text-[13.5px] text-slate-600 leading-relaxed mb-8 line-clamp-2">
                                            {service.description || 'Solution complète pour votre activité professionnelle.'}
                                        </p>
                                    </div>

                                    {/* Footer: Price & High-End Action Button */}
                                    <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                                        {isAvailable ? (
                                            <div className="flex items-baseline gap-1.5">
                                                {service.slug === 'custom-website' ? (
                                                    <>
                                                        <span className="font-figtree text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dès</span>
                                                        <span className="font-syne text-2xl font-black text-slate-900">1 500</span>
                                                    </>
                                                ) : (
                                                    <span className="font-syne text-2xl font-black text-slate-900">{service.price?.toFixed(0) ?? '0'}</span>
                                                )}
                                                <span className="font-figtree text-[12px] text-slate-500 font-semibold">MAD/mois</span>
                                            </div>
                                        ) : (
                                            <span className="font-figtree text-[12px] text-slate-400 font-medium">Lancement imminent</span>
                                        )}

                                        {isAvailable && (
                                            <Link href={service.slug === 'custom-website' ? '/services/custom-website/request' : '#signup'}>
                                                <button
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-syne font-bold text-[12.5px] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40"
                                                    style={{ backgroundColor: '#0066FF' }}
                                                >
                                                    {service.slug === 'custom-website' ? 'Demander' : 'Découvrir'}
                                                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </ScrollReveal>
                        )
                    })}
                </div>

                {/* Bottom CTA Pill */}
                <div className="mt-16 flex justify-center">
                    <Link href="/services">
                        <button className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white border border-slate-200/90 shadow-md shadow-slate-900/5 font-figtree font-bold text-[13px] text-slate-800 hover:text-[#0066FF] hover:border-blue-200 hover:-translate-y-0.5 transition-all">
                            Toutes les solutions
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200 text-[#0066FF]" />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
