'use client'

import { useState, useTransition } from 'react'
import { deleteUser } from '@/app/actions/admin'
import { Trash2, AlertTriangle, X, Search, Users, Globe, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react'

interface UserService {
    service: { name: string; slug: string }
    isActive: boolean
}

interface UserData {
    id: string
    companyName: string
    email: string
    role: string
    createdAt: string
    services: UserService[]
    websites: { id: string }[]
}

interface Props {
    users: UserData[]
    currentAdminId: string
}

function ConfirmDeleteModal({
    user,
    onConfirm,
    onCancel,
    isPending,
}: {
    user: UserData
    onConfirm: () => void
    onCancel: () => void
    isPending: boolean
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-rose-50 border-b border-rose-100 px-6 py-5 flex items-start gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-bold text-slate-900">Supprimer le client</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Cette action est <strong>irréversible</strong>.</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <p className="text-sm font-bold text-slate-900">{user.companyName || 'Sans entreprise'}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Éléments qui seront supprimés :</p>
                        <ul className="space-y-1.5 text-xs">
                            {[
                                `Compte utilisateur & identifiants`,
                                `${user.websites.length} site(s) web configuré(s)`,
                                `Toutes les commandes, tables et menus`,
                                `Toutes les réservations et rapports`,
                                `Historique complet des paiements & factures`,
                            ].map(item => (
                                <li key={item} className="flex items-center gap-2 text-rose-600 font-medium">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isPending}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-all disabled:opacity-50 cursor-pointer"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all disabled:opacity-60 cursor-pointer shadow-sm hover:shadow-md"
                    >
                        {isPending ? (
                            <>
                                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Suppression en cours…
                            </>
                        ) : (
                            <>
                                <Trash2 size={13} />
                                Confirmer la suppression
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function AdminUsersClient({ users: initialUsers, currentAdminId }: Props) {
    const [users, setUsers] = useState<UserData[]>(initialUsers)
    const [search, setSearch] = useState('')
    const [toDelete, setToDelete] = useState<UserData | null>(null)
    const [successId, setSuccessId] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [isPending, startTransition] = useTransition()

    const filtered = users.filter(u =>
        u.companyName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = (user: UserData) => {
        setErrorMsg('')
        setToDelete(user)
    }

    const confirmDelete = () => {
        if (!toDelete) return
        startTransition(async () => {
            const result = await deleteUser(toDelete.id)
            if ('error' in result) {
                setErrorMsg(result.error || 'Erreur')
                setToDelete(null)
            } else {
                setSuccessId(toDelete.id)
                setTimeout(() => {
                    setUsers(prev => prev.filter(u => u.id !== toDelete.id))
                    setSuccessId(null)
                    setToDelete(null)
                }, 500)
            }
        })
    }

    const clients = filtered.filter(u => u.role !== 'ADMIN')
    const adminList = filtered.filter(u => u.role === 'ADMIN')

    return (
        <>
            {toDelete && (
                <ConfirmDeleteModal
                    user={toDelete}
                    onConfirm={confirmDelete}
                    onCancel={() => setToDelete(null)}
                    isPending={isPending}
                />
            )}

            <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-xs font-bold">
                                Annuaire des Comptes
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                                {users.length} comptes au total
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                            Répertoire des Utilisateurs
                        </h1>
                        <p className="text-sm text-slate-500">
                            Consultez les entreprises clientes, leurs modules actifs et leurs sites déployés.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-80">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Rechercher par nom, email…"
                            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-slate-200 rounded-2xl bg-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-xs transition-all placeholder-slate-400"
                        />
                    </div>
                </div>

                {/* Error banner */}
                {errorMsg && (
                    <div className="flex items-center gap-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl px-4 py-3 text-xs font-semibold">
                        <AlertTriangle size={15} />
                        <span>{errorMsg}</span>
                        <button onClick={() => setErrorMsg('')} className="ml-auto cursor-pointer"><X size={14} /></button>
                    </div>
                )}

                {/* Clients Table Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-cyan-600" />
                            <h2 className="text-sm font-bold text-slate-900">Comptes Clients</h2>
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                                {clients.length}
                            </span>
                        </div>
                    </div>

                    {clients.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 space-y-2">
                            <Users size={32} className="mx-auto opacity-30" />
                            <p className="text-xs">Aucun compte client trouvé</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-3.5 text-left">Entreprise / Contact</th>
                                        <th className="px-6 py-3.5 text-left">Services Actifs</th>
                                        <th className="px-6 py-3.5 text-left">Sites Web</th>
                                        <th className="px-6 py-3.5 text-left">Date d&apos;inscription</th>
                                        <th className="px-6 py-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {clients.map(u => (
                                        <tr
                                            key={u.id}
                                            className={`hover:bg-slate-50/70 transition-colors group ${
                                                successId === u.id ? 'opacity-0 scale-95 transition-all duration-500' : ''
                                            }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/80 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                                                        {u.companyName?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-slate-900 text-xs truncate">
                                                            {u.companyName || 'Sans entreprise'}
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 font-mono truncate">
                                                            {u.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {u.services.length === 0 ? (
                                                        <span className="text-xs text-slate-400 italic">Aucun service</span>
                                                    ) : (
                                                        u.services.map(s => (
                                                            <span
                                                                key={s.service.slug}
                                                                className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200/60"
                                                            >
                                                                {s.service.name}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{u.websites.length} site(s)</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {new Date(u.createdAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(u)}
                                                    title="Supprimer ce compte"
                                                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Administrators List Card */}
                {adminList.length > 0 && (
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-cyan-600" />
                            <h2 className="text-sm font-bold text-slate-900">Administrateurs Système</h2>
                            <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 text-[10px] font-bold">
                                {adminList.length}
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {adminList.map(adm => (
                                <div key={adm.id} className="px-6 py-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-2xl bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 flex items-center justify-center font-bold text-xs">
                                            AD
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                                {adm.companyName || 'Super Administrateur'}
                                                <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-700 text-[9px] font-extrabold border border-cyan-500/20">
                                                    ADMIN
                                                </span>
                                            </p>
                                            <p className="text-[11px] text-slate-400 font-mono">{adm.email}</p>
                                        </div>
                                    </div>
                                    {adm.id === currentAdminId && (
                                        <span className="text-[11px] text-slate-400 font-semibold bg-slate-100 px-2.5 py-1 rounded-xl">
                                            Votre session actuelle
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
