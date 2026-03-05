'use client'

import { Settings, Rocket, TrendingUp } from 'lucide-react'

const steps = [
    {
        number: '01',
        icon: Settings,
        title: 'Choisissez vos modules',
        description: 'Sélectionnez les solutions adaptées à votre activité parmi notre catalogue. Chaque module est indépendant.',
        color: 'blue',
    },
    {
        number: '02',
        icon: Rocket,
        title: 'Configurez en 5 minutes',
        description: 'Interface intuitive, zéro code. Notre équipe vous accompagne pour une intégration sans friction.',
        color: 'violet',
    },
    {
        number: '03',
        icon: TrendingUp,
        title: 'Évoluez et grandissez',
        description: 'Suivez vos performances en temps réel. Activez de nouveaux modules au fur et à mesure de votre croissance.',
        color: 'indigo',
    },
]

const colorMap: Record<string, { bg: string; text: string; ring: string; lineFrom: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'ring-blue-500/20', lineFrom: 'from-blue-500/40' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', ring: 'ring-violet-500/20', lineFrom: 'from-violet-500/40' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', ring: 'ring-indigo-500/20', lineFrom: 'from-indigo-500/40' },
}

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative py-32 bg-[#050914] overflow-hidden">
            {/* Subtle separator */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            {/* Center glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Header — centered */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        Comment ça marche
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                        Opérationnel en{' '}
                        <span className="text-blue-400">quelques minutes</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Pas de formation longue, pas de DSI nécessaire. Démarrez aujourd'hui.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connector line */}
                    <div className="hidden md:block absolute top-14 left-[16.67%] right-[16.67%] h-px">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-indigo-500/30" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-500" />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-violet-500" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-indigo-500" />
                    </div>

                    {steps.map((step, i) => {
                        const c = colorMap[step.color]
                        const Icon = step.icon
                        return (
                            <div key={i} className="group relative">
                                <div className="bg-[#0a1628]/80 border border-white/[0.07] rounded-2xl p-8 h-full hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300">
                                    {/* Icon + Number row */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`h-12 w-12 rounded-xl ${c.bg} ${c.text} ring-1 ${c.ring} flex items-center justify-center`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <span className="text-5xl font-black text-white/[0.05] group-hover:text-white/[0.08] transition-colors select-none">
                                            {step.number}
                                        </span>
                                    </div>
                                    <h3 className={`text-lg font-bold text-white mb-3 group-hover:${c.text} transition-colors`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
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
