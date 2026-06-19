'use client'

import { Settings, Rocket, TrendingUp } from 'lucide-react'
import SpotlightBackground from '@/components/ui/spotlight-background'

const C = '0, 102, 255'

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

const styles = `
    .how-glass {
        background: rgba(6,12,24,0.65);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        position: relative;
        overflow: hidden;
        transition: transform 0.35s ease, box-shadow 0.35s ease;
    }
    .how-glass::before {
        content: '';
        position: absolute;
        inset: 0;
        padding: 1px;
        border-radius: inherit;
        background: linear-gradient(180deg, rgba(${C},0.4) 0%, rgba(${C},0.1) 25%, transparent 50%, rgba(${C},0.05) 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        transition: background 0.35s ease;
    }
    .how-glass:hover {
        transform: translateY(-6px);
        box-shadow: 0 0 60px rgba(${C},0.1), 0 24px 48px rgba(0,0,0,0.35);
    }
    .how-glass:hover::before {
        background: linear-gradient(180deg, rgba(${C},0.6) 0%, rgba(${C},0.2) 25%, transparent 55%, rgba(${C},0.1) 100%);
    }

    @keyframes how-up {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .how-r { animation: how-up 0.8s cubic-bezier(.22,1,.36,1) both; }
    .how-d1 { animation-delay: 100ms; }
    .how-d2 { animation-delay: 220ms; }
    .how-d3 { animation-delay: 340ms; }

    @keyframes travel {
        0%   { left: 0%; opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 1; }
        100% { left: 100%; opacity: 0; }
    }
`

export default function HowItWorks() {
    return (
        <>
            <style>{styles}</style>

            <section id="how-it-works" className="relative bg-[#030712] overflow-hidden">
                <SpotlightBackground>
                    {/* Top separator */}
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${C},0.3), transparent)` }} />

                    <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">

                        {/* Header */}
                        <div className="how-r text-center max-w-2xl mx-auto mb-12 md:mb-20">
                            <div className="flex items-center justify-center gap-3 mb-5">
                                <div className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, #0066FF)` }} />
                                <span className="font-figtree text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: '#0066FF' }}>Comment ça marche</span>
                                <div className="h-px w-10" style={{ background: `linear-gradient(90deg, #0066FF, transparent)` }} />
                            </div>
                            <h2 className="font-syne font-black text-white leading-tight mb-4">
                                <span className="block text-3xl md:text-5xl">Opérationnel en</span>
                                <span className="block text-3xl md:text-5xl" style={{ color: '#0066FF' }}>quelques minutes</span>
                            </h2>
                            <p className="font-figtree text-[14px] md:text-[15px] text-slate-400 leading-relaxed">
                                Pas de formation longue, pas de DSI nécessaire.
                                <br />Démarrez aujourd&apos;hui et gérez tout depuis un tableau de bord unifié.
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">

                            {/* Connector line (desktop) */}
                            <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px">
                                <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, rgba(${C},0.35), rgba(${C},0.15), rgba(${C},0.35))` }} />
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor: '#0066FF',
                                        boxShadow: `0 0 8px rgba(${C},0.8)`,
                                        animation: 'travel 3s ease-in-out infinite',
                                    }}
                                />
                            </div>

                            {steps.map((step, i) => {
                                const Icon = step.icon
                                const delays = ['how-d1', 'how-d2', 'how-d3']
                                return (
                                    <div key={i} className={`how-r ${delays[i]}`}>
                                        <div className="how-glass rounded-2xl p-6 md:p-8 h-full">

                                            {/* Big background number */}
                                            <div className="absolute -bottom-2 right-3 font-syne font-black text-[80px] md:text-[110px] leading-none select-none pointer-events-none" style={{ color: `rgba(${C},0.04)` }}>
                                                {step.number}
                                            </div>

                                            {/* Icon */}
                                            <div className="relative z-10 inline-flex items-center justify-center h-12 w-12 rounded-xl mb-6"
                                                style={{
                                                    backgroundColor: `rgba(${C},0.07)`,
                                                    boxShadow: `0 0 20px rgba(${C},0.08), inset 0 1px 1px rgba(${C},0.12)`,
                                                }}
                                            >
                                                <Icon className="h-5 w-5" style={{ color: '#0066FF' }} />
                                            </div>

                                            {/* Step label */}
                                            <div className="font-syne text-[11px] font-black tracking-wider mb-3" style={{ color: `rgba(${C},0.5)` }}>
                                                STEP {step.number}
                                            </div>

                                            <h3 className="font-syne font-bold text-[19px] text-white mb-3 relative z-10">
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
                </SpotlightBackground>
            </section>
        </>
    )
}
