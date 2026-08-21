'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { signUp } from '@/app/actions/auth'
import Link from 'next/link'
import { Loader2, ArrowRight, Shield, Zap, HeartHandshake, Star, Eye, EyeOff, Sparkles } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

export default function SignupSection() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await signUp(null, formData)
            if (result?.error) setError(result.error)
            else router.push('/dashboard')
        })
    }

    const benefits = [
        { icon: Shield, label: 'Aucune carte bancaire requise' },
        { icon: Zap, label: 'Configuration en moins de 5 min' },
        { icon: HeartHandshake, label: 'Support dédié en français' },
        { icon: Star, label: 'Essai gratuit sans engagement' },
    ]

    return (
        <section id="signup" className="relative py-28 md:py-36 bg-[#F8FAFC] text-slate-900 overflow-hidden">
            {/* Top divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left — Benefits */}
                    <ScrollReveal direction="right">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6 shadow-2xs">
                            <Sparkles className="h-3.5 w-3.5 text-[#0066FF]" />
                            <span className="font-figtree text-[11px] font-bold uppercase tracking-[0.2em] text-[#0066FF]">
                                Inscription gratuite
                            </span>
                        </div>

                        <h2 className="font-syne font-black text-slate-900 leading-tight mb-6">
                            <span className="block text-3xl md:text-5xl tracking-tight">Rejoignez les</span>
                            <span className="block text-3xl md:text-5xl tracking-tight text-[#0066FF]">entreprises qui</span>
                            <span className="block text-3xl md:text-5xl tracking-tight text-[#0066FF]">avancent</span>
                        </h2>

                        <p className="font-figtree text-[15px] text-slate-600 leading-relaxed mb-10 max-w-md font-medium">
                            Créez votre compte en quelques secondes et gérez votre business de manière professionnelle dès aujourd&apos;hui.
                        </p>

                        <div className="space-y-4 mb-10">
                            {benefits.map((b, i) => {
                                const Icon = b.icon
                                return (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="h-11 w-11 rounded-2xl bg-blue-50 border border-blue-100 text-[#0066FF] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:shadow-xs transition-all duration-200">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="font-figtree text-[14.5px] text-slate-700 font-semibold">{b.label}</span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Social proof */}
                        <div className="pt-8 flex items-center gap-4 border-t border-slate-200/80">
                            <div className="flex -space-x-2">
                                {['#0066FF', '#0891b2', '#0284c7', '#7c3aed'].map((c, i) => (
                                    <div key={i} className="h-9 w-9 rounded-full ring-2 ring-white flex items-center justify-center text-white shadow-2xs font-syne text-[11px] font-bold" style={{ backgroundColor: c }}>
                                        {['A', 'K', 'M', 'Y'][i]}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="font-syne text-sm font-extrabold text-slate-900 tabular-nums">500+ entreprises</div>
                                <div className="font-figtree text-[11.5px] text-slate-500 font-medium">nous font déjà confiance au Maroc</div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Right — Signup Form Card */}
                    <ScrollReveal direction="left" delay={150}>
                        <div className="relative rounded-3xl p-8 bg-white/95 backdrop-blur-2xl border border-slate-200/90 border-t-white shadow-2xl shadow-slate-900/5">
                            <div className="h-1 rounded-t-3xl absolute top-0 left-0 right-0" style={{ background: 'linear-gradient(90deg, #0066FF, #0284C7, #0066FF)' }} />

                            <h3 className="font-syne font-bold text-2xl text-slate-900 mb-1 pt-2 tracking-tight">Créer un compte</h3>
                            <p className="font-figtree text-[13.5px] text-slate-500 mb-8">Configuration en quelques minutes. Aucun engagement.</p>

                            <form action={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="companyNameSignup" className="block font-figtree text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Nom de l&apos;entreprise
                                    </label>
                                    <Input
                                        id="companyNameSignup"
                                        name="companyName"
                                        placeholder="Mon Entreprise SARL"
                                        required
                                        className="h-11 bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl font-figtree text-[14px] focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="emailSignup" className="block font-figtree text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Email professionnel
                                    </label>
                                    <Input
                                        id="emailSignup"
                                        name="email"
                                        type="email"
                                        placeholder="nom@entreprise.com"
                                        required
                                        className="h-11 bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl font-figtree text-[14px] focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="passwordSignup" className="block font-figtree text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="passwordSignup"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            required
                                            className="h-11 bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pr-11 font-figtree text-[14px] focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                                            aria-label={showPassword ? 'Masquer' : 'Afficher'}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                                        <p className="font-figtree text-[13px] text-red-600 font-medium">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full h-12 inline-flex items-center justify-center gap-2 font-syne font-bold text-[14px] text-white rounded-xl transition-all duration-200 hover:brightness-105 hover:-translate-y-0.5 active:scale-98 disabled:opacity-60 shadow-lg shadow-blue-500/25 cursor-pointer"
                                    style={{ backgroundColor: '#0066FF' }}
                                >
                                    {isPending ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" />Création en cours...</>
                                    ) : (
                                        <>Démarrer gratuitement <ArrowRight className="h-4 w-4" /></>
                                    )}
                                </button>

                                <p className="text-center font-figtree text-[11.5px] text-slate-500 pt-1">
                                    En vous inscrivant, vous acceptez nos{' '}
                                    <Link href="/terms" className="text-[#0066FF] font-semibold underline underline-offset-2 hover:text-blue-700 transition-colors">
                                        conditions d&apos;utilisation
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    )
}
