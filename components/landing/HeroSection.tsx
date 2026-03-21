'use client'

import Link from 'next/link'
import { ArrowRight, ChevronRight, Activity, TrendingUp, Calendar, FileText } from 'lucide-react'
import { useEffect, useRef } from 'react'

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

// Custom element interface for spline-viewer
interface SplineViewerElement extends HTMLElement {
    url: string;
}

// Spline Viewer Component (for earth background)
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

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#030712]">

            {/* Earth 3D Background */}
            <div className="absolute inset-0 z-0">
                <SplineViewer
                    url="https://prod.spline.design/od8-AWHzyTVZSddI/scene.splinecode"
                    className="w-full h-full"
                />
            </div>

            {/* Background overlay for better text readability */}
            <div className="absolute inset-0 z-5 bg-[#030712]/40" />

            {/* Dot grid background */}
            <div className="absolute inset-0 opacity-[0.35] z-5"
                style={{
                    backgroundImage: 'radial-gradient(rgba(34,211,238,0.3) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }} />

            {/* Atmospheric radial glows */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(6,182,212,0.09),transparent)] z-5" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-[#030712] to-transparent z-5" />

            {/* Floating orbs */}
            <div
                className="absolute top-[20%] right-[10%] w-105 h-105 rounded-full bg-cyan-500/5 blur-[110px] pointer-events-none animate-float z-5"
                style={{ animationDuration: '9s' }}
            />
            <div
                className="absolute bottom-[15%] left-[5%] w-70 h-70 rounded-full bg-teal-400/4 blur-[90px] pointer-events-none animate-float z-5"
                style={{ animationDuration: '13s', animationDirection: 'reverse' }}
            />

            {/* Top beam line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/40 to-transparent z-5" />

            <div className="relative z-20 max-w-7xl mx-auto px-6 pt-28 pb-16">
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
                        <h1 className="font-syne font-black leading-[0.9] tracking-tight mb-8 drop-shadow-lg">
                            <span className="block text-5xl md:text-6xl xl:text-[72px] text-white">GÉREZ</span>
                            <span className="block text-5xl md:text-6xl xl:text-[72px] bg-linear-to-r from-cyan-300 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                                VOTRE
                            </span>
                            <span className="block text-5xl md:text-6xl xl:text-[72px] text-white">BUSINESS</span>
                        </h1>

                        {/* Subtext */}
                        <p className="font-figtree text-[17px] text-slate-400 leading-relaxed max-w-105 mb-9 drop-shadow-sm">
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

                    {/* ——— Right: 3D FIRST STEP Scene ——— */}
                    <div className="relative hidden lg:block">
                        <div className="relative rounded-2xl overflow-hidden h-[500px]">
                            <iframe
                                src="https://my.spline.design/zoomglasscopycopy-2Z8PrzwTZzjttqKQsMeELYLM-c6s/"
                                frameBorder="0"
                                width="100%"
                                height="100%"
                                className="absolute inset-0 w-full h-full"
                                style={{ border: 'none' }}
                                allow="autoplay"
                            />
                        </div>
                    </div>
                </div>

                {/* ——— Stats bar ——— */}
                <div className="relative z-20 mt-20 grid grid-cols-2 md:grid-cols-4 overflow-hidden rounded-2xl border border-cyan-900/30 bg-[#060c18]/80 backdrop-blur-sm">
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
