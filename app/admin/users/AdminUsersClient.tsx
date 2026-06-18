'use client'

import { useState, useTransition } from 'react'
import { deleteUser } from '@/app/actions/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Trash2, AlertTriangle, X, Search, Users, Globe, CheckCircle2 } from 'lucide-react'

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-red-50 border-b border-red-100 px-6 py-5 flex items-start gap-4">
                    <div className="h-11 w-11 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-bold text-slate-900">Supprimer le client</h3>
                        <p className="text-sm text-slate-500 mt-0.5">Cette action est <strong>irréversible</strong>.</p>
                    </div>
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{user.companyName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ce qui sera supprimé :</p>
                        <ul className="space-y-1.5">
                            {[
                                `Compte utilisateur`,
                                `${user.websites.length} site(s) web`,
                                `Toutes les commandes, tables, menus`,
                                `Toutes les réservations & rapports`,
                                `Historique de paiements`,
                            ].map(item => (
                                <li key={item} className="flex items-center gap-2 text-sm text-red-600">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isPending}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-all disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all disabled:opacity-60 active:scale-95 shadow-lg shadow-red-200"
                    >
                        {isPending ? (
                            <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Suppression…
                            </>
                        ) : (
                            <>
                                <Trash2 size={14} />
                                Supprimer définitivement
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
                }, 600)
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

            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Directory</h1>
                        <p className="text-slate-500 mt-1">
                            {users.filter(u => u.role !== 'ADMIN').length} client(s) sur la plateforme
                        </p>
                    </div>
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Rechercher un client…"
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                        />
                    </div>
                </div>

                {/* Error banner */}
                {errorMsg && (
                    <div className="flex items-center gap-3 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm">
                        <AlertTriangle size={15} />
                        {errorMsg}
                        <button onClick={() => setErrorMsg('')} className="ml-auto"><X size={14} /></button>
                    </div>
                )}

                {/* Clients table */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Users size={16} className="text-blue-500" />
                            Clients ({clients.length})
                        </CardTitle>
                        <CardDescription>Comptes clients actifs sur la plateforme.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {clients.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <Users size={32} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm">Aucun client trouvé</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            <th className="px-5 py-3 text-left">Entreprise / Email</th>
                                            <th className="px-5 py-3 text-left">Services</th>
                                            <th className="px-5 py-3 text-left">Sites</th>
                                            <th className="px-5 py-3 text-left">Inscrit le</th>
                                            <th className="px-5 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {clients.map(u => (
                                            <tr
                                                key={u.id}
                                                className={`group transition-all duration-300 ${
                                                    successId === u.id
                                                        ? 'bg-red-50 opacity-50 scale-95'
                                                        : 'bg-white hover:bg-slate-50'
                                                }`}
                                            >
                                                {/* Company / Email */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                                                            {u.companyName?.[0]?.toUpperCase() || 'C'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{u.companyName}</p>
                                                            <p className="text-xs text-slate-400">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Services */}
                                                <td className="px-5 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {u.services.filter(s => s.isActive).length === 0 ? (
                                                            <span className="text-xs text-slate-400">Aucun</span>
                                                        ) : (
                                                            u.services.filter(s => s.isActive).map(s => (
                                                                <span
                                                                    key={s.service.slug}
                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-100"
                                                                >
                                                                    {s.service.name}
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Sites */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-1.5 text-slate-600">
                                                        <Globe size={13} className="text-slate-400" />
                                                        <span className="font-medium">{u.websites.length}</span>
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="px-5 py-4 text-xs text-slate-400">
                                                    {new Date(u.createdAt).toLocaleDateString('fr-FR', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-4 text-right">
                                                    {successId === u.id ? (
                                                        <CheckCircle2 size={16} className="text-red-400 inline" />
                                                    ) : (
                                                        <button
                                                            onClick={() => handleDelete(u)}
                                                            disabled={isPending}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all disabled:opacity-40 opacity-0 group-hover:opacity-100 active:scale-95"
                                                        >
                                                            <Trash2 size={12} />
                                                            Supprimer
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Admins table (read-only, no delete) */}
                {adminList.length > 0 && (
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                Administrateurs ({adminList.length})
                            </CardTitle>
                            <CardDescription>Comptes administrateurs — ne peuvent pas être supprimés.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            <th className="px-5 py-3 text-left">Compte</th>
                                            <th className="px-5 py-3 text-left">Rôle</th>
                                            <th className="px-5 py-3 text-left">Inscrit le</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {adminList.map(u => (
                                            <tr key={u.id} className="bg-white hover:bg-slate-50">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                            {u.companyName?.[0]?.toUpperCase() || 'A'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{u.companyName}</p>
                                                            <p className="text-xs text-slate-400">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                                        ADMIN
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-xs text-slate-400">
                                                    {new Date(u.createdAt).toLocaleDateString('fr-FR', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    )
}
