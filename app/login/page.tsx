'use client'

import { Suspense, useState, useTransition, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import {
    signIn, verify2FA, resend2FACode,
    verifyWithRecoveryCode, sendRecoveryEmailCode, verifyWithRecoveryEmail,
} from '@/app/actions/auth'
import { Loader2, Mail, Lock, ArrowLeft, Sparkles, ShieldCheck, RotateCcw, ChevronLeft, KeyRound, MailCheck, Eye, EyeOff, CheckCircle2, ArrowRight, TrendingUp, Star, Activity, BarChart3, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── OTP Input Row ────────────────────────────────────────────────────────────

function OTPInput({ onComplete, numeric = true }: { onComplete: (code: string) => void; numeric?: boolean }) {
    const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
    const refs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (i: number, val: string) => {
        const char = numeric
            ? val.replace(/\D/g, '').slice(-1)
            : val.slice(-1).toUpperCase()
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
        const pasted = e.clipboardData.getData('text').replace(/[^A-Z0-9\-]/gi, '').toUpperCase().slice(0, 6)
        if (!pasted) return
        const next = [...Array(6).fill('')]
        pasted.split('').forEach((c, idx) => { next[idx] = c })
        setDigits(next)
        refs.current[Math.min(pasted.length, 5)]?.focus()
        if (pasted.length === 6) onComplete(pasted)
    }

    return (
        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {digits.map((d, i) => (
                <input
                    key={i}
                    ref={el => { refs.current[i] = el }}
                    type="text"
                    inputMode={numeric ? 'numeric' : 'text'}
                    maxLength={1}
                    value={d}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    autoFocus={i === 0}
                    className={`w-11 h-13 text-center text-xl font-syne font-black rounded-xl border-2 outline-none transition-all
                        ${d ? 'border-[#0066FF] bg-blue-50/50 text-[#0066FF] shadow-sm'
                            : 'border-slate-200 bg-slate-50/80 text-slate-900'}
                        focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 focus:bg-white`}
                />
            ))}
        </div>
    )
}

// ─── Recovery Code Input ──────────────────────────────────────────────────────

function RecoveryCodeInput({ onChange }: { onChange: (val: string) => void }) {
    return (
        <input
            type="text"
            maxLength={9}
            placeholder="XXXX-XXXX"
            onChange={e => {
                let v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                if (v.length > 4) v = v.slice(0, 4) + '-' + v.slice(4, 8)
                e.target.value = v
                onChange(v)
            }}
            className="w-full text-center text-lg font-mono font-bold tracking-widest h-12 border-2 border-slate-200 rounded-xl bg-slate-50/80 text-slate-900 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 focus:bg-white outline-none transition-all"
        />
    )
}

// ─── Resend Button ────────────────────────────────────────────────────────────

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
            {resendError && <p className="text-xs text-red-600 font-medium">{resendError}</p>}
            {seconds > 0 ? (
                <p className="text-xs font-figtree text-slate-500">
                    Renvoyer dans <span className="font-bold text-slate-900 tabular-nums">{seconds}s</span>
                </p>
            ) : (
                <button onClick={handleResend} disabled={isPending}
                    className="inline-flex items-center gap-1.5 text-xs font-figtree font-bold text-[#0066FF] hover:text-blue-700 transition-colors disabled:opacity-50">
                    {isPending ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Envoi…</> : <><RotateCcw className="h-3.5 w-3.5" /> Renvoyer le code</>}
                </button>
            )}
        </div>
    )
}

// ─── Main Form ────────────────────────────────────────────────────────────────

type RecoveryMode = 'none' | 'recovery-code' | 'recovery-email'

