'use client'

import Link from 'next/link'
import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { signUp } from '@/app/actions/auth'
import { ElegantShape } from '@/components/ui/shape-landing-hero'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Activity,
    TrendingUp,
    BarChart3,
    Shield,
    Wand2,
    Sparkles,
    ArrowRight,
    Loader2,
    Eye,
    EyeOff,
    CheckCircle2,
    Clock,
    DollarSign,
    ArrowUpRight,
    Filter,
    Plus,
    Check,
    MousePointer2,
} from 'lucide-react'

/* ─── Brand color: #0066FF ─────────────────────── */
const C = '0, 102, 255'

const heroStyles = `
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
        70%  { box-shadow: 0 0 0 10px rgba(${C},0); }
        100% { box-shadow: 0 0 0 0 rgba(${C},0); }
    }

    .h-anim { animation: hfu 0.8s cubic-bezier(.23,1,.32,1) both; }
    .h-d1  { animation-delay: 60ms; }
    .h-d2  { animation-delay: 140ms; }
    .h-d3  { animation-delay: 220ms; }
    .h-d4  { animation-delay: 300ms; }
    .h-d5  { animation-delay: 380ms; }

    .ticker-track { animation: ticker-scroll 32s linear infinite; }
    .ticker-track:hover { animation-play-state: paused; }

    .shimmer-word {
        background: linear-gradient(105deg, #0066FF 0%, #0284C7 30%, #0EA5E9 50%, #0066FF 70%, #0044CC 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer-sweep 6s linear infinite;
    }

    .pulse-dot { animation: pulse-ring 2.5s ease infinite; }

    @keyframes spin-gradient {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .rotating-border-wrapper {
        position: relative;
        border-radius: 9999px;
        padding: 1.5px;
        overflow: hidden;
        display: inline-flex;
    }

    .rotating-border-wrapper::before {
        content: '';
        position: absolute;
        inset: -150%;
        background: conic-gradient(from 0deg, #0066FF 0%, #10B981 33%, #0EA5E9 66%, #0066FF 100%);
        animation: spin-gradient 3.5s linear infinite;
        z-index: 0;
    }

    .rotating-border-inner {
        position: relative;
        z-index: 1;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
    }
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

/* Mock Data Variants for Interactive State Changes */
const DATA_VARIANTS = {
    '7d': {
        revenue: '42 850 MAD',
        growth: '+8.2%',
        totalSales: '4 878 500 MAD',
        peakVal: '4 250 MAD',
        peakDate: '5 mai',
        chartPath: 'M 0,60 Q 40,20 80,45 T 160,15 T 240,65 T 320,25 T 400,40',
        chartFill: 'M 0,60 Q 40,20 80,45 T 160,15 T 240,65 T 320,25 T 400,40 L 400,110 L 0,110 Z',
    },
    '30d': {
        revenue: '142 850 MAD',
        growth: '+18.4%',
        totalSales: '14 878 500 MAD',
        peakVal: '8 450 MAD',
        peakDate: '13 mai',
        chartPath: 'M 0,35 Q 30,75 70,75 T 140,85 Q 180,10 220,15 T 300,20 Q 350,50 400,50',
        chartFill: 'M 0,35 Q 30,75 70,75 T 140,85 Q 180,10 220,15 T 300,20 Q 350,50 400,50 L 400,110 L 0,110 Z',
    },
    '90d': {
        revenue: '485 200 MAD',
        growth: '+32.8%',
        totalSales: '48 785 000 MAD',
        peakVal: '14 200 MAD',
        peakDate: '25 mai',
        chartPath: 'M 0,80 Q 50,15 100,50 T 200,10 T 300,35 T 400,15',
        chartFill: 'M 0,80 Q 50,15 100,50 T 200,10 T 300,35 T 400,15 L 400,110 L 0,110 Z',
    },
}

export default function HeroSection() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    /* ─── Real Interactive State Machine ─── */
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
    const [activeSegment, setActiveSegment] = useState<'brute' | 'ebitda' | 'nette'>('ebitda')
    const [installedModule, setInstalledModule] = useState(false)
    const [simStep, setSimStep] = useState<number>(0)
    const [isClicking, setIsClicking] = useState<boolean>(false)

    // Current data based on selected tab
    const currentData = DATA_VARIANTS[timeRange]

    /* ─── Automated Real Action Timeline Simulation ─── */
    useEffect(() => {
        const interval = setInterval(() => {
            setSimStep(prev => (prev + 1) % 4)
        }, 3500)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (simStep === 0) {
            // Step 0: Cursor 1 clicks '90d' filter -> State updates
            setIsClicking(true)
            setTimeout(() => {
                setTimeRange('90d')
                setIsClicking(false)
            }, 300)
        } else if (simStep === 1) {
            // Step 1: Cursor 2 drags & drops AI module -> State updates
            setIsClicking(true)
            setTimeout(() => {
                setInstalledModule(true)
                setIsClicking(false)
            }, 400)
        } else if (simStep === 2) {
            // Step 2: Cursor 3 clicks EBITDA ratio -> State updates
            setIsClicking(true)
            setTimeout(() => {
                setActiveSegment('ebitda')
                setIsClicking(false)
            }, 300)
        } else if (simStep === 3) {
            // Step 3: Cursor 1 clicks back to '30d'
            setIsClicking(true)
            setTimeout(() => {
                setTimeRange('30d')
                setIsClicking(false)
            }, 300)
        }
    }, [simStep])

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

            <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#FAFBFD] text-slate-900 pt-32 sm:pt-36">

                {/* ── Background Gradients & Ambient Effects ── */}
                <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[850px] h-[850px] rounded-full bg-gradient-to-br from-blue-400/10 via-sky-300/10 to-transparent blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-indigo-300/10 via-blue-200/10 to-transparent blur-3xl" />
                    <div className="absolute top-[25%] left-[35%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-400/5 to-blue-500/5 blur-3xl" />

                    <ElegantShape
                        delay={0.2}
                        width={500}
                        height={120}
                        rotate={10}
                        gradient="from-blue-500/[0.08]"
                        className="left-[-5%] top-[15%]"
                    />

                    <ElegantShape
                        delay={0.4}
                        width={400}
                        height={100}
                        rotate={-12}
                        gradient="from-sky-400/[0.08]"
                        className="right-[2%] top-[60%]"
                    />

                    <ElegantShape
                        delay={0.6}
                        width={250}
                        height={70}
                        rotate={-6}
                        gradient="from-indigo-400/[0.08]"
                        className="left-[10%] bottom-[15%]"
                    />
                </div>

                {/* ── Main Two-Column Editorial Container ── */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20 w-full flex-grow flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">

                        {/* ── LEFT COLUMN: Headline & Signup CTA ── */}
                        <div className="lg:col-span-5 flex flex-col items-start text-left">
                            
                            {/* Eyebrow badge with spinning gradient border (#0066FF & #10B981) */}
                            <div className="h-anim h-d1 rotating-border-wrapper mb-6 shadow-md shadow-blue-500/10">
                                <div className="rotating-border-inner inline-flex items-center gap-2.5 px-4 py-1.5">
                                    <span className="pulse-dot h-2 w-2 rounded-full shrink-0 bg-[#0066FF]" />
                                    <span className="font-figtree text-[11px] font-bold uppercase tracking-[0.2em] text-[#0066FF]">
                                        Plateforme Business OS · Maroc
                                    </span>
                                </div>
                            </div>

                            {/* Main Display Headline */}
                            <h1 className="h-anim h-d2 font-syne font-black leading-[0.93] tracking-tight text-slate-900 mb-6"
                                style={{ fontSize: 'clamp(2.75rem, 5.2vw, 4.5rem)' }}
                            >
                                GÉREZ
                                <br />
                                <span className="shimmer-word">VOTRE</span>
                                <br />
                                BUSINESS.
                            </h1>

                            {/* Subtitle */}
                            <p className="h-anim h-d3 font-figtree text-[15.5px] md:text-[17px] text-slate-600 leading-relaxed max-w-lg mb-7">
                                FirstStep centralise la gestion de votre entreprise —{' '}
                                <span className="font-semibold text-slate-900">cabinet, restaurant, commerce</span>.
                                Un seul outil, zéro friction.
                            </p>

                            {/* Signup Form Card */}
                            <div className="h-anim h-d4 w-full max-w-md relative rounded-2xl overflow-hidden mb-7 border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-900/5">
                                <div className="h-1" style={{ background: 'linear-gradient(90deg, #0066FF, #0284C7, #0066FF)' }} />
                                <div className="p-5">
                                    <form action={handleSignupSubmit} className="space-y-3.5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor="companyName" className="block font-figtree text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                    Entreprise
                                                </label>
                                                <Input
                                                    id="companyName"
                                                    name="companyName"
                                                    placeholder="Mon Entreprise SARL"
                                                    required
                                                    className="h-9.5 bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl font-figtree text-[13px] focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block font-figtree text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                    Email pro
                                                </label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="nom@entreprise.com"
                                                    required
                                                    className="h-9.5 bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl font-figtree text-[13px] focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="password" className="block font-figtree text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                Mot de passe
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    required
                                                    className="h-9.5 bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pr-10 font-figtree text-[13px] focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(v => !v)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-200">
                                                <p className="font-figtree text-[12px] text-red-600 font-medium">{error}</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full h-10.5 inline-flex items-center justify-center gap-2 font-syne font-bold text-[13px] text-white rounded-xl transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 shadow-lg shadow-blue-500/25"
                                            style={{ backgroundColor: '#0066FF' }}
                                        >
                                            {isPending ? (
                                                <><Loader2 className="h-4 w-4 animate-spin" />Création...</>
                                            ) : (
                                                <>Essayer gratuitement <ArrowRight className="h-4 w-4" /></>
                                            )}
                                        </button>

                                        <div className="flex items-center justify-between font-figtree text-[10.5px] text-slate-500 pt-0.5">
                                            <span className="flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                Config en 5 min
                                            </span>
                                            <Link href="/login" className="text-slate-600 hover:text-[#0066FF] font-medium transition-colors">
                                                Déjà un compte ? Connexion
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Horizontal Stats Strip */}
                            <div className="h-anim h-d5 w-full max-w-md pt-2 border-t border-slate-200/80">
                                <div className="grid grid-cols-4 gap-2">
                                    {stats.map((stat, i) => (
                                        <div key={i} className="flex flex-col items-start">
                                            <span className="font-syne text-lg font-black text-slate-900">
                                                {stat.value}
                                            </span>
                                            <span className="font-figtree text-[9.5px] text-slate-500 font-medium leading-tight">
                                                {stat.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: Real Interactive SaaS Visuals with Animated Cursors ── */}
                        <div className="lg:col-span-7 relative w-full flex flex-col gap-4 items-center justify-center min-h-[520px]">
                            
                            {/* Ambient FirstStep Radial Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-sky-400/10 to-indigo-500/5 rounded-3xl blur-3xl transform scale-95 pointer-events-none" />

                            {/* ── ANIMATED CURSOR 1: Directeur (Clicks period filter & alters chart data) ── */}
                            <motion.div
                                className="absolute z-40 pointer-events-none"
                                animate={
                                    simStep === 0
                                        ? { x: [100, 240, 240], y: [-60, -28, -28], scale: [1, 1, 0.9, 1] }
                                        : { x: [240, 180, 100], y: [-28, 0, -60], scale: 1 }
                                }
                                transition={{ duration: 1.8, ease: 'easeInOut' }}
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <div className="relative">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#0066FF" stroke="#ffffff" strokeWidth="1.5">
                                            <path d="M3 3l7 18 3-7 7-3L3 3z" />
                                        </svg>
                                        {isClicking && simStep === 0 && (
                                            <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full border-2 border-blue-500 animate-ping pointer-events-none" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-[10px] font-figtree font-bold text-slate-900">
                                        <span className="h-3.5 w-3.5 rounded-full bg-[#0066FF] text-white text-[8px] flex items-center justify-center font-black">D</span>
                                        <span>Directeur</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-figtree text-[9px] font-medium shadow-sm">
                                        Change la période ({timeRange})
                                    </span>
                                </div>
                            </motion.div>

                            {/* ── ANIMATED CURSOR 2: Responsable (Drags & drops AI module widget) ── */}
                            <motion.div
                                className="absolute z-40 pointer-events-none"
                                animate={
                                    simStep === 1
                                        ? { x: [-120, -40, -40], y: [160, 50, 50], scale: [1, 1, 0.9, 1] }
                                        : { x: [-40, -120], y: [50, 160], scale: 1 }
                                }
                                transition={{ duration: 2.2, ease: 'easeInOut' }}
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <div className="relative">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#0284C7" stroke="#ffffff" strokeWidth="1.5">
                                            <path d="M3 3l7 18 3-7 7-3L3 3z" />
                                        </svg>
                                        {isClicking && simStep === 1 && (
                                            <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full border-2 border-sky-500 animate-ping pointer-events-none" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-[10px] font-figtree font-bold text-slate-900">
                                        <span className="h-3.5 w-3.5 rounded-full bg-[#0284C7] text-white text-[8px] flex items-center justify-center font-black">R</span>
                                        <span>Responsable Ventes</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-md bg-sky-900 text-white font-figtree text-[9px] font-medium shadow-sm">
                                        {installedModule ? 'Module IA Activé!' : 'Glisse le Module IA'}
                                    </span>
                                </div>
                            </motion.div>

                            {/* ── ANIMATED CURSOR 3: CFO (Clicks EBITDA segment on Donut) ── */}
                            <motion.div
                                className="absolute z-40 pointer-events-none"
                                animate={
                                    simStep === 2
                                        ? { x: [140, 140], y: [120, 120], scale: [1, 0.9, 1] }
                                        : { x: [140, 200], y: [120, 180], scale: 1 }
                                }
                                transition={{ duration: 1.5, ease: 'easeInOut' }}
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <div className="relative">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#10B981" stroke="#ffffff" strokeWidth="1.5">
                                            <path d="M3 3l7 18 3-7 7-3L3 3z" />
                                        </svg>
                                        {isClicking && simStep === 2 && (
                                            <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full border-2 border-emerald-500 animate-ping pointer-events-none" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-[10px] font-figtree font-bold text-slate-900">
                                        <span className="h-3.5 w-3.5 rounded-full bg-[#10B981] text-white text-[8px] flex items-center justify-center font-black">C</span>
                                        <span>CFO</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-900 text-white font-figtree text-[9px] font-medium shadow-sm">
                                        Inspecte EBITDA ({activeSegment})
                                    </span>
                                </div>
                            </motion.div>


                            {/* ── TOP VISUAL CARD: Finance & Live Time Range Filters ── */}
                            <div className="relative z-10 w-full bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-xl shadow-slate-900/8 overflow-hidden">
                                
                                {/* Top Header & Interactive Filter Buttons */}
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF]">
                                            <BarChart3 className="h-4.5 w-4.5" />
                                        </div>
                                        <div>
                                            <div className="font-syne text-[15px] font-bold text-slate-900 leading-tight">Finance & Ventes</div>
                                            <div className="font-figtree text-[11px] text-slate-500">Tendance des ventes en temps réel</div>
                                        </div>
                                    </div>

                                    {/* REAL Interactive Time Filters (7d, 30d, 90d) */}
                                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
                                        {(['7d', '30d', '90d'] as const).map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setTimeRange(tab)}
                                                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-figtree font-bold transition-all duration-200 ${
                                                    timeRange === tab
                                                        ? 'bg-white text-[#0066FF] shadow-sm ring-1 ring-blue-500/20'
                                                        : 'text-slate-500 hover:text-slate-900'
                                                }`}
                                            >
                                                {tab === '7d' ? '7 jours' : tab === '30d' ? '30 jours' : '90 jours'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dynamic Multi-Curve Line Chart */}
                                <div className="relative w-full h-[140px] pt-2">
                                    {/* Y-Axis Grid & Labels */}
                                    <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-[9px] font-figtree font-semibold text-slate-400">
                                        <span>15k MAD</span>
                                        <span>10k MAD</span>
                                        <span>5k MAD</span>
                                        <span>2k MAD</span>
                                        <span>0 MAD</span>
                                    </div>

                                    {/* Horizontal Grid lines */}
                                    <div className="absolute left-12 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                                        <div className="h-px bg-slate-100 w-full" />
                                        <div className="h-px bg-slate-100 w-full" />
                                        <div className="h-px bg-slate-100 w-full" />
                                        <div className="h-px bg-slate-100 w-full" />
                                        <div className="h-px bg-slate-200/80 w-full" />
                                    </div>

                                    {/* Dynamic Tooltip Line at Peak */}
                                    <motion.div
                                        className="absolute top-0 bottom-6 w-px bg-[#0066FF] border-l border-dashed border-[#0066FF] pointer-events-none z-10"
                                        animate={{ left: timeRange === '7d' ? '38%' : timeRange === '30d' ? '46%' : '68%' }}
                                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                                    >
                                        <div className="absolute -top-3 -left-8 px-2 py-0.5 rounded-lg bg-[#0066FF] text-white font-figtree text-[9.5px] font-extrabold shadow-md flex items-center gap-1 whitespace-nowrap">
                                            <span>{currentData.peakVal}</span>
                                            <span className="text-emerald-300 font-bold">{currentData.growth}</span>
                                        </div>
                                        <div className="absolute top-[40%] -left-[4px] h-2.5 w-2.5 rounded-full bg-[#0066FF] border-2 border-white shadow-md ring-2 ring-blue-300" />
                                    </motion.div>

                                    {/* SVG Curves Morphing on State Change */}
                                    <div className="absolute left-12 right-0 top-0 bottom-6">
                                        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 110" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="finGradBlueReal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#0066FF" stopOpacity="0.22" />
                                                    <stop offset="100%" stopColor="#0066FF" stopOpacity="0.0" />
                                                </linearGradient>
                                            </defs>
                                            <motion.path
                                                d={currentData.chartFill}
                                                fill="url(#finGradBlueReal)"
                                                transition={{ duration: 0.6 }}
                                            />
                                            <motion.path
                                                d={currentData.chartPath}
                                                fill="none"
                                                stroke="#0066FF"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                transition={{ duration: 0.6 }}
                                            />
                                        </svg>
                                    </div>

                                    {/* X-Axis Date Labels */}
                                    <div className="absolute left-12 right-0 bottom-0 flex justify-between text-[9.5px] font-figtree text-slate-400 pt-1 border-t border-slate-100">
                                        <span>1er mai</span>
                                        <span>5 mai</span>
                                        <span>10 mai</span>
                                        <span className="text-[#0066FF] font-bold">{currentData.peakDate}</span>
                                        <span>20 mai</span>
                                        <span>25 mai</span>
                                        <span>30 mai</span>
                                    </div>
                                </div>
                            </div>

                            {/* ── BOTTOM TWO CARDS ROW ── */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full relative z-10">

                                {/* ── CARD 2: Ventes Totales (Responds to Drag & Drop AI Module) ── */}
                                <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-5 shadow-xl shadow-slate-900/8 relative overflow-hidden">
                                    
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-syne font-extrabold text-[15px] text-slate-900">Ventes Totales</h3>
                                        <div className="h-7 w-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF]">
                                            <Clock className="h-3.5 w-3.5" />
                                        </div>
                                    </div>

                                    {/* Dynamic Big Metric */}
                                    <motion.div
                                        key={currentData.totalSales}
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="font-syne text-2xl font-black text-slate-900 tracking-tight mb-0.5"
                                    >
                                        {currentData.totalSales}
                                    </motion.div>
                                    <div className="font-figtree text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mb-3">
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                        {currentData.growth} vs l&apos;an passé
                                    </div>

                                    {/* Installed Dragged Module Indicator */}
                                    <AnimatePresence>
                                        {installedModule && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="mb-3 p-2 rounded-xl bg-blue-50/90 border border-blue-200 flex items-center justify-between text-[10.5px] font-figtree font-bold text-[#0066FF]"
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                    Module IA Prédictif Activé
                                                </span>
                                                <span className="text-emerald-600 font-extrabold">+18% Ventes</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Curved Area Chart */}
                                    <div className="relative h-20 w-full">
                                        <div className="absolute left-0 top-0 bottom-4 w-5 flex flex-col justify-between text-[8.5px] font-figtree font-medium text-slate-400">
                                            <span>15M</span>
                                            <span>5M</span>
                                            <span>0</span>
                                        </div>

                                        <div className="absolute left-5 right-0 top-0 bottom-4">
                                            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 55" preserveAspectRatio="none">
                                                <path
                                                    d="M 0,35 Q 25,25 50,10 Q 75,5 100,18 Q 125,35 150,38 L 150,55 L 0,55 Z"
                                                    fill="#0066FF"
                                                    fillOpacity="0.12"
                                                />
                                                <path
                                                    d="M 0,35 Q 25,25 50,10 Q 75,5 100,18 Q 125,35 150,38"
                                                    fill="none"
                                                    stroke="#0066FF"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                />
                                                <circle cx="50" cy="10" r="3" fill="#0066FF" stroke="#fff" strokeWidth="1.5" />
                                                <circle cx="100" cy="18" r="3" fill="#0066FF" stroke="#fff" strokeWidth="1.5" />
                                                <circle cx="150" cy="38" r="3" fill="#0066FF" stroke="#fff" strokeWidth="1.5" />
                                            </svg>
                                        </div>

                                        <div className="absolute left-5 right-0 bottom-0 flex justify-between text-[9px] font-figtree font-medium text-slate-400">
                                            <span>Août</span>
                                            <span>Oct</span>
                                            <span className="text-[#0066FF] font-bold">Nov</span>
                                            <span>Déc</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ── CARD 3: Profitabilité (Clickable Donut & Dynamic Legend) ── */}
                                <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-5 shadow-xl shadow-slate-900/8 relative overflow-hidden">
                                    
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-syne font-extrabold text-[15px] text-slate-900 leading-tight">Profitabilité</h3>
                                            <div className="font-figtree text-[10.5px] text-slate-500">Ratio financier</div>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF]">
                                            <DollarSign className="h-4 w-4" />
                                        </div>
                                    </div>

                                    {/* Donut & Interactive Legend */}
                                    <div className="flex items-center justify-between gap-2">
                                        
                                        {/* Donut Chart */}
                                        <div className="relative h-22 w-22 shrink-0 flex items-center justify-center cursor-pointer">
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#F1F5F9"
                                                    strokeWidth="3.5"
                                                />
                                                {/* Segment 1: Marge brute */}
                                                <path
                                                    onClick={() => setActiveSegment('brute')}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke={activeSegment === 'brute' ? '#0066FF' : '#94A3B8'}
                                                    strokeWidth={activeSegment === 'brute' ? '4.5' : '3.5'}
                                                    strokeDasharray="45 100"
                                                    className="transition-all duration-300"
                                                />
                                                {/* Segment 2: EBITDA */}
                                                <path
                                                    onClick={() => setActiveSegment('ebitda')}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke={activeSegment === 'ebitda' ? '#10B981' : '#94A3B8'}
                                                    strokeWidth={activeSegment === 'ebitda' ? '4.5' : '3.5'}
                                                    strokeDasharray="26 100"
                                                    strokeDashoffset="-45"
                                                    className="transition-all duration-300"
                                                />
                                                {/* Segment 3: Marge nette */}
                                                <path
                                                    onClick={() => setActiveSegment('nette')}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke={activeSegment === 'nette' ? '#0284C7' : '#94A3B8'}
                                                    strokeWidth={activeSegment === 'nette' ? '4.5' : '3.5'}
                                                    strokeDasharray="18 100"
                                                    strokeDashoffset="-71"
                                                    className="transition-all duration-300"
                                                />
                                            </svg>

                                            {/* Dynamic Center Label */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                <span className="font-syne font-black text-base text-slate-900 leading-none">
                                                    {activeSegment === 'ebitda' ? '26%' : activeSegment === 'brute' ? '45%' : '18%'}
                                                </span>
                                                <span className="font-figtree text-[8.5px] font-extrabold text-[#0066FF] uppercase tracking-wider mt-0.5">
                                                    {activeSegment}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Interactive Legend List */}
                                        <div className="space-y-1.5 font-figtree text-[10.5px] font-semibold">
                                            <button
                                                onClick={() => setActiveSegment('brute')}
                                                className={`flex items-center gap-2 px-2 py-0.5 rounded-lg transition-colors w-full ${
                                                    activeSegment === 'brute' ? 'bg-blue-50 text-[#0066FF]' : 'text-slate-600'
                                                }`}
                                            >
                                                <span className="h-2 w-2 rounded-sm bg-[#0066FF] shrink-0" />
                                                <span>Marge brute (45%)</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveSegment('ebitda')}
                                                className={`flex items-center gap-2 px-2 py-0.5 rounded-lg transition-colors w-full ${
                                                    activeSegment === 'ebitda' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'
                                                }`}
                                            >
                                                <span className="h-2 w-2 rounded-sm bg-emerald-500 shrink-0" />
                                                <span>EBITDA (26%)</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveSegment('nette')}
                                                className={`flex items-center gap-2 px-2 py-0.5 rounded-lg transition-colors w-full ${
                                                    activeSegment === 'nette' ? 'bg-sky-50 text-sky-700' : 'text-slate-600'
                                                }`}
                                            >
                                                <span className="h-2 w-2 rounded-sm bg-sky-600 shrink-0" />
                                                <span>Marge nette (18%)</span>
                                            </button>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Bottom Feature Ticker ── */}
                <div className="relative z-20 bg-white/80 backdrop-blur-md border-t border-b border-slate-200/60 overflow-hidden py-3.5">
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FAFBFD] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FAFBFD] to-transparent z-10 pointer-events-none" />
                    <div className="ticker-track flex items-center whitespace-nowrap will-change-transform">
                        {featureTicker.map((item, i) => {
                            const Icon = item.icon
                            return (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-2 px-8 text-[11px] font-figtree font-bold text-slate-500 uppercase tracking-widest transition-colors duration-200 cursor-default hover:text-[#0066FF]"
                                    style={{ borderRight: '1px solid rgba(0, 102, 255, 0.1)' }}
                                >
                                    <Icon className="h-3.5 w-3.5 shrink-0 text-[#0066FF]" />
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
