'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
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
        <section id="signup" className="relative py-32 bg-[#050914] overflow-hidden">
            {/* Top separator */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/7 to-transparent" />
            {/* Background glow */}
            <div className="absolute top-1/3 right-0 w-125 h-125 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/3 left-0 w-100 h-100 rounded-full bg-violet-600/8 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left — Benefits */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-8">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                            Inscription gratuite
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                            Rejoignez les
                            <br />
                            <span className="text-blue-400">entreprises qui
                            <br />avancent</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-10">
                            Créez votre compte en quelques secondes et gérez votre business de manière professionnelle dès aujourd&apos;hui.
                        </p>

                        <div className="space-y-3">
                            {benefits.map((b, i) => {
                                const Icon = b.icon
                                return (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                                            <Icon className="h-4.5 w-4.5" />
                                        </div>
                                        <span className="text-slate-300 font-medium text-sm">{b.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="relative">
                        {/* Glow */}
                        <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-blue-500/20 via-transparent to-violet-500/20 blur-sm" />
                        
                        <div className="relative bg-[#0a1628] border border-white/8 rounded-2xl overflow-hidden">
                            {/* Top accent bar */}
                            <div className="h-1 bg-linear-to-r from-blue-500 via-blue-400 to-violet-500" />

                            <div className="p-8">
                                <h3 className="text-xl font-bold text-white mb-1">Créer un compte</h3>
                                <p className="text-sm text-slate-500 mb-7">Configurez votre profil en quelques minutes.</p>

                                <form action={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="companyName" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nom de l&apos;entreprise</label>
                                        <Input id="companyName" name="companyName" placeholder="Mon Entreprise" required
                                            className="h-11 bg-white/4 border-white/8 text-white focus:text-black  placeholder:text-slate-600 focus:border-blue-500/50 rounded-xl" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email professionnel</label>
                                        <Input id="email" name="email" type="email" placeholder="nom@entreprise.com" required
                                            className="h-11 bg-white/4 border-white/8 text-white focus:text-black  placeholder:text-slate-600 focus:border-blue-500/50 rounded-xl" />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mot de passe</label>
                                        <div className="relative">
                                            <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" required
                                                className="h-11 bg-white/4 border-white/8 text-white focus:text-black placeholder:text-slate-600 focus:border-blue-500/50 rounded-xl pr-11" />
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
                                        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                            <p className="text-sm text-red-400">{error}</p>
                                        </div>
                                    )}

                                    <Button type="submit" disabled={isPending}
                                        className="w-full h-12 font-bold text-base bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/25 gap-2">
                                        {isPending ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" />Création...</>
                                        ) : (
                                            <>Démarrer gratuitement<ArrowRight className="h-4 w-4" /></>
                                        )}
                                    </Button>

                                    <p className="text-center text-xs text-slate-600">
                                        En vous inscrivant, vous acceptez nos{' '}
                                        <Link href="/terms" className="text-slate-400 underline underline-offset-2 hover:text-white transition-colors">conditions d&apos;utilisation</Link>
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
