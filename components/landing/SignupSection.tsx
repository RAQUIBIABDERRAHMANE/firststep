'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { signUp } from '@/app/actions/auth'
import { Loader2, CheckCircle2, Sparkles, ArrowRight, Shield, Zap, HeartHandshake } from 'lucide-react'

type Service = {
    id: string
    name: string
    status: string
}

interface SignupSectionProps {
    services: Service[]
}

export default function SignupSection({ services }: SignupSectionProps) {
    const [selectedServices, setSelectedServices] = useState<string[]>([])
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        )
    }

    async function handleSubmit(formData: FormData) {
        setError(null)

        // Add selected services to formData
        selectedServices.forEach(id => formData.append('services', id))

        startTransition(async () => {
            const result = await signUp(null, formData)
            if (result?.error) {
                setError(result.error)
            } else {
                router.push('/dashboard')
            }
        })
    }

    const benefits = [
        { icon: <Shield className="h-5 w-5" />, text: 'Aucune carte requise' },
        { icon: <Zap className="h-5 w-5" />, text: 'Configuration en 5 minutes' },
        { icon: <HeartHandshake className="h-5 w-5" />, text: 'Support dédié' },
    ]

    return (
        <section id="signup" className="py-32 relative overflow-hidden bg-slate-950">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-medium text-violet-300 mb-6">
                                <Sparkles className="h-4 w-4" />
                                Rejoignez-nous
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                                Prêt à faire le{' '}
                                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                                    premier pas ?
                                </span>
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                Rejoignez des centaines d'entreprises qui ont transformé leurs opérations. Créez votre compte et sélectionnez vos modules pour commencer.
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-4">
                            {benefits.map((benefit, i) => (
                                <div 
                                    key={i} 
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
                                        {benefit.icon}
                                    </div>
                                    <span className="text-slate-300 font-medium">{benefit.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Form Card */}
                    <div className="relative">
                        {/* Glow behind card */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-3xl blur-2xl opacity-50" />
                        
                        <Card className="relative bg-slate-900/80 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden">
                            {/* Top accent */}
                            <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600" />
                            
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl font-bold text-white">Créer un compte</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Configurez votre profil entreprise en quelques minutes.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form action={handleSubmit} className="space-y-5">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="companyName" className="text-sm font-medium text-slate-300">
                                                Nom de l'entreprise
                                            </label>
                                            <Input
                                                id="companyName"
                                                name="companyName"
                                                placeholder="Mon Entreprise"
                                                required
                                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:ring-violet-500/20 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-slate-300">
                                                Adresse email
                                            </label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="nom@entreprise.com"
                                                required
                                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:ring-violet-500/20 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="password" className="text-sm font-medium text-slate-300">
                                                Mot de passe
                                            </label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                required
                                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:ring-violet-500/20 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-300">
                                            Services qui vous intéressent
                                        </label>
                                        <div className="grid gap-2 max-h-40 overflow-y-auto pr-2">
                                            {services.map(service => (
                                                <div
                                                    key={service.id}
                                                    onClick={() => toggleService(service.id)}
                                                    className={`
                                                        flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all
                                                        ${selectedServices.includes(service.id)
                                                            ? 'bg-violet-500/20 border-violet-500/50 text-white'
                                                            : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/[0.04]'}
                                                    `}
                                                >
                                                    <span className="text-sm font-medium">{service.name}</span>
                                                    {selectedServices.includes(service.id) && (
                                                        <CheckCircle2 className="h-4 w-4 text-violet-400" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                            <p className="text-sm text-red-400">{error}</p>
                                        </div>
                                    )}

                                    <Button 
                                        type="submit" 
                                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 rounded-xl group" 
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Création en cours...
                                            </>
                                        ) : (
                                            <>
                                                Commencer gratuitement
                                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-center text-xs text-slate-600">
                                        En créant un compte, vous acceptez nos{' '}
                                        <a href="#" className="text-violet-400 hover:underline">conditions d'utilisation</a>
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