function LoginForm() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
    const [pendingEmail, setPendingEmail] = useState('')
    const [pendingRedirect, setPendingRedirect] = useState('')
    const [otpCode, setOtpCode] = useState('')
    const [recoveryMode, setRecoveryMode] = useState<RecoveryMode>('none')
    const [recoveryCode, setRecoveryCode] = useState('')
    const [recoveryEmailOtp, setRecoveryEmailOtp] = useState('')
    const [maskedRecoveryEmail, setMaskedRecoveryEmail] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [resentNotice, setResentNotice] = useState(false)

    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/dashboard'

    // ── Step 1 ────────────────────────────────────────────────────────────────
    async function handleCredentials(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await signIn(null, formData)
            if (!result) return
            if ('error' in result) { setError(result.error ?? null); return }
            if (result.requires2FA) {
                setPendingEmail(result.email)
                setPendingRedirect(result.redirectTo || redirectTo)
                setStep('otp')
            }
        })
    }

    // ── Step 2a: OTP ──────────────────────────────────────────────────────────
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

    // ── Step 2b: Recovery code ────────────────────────────────────────────────
    async function handleRecoveryCode() {
        if (recoveryCode.length < 9) return
        setError(null)
        startTransition(async () => {
            const fd = new FormData()
            fd.append('email', pendingEmail)
            fd.append('code', recoveryCode)
            fd.append('redirectTo', pendingRedirect)
            const result = await verifyWithRecoveryCode(null, fd)
            if (result?.error) setError(result.error)
        })
    }

    // ── Step 2c: Recovery email ───────────────────────────────────────────────
    async function switchToRecoveryEmail() {
        setError(null)
        startTransition(async () => {
            const result = await sendRecoveryEmailCode(pendingEmail)
            if ('error' in result) { setError(result.error || 'Erreur'); return }
            setMaskedRecoveryEmail(result.maskedEmail || '')
            setRecoveryMode('recovery-email')
        })
    }

    async function handleRecoveryEmailOTP(code?: string) {
        const finalCode = code || recoveryEmailOtp
        if (finalCode.length !== 6) return
        setError(null)
        startTransition(async () => {
            const fd = new FormData()
            fd.append('email', pendingEmail)
            fd.append('code', finalCode)
            fd.append('redirectTo', pendingRedirect)
            const result = await verifyWithRecoveryEmail(null, fd)
            if (result?.error) setError(result.error)
        })
    }

    const resetRecovery = () => { setRecoveryMode('none'); setError(null); setRecoveryCode(''); setRecoveryEmailOtp('') }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FAFBFD] text-slate-900 overflow-hidden font-figtree">

            {/* ── LEFT SHOWCASE COLUMN (Visible on lg screens) ── */}
            <div className="hidden lg:flex lg:col-span-7 relative p-12 flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-50/60 via-slate-50 to-blue-100/40 border-r border-slate-200/80">
                
                {/* Ambient Radial Blur Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-400/20 via-sky-300/10 to-transparent blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-emerald-300/15 via-blue-300/10 to-transparent blur-3xl pointer-events-none" />

                {/* Top Logo */}
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="h-11 w-11 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform duration-300">
                            <img src="/Untitled design (13).png" alt="FirstStep Logo" className="h-full w-full object-contain" />
                        </div>
                        <span className="font-syne font-black text-2xl tracking-tight text-slate-900">FirstStep</span>
                    </Link>
                </div>

                {/* Center Floating 3D Product Dashboard Visual */}
                <div className="relative z-10 my-auto py-8">
                    <div className="max-w-xl mx-auto space-y-6">
                        
                        {/* Eyebrow Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-blue-200/80 shadow-sm backdrop-blur-md">
                            <Sparkles className="h-4 w-4 text-[#0066FF]" />
                            <span className="font-figtree text-[11px] font-bold uppercase tracking-[0.2em] text-[#0066FF]">
                                Business OS · Maroc
                            </span>
                        </div>

                        {/* Display Title */}
                        <h2 className="font-syne font-black text-4xl xl:text-5xl leading-[1.05] text-slate-900">
                            Pilotez votre entreprise avec <span className="text-[#0066FF]">précision.</span>
                        </h2>

                        {/* Interactive 3D Mockup Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-6 shadow-2xl shadow-slate-900/10 relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF]">
                                        <BarChart3 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-syne text-base font-bold text-slate-900">Tableau de Bord Live</div>
                                        <div className="font-figtree text-[11px] text-slate-500">Mise à jour instantanée</div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    +32.8% Croissance
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                    <div className="text-[11px] text-slate-500 font-medium">Revenu du Mois</div>
                                    <div className="font-syne text-xl font-black text-slate-900">485 200 MAD</div>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                    <div className="text-[11px] text-slate-500 font-medium">Commandes Valides</div>
                                    <div className="font-syne text-xl font-black text-[#0066FF]">1 420 MAD avg</div>
                                </div>
                            </div>

                            {/* Mini SVG Curve */}
                            <div className="h-16 w-full pt-1">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 50" preserveAspectRatio="none">
                                    <path
                                        d="M 0,40 Q 50,10 100,30 T 200,10 T 300,20 L 300,50 L 0,50 Z"
                                        fill="#0066FF"
                                        fillOpacity="0.1"
                                    />
                                    <path
                                        d="M 0,40 Q 50,10 100,30 T 200,10 T 300,20"
                                        fill="none"
                                        stroke="#0066FF"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Glowing Testimonial Glass Card */}
                        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                            <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[#0066FF] to-sky-400 text-white font-syne font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                                LD
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-0.5 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="font-figtree text-[12.5px] text-slate-700 font-medium italic">
                                    &ldquo;FirstStep a automatisé la gestion de nos 3 établissements à Casablanca.&rdquo;
                                </p>
                                <span className="font-figtree text-[10.5px] text-slate-400 font-bold uppercase tracking-wider">
                                    Léa Dubois · Fondatrice Retail
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Trust Strip */}
                <div className="relative z-10 flex items-center justify-between text-[11.5px] text-slate-500 font-medium pt-4 border-t border-slate-200/60">
                    <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        500+ Entreprises au Maroc
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#0066FF]" />
                        Conforme CNDP & SSL
                    </span>
                </div>
            </div>

            {/* ── RIGHT AUTHENTICATION COLUMN (Login Form) ── */}
            <div className="col-span-12 lg:col-span-5 flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
                
                {/* Mobile Top Brand Logo */}
                <div className="lg:hidden flex flex-col items-center mb-6">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1">
                            <img src="/Untitled design (13).png" alt="FirstStep" className="h-full w-full object-contain" />
                        </div>
                        <span className="font-syne font-black text-xl text-slate-900">FirstStep</span>
                    </Link>
                </div>

                <div className="w-full max-w-md">

                    {/* ── STEP 1: Credentials ── */}
                    {step === 'credentials' && (
                        <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-7 md:p-9 shadow-2xl shadow-slate-900/8 relative overflow-hidden">
                            <div className="h-1.5 -mx-9 -mt-9 mb-8" style={{ background: 'linear-gradient(90deg, #0066FF, #10B981, #0066FF)' }} />

                            {/* Header Badge */}
                            <div className="rotating-border-wrapper mb-4 shadow-sm shadow-blue-500/10 inline-flex">
                                <div className="rotating-border-inner inline-flex items-center gap-2 px-3.5 py-1">
                                    <ShieldCheck className="h-3.5 w-3.5 text-[#0066FF]" />
                                    <span className="font-figtree text-[10.5px] font-bold uppercase tracking-[0.15em] text-[#0066FF]">
                                        Espace Client FirstStep
                                    </span>
                                </div>
                            </div>

                            <div className="mb-7">
                                <h1 className="font-syne font-black text-3xl text-slate-900 tracking-tight mb-1.5">
                                    Bienvenue à bord 👋
                                </h1>
                                <p className="font-figtree text-[14px] text-slate-500 font-medium">
                                    Accédez à l&apos;OS complet de votre entreprise
                                </p>
                            </div>

                            <form action={handleCredentials} className="space-y-4">
                                <input type="hidden" name="redirectTo" value={redirectTo} />

                                <div>
                                    <label htmlFor="email" className="block font-figtree text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5 text-[#0066FF]" />
                                        Adresse Email Professionnelle
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="nom@entreprise.ma"
                                        required
                                        className="h-11.5 bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl font-figtree text-[14px] focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label htmlFor="password" className="block font-figtree text-[10.5px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                            <Lock className="h-3.5 w-3.5 text-[#0066FF]" />
                                            Mot de passe
                                        </label>
                                        <Link href="/forgot-password" className="font-figtree text-[11.5px] font-bold text-[#0066FF] hover:underline transition-all">
                                            Mot de passe oublié ?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            required
                                            className="h-11.5 bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pr-10 font-figtree text-[14px] focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-figtree text-[13px] font-medium">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full h-12 inline-flex items-center justify-center gap-2 font-syne font-bold text-[14px] text-white rounded-xl transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 shadow-lg shadow-blue-500/25 mt-3"
                                    style={{ backgroundColor: '#0066FF' }}
                                >
                                    {isPending ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" />Connexion en cours...</>
                                    ) : (
                                        <>Se Connecter <ArrowRight className="h-4 w-4" /></>
                                    )}
                                </button>
                            </form>

                            {/* Divider & Signup Link */}
                            <div className="mt-7 pt-6 border-t border-slate-100 text-center font-figtree text-[13px] text-slate-500">
                                Pas encore de compte ?{' '}
                                <Link href="/#signup" className="font-bold text-[#0066FF] hover:underline">
                                    Essai gratuit (5 min)
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2: OTP / 2FA ── */}
                    {step === 'otp' && (
                        <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-7 md:p-9 shadow-2xl shadow-slate-900/8 relative overflow-hidden">
                            <div className="h-1.5 -mx-9 -mt-9 mb-8" style={{ background: 'linear-gradient(90deg, #0066FF, #10B981, #0066FF)' }} />

                            {/* Standard OTP */}
                            {recoveryMode === 'none' && (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-[#0066FF] mb-3">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <h1 className="font-syne font-black text-2xl text-slate-900 mb-1">Double Authentification</h1>
                                        <p className="font-figtree text-[13px] text-slate-500">
                                            Code envoyé à <span className="font-bold text-slate-900">{pendingEmail}</span>
                                        </p>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block font-figtree text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
                                                Entrez le code à 6 chiffres
                                            </label>
                                            <OTPInput onComplete={(code) => { setOtpCode(code); handleOTP(code) }} />
                                        </div>

                                        {error && (
                                            <div className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 font-figtree text-[12.5px] font-medium text-center">
                                                {error}
                                            </div>
                                        )}

                                        {resentNotice && (
                                            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-figtree text-[12px] font-medium text-center">
                                                ✅ Nouveau code envoyé !
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleOTP()}
                                            disabled={otpCode.length !== 6 || isPending}
                                            className="w-full h-12 inline-flex items-center justify-center gap-2 font-syne font-bold text-[14px] text-white rounded-xl transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 shadow-lg shadow-blue-500/25"
                                            style={{ backgroundColor: '#0066FF' }}
                                        >
                                            {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Vérification...</> : <><ShieldCheck className="h-4 w-4" />Confirmer</>}
                                        </button>

                                        <ResendButton email={pendingEmail} onResent={() => { setResentNotice(true); setTimeout(() => setResentNotice(false), 3000) }} />

                                        {/* Recovery options */}
                                        <div className="border-t border-slate-100 pt-4 space-y-2">
                                            <p className="text-[11px] text-center font-figtree text-slate-500">Un problème pour recevoir le code ?</p>
                                            <div className="flex flex-col gap-2">
                                                <button onClick={() => { setRecoveryMode('recovery-code'); setError(null) }}
                                                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-slate-200 font-figtree text-[12px] font-bold text-slate-700 hover:text-[#0066FF] hover:border-blue-200 transition-all">
                                                    <KeyRound className="h-3.5 w-3.5 text-[#0066FF]" /> Code de récupération
                                                </button>
                                                <button onClick={switchToRecoveryEmail} disabled={isPending}
                                                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-slate-200 font-figtree text-[12px] font-bold text-slate-700 hover:text-[#0066FF] hover:border-blue-200 transition-all disabled:opacity-50">
                                                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MailCheck className="h-3.5 w-3.5 text-[#0066FF]" />}
                                                    Email de secours
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Recovery Code mode */}
                            {recoveryMode === 'recovery-code' && (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mb-3">
                                            <KeyRound className="h-6 w-6" />
                                        </div>
                                        <h1 className="font-syne font-black text-2xl text-slate-900 mb-1">Code de secours</h1>
                                        <p className="font-figtree text-[13px] text-slate-500">Saisissez l&apos;un de vos codes de secours (XXXX-XXXX).</p>
                                    </div>

                                    <div className="space-y-4">
                                        <RecoveryCodeInput onChange={setRecoveryCode} />
                                        {error && (
                                            <div className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 font-figtree text-[12.5px] font-medium text-center">{error}</div>
                                        )}
                                        <button onClick={handleRecoveryCode} disabled={recoveryCode.length < 9 || isPending}
                                            className="w-full h-12 inline-flex items-center justify-center gap-2 font-syne font-bold text-[14px] text-white rounded-xl transition-all duration-200 hover:brightness-110 disabled:opacity-60 shadow-lg shadow-blue-500/25"
                                            style={{ backgroundColor: '#0066FF' }}>
                                            {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Vérification...</> : <>Valider le code</>}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Recovery Email OTP mode */}
                            {recoveryMode === 'recovery-email' && (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mb-3">
                                            <MailCheck className="h-6 w-6" />
                                        </div>
                                        <h1 className="font-syne font-black text-2xl text-slate-900 mb-1">Email de secours</h1>
                                        <p className="font-figtree text-[13px] text-slate-500">
                                            Code envoyé à <span className="font-bold text-slate-900">{maskedRecoveryEmail}</span>
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <OTPInput onComplete={(code) => { setRecoveryEmailOtp(code); handleRecoveryEmailOTP(code) }} />
                                        {error && (
                                            <div className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 font-figtree text-[12.5px] font-medium text-center">{error}</div>
                                        )}
                                        <button onClick={() => handleRecoveryEmailOTP()} disabled={recoveryEmailOtp.length !== 6 || isPending}
                                            className="w-full h-12 inline-flex items-center justify-center gap-2 font-syne font-bold text-[14px] text-white rounded-xl transition-all duration-200 hover:brightness-110 disabled:opacity-60 shadow-lg shadow-blue-500/25"
                                            style={{ backgroundColor: '#0066FF' }}>
                                            {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Vérification...</> : <><ShieldCheck className="h-4 w-4" />Confirmer</>}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Back navigation */}
                            <div className="mt-6 flex items-center justify-center gap-4">
                                {recoveryMode !== 'none' && (
                                    <button onClick={resetRecovery}
                                        className="inline-flex items-center gap-1 font-figtree text-[12px] font-bold text-slate-500 hover:text-[#0066FF] transition-colors">
                                        <ChevronLeft className="h-4 w-4" /> Retour au code email
                                    </button>
                                )}
                                {recoveryMode === 'none' && (
                                    <button onClick={() => { setStep('credentials'); setError(null); setOtpCode('') }}
                                        className="inline-flex items-center gap-1 font-figtree text-[12px] font-bold text-slate-500 hover:text-[#0066FF] transition-colors">
                                        <ChevronLeft className="h-4 w-4" /> Changer d&apos;adresse email
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bottom Home Link */}
                    <div className="mt-6 text-center">
                        <Link href="/" className="inline-flex items-center gap-1.5 font-figtree text-[12.5px] font-bold text-slate-500 hover:text-[#0066FF] transition-colors">
                            <ArrowLeft className="h-3.5 w-3.5" /> Retour au site principal
                        </Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#FAFBFD]"><Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" /></div>}>
            <LoginForm />
        </Suspense>
    )
}
