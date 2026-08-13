'use client'

import { Settings, Rocket, TrendingUp, Sparkles, Check } from 'lucide-react'
import SpotlightBackground from '@/components/ui/spotlight-background'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

const steps = [
    {
        number: '01',
        icon: Settings,
        title: 'Choisissez vos modules',
        description: 'Sélectionnez les solutions adaptées à votre activité. Chaque module est indépendant et activable en un clic depuis votre tableau de bord.',
    },
    {
        number: '02',
        icon: Rocket,
        title: 'Configurez en 5 minutes',
        description: "Interface intuitive, zéro code. Notre équipe vous accompagne pour une intégration sans friction dans votre flux de travail.",
    },
    {
        number: '03',
        icon: TrendingUp,
        title: 'Scalez votre activité',
        description: 'Suivez vos performances en temps réel. Activez de nouveaux modules au fur et à mesure de la croissance de votre entreprise.',
    },
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative bg-[#FAFBFD] text-slate-900 overflow-hidden">
            <SpotlightBackground>
                {/* Top border */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-36">

                    {/* Header */}
                    <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
                            <Sparkles className="h-3.5 w-3.5 text-[#0066FF]" />
                            <span className="font-figtree text-[11px] font-bold uppercase tracking-[0.2em] text-[#0066FF]">
                                Comment ça marche
                            </span>
                        </div>
                        <h2 className="font-syne font-black text-slate-900 leading-tight mb-4">
                            <span className="block text-3xl md:text-5xl">Opérationnel en</span>
                            <span className="block text-3xl md:text-5xl text-[#0066FF]">quelques minutes</span>
                        </h2>
                        <p className="font-figtree text-[15px] text-slate-600 leading-relaxed">
                            Pas de formation longue, pas de DSI nécessaire.
                            <br />Démarrez aujourd&apos;hui et gérez tout depuis un tableau de bord unifié.
                        </p>
                    </ScrollReveal>

                    {/* Timeline Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

                        {/* Connector timeline line (desktop) */}
                        <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-200 via-[#0066FF] to-blue-200 z-0" />

                        {steps.map((step, i) => {
                            const Icon = step.icon
                            return (
                                <ScrollReveal
                                    key={i}
                                    delay={i * 120}
                                    direction="up"
                                    className="relative z-10"
                                >
                                    <div className="group relative rounded-3xl p-8 bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col justify-between overflow-hidden">
                                        
                                        {/* Big watermark background number */}
                                        <div className="absolute -bottom-4 -right-2 font-syne font-black text-[100px] leading-none text-slate-100 select-none pointer-events-none group-hover:text-blue-50 transition-colors">
                                            {step.number}
                                        </div>

                                        <div>
                                            {/* Step header: icon + badge */}
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF] shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <span className="font-syne text-[11px] font-extrabold uppercase tracking-widest text-[#0066FF] bg-blue-50/80 px-3 py-1 rounded-full border border-blue-100">
                                                    Étape {step.number}
                                                </span>
                                            </div>

                                            <h3 className="font-syne font-bold text-xl text-slate-900 mb-3 relative z-10 group-hover:text-[#0066FF] transition-colors">
                                                {step.title}
                                            </h3>
                                            <p className="font-figtree text-[13.5px] text-slate-600 leading-relaxed relative z-10 mb-6">
                                                {step.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1.5 font-figtree text-[12px] font-semibold text-emerald-600 pt-4 border-t border-slate-100">
                                            <Check className="h-4 w-4" />
                                            Garantie 0 effort
                                        </div>
                                    </div>
                                </ScrollReveal>
                            )
                        })}
                    </div>
                </div>
            </SpotlightBackground>
        </section>
    )
}
