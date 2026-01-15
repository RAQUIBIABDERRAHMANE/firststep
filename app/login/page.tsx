'use client'

import { Suspense, useState, useTransition } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { signIn } from '@/app/actions/auth'
import { Loader2, Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react'



function LoginForm() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/dashboard'

    async function handleSubmit(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await signIn(null, formData)
            if (result?.error) {
                setError(result.error)
            }
        })
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.15),transparent_40%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.1),transparent_40%)]" />

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

            <div className="w-full max-w-md animate-scale-in relative z-10">
                <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center text-primary-foreground font-black shadow-xl shadow-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-300">
                        F
                    </div>
                    <span className="text-3xl font-black gradient-text">FirstStep</span>
                </Link>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">Welcome Back</h1>
                    <p className="text-muted-foreground font-medium">
                        Sign in to access your dashboard
                    </p>
                </div>

                <Card className="glass-card shadow-2xl border-border/50 backdrop-blur-2xl">
                    <CardContent className="pt-8 pb-8 px-8">
                        <form action={handleSubmit} className="space-y-6">
                            <input type="hidden" name="redirectTo" value={redirectTo} />
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-bold leading-none text-foreground flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    className="h-14 text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-bold leading-none text-foreground flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-primary" />
                                        Password
                                    </label>
                                    <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-accent transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="h-14 text-base"
                                />
                            </div>

                            {error && (
                                <div className="text-sm font-bold text-destructive bg-destructive/10 p-4 rounded-xl border-2 border-destructive/30 backdrop-blur-sm animate-shake">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full h-14 text-base font-black" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Sign In
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-all duration-300 hover:gap-3">
                        <ArrowLeft className="h-4 w-4" />
                        Back to home
                    </Link>
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground font-medium">
                    Don&apos;t have an account?{' '}
                    <Link href="/#signup" className="text-primary font-bold hover:text-accent transition-colors">
                        Get Started
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
            <LoginForm />
        </Suspense>
    )
}
