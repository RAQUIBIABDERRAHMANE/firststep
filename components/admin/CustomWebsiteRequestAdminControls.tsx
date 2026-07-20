'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { updateCustomWebsiteRequestStatus } from '@/app/actions/admin'
import { Badge } from '@/components/ui/Badge'
import { Loader2, MessageSquarePlus, RefreshCw, Send } from 'lucide-react'

interface CustomWebsiteRequestAdminControlsProps {
    requestId: string
    currentStatus: string
    adminNotes: any[]
}

export default function CustomWebsiteRequestAdminControls({
    requestId,
    currentStatus,
    adminNotes = []
}: CustomWebsiteRequestAdminControlsProps) {
    const [status, setStatus] = useState(currentStatus)
    const [noteText, setNoteText] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const result = await updateCustomWebsiteRequestStatus(requestId, status, noteText)
            if (result.error) {
                setMessage({ type: 'error', text: result.error })
            } else {
                setMessage({ type: 'success', text: 'Statut et notes mis à jour avec succès !' })
                setNoteText('') // clear note input
                // Reload window to update state
                window.location.reload()
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Une erreur est survenue.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleUpdate} className="mt-4 p-5 bg-blue-50/30 border border-blue-100 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-50 pb-2">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest flex items-center gap-1.5 font-syne">
                    <MessageSquarePlus className="h-4 w-4" />
                    Suivi Projet (Admin)
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">Statut:</span>
                    <Badge variant={currentStatus === 'COMPLETED' ? 'success' : 'warning'} className="text-[9px] px-2 py-0.5 rounded-full font-bold">
                        {currentStatus === 'PENDING' ? 'Étude en cours' :
                         currentStatus === 'REVIEWING' ? 'Maquette UX/UI' :
                         currentStatus === 'IN_PROGRESS' ? 'Développement' : 'Site en ligne'}
                    </Badge>
                </div>
            </div>

            {message && (
                <div className={`
                    p-3 rounded-xl text-xs font-semibold border
                    ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-600'}
                `}>
                    {message.text}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Changer le statut du projet</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full h-10 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                        <option value="PENDING">Étude des besoins (PENDING)</option>
                        <option value="REVIEWING">Maquettage UX/UI (REVIEWING)</option>
                        <option value="IN_PROGRESS">Développement actif (IN_PROGRESS)</option>
                        <option value="COMPLETED">Projet livré / en ligne (COMPLETED)</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ajouter une note de suivi (optionnel)</label>
                    <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Ex: Première version de la maquette envoyée par email..."
                        className="w-full h-10 px-4 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <Button disabled={loading} size="sm" type="submit" className="gap-1.5 text-xs px-5 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">
                    {loading ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Enregistrement...
                        </>
                    ) : (
                        <>
                            Mettre à jour le projet
                            <Send className="h-3 w-3" />
                        </>
                    )}
                </Button>
            </div>
            
            {adminNotes.length > 0 && (
                <div className="border-t border-slate-100 pt-3 mt-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Historique des notes admin</span>
                    <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                        {adminNotes.map((note: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex justify-between gap-4 text-[11px]">
                                <span className="text-slate-600 leading-normal">{note.note}</span>
                                <span className="text-[9px] text-slate-400 font-bold shrink-0 self-end">
                                    {new Date(note.createdAt).toLocaleDateString('fr-FR', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </form>
    )
}
