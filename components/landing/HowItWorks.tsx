'use client'

import { Settings, Rocket, TrendingUp } from 'lucide-react'

const steps = [
    {
        number: '01',
        icon: Settings,
        title: 'Choisissez vos modules',
        description: 'Sélectionnez les solutions adaptées à votre activité. Chaque module est indépendant et activable en un clic depuis votre tableau de bord.',
        accent: 'cyan',
    },
    {
        number: '02',
        icon: Rocket,
        title: 'Configurez en 5 minutes',
        description: "Interface intuitive, zéro code. Notre équipe vous accompagne pour une intégration sans friction dans votre flux de travail.",
        accent: 'teal',
    },
    {
        number: '03',
        icon: TrendingUp,
        title: 'Scalez votre activité',
        description: 'Suivez vos performances en temps réel. Activez de nouveaux modules au fur et à mesure de la croissance de votre entreprise.',
        accent: 'sky',
    },
]

const tokens: Record<string, { icon: string; title: string; border: string; bg: string; num: string; line: string }> = {
    cyan: {
        icon: 'text-cyan-400',
        title: 'group-hover:text-cyan-300',
        border: 'group-hover:border-cyan-800/50',
        bg: 'bg-cyan-500/8 border-cyan-800/30',
        num: 'text-cyan-950/80',
        line: 'from-cyan-800/50',
    },
    teal: {
        icon: 'text-teal-400',
        title: 'group-hover:text-teal-300',
        border: 'group-hover:border-teal-800/50',
        bg: 'bg-teal-500/8 border-teal-800/30',
        num: 'text-teal-950/80',
        line: 'from-teal-800/50',
    },
    sky: {
        icon: 'text-sky-400',
        title: 'group-hover:text-sky-300',
        border: 'group-hover:border-sky-800/50',
        bg: 'bg-sky-500/8 border-sky-800/30',
        num: 'text-sky-950/80',
        line: 'from-sky-800/50',
    },
}

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative py-32 bg-[#030712] overflow-hidden">

            {/* Top separator */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-900/50 to-transparent" />

            {/* Center atmospheric glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-[350px] rounded-full bg-cyan-950/60 blur-[130px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <div className="flex items-center justify-center gap-3 mb-5">
                        <div className="h-px w-10 bg-cyan-400" />
                        <span className="font-figtree text-[11px] font-semibold text-cyan-400 uppercase tracking-[0.25em]">Comment ça marche</span>
                        <div className="h-px w-10 bg-cyan-400" />
                    </div>
                    <h2 className="font-syne font-black text-white leading-tight mb-4">
                        <span className="block text-4xl md:text-5xl">Opérationnel en</span>
                        <span className="block text-4xl md:text-5xl text-cyan-400">quelques minutes</span>
                    </h2>
                    <p className="font-figtree text-[16px] text-slate-400 leading-relaxed">
                        Pas de formation longue, pas de DSI nécessaire.
                        <br />Démarrez aujourd&apos;hui et gérez tout depuis un tableau de bord unifié.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">

                    {/* Horizontal connector line (desktop only) */}
                    <div className="hidden md:block absolute top-13 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px">
                        <div className="absolute inset-0 bg-linear-to-r from-cyan-800/60 via-teal-800/40 to-sky-800/60" />
                    </div>

                    {steps.map((step, i) => {
                        const c = tokens[step.accent]
                        const Icon = step.icon
                        return (
                            <div key={i} className="group relative">
                                <div className={`relative rounded-xl border border-white/5 ${c.border} bg-[#060c18] transition-all duration-300 p-8 h-full overflow-hidden hover:-translate-y-1`}>

                                    {/* Large background number */}
                                    <div className={`absolute -bottom-2 right-3 font-syne font-black text-[110px] leading-none select-none pointer-events-none ${c.num}`}>
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className={`relative z-10 inline-flex items-center justify-center h-12 w-12 rounded-xl border mb-6 ${c.bg}`}>
                                        <Icon className={`h-5 w-5 ${c.icon}`} />
                                    </div>

                                    {/* Step number label */}
                                    <div className={`font-syne text-[12px] font-black tracking-wider mb-3 ${c.icon}`}>
                                        STEP {step.number}
                                    </div>

                                    <h3 className={`font-syne font-bold text-[19px] text-white mb-3 ${c.title} transition-colors duration-300`}>
                                        {step.title}
                                    </h3>
                                    <p className="font-figtree text-[13px] text-slate-500 leading-relaxed relative z-10">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

