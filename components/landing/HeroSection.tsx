'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, ChevronRight, Activity, TrendingUp, Calendar, FileText } from 'lucide-react'

const stats = [
    { value: '500+', label: 'Entreprises' },
    { value: '99.9%', label: 'Disponibilité' },
    { value: '5 min', label: 'Configuration' },
    { value: '24/7', label: 'Support' },
]

const features = [
    { label: 'Rendez-vous', icon: Calendar },
    { label: 'Facturation', icon: FileText },
    { label: 'Dossiers médicaux', icon: Activity },
    { label: 'Commandes', icon: TrendingUp },
]

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#030712]">

            {/* Dot grid background */}
            <div className="absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundImage: 'radial-gradient(rgba(34,211,238,0.3) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }} />

            {/* Atmospheric radial glows */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(6,182,212,0.09),transparent)]" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-[#030712] to-transparent" />

            {/* Floating orbs */}
            <div
                className="absolute top-[20%] right-[10%] w-105 h-105 rounded-full bg-cyan-500/5 blur-[110px] pointer-events-none animate-float"
                style={{ animationDuration: '9s' }}
            />
            <div
                className="absolute bottom-[15%] left-[5%] w-70 h-70 rounded-full bg-teal-400/4 blur-[90px] pointer-events-none animate-float"
                style={{ animationDuration: '13s', animationDirection: 'reverse' }}
            />

            {/* Top beam line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/40 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16">
                <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

                    {/* ——— Left: Text ——— */}
                    <div>
                        {/* Eyebrow */}
                        <div className="flex items-center gap-3 mb-9">
                            <div className="h-px w-10 bg-cyan-400" />
                            <span className="font-figtree text-[11px] font-semibold text-cyan-400 uppercase tracking-[0.25em]">
                                Plateforme SaaS B2B · Maroc
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="font-syne font-black leading-[0.9] tracking-tight mb-8">
                            <span className="block text-5xl md:text-6xl xl:text-[72px] text-white">GÉREZ</span>
                            <span className="block text-5xl md:text-6xl xl:text-[72px] bg-linear-to-r from-cyan-300 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                                VOTRE
                            </span>
                            <span className="block text-5xl md:text-6xl xl:text-[72px] text-white">BUSINESS</span>
                        </h1>

                        {/* Subtext */}
                        <p className="font-figtree text-[17px] text-slate-400 leading-relaxed max-w-105 mb-9">
                            FirstStep centralise la gestion de votre entreprise — cabinet, restaurant, commerce. Un seul outil, zéro friction.
                        </p>

                        {/* Feature tags */}
                        <div className="flex flex-wrap gap-2 mb-10">
                            {features.map((f, i) => {
                                const Icon = f.icon
                                return (
                                    <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-cyan-800/50 bg-cyan-950/40 text-[12px] font-figtree font-medium text-cyan-300">
                                        <Icon className="h-3 w-3" />
                                        {f.label}
                                    </span>
                                )
                            })}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start mb-5">
                            <Link href="#signup">
                                <button className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-syne font-bold text-[14px] rounded-xl transition-all duration-300 shadow-[0_0_35px_rgba(34,211,238,0.28)] hover:shadow-[0_0_50px_rgba(34,211,238,0.45)]">
                                    Démarrer gratuitement
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                                </button>
                            </Link>
                            <Link href="#services">
                                <button className="inline-flex items-center gap-2 px-7 py-3.5 font-figtree font-semibold text-[14px] text-slate-300 hover:text-white border border-white/8 hover:border-cyan-800/60 rounded-xl transition-all duration-300 hover:bg-cyan-950/20">
                                    Voir les solutions
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>
                        <p className="font-figtree text-[11px] text-slate-600">Aucune carte bancaire · Configuration en 5 minutes</p>
                    </div>

                    {/* ——— Right: Dashboard mockup (pure CSS) ——— */}
                    <div className="relative hidden lg:block">
                        {/* Outer glow */}
                        <div className="absolute -inset-6 rounded-3xl bg-cyan-500/5 blur-2xl" />

                        {/* Main card */}
                        <div className="relative rounded-2xl border border-cyan-900/40 bg-[#060f1e]/95 backdrop-blur-sm overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.05)]">

                            {/* Browser top bar */}
                            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5 bg-[#030a14]">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                                </div>
                                <div className="flex-1 mx-3 h-5 rounded-md bg-white/4 flex items-center px-3">
                                    <span className="font-figtree text-[10px] text-slate-600">firststepco.com/dashboard</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="font-figtree text-[10px] text-emerald-400">Live</span>
                                </div>
                            </div>

                            {/* Dashboard content */}
                            <div className="p-5 space-y-4">

                                {/* Stat cards */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Revenus', value: '48 250', unit: 'MAD', color: 'text-cyan-400', trend: '+12%' },
                                        { label: 'Rendez-vous', value: '127', unit: 'cette semaine', color: 'text-emerald-400', trend: '+8%' },
                                        { label: 'Clients', value: '1 842', unit: 'actifs', color: 'text-violet-400', trend: '+5%' },
                                    ].map((card, i) => (
                                        <div key={i} className="rounded-xl bg-white/3 border border-white/5 p-3">
                                            <div className="font-figtree text-[10px] text-slate-500 mb-1.5">{card.label}</div>
                                            <div className={`font-syne font-bold text-[15px] ${card.color}`}>{card.value}</div>
                                            <div className="font-figtree text-[9px] text-slate-600 mt-0.5">{card.unit}</div>
                                            <div className="font-figtree text-[9px] text-emerald-400 mt-1.5">↑ {card.trend}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bar chart */}
                                <div className="rounded-xl bg-white/3 border border-white/5 p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-figtree text-[11px] font-medium text-slate-400">Activité mensuelle</span>
                                        <span className="font-syne text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">2026</span>
                                    </div>
                                    <div className="flex items-end gap-1 h-16">
                                        {[35, 58, 42, 75, 50, 88, 65, 80, 55, 92, 70, 95].map((h, i) => (
                                            <div key={i} className="flex-1" style={{ height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                                                <div
                                                    className="w-full rounded-t-[2px]"
                                                    style={{
                                                        height: `${h}%`,
                                                        background: i === 11
                                                            ? 'linear-gradient(to top, rgba(34,211,238,0.9), rgba(34,211,238,0.4))'
                                                            : i >= 9
                                                            ? 'rgba(34,211,238,0.15)'
                                                            : 'rgba(255,255,255,0.05)',
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Activity feed */}
                                <div className="rounded-xl bg-white/3 border border-white/5 p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-figtree text-[11px] font-medium text-slate-400">Activité récente</span>
                                        <span className="font-figtree text-[10px] text-slate-600">Temps réel</span>
                                    </div>
                                    <div className="space-y-2.5">
                                        {[
                                            { name: 'RDV — Dr. Amrani', time: '2 min', status: 'Confirmé', cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-800/40' },
                                            { name: 'Facture #1042 émise', time: '18 min', status: 'Payée', cls: 'text-cyan-400 bg-cyan-500/10 border-cyan-800/40' },
                                            { name: 'Commande Table 5', time: '41 min', status: 'En cours', cls: 'text-amber-400 bg-amber-500/10 border-amber-800/40' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-figtree text-[11px] text-slate-300 font-medium">{item.name}</div>
                                                    <div className="font-figtree text-[10px] text-slate-600">Il y a {item.time}</div>
                                                </div>
                                                <span className={`font-figtree text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.cls}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating status badge */}
                        <div className="absolute -top-4 -right-5 rounded-xl border border-cyan-800/50 bg-[#060f1e] px-4 py-2.5 shadow-xl shadow-black/50">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-figtree text-[11px] font-semibold text-white">Système opérationnel</span>
                            </div>
                        </div>

                        {/* Bottom decorative line */}
                        <div className="absolute -bottom-5 left-8 right-8 h-px bg-linear-to-r from-transparent via-cyan-500/25 to-transparent" />
                    </div>
                </div>

                {/* ——— Stats bar ——— */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 overflow-hidden rounded-2xl border border-cyan-900/30 bg-[#060c18]/50">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className={`flex flex-col items-center justify-center py-7 px-6 hover:bg-cyan-950/30 transition-colors duration-300 group
                                ${i < 3 ? 'md:border-r border-cyan-900/20' : ''}
                                ${i < 2 ? 'border-b md:border-b-0 border-cyan-900/20' : ''}
                            `}
                        >
                            <span className="font-syne text-3xl font-black text-white mb-0.5 group-hover:text-cyan-300 transition-colors duration-300">
                                {stat.value}
                            </span>
                            <span className="font-figtree text-[11px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
