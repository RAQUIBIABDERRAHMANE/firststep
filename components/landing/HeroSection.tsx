'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, CheckCircle, TrendingUp, Users, Zap } from 'lucide-react'

const stats = [
    { value: '500+', label: 'Entreprises actives' },
    { value: '99.9%', label: 'Disponibilité' },
    { value: '< 5min', label: 'Configuration' },
    { value: '24/7', label: 'Support dédié' },
]

const badges = [
    'Gestion des rendez-vous',
    'Facturation intelligente',
    'Dossiers médicaux',
    'Commandes restaurant',
]

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#050914]">
            {/* Grid background */}
            <div className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                    backgroundSize: '72px 72px',
                }} />

            {/* Radial fade on grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.15),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(124,58,237,0.08),transparent)]" />

            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-8">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                        Plateforme SaaS B2B — Maroc
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                        Gérez votre{' '}
                        <span className="relative inline-block">
                            <span className="bg-linear-to-r from-blue-400 via-blue-300 to-violet-400 bg-clip-text text-transparent">
                                entreprise
                            </span>
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 9C50 3 100 1 150 3C200 5 250 8 298 6" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="underline-grad" x1="0" y1="0" x2="300" y2="0">
                                        <stop stopColor="#3b82f6" />
                                        <stop offset="1" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>{' '}
                        avec un seul outil
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
                        FirstStep centralise la gestion de votre cabinet, restaurant ou commerce. Activez uniquement ce dont vous avez besoin.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-2 justify-center mb-10">
                        {badges.map((b, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/4 border border-white/8 text-sm text-slate-300">
                                <CheckCircle className="h-3.5 w-3.5 text-blue-400" />
                                {b}
                            </span>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <Link href="#signup">
                            <Button size="lg" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 h-13 rounded-xl shadow-2xl shadow-blue-600/30 text-base">
                                Démarrer gratuitement
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="#services">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold px-8 h-13 rounded-xl border-white/10 bg-white/3 hover:bg-white/[7%] text-white text-base">
                                Voir les solutions
                            </Button>
                        </Link>
                    </div>

                    <p className="text-xs text-slate-600">Aucune carte bancaire requise • Configuration en 5 minutes</p>
                </div>

                {/* Stats bar */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/6 rounded-2xl overflow-hidden border border-white/6">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center justify-center py-8 px-6 bg-[#050914] hover:bg-white/2 transition-colors">
                            <span className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</span>
                            <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
