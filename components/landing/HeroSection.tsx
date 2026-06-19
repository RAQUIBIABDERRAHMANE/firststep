'use client'

import Link from 'next/link'
import { useState, useTransition, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { signUp } from '@/app/actions/auth'
import Spline from '@splinetool/react-spline'
import {
    Download,
    Wand2,
    Activity,
    TrendingUp,
    BarChart3,
    Shield,
    Sparkles,
    ArrowRight,
    ChevronRight,
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react'

/* ─── Brand color: #0066FF → rgb(0, 102, 255) ─────────────────────── */
const C = '0, 102, 255'

const heroStyles = `
    /* ── Liquid Glass – Light ── */
    .lg-pill {
        background: rgba(255,255,255,0.04);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        position: relative;
        overflow: hidden;
    }
    .lg-pill::before {
        content: '';
        position: absolute;
        inset: 0;
        padding: 1px;
        border-radius: inherit;
        background: linear-gradient(180deg, rgba(${C},0.5) 0%, rgba(${C},0.1) 30%, transparent 50%, rgba(${C},0.1) 80%, rgba(${C},0.4) 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
    }

    /* ── Liquid Glass – Strong ── */
    .lg-strong {
        background: rgba(3,7,18,0.55);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        position: relative;
        overflow: hidden;
        box-shadow: 4px 4px 20px rgba(0,0,0,0.2), inset 0 1px 1px rgba(${C},0.15);
    }
    .lg-strong::before {
        content: '';
        position: absolute;
        inset: 0;
        padding: 1px;
        border-radius: inherit;
        background: linear-gradient(135deg, rgba(${C},0.6) 0%, rgba(${C},0.2) 30%, transparent 55%, rgba(${C},0.2) 80%, rgba(${C},0.5) 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
    }

    @keyframes hfu {
        from { opacity: 0; transform: translateY(24px); }
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
    @keyframes pulse-ring {
        0%   { box-shadow: 0 0 0 0 rgba(${C},0.4); }
        70%  { box-shadow: 0 0 0 12px rgba(${C},0); }
        100% { box-shadow: 0 0 0 0 rgba(${C},0); }
    }

    .h-anim { animation: hfu 0.9s cubic-bezier(.22,1,.36,1) both; }
    .h-d1  { animation-delay: 80ms; }
    .h-d2  { animation-delay: 180ms; }
    .h-d3  { animation-delay: 280ms; }
    .h-d4  { animation-delay: 380ms; }
    .h-d5  { animation-delay: 480ms; }

    .ticker-track { animation: ticker-scroll 30s linear infinite; }
    .ticker-track:hover { animation-play-state: paused; }

    .shimmer-word {
        background: linear-gradient(105deg, #5E9FFF 0%, #0066FF 25%, #ffffff 48%, #0066FF 72%, #0044CC 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer-sweep 5s linear infinite;
    }

    .pill-btn {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .pill-btn:hover {
        transform: scale(1.04);
        box-shadow: 0 0 24px rgba(${C},0.25);
    }
    .pill-btn:active { transform: scale(0.97); }

    .pulse-dot { animation: pulse-ring 2.5s ease infinite; }
`

const featureTicker = [
    { icon: Activity,   label: 'Dossiers' },
    { icon: TrendingUp, label: 'Croissance' },
    { icon: BarChart3,  label: 'Analytiques' },
    { icon: Shield,     label: 'Sécurité' },
    { icon: Wand2,      label: 'IA intégrée' },
    { icon: Sparkles,   label: 'Automatisation' },
    { icon: Activity,   label: 'Dossiers' },
    { icon: TrendingUp, label: 'Croissance' },
    { icon: BarChart3,  label: 'Analytiques' },
    { icon: Shield,     label: 'Sécurité' },
    { icon: Wand2,      label: 'IA intégrée' },
    { icon: Sparkles,   label: 'Automatisation' },
]

const stats = [
    { value: '500+', label: 'Entreprises actives' },
    { value: '99.9%', label: 'Disponibilité' },
    { value: '5 min', label: 'Pour démarrer' },
    { value: '24/7', label: 'Support dédié' },
]

export default function HeroSection() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    async function handleSignupSubmit(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await signUp(null, formData)
            if (result?.error) setError(result.error)
            else router.push('/dashboard')
        })
    }

    return (
        <>
            <style>{heroStyles}</style>

            <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#030712]">

                {/* ── 3D Web Experience (Spline) ── */}
                <div className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 mix-blend-screen">
                    <Suspense fallback={<div className="w-full h-full bg-[#030712]" />}>
                        <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
                    </Suspense>
                </div>

                {/* ── Overlays ── */}
                <div className="absolute inset-0 z-[1] bg-[#030712]/40 pointer-events-none" />
                <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: 'radial-gradient(circle at 25% 45%, rgba(0, 102, 255, 0.15), transparent 55%)' }} />
                <div className="absolute bottom-0 left-0 right-0 h-48 z-[2] bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />

                {/* ── Content ── */}
                <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center pointer-events-auto">
                    
                    {/* Eyebrow badge */}
                    <div className="h-anim h-d1 lg-pill inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8">
                        <span className="pulse-dot h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: '#0066FF' }} />
                        <span className="font-figtree text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: '#0066FF' }}>
                            Plateforme Business OS · Maroc
                        </span>
                    </div>

                    {/* H1 */}
                    <h1 className="h-anim h-d2 font-syne font-black leading-[0.92] tracking-tight text-white mb-6 drop-shadow-2xl"
                        style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)' }}
                    >
                        GÉREZ
                        <br />
                        <span className="shimmer-word">VOTRE</span>
                        <br />
                        BUSINESS.
                    </h1>

                    {/* Subheading */}
                    <p className="h-anim h-d3 font-figtree text-[16px] md:text-[18px] text-slate-400 leading-relaxed max-w-xl mb-8">
                        FirstStep centralise la gestion de votre entreprise —{' '}
                        <span className="text-white/80">cabinet, restaurant, commerce</span>.
                        Un seul outil, zéro friction.
                    </p>

                    {/* Signup Form Card */}
                    <div className="h-anim h-d4 w-full max-w-md relative rounded-2xl overflow-hidden mb-8 border border-white/5 mx-auto"
                        style={{
                            background: 'rgba(6,12,24,0.6)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        }}
                    >
                        <div className="h-0.5" style={{ background: `linear-gradient(90deg, #0066FF, rgba(${C},0.3), #0066FF)` }} />
                        <div className="p-6 text-left">
                            <form action={handleSignupSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="companyName" className="block font-figtree text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Entreprise
                                        </label>
                                        <Input
                                            id="companyName"
                                            name="companyName"
                                            placeholder="Mon Entreprise SARL"
                                            required
                                            className="h-10 bg-white/3 border-white/8 text-white focus:text-black placeholder:text-slate-600 rounded-xl font-figtree text-[13px]"
                                            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block font-figtree text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Email professionnel
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="nom@entreprise.com"
                                            required
                                            className="h-10 bg-white/3 border-white/8 text-white focus:text-black placeholder:text-slate-600 rounded-xl font-figtree text-[13px]"
                                            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block font-figtree text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            required
                                            className="h-10 bg-white/3 border-white/8 text-white focus:text-black placeholder:text-slate-600 rounded-xl pr-10 font-figtree text-[13px]"
                                            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="px-3 py-2 rounded-xl bg-red-500/8 border border-red-800/50">
                                        <p className="font-figtree text-[12px] text-red-400">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full h-11 inline-flex items-center justify-center gap-2 font-syne font-bold text-[13px] text-black rounded-xl transition-all duration-200 disabled:opacity-60 hover:brightness-110"
                                    style={{
                                        backgroundColor: '#0066FF',
                                        boxShadow: `0 0 30px rgba(0, 102, 255, 0.25)`,
                                    }}
                                >
                                    {isPending ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" />Création...</>
                                    ) : (
                                        <>Essayer gratuitement <ArrowRight className="h-4 w-4" /></>
                                    )}
                                </button>

                                <div className="flex items-center justify-between font-figtree text-[10px] text-slate-600 pt-1">
                                    <span>Configuration en 5 min</span>
                                    <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                                        Déjà un compte ? Connexion
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Stats bar */}
                    <div className="h-anim h-d5 w-full max-w-3xl rounded-2xl overflow-hidden mx-auto"
                        style={{
                            background: 'rgba(6,12,24,0.7)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: `inset 0 1px 1px rgba(0, 102, 255, 0.1), 0 0 0 1px rgba(0, 102, 255, 0.12)`,
                        }}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4">
                            {stats.map((stat, i) => (
                                <div
                                    key={i}
                                    className={`flex flex-col items-center justify-center py-6 px-4 cursor-default group
                                        ${i < 3 ? 'md:border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''}
                                        hover:bg-white/[0.02] transition-colors duration-200
                                    `}
                                    style={{ borderColor: 'rgba(0, 102, 255, 0.12)' }}
                                >
                                    <span className="font-syne text-2xl font-black text-white mb-0.5 transition-colors duration-200">
                                        {stat.value}
                                    </span>
                                    <span className="font-figtree text-[10px] text-slate-500 uppercase tracking-wider text-center">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Feature Ticker ── */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#020810]/60 backdrop-blur-sm overflow-hidden py-3.5"
                    style={{ borderTop: '1px solid rgba(0, 102, 255,0.1)' }}
                >
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#020810] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#020810] to-transparent z-10 pointer-events-none" />
                    <div className="ticker-track flex items-center whitespace-nowrap will-change-transform">
                        {featureTicker.map((item, i) => {
                            const Icon = item.icon
                            return (
                                <span key={i} className="inline-flex items-center gap-2 px-7 text-[11px] font-figtree font-medium text-white/30 uppercase tracking-widest transition-colors duration-200 cursor-default"
                                    style={{ borderRight: '1px solid rgba(0, 102, 255,0.08)' }}
                                >
                                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: 'rgba(0, 102, 255,0.4)' }} />
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
