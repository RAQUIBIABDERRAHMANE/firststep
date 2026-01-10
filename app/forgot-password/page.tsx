'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { requestPasswordReset } from '@/app/actions/auth'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setError(null)
        setSuccess(null)

        startTransition(async () => {
            const result = await requestPasswordReset(null, formData)
            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                setSuccess(result.message || 'Verification code sent.')
                // Redirect to reset page with email as query param after a short delay
                setTimeout(() => {
                    const email = formData.get('email') as string
                    router.push(`/reset-password?email=${encodeURIComponent(email)}`)
                }, 2000)
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
                <div className="flex flex-col items-center mb-10">
                    <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-all duration-300 mb-8 self-start group hover:gap-3">
                        <ArrowLeft className="h-4 w-4" />
                        Back to login
                    </Link>
                    <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center text-primary-foreground mb-6 shadow-2xl shadow-primary/40 animate-pulse-glow">
                        <Mail className="h-10 w-10" />
                    </div>
                    <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">Forgot password?</h1>
                    <p className="text-muted-foreground font-medium text-center max-w-sm">
                        Enter your email and we&apos;ll send you a 6-digit code to reset your password.
                    </p>
                </div>

                <Card className="glass-card shadow-2xl border-border/50 backdrop-blur-2xl">
                    <CardContent className="pt-8 pb-8 px-8">
                        <form action={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-bold leading-none text-foreground">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    className="h-14 text-base"
                                    disabled={!!success}
                                />
                            </div>

                            {error && (
                                <div className="text-sm font-bold text-destructive bg-destructive/10 p-4 rounded-xl border-2 border-destructive/30 text-center backdrop-blur-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="text-sm font-bold text-emerald-600 bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200 text-center backdrop-blur-sm">
                                    {success}
                                </div>
                            )}

                            <Button type="submit" className="w-full h-14 text-base font-black" disabled={isPending || !!success}>
                                {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                {isPending ? 'Sending code...' : success ? 'Code Sent' : 'Send Reset Code'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
