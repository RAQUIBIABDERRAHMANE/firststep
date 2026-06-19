'use client'

import { Suspense, useState, useTransition, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { signIn, verify2FA, resend2FACode } from '@/app/actions/auth'
import { Loader2, Mail, Lock, ArrowLeft, Sparkles, ShieldCheck, RotateCcw, ChevronLeft } from 'lucide-react'

// ─── OTP Input Row ────────────────────────────────────────────────────────────

function OTPInput({ onComplete }: { onComplete: (code: string) => void }) {
    const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
    const refs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (i: number, val: string) => {
        const char = val.replace(/\D/g, '').slice(-1)
        const next = [...digits]
        next[i] = char
        setDigits(next)

        if (char && i < 5) refs.current[i + 1]?.focus()

        const full = next.join('')
        if (full.length === 6) onComplete(full)
    }

    const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) {
            refs.current[i - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (!pasted) return
        const next = [...Array(6).fill('')]
        pasted.split('').forEach((c, idx) => { next[idx] = c })
        setDigits(next)
        const focusIdx = Math.min(pasted.length, 5)
        refs.current[focusIdx]?.focus()
        if (pasted.length === 6) onComplete(pasted)
    }

    return (
        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {digits.map((d, i) => (
                <input
                    key={i}
                    ref={el => { refs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    autoFocus={i === 0}
                    className={`w-12 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all
                        ${d ? 'border-primary bg-primary/5 text-foreground shadow-sm shadow-primary/20'
                            : 'border-border bg-background text-foreground'}
                        focus:border-primary focus:ring-2 focus:ring-primary/20 focus:scale-110`}
                />
            ))}
        </div>
    )
}

// ─── Resend Timer ─────────────────────────────────────────────────────────────

function ResendButton({ email, onResent }: { email: string; onResent: () => void }) {
    const [seconds, setSeconds] = useState(60)
    const [isPending, startTransition] = useTransition()
    const [resendError, setResendError] = useState('')

    useEffect(() => {
        if (seconds <= 0) return
        const t = setTimeout(() => setSeconds(s => s - 1), 1000)
        return () => clearTimeout(t)
    }, [seconds])

    const handleResend = () => {
        setResendError('')
        startTransition(async () => {
            const result = await resend2FACode(email)
            if ('error' in result) {
                setResendError(result.error || 'Erreur')
            } else {
                setSeconds(60)
                onResent()
            }
        })
    }

    return (
        <div className="text-center space-y-1">
            {resendError && <p className="text-xs text-destructive">{resendError}</p>}
            {seconds > 0 ? (
                <p className="text-sm text-muted-foreground">
                    Renvoyer le code dans <span className="font-bold text-foreground tabular-nums">{seconds}s</span>
                </p>
            ) : (
                <button
                    onClick={handleResend}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors disabled:opacity-50"
                >
                    {isPending
                        ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Envoi…</>
                        : <><RotateCcw className="h-3.5 w-3.5" /> Renvoyer le code</>
                    }
                </button>
            )}
        </div>
    )
}

// ─── Main Form ────────────────────────────────────────────────────────────────

function LoginForm() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
    const [pendingEmail, setPendingEmail] = useState('')
    const [pendingRedirect, setPendingRedirect] = useState('')
    const [otpCode, setOtpCode] = useState('')
    const [resentNotice, setResentNotice] = useState(false)

    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/dashboard'

    // ── Step 1: Validate credentials ─────────────────────────────────────────

    async function handleCredentials(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await signIn(null, formData)
            if (!result) return // redirected
            if ('error' in result) {
                setError(result.error ?? null)
                return
            }
            if (result.requires2FA) {
                setPendingEmail(result.email)
                setPendingRedirect(result.redirectTo || redirectTo)
                setStep('otp')
            }
        })
    }

    // ── Step 2: Verify OTP ────────────────────────────────────────────────────

    async function handleOTP(code?: string) {
        const finalCode = code || otpCode
        if (finalCode.length !== 6) return
        setError(null)
        startTransition(async () => {
            const fd = new FormData()
            fd.append('email', pendingEmail)
            fd.append('code', finalCode)
            fd.append('redirectTo', pendingRedirect)
            const result = await verify2FA(null, fd)
            if (result?.error) setError(result.error)
        })
    }

    // ── Shared background / wrapper ───────────────────────────────────────────

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.15),transparent_40%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.1),transparent_40%)]" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

            <div className="w-full max-w-md animate-scale-in relative z-10">

                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
                    <img
                        src="/og-image.png"
                        alt="FirstStep Logo"
                        className="h-16 w-16 rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300"
                    />
                    <span className="text-3xl font-black gradient-text">FirstStep</span>
                </Link>

                {/* ── STEP 1: Credentials ── */}
                {step === 'credentials' && (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">Welcome Back</h1>
                            <p className="text-muted-foreground font-medium">Sign in to access your dashboard</p>
                        </div>

                        <Card className="glass-card shadow-2xl border-border/50 backdrop-blur-2xl">
                            <CardContent className="pt-8 pb-8 px-8">
                                <form action={handleCredentials} className="space-y-6">
                                    <input type="hidden" name="redirectTo" value={redirectTo} />

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-bold leading-none text-foreground flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-primary" />
                                            Email Address
                                        </label>
                                        <Input id="email" name="email" type="email" placeholder="name@company.com" required className="h-14 text-base" />
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
                                        <Input id="password" name="password" type="password" placeholder="••••••••" required className="h-14 text-base" />
                                    </div>

                                    {error && (
                                        <div className="text-sm font-bold text-destructive bg-destructive/10 p-4 rounded-xl border-2 border-destructive/30 backdrop-blur-sm animate-shake">
                                            {error}
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full h-14 text-base font-black" disabled={isPending}>
                                        {isPending ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Vérification…</>
                                        ) : (
                                            <><Sparkles className="mr-2 h-5 w-5" /> Sign In</>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* ── STEP 2: OTP ── */}
                {step === 'otp' && (
                    <>
                        <div className="text-center mb-8">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border-2 border-primary/20 mb-4">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-3xl font-black text-foreground mb-2 tracking-tight">Vérification 2FA</h1>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Un code à 6 chiffres a été envoyé à<br />
                                <span className="font-bold text-foreground">{pendingEmail}</span>
                            </p>
                        </div>

                        <Card className="glass-card shadow-2xl border-border/50 backdrop-blur-2xl">
                            <CardContent className="pt-8 pb-8 px-8 space-y-6">
                                {/* OTP inputs */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-foreground text-center">
                                        Entrez votre code de vérification
                                    </label>
                                    <OTPInput onComplete={(code) => { setOtpCode(code); handleOTP(code) }} />
                                </div>

                                {error && (
                                    <div className="text-sm font-bold text-destructive bg-destructive/10 p-4 rounded-xl border-2 border-destructive/30 text-center">
                                        {error}
                                    </div>
                                )}

                                {resentNotice && (
                                    <div className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center font-medium">
                                        ✅ Nouveau code envoyé !
                                    </div>
                                )}

                                {/* Confirm button */}
                                <Button
                                    onClick={() => handleOTP()}
                                    disabled={otpCode.length !== 6 || isPending}
                                    className="w-full h-14 text-base font-black"
                                >
                                    {isPending
                                        ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Vérification…</>
                                        : <><ShieldCheck className="mr-2 h-5 w-5" /> Confirmer</>
                                    }
                                </Button>

                                {/* Resend */}
                                <ResendButton
                                    email={pendingEmail}
                                    onResent={() => { setResentNotice(true); setTimeout(() => setResentNotice(false), 3000) }}
                                />
                            </CardContent>
                        </Card>

                        {/* Back to Step 1 */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => { setStep('credentials'); setError(null); setOtpCode('') }}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-all"
                            >
                                <ChevronLeft className="h-4 w-4" /> Changer d&apos;adresse email
                            </button>
                        </div>
                    </>
                )}

                {step === 'credentials' && (
                    <>
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
                    </>
                )}
            </div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
            <LoginForm />
        </Suspense>
    )
}
