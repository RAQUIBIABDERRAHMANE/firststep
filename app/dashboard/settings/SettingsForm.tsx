'use client'

import { useActionState } from 'react'
import { updateProfile, updatePassword } from '@/app/actions/auth'
import { CheckCircle2, AlertCircle } from 'lucide-react'

function StatusMessage({ state }: { state: { success?: boolean; message?: string; error?: string } | null }) {
    if (!state) return null
    if (state.success) {
        return (
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {state.message}
            </div>
        )
    }
    if (state.error) {
        return (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {state.error}
            </div>
        )
    }
    return null
}

export default function SettingsForm({ user }: { user: { companyName: string | null; email: string } }) {
    const [profileState, profileAction, profilePending] = useActionState(updateProfile, null)
    const [passwordState, passwordAction, passwordPending] = useActionState(updatePassword, null)

    return (
        <div className="flex flex-col gap-6">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-semibold text-slate-900">Profil</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Gérez les informations de votre entreprise.</p>
                </div>
                <form action={profileAction} className="p-6 space-y-4">
                    <StatusMessage state={profileState} />
                    <div className="space-y-1.5">
                        <label htmlFor="companyName" className="text-sm font-medium text-slate-700">Nom de l&apos;entreprise</label>
                        <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            defaultValue={user.companyName || ''}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-400">L&apos;adresse email ne peut pas être modifiée.</p>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={profilePending}
                            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all"
                        >
                            {profilePending ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-semibold text-slate-900">Mot de passe</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Mettez à jour votre mot de passe.</p>
                </div>
                <form action={passwordAction} className="p-6 space-y-4">
                    <StatusMessage state={passwordState} />
                    <div className="space-y-1.5">
                        <label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">Mot de passe actuel</label>
                        <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirmer le mot de passe</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={passwordPending}
                            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all"
                        >
                            {passwordPending ? 'Mise à jour...' : 'Mettre à jour'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
