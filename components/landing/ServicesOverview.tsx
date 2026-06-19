'use client'

import { Utensils, Store, Package, Car, Hotel, Hospital, Briefcase, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { DottedSurface } from '@/components/ui/dotted-surface'

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

/* brand color */
const C = '0, 102, 255'

const styles = `
    .svc-glass {
        background: rgba(6,12,24,0.65);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        position: relative;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .svc-glass::before {
        content: '';
        position: absolute;
        inset: 0;
        padding: 1px;
        border-radius: inherit;
        background: linear-gradient(160deg, rgba(${C},0.35) 0%, rgba(${C},0.08) 35%, transparent 60%, rgba(${C},0.06) 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        transition: background 0.3s ease;
    }
    .svc-glass:hover {
        transform: translateY(-4px);
        box-shadow: 0 0 50px rgba(${C},0.1), 0 20px 40px rgba(0,0,0,0.3);
    }
    .svc-glass:hover::before {
        background: linear-gradient(160deg, rgba(${C},0.55) 0%, rgba(${C},0.18) 35%, transparent 60%, rgba(${C},0.12) 100%);
    }

    @keyframes svc-up {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .svc-r { animation: svc-up 0.7s cubic-bezier(.22,1,.36,1) both; }

    .svc-cta-pill {
        background: rgba(6,12,24,0.6);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        position: relative;
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .svc-cta-pill::before {
        content: '';
        position: absolute;
        inset: 0;
        padding: 1px;
        border-radius: inherit;
        background: linear-gradient(135deg, rgba(${C},0.45) 0%, rgba(${C},0.1) 40%, transparent 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
    }
    .svc-cta-pill:hover {
        transform: scale(1.03);
        box-shadow: 0 0 20px rgba(${C},0.2);
    }
`

export default function ServicesOverview({ services }: ServicesOverviewProps) {
    const sortedServices = [...services].sort((a, b) => {
        if (a.status === 'AVAILABLE' && b.status !== 'AVAILABLE') return -1
        if (a.status !== 'AVAILABLE' && b.status === 'AVAILABLE') return 1
        return 0
    })

    return (
        <>
            <style>{styles}</style>

            <section id="services" className="relative z-0 py-32 bg-[#030712] overflow-hidden">

                {/* Top separator glow */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${C},0.3), transparent)` }} />

                {/* 3D Dotted Surface wave background */}
                <DottedSurface className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none" />

                {/* Orbs */}
                <div className="absolute top-[15%] right-[10%] w-72 h-72 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `rgba(${C},0.04)` }} />
                <div className="absolute bottom-[15%] left-[8%] w-56 h-56 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: `rgba(${C},0.03)` }} />

                <div className="relative max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="svc-r flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-px w-10" style={{ background: `linear-gradient(90deg, #0066FF, transparent)` }} />
                                <span className="font-figtree text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: '#0066FF' }}>
                                    Nos Solutions
                                </span>
                            </div>
                            <h2 className="font-syne font-black text-white leading-tight">
                                <span className="block text-4xl md:text-5xl">Des outils taillés</span>
                                <span className="block text-4xl md:text-5xl" style={{ color: '#0066FF' }}>pour votre métier</span>
                            </h2>
                        </div>
                        <p className="font-figtree text-slate-400 text-[15px] leading-relaxed max-w-sm md:text-right">
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
                                    className="svc-glass svc-r rounded-2xl group"
                                    style={{ animationDelay: `${idx * 80}ms` }}
                                >
                                    {/* Number watermark */}
                                    <div className="absolute top-3 right-5 font-syne text-5xl font-black select-none pointer-events-none" style={{ color: `rgba(${C},0.04)` }}>
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>

                                    <div className="relative p-6">
                                        {/* Icon + status */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="p-2.5 rounded-xl"
                                                style={isAvailable ? {
                                                    backgroundColor: `rgba(${C},0.08)`,
                                                    color: '#0066FF',
                                                    boxShadow: `0 0 16px rgba(${C},0.08)`,
                                                } : {
                                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                                    color: '#475569',
                                                }}
                                            >
                                                {getServiceIcon(service.category)}
                                            </div>
                                            <span className={`font-figtree text-[11px] font-semibold px-2.5 py-1 rounded-full ${isAvailable
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : 'bg-white/3 text-slate-500'
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

                                        <h3 className={`font-syne font-bold text-[17px] mb-2 transition-colors duration-300 ${isAvailable ? 'text-white' : 'text-slate-400'}`}>
                                            {service.name}
                                        </h3>
                                        <p className="font-figtree text-[13px] text-slate-500 leading-relaxed mb-6 line-clamp-2">
                                            {service.description || 'Solution complète pour votre activité professionnelle.'}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid rgba(${C},0.06)` }}>
                                            {isAvailable ? (
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="font-syne text-2xl font-black text-white">{service.price?.toFixed(0) ?? '0'}</span>
                                                    <span className="font-figtree text-[12px] text-slate-500">MAD</span>
                                                </div>
                                            ) : (
                                                <span className="font-figtree text-[12px] text-slate-600">Lancement imminent</span>
                                            )}
                                            {isAvailable && (
                                                <Link href="#signup">
                                                    <button className="inline-flex items-center gap-1.5 font-figtree text-[12px] font-semibold transition-all duration-200 hover:gap-2" style={{ color: '#0066FF' }}>
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

                    {/* CTA pill */}
                    <div className="mt-14 flex justify-center">
                        <Link href="/services">
                            <button className="svc-cta-pill group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-figtree font-semibold text-[13px] text-white/80 hover:text-white">
                                Toutes les solutions
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
