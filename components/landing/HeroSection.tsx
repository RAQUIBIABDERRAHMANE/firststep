'use client'

import Link from 'next/link'
import { ArrowRight, ChevronRight, Activity, TrendingUp, Calendar, FileText, Zap, Shield, BarChart3, Users } from 'lucide-react'
import { useEffect, useRef } from 'react'

// Custom element interface for spline-viewer
interface SplineViewerElement extends HTMLElement {
    url: string;
}

// Spline Viewer Component (earth background)
const SplineViewer = ({ url, className }: { url: string; className?: string }) => {
    const viewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewerRef.current && typeof window !== 'undefined') {
            const splineViewer = document.createElement('spline-viewer') as SplineViewerElement;
            splineViewer.setAttribute('url', url);
            splineViewer.style.width = '100%';
            splineViewer.style.height = '100%';
            viewerRef.current.innerHTML = '';
            viewerRef.current.appendChild(splineViewer);
        }
    }, [url]);

    return <div ref={viewerRef} className={className} />;
};

const ticker = [
    { icon: Calendar, label: 'Rendez-vous' },
    { icon: FileText, label: 'Facturation' },
    { icon: Activity, label: 'Dossiers médicaux' },
    { icon: TrendingUp, label: 'Commandes' },
    { icon: Zap, label: 'Automatisation' },
    { icon: Shield, label: 'Sécurité' },
    { icon: BarChart3, label: 'Analytiques' },
    { icon: Users, label: 'Multi-équipes' },
    // duplicated for seamless loop
    { icon: Calendar, label: 'Rendez-vous' },
    { icon: FileText, label: 'Facturation' },
    { icon: Activity, label: 'Dossiers médicaux' },
    { icon: TrendingUp, label: 'Commandes' },
    { icon: Zap, label: 'Automatisation' },
    { icon: Shield, label: 'Sécurité' },
    { icon: BarChart3, label: 'Analytiques' },
    { icon: Users, label: 'Multi-équipes' },
]

const stats = [
    { value: '500+', label: 'Entreprises actives' },
    { value: '99.9%', label: 'Disponibilité' },
    { value: '5 min', label: 'Pour démarrer' },
    { value: '24/7', label: 'Support dédié' },
]

