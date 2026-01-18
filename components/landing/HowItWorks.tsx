'use client'

import { CheckCircle2, ArrowRight, Rocket, Settings, TrendingUp } from 'lucide-react'

export default function HowItWorks() {
    const steps = [
        {
            number: '01',
            icon: <Settings className="h-6 w-6" />,
            title: 'Choisissez vos services',
            description: 'Sélectionnez parmi notre gamme de solutions modulaires adaptées à vos besoins spécifiques.'
        },
        {
            number: '02',
            icon: <Rocket className="h-6 w-6" />,
            title: 'Configuration rapide',
            description: 'Notre équipe vous aide à intégrer les systèmes de manière fluide dans votre flux de travail.'
        },
        {
            number: '03',
            icon: <TrendingUp className="h-6 w-6" />,
            title: 'Évoluez & Grandissez',
            description: 'Concentrez-vous sur l\'essentiel — vos clients — pendant que nos systèmes gèrent le reste.'
        }
    ]

    return (
        <section id="how-it-works" className="py-32 relative overflow-hidden bg-slate-950">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-medium text-violet-300 mb-6">
                        <CheckCircle2 className="h-4 w-4" />
                        Simple & Efficace
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Comment ça <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">marche</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Commencer avec FirstStep est simple, rapide et conçu pour minimiser les perturbations.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[4rem] left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

                    {steps.map((step, index) => (
                        <div 
                            key={index} 
                            className="relative group"
                        >
                            {/* Card */}
                            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-8 hover:bg-white/[0.04] hover:border-violet-500/20 transition-all duration-500 hover:-translate-y-2">
                                {/* Step Number */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 group-hover:scale-110 transition-all duration-300">
                                        {step.icon}
                                    </div>
                                    <span className="text-5xl font-bold text-white/5 group-hover:text-violet-500/20 transition-colors">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed">
                                    {step.description}
                                </p>

                                {/* Arrow (not on last item) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                                        <div className="h-8 w-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                                            <ArrowRight className="h-4 w-4 text-violet-400" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
