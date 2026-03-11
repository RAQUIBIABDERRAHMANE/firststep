'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { signUp } from '@/app/actions/auth'
import Link from 'next/link'
import { Loader2, ArrowRight, Shield, Zap, HeartHandshake, Star, Eye, EyeOff } from 'lucide-react'

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
        <section id="signup" className="relative py-32 bg-[#030712] overflow-hidden">

            {/* Top separator */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-900/50 to-transparent" />

            {/* Atmospheric glows */}
            <div className="absolute top-0 right-0 w-125 h-125 rounded-full bg-cyan-900/20 blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-teal-900/15 blur-[120px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left — Benefits */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-px w-10 bg-cyan-400" />
                            <span className="font-figtree text-[11px] font-semibold text-cyan-400 uppercase tracking-[0.25em]">
                                Inscription gratuite
                            </span>
                        </div>

                        <h2 className="font-syne font-black text-white leading-tight mb-6">
                            <span className="block text-4xl md:text-5xl">Rejoignez les</span>
                            <span className="block text-4xl md:text-5xl text-cyan-400">entreprises qui</span>
                            <span className="block text-4xl md:text-5xl text-cyan-400">avancent</span>
                        </h2>

                        <p className="font-figtree text-[16px] text-slate-400 leading-relaxed mb-10 max-w-md">
                            Créez votre compte en quelques secondes et gérez votre business de manière professionnelle dès aujourd&apos;hui.
                        </p>

                        <div className="space-y-4">
                            {benefits.map((b, i) => {
                                const Icon = b.icon
                                return (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-cyan-500/8 border border-cyan-800/40 text-cyan-400 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/15 transition-colors duration-200">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span className="font-figtree text-[14px] text-slate-300 font-medium">{b.label}</span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Social proof */}
                        <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {['bg-cyan-600', 'bg-teal-600', 'bg-sky-600', 'bg-indigo-600'].map((c, i) => (
                                    <div key={i} className={`h-8 w-8 rounded-full ${c} border-2 border-[#030712] flex items-center justify-center`}>
                                        <span className="font-syne text-[10px] font-bold text-white">
                                            {['A', 'K', 'M', 'Y'][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="font-syne text-sm font-bold text-white">500+ entreprises</div>
                                <div className="font-figtree text-[11px] text-slate-500">nous font déjà confiance</div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="relative">
                        {/* Outer glow ring */}
                        <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-cyan-500/15 via-transparent to-teal-500/10 blur-sm" />

                        <div className="relative bg-[#060c18] border border-cyan-900/30 rounded-2xl overflow-hidden">
                            {/* Cyan top accent bar */}
                            <div className="h-0.5 bg-linear-to-r from-cyan-500 via-teal-400 to-cyan-500" />

                            <div className="p-8">
                                <h3 className="font-syne font-bold text-xl text-white mb-1">Créer un compte</h3>
                                <p className="font-figtree text-[13px] text-slate-500 mb-7">Configuration en quelques minutes. Aucun engagement.</p>

                                <form action={handleSubmit} className="space-y-5">
                                    <div>
                                        <label htmlFor="companyName" className="block font-figtree text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                            Nom de l&apos;entreprise
                                        </label>
                                        <Input
                                            id="companyName"
                                            name="companyName"
                                            placeholder="Mon Entreprise SARL"
                                            required
                                            className="h-11 bg-white/4 border-white/8 text-white placeholder:text-slate-600 focus:border-cyan-500/40 focus:ring-0 rounded-xl font-figtree text-[14px]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block font-figtree text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                            Email professionnel
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="nom@entreprise.com"
                                            required
                                            className="h-11 bg-white/4 border-white/8 text-white placeholder:text-slate-600 focus:border-cyan-500/40 focus:ring-0 rounded-xl font-figtree text-[14px]"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block font-figtree text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                            Mot de passe
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                required
                                                className="h-11 bg-white/4 border-white/8 text-white placeholder:text-slate-600 focus:border-cyan-500/40 focus:ring-0 rounded-xl pr-11 font-figtree text-[14px]"
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
                                        <div className="px-4 py-3 rounded-xl bg-red-500/8 border border-red-800/50">
                                            <p className="font-figtree text-[13px] text-red-400">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full h-12 inline-flex items-center justify-center gap-2 font-syne font-bold text-[14px] bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 text-black rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)]"
                                    >
                                        {isPending ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" />Création en cours...</>
                                        ) : (
                                            <>Démarrer gratuitement <ArrowRight className="h-4 w-4" /></>
                                        )}
                                    </button>

                                    <p className="text-center font-figtree text-[11px] text-slate-600">
                                        En vous inscrivant, vous acceptez nos{' '}
                                        <Link href="/terms" className="text-slate-400 underline underline-offset-2 hover:text-white transition-colors">
                                            conditions d&apos;utilisation
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