export default function HeroSection() {
    return (
        <>
            <style>{`
                @keyframes hero-fade-up {
                    from { opacity: 0; transform: translateY(32px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes ticker-scroll {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                @keyframes shimmer-sweep {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes border-spin {
                    from { --angle: 0deg; }
                    to   { --angle: 360deg; }
                }
                .hero-fade-up { animation: hero-fade-up 0.8s cubic-bezier(.22,1,.36,1) both; }
                .delay-100  { animation-delay: 100ms; }
                .delay-200  { animation-delay: 200ms; }
                .delay-300  { animation-delay: 300ms; }
                .delay-400  { animation-delay: 400ms; }
                .delay-500  { animation-delay: 500ms; }
                .delay-600  { animation-delay: 600ms; }
                .delay-700  { animation-delay: 700ms; }

                .ticker-track { animation: ticker-scroll 28s linear infinite; }
                .ticker-track:hover { animation-play-state: paused; }

                .shimmer-text {
                    background: linear-gradient(
                        105deg,
                        #67e8f9 0%,
                        #22d3ee 30%,
                        #fff    48%,
                        #22d3ee 65%,
                        #2dd4bf 100%
                    );
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer-sweep 4s linear infinite;
                    animation-delay: 1.2s;
                }

                .glow-btn {
                    position: relative;
                    isolation: isolate;
                }
                .glow-btn::before {
                    content: '';
                    position: absolute;
                    inset: -1px;
                    border-radius: inherit;
                    background: linear-gradient(135deg, #22d3ee, #2dd4bf, #0e7490);
                    z-index: -1;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .glow-btn:hover::before { opacity: 1; }

                .stat-card {
                    position: relative;
                    overflow: hidden;
                }
                .stat-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse at 50% 0%, rgba(34,211,238,0.08), transparent 70%);
                    opacity: 0;
                    transition: opacity 0.4s;
                }
                .stat-card:hover::before { opacity: 1; }
            `}</style>

            <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#030712]">

                {/* ── Earth 3D background ── */}
                <div className="absolute inset-0 z-0 opacity-70">
                    <SplineViewer
                        url="https://prod.spline.design/od8-AWHzyTVZSddI/scene.splinecode"
                        className="w-full h-full"
                    />
                </div>

                {/* ── Layered atmospheric overlays ── */}
                <div className="absolute inset-0 z-[1] bg-[#030712]/55" />
                {/* Top vignette */}
                <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(6,182,212,0.13),transparent)]" />
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-2/5 z-[2] bg-linear-to-t from-[#030712] to-transparent" />
                {/* Dot matrix */}
                <div
                    className="absolute inset-0 z-[2] opacity-[0.22]"
                    style={{
                        backgroundImage: 'radial-gradient(rgba(34,211,238,0.35) 1px, transparent 1px)',
                        backgroundSize: '44px 44px',
                    }}
                />

                {/* ── Ambient orbs ── */}
                <div className="absolute top-[18%] left-[12%] w-96 h-96 rounded-full bg-cyan-500/6 blur-[120px] pointer-events-none z-[2] animate-float" style={{ animationDuration: '11s' }} />
                <div className="absolute bottom-[20%] right-[8%] w-72 h-72 rounded-full bg-teal-400/5 blur-[100px] pointer-events-none z-[2] animate-float" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                <div className="absolute top-[50%] left-[45%] w-56 h-56 rounded-full bg-cyan-600/4 blur-[80px] pointer-events-none z-[2] animate-float" style={{ animationDuration: '8s' }} />

                {/* ── Top beam ── */}
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent z-[3]" />

                {/* ════════════════════════════════
                    HERO CONTENT
                ════════════════════════════════ */}
                <div className="relative z-20 max-w-5xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">

                    {/* Eyebrow pill */}
                    <div className="hero-fade-up delay-100 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-700/40 bg-cyan-950/35 backdrop-blur-sm mb-10">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="font-figtree text-[11px] font-semibold text-cyan-300 uppercase tracking-[0.22em]">
                            Plateforme SaaS B2B · Maroc
                        </span>
                    </div>

                    {/* ── Headline ── */}
                    <h1 className="hero-fade-up delay-200 font-syne font-black leading-[0.88] tracking-tight mb-8 drop-shadow-xl">
                        {/* Line 1 */}
                        <span className="block text-[clamp(3.2rem,9vw,7rem)] text-white">
                            GÉREZ
                        </span>
                        {/* Line 2 — shimmer */}
                        <span className="block text-[clamp(3.2rem,9vw,7rem)] shimmer-text">
                            VOTRE
                        </span>
                        {/* Line 3 */}
                        <span className="block text-[clamp(3.2rem,9vw,7rem)] text-white">
                            BUSINESS.
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="hero-fade-up delay-300 font-figtree text-[17px] md:text-[19px] text-slate-400 leading-relaxed max-w-2xl mb-10">
                        FirstStep centralise la gestion de votre entreprise —{' '}
                        <span className="text-slate-300">cabinet, restaurant, commerce</span>.
                        Un seul outil, zéro friction.
                    </p>

                    {/* CTAs */}
                    <div className="hero-fade-up delay-400 flex flex-col sm:flex-row gap-3 items-center justify-center mb-4">
                        <Link href="#signup">
                            <button className="glow-btn group inline-flex items-center gap-2.5 px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-syne font-bold text-[14px] rounded-xl transition-all duration-300 shadow-[0_0_40px_rgba(34,211,238,0.32)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] hover:scale-[1.02]">
                                Démarrer gratuitement
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </button>
                        </Link>
                        <Link href="#services">
                            <button className="inline-flex items-center gap-2 px-8 py-4 font-figtree font-semibold text-[14px] text-slate-300 hover:text-white border border-white/10 hover:border-cyan-700/60 rounded-xl transition-all duration-300 hover:bg-cyan-950/25 backdrop-blur-sm">
                                Voir les solutions
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </Link>
                    </div>
                    <p className="hero-fade-up delay-500 font-figtree text-[11px] text-slate-600 mb-16">
                        Aucune carte bancaire · Configuration en 5 minutes
                    </p>

                    {/* ── Stats bar ── */}
                    <div className="hero-fade-up delay-600 w-full grid grid-cols-2 md:grid-cols-4 overflow-hidden rounded-2xl border border-cyan-900/30 bg-[#060c18]/75 backdrop-blur-md">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className={`stat-card flex flex-col items-center justify-center py-7 px-6 transition-colors duration-300 group cursor-default
                                    ${i < 3 ? 'md:border-r border-cyan-900/20' : ''}
                                    ${i < 2 ? 'border-b md:border-b-0 border-cyan-900/20' : ''}
                                `}
                            >
                                <span className="font-syne text-3xl font-black text-white mb-0.5 group-hover:text-cyan-300 transition-colors duration-300">
                                    {stat.value}
                                </span>
                                <span className="font-figtree text-[11px] text-slate-500 uppercase tracking-wider">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════════
                    FEATURE TICKER (bottom strip)
                ══════════════════════════════════ */}
                <div className="relative z-20 border-t border-cyan-900/25 bg-[#020810]/60 backdrop-blur-sm overflow-hidden py-4">
                    {/* fade masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-[#020810] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-[#020810] to-transparent z-10 pointer-events-none" />

                    <div className="ticker-track flex items-center gap-0 whitespace-nowrap will-change-transform">
                        {ticker.map((item, i) => {
                            const Icon = item.icon
                            return (
                                <span key={i} className="inline-flex items-center gap-2 px-7 text-[12px] font-figtree font-medium text-slate-500 uppercase tracking-widest border-r border-cyan-900/20 hover:text-cyan-400 transition-colors duration-200 cursor-default">
                                    <Icon className="h-3.5 w-3.5 text-cyan-700 shrink-0" />
                                    {item.label}
                                </span>
                            )
                        })}
                    </div>
                </div>

            </section>
        </>
    )
}
