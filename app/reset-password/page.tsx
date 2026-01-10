'use client'

import { useState, useTransition, Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { resetPassword } from '@/app/actions/auth'
import { Loader2, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

function ResetPasswordForm() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || ''

    async function handleSubmit(formData: FormData) {
        setError(null)

        // Validate password match
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        // Validate password length
        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        // Validate code format
        const code = formData.get('code') as string
        if (!/^\d{6}$/.test(code)) {
            setError('Code must be exactly 6 digits')
            return
        }

        startTransition(async () => {
            const result = await resetPassword(null, formData)
            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
            }
        })
    }

    if (success) {
        return (
            <Card className="glass-card shadow-2xl border-border/50 animate-scale-in backdrop-blur-2xl">
                <CardContent className="pt-16 pb-16 flex flex-col items-center text-center">
                    <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white mb-8 shadow-2xl shadow-emerald-500/40 animate-pulse-glow">
                        <CheckCircle2 className="h-14 w-14" />
                    </div>
                    <h2 className="text-3xl font-black text-foreground mb-4">Password Reset!</h2>
                    <p className="text-muted-foreground font-medium max-w-xs">
                        Your password has been successfully updated. Redirecting you to login...
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="glass-card shadow-2xl border-border/50 backdrop-blur-2xl">
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-black">Verification</CardTitle>
                <CardDescription className="text-base font-medium">
                    We sent a 6-digit code to <span className="text-foreground font-bold">{email}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
                <form action={handleSubmit} className="space-y-6">
                    <input type="hidden" name="email" value={email} />

                    <div className="space-y-2">
                        <label htmlFor="code" className="text-sm font-bold leading-none text-foreground text-center block">
                            Enter 6-digit code
                        </label>
                        <Input
                            id="code"
                            name="code"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            placeholder="000000"
                            required
                            className="text-center text-3xl tracking-[0.5em] font-mono h-16"
                            onChange={(e) => {
                                // Only allow digits
                                e.target.value = e.target.value.replace(/\D/g, '')
                            }}
                        />
                        <p className="text-xs text-muted-foreground text-center font-medium">
                            Check your email for the verification code
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-bold leading-none text-foreground">
                            New Password
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-12 h-14 text-base"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                            Must be at least 8 characters
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-bold leading-none text-foreground">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pr-12 h-14 text-base"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-destructive font-bold">
                                Passwords do not match
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="text-sm font-bold text-destructive bg-destructive/10 p-4 rounded-xl border-2 border-destructive/30 text-center backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full h-14 text-base font-black mt-4" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                        {isPending ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default function ResetPasswordPage() {
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
                    <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center text-primary-foreground mb-6 shadow-2xl shadow-primary/40 animate-pulse-glow">
                        <ShieldCheck className="h-10 w-10" />
                    </div>
                    <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">Secure Reset</h1>
                    <p className="text-muted-foreground font-medium text-center max-w-sm">
                        Verify your identity to choose a new password.
                    </p>
                </div>

                <Suspense fallback={
                    <Card className="glass-card shadow-2xl border-border/50 h-96 flex items-center justify-center backdrop-blur-2xl">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </Card>
                }>
                    <ResetPasswordForm />
                </Suspense>

                <p className="mt-10 text-center text-sm text-muted-foreground font-medium">
                    Didn&apos;t receive the code?{' '}
                    <Link href="/forgot-password" className="text-primary font-bold hover:text-accent transition-colors">
                        Try again
                    </Link>
                </p>
            </div>
        </div>
    )
}
