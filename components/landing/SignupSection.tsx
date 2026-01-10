'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { signUp } from '@/app/actions/auth'
import { Loader2, CheckCircle2 } from 'lucide-react'

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

    return (
        <section id="signup" className="py-24 bg-zinc-950 text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to take the <span className="text-primary">FirstStep?</span></h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Join hundreds of businesses that have transformed their operations. Create your account and select your modules to get started.
                        </p>
                        <ul className="space-y-4">
                            {['No credit card required', 'Cancel anytime', 'Dedicated support', 'Free 14-day trial'].map((item, i) => (
                                <li key={i} className="flex items-center text-gray-300">
                                    <CheckCircle2 className="h-5 w-5 text-primary mr-3" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-2xl animate-fade-in stagger-2">
                        <CardHeader>
                            <CardTitle className="text-white">Sign Up</CardTitle>
                            <CardDescription className="text-gray-400">
                                Create your business profile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={handleSubmit} className="space-y-6">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="companyName" className="text-sm font-medium text-gray-200">Company Name</label>
                                        <Input
                                            id="companyName"
                                            name="companyName"
                                            placeholder="Acme Corp"
                                            required
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-gray-200">Email Address</label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            required
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="password" className="text-sm font-medium text-gray-200">Password</label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-200">Select Interested Services</label>
                                    <div className="grid gap-2">
                                        {services.map(service => (
                                            <div
                                                key={service.id}
                                                onClick={() => toggleService(service.id)}
                                                className={`
                          flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all
                          ${selectedServices.includes(service.id)
                                                        ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/10'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}
                        `}
                                            >
                                                <span className="text-sm font-medium">{service.name}</span>
                                                {selectedServices.includes(service.id) && <CheckCircle2 className="h-4 w-4 text-primary" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {error && <p className="text-sm text-red-400">{error}</p>}

                                <Button type="submit" className="w-full text-lg h-12" disabled={isPending}>
                                    {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                    {isPending ? 'Creating Account...' : 'Get Started'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
