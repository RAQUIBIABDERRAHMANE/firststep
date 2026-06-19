'use client'

import { useState, useTransition } from 'react'
import {
    generateRecoveryCodes,
    saveRecoveryEmail,
    getRecoverySettings,
} from '@/app/actions/auth'
import { useActionState } from 'react'
import {
    ShieldCheck, KeyRound, Mail, RefreshCw, Eye, EyeOff,
    Copy, CheckCircle2, AlertTriangle, AlertCircle, Download
} from 'lucide-react'

interface Props {
    initialRecoveryEmail: string | null
    initialCodesCount: number
}

function StatusMessage({ state }: { state: { success?: boolean; message?: string; error?: string } | null }) {
    if (!state) return null
    if (state.success) return (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0" />{state.message}
        </div>
    )
    if (state.error) return (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />{state.error}
        </div>
    )
    return null
}

export default function SecuritySettings({ initialRecoveryEmail, initialCodesCount }: Props) {
    const [codesCount, setCodesCount] = useState(initialCodesCount)
    const [revealedCodes, setRevealedCodes] = useState<string[] | null>(null)
    const [showCodes, setShowCodes] = useState(false)
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
    const [genPending, startGenTransition] = useTransition()
    const [emailState, emailAction, emailPending] = useActionState(saveRecoveryEmail, null)

    const handleGenerate = () => {
        startGenTransition(async () => {
            const result = await generateRecoveryCodes()
            if ('codes' in result && result.codes) {
                setRevealedCodes(result.codes)
                setCodesCount(result.codes.length)
                setShowCodes(true)
            }
        })
    }

    const handleCopy = (code: string, idx: number) => {
        navigator.clipboard.writeText(code)
        setCopiedIdx(idx)
        setTimeout(() => setCopiedIdx(null), 2000)
    }

    const handleDownload = () => {
        if (!revealedCodes) return
        const text = [
            'FirstStep — Codes de récupération 2FA',
            '======================================',
            'Gardez ces codes en lieu sûr. Chaque code ne peut être utilisé qu\'une seule fois.',
            '',
            ...revealedCodes.map((c, i) => `${i + 1}. ${c}`),
            '',
            `Généré le : ${new Date().toLocaleString('fr-FR')}`,
        ].join('\n')
        const blob = new Blob([text], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'firststep-recovery-codes.txt'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-3 px-1">
                <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                    <h2 className="font-semibold text-slate-900">Sécurité 2FA</h2>
                    <p className="text-xs text-slate-500">Configurez vos options de récupération si vous perdez accès à votre email.</p>
                </div>
            </div>

            {/* ── Recovery Email ── */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <h3 className="font-semibold text-slate-900 text-sm">Email de secours</h3>
                </div>
                <form action={emailAction} className="p-6 space-y-4">
                    <p className="text-sm text-slate-500">
                        Si vous n'avez pas accès à votre email principal, un code de vérification sera envoyé à cette adresse.
                    </p>
                    <StatusMessage state={emailState} />
                    <div className="space-y-1.5">
                        <label htmlFor="recoveryEmail" className="text-sm font-medium text-slate-700">
                            Adresse email de secours
                        </label>
                        <input
                            id="recoveryEmail"
                            name="recoveryEmail"
                            type="email"
                            defaultValue={initialRecoveryEmail || ''}
                            placeholder="backup@example.com"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                        {initialRecoveryEmail && (
                            <p className="text-xs text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Email configuré : <span className="font-medium">{initialRecoveryEmail}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={emailPending}
                            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all"
                        >
                            {emailPending ? 'Enregistrement…' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Recovery Codes ── */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-slate-400" />
                    <h3 className="font-semibold text-slate-900 text-sm">Codes de récupération</h3>
                    {codesCount > 0 && (
                        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${codesCount <= 2 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {codesCount} restant{codesCount > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-500">
                        Ces codes à usage unique vous permettent de vous connecter si vous n'avez pas accès à votre email.
                        <strong className="text-slate-700"> Conservez-les en lieu sûr.</strong>
                    </p>

                    {codesCount <= 2 && codesCount > 0 && (
                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-700">
                                <strong>Attention :</strong> Il ne vous reste que {codesCount} code{codesCount > 1 ? 's' : ''}.
                                Régénérez-les avant de les épuiser.
                            </p>
                        </div>
                    )}

                    {codesCount === 0 && !revealedCodes && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">
                                Vous n'avez aucun code de récupération actif. Générez-en maintenant.
                            </p>
                        </div>
                    )}

                    {/* Revealed codes grid */}
                    {revealedCodes && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vos codes (à copier maintenant)</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowCodes(s => !s)}
                                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                                    >
                                        {showCodes ? <><EyeOff className="h-3.5 w-3.5" /> Masquer</> : <><Eye className="h-3.5 w-3.5" /> Afficher</>}
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                    >
                                        <Download className="h-3.5 w-3.5" /> Télécharger
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {revealedCodes.map((code, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                                    >
                                        <code className={`text-sm font-mono font-bold tracking-widest ${showCodes ? 'text-slate-800' : 'text-transparent select-none bg-slate-300 rounded'}`}>
                                            {showCodes ? code : '••••-••••'}
                                        </code>
                                        <button
                                            onClick={() => handleCopy(code, i)}
                                            className="shrink-0 text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {copiedIdx === i
                                                ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                                : <Copy className="h-3.5 w-3.5" />
                                            }
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                                ⚠️ Ces codes ne seront plus visibles après avoir quitté cette page. Téléchargez-les ou copiez-les maintenant.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={genPending}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-xl hover:bg-slate-900 disabled:opacity-50 transition-all active:scale-95"
                    >
                        {genPending
                            ? <><RefreshCw className="h-4 w-4 animate-spin" /> Génération…</>
                            : <><RefreshCw className="h-4 w-4" /> {codesCount > 0 ? 'Régénérer les codes' : 'Générer 8 codes'}</>
                        }
                    </button>
                    {codesCount > 0 && (
                        <p className="text-xs text-slate-400">
                            ⚠️ Régénérer invalide tous vos codes actuels.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
