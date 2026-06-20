'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, Plus, Pill, X, Loader2, Trash2, ChevronDown, ChevronRight, Clock } from 'lucide-react'
import { saveMedicalHistory, deleteMedicalHistory } from '@/app/actions/medical'

type Prescription = { id: string; medication: string; dosage: string | null; frequency: string | null; duration: string | null; instructions: string | null }
type MedicalRecord = {
    id: string; visitDate: Date; chiefComplaint: string | null; diagnosis: string | null; treatment: string | null
    notes: string | null; weight: number | null; bloodPressure: string | null
    temperature: number | null; heartRate: number | null; prescriptions: Prescription[]
}
type MedicalHistory = { id: string; condition: string; since: string | null; status: string; notes: string | null }

export default function PatientProfileClient({ client, profile, tenantSlug }: {
    client: { id: string; name: string; email: string | null; phone: string | null; age: number | null; cni: string | null }
    profile: { records: MedicalRecord[]; history: MedicalHistory[] }
    tenantSlug: string
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const [histCondition, setHistCondition] = useState('')
    const [histSince, setHistSince] = useState('')
    const [histStatus, setHistStatus] = useState('ACTIVE')
    const [histNotes, setHistNotes] = useState('')

    const handleSaveHistory = () => {
        startTransition(async () => {
            await saveMedicalHistory({
                clientId: client.id, condition: histCondition,
                since: histSince || undefined, status: histStatus, notes: histNotes || undefined
            }, tenantSlug)
            setShowHistoryModal(false)
            setHistCondition(''); setHistSince(''); setHistStatus('ACTIVE'); setHistNotes('')
            router.refresh()
        })
    }

    const handleDeleteHistory = (id: string) => {
        if (!confirm('Supprimer cet antécédent ?')) return
        startTransition(async () => {
            await deleteMedicalHistory(id, tenantSlug)
            router.refresh()
        })
    }

    const activeHistory = profile.history.filter(h => h.status === 'ACTIVE')
    const resolvedHistory = profile.history.filter(h => h.status === 'RESOLVED')

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.push(`/dashboard/cabinet/${tenantSlug}/medical`)}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Retour
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">{client.name}</h2>
                    <p className="text-sm text-slate-500">
                        {client.email && `${client.email}`}
                        {client.phone && ` · ${client.phone}`}
                        {client.age && ` · ${client.age} ans`}
                        {client.cni && ` · CNI: ${client.cni}`}
                        {` · ${profile.records.length} consultation(s)`}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Consultations */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-semibold text-lg">Historique des consultations</h3>
                    {profile.records.length === 0 ? (
                        <div className="border rounded-lg p-10 text-center">
                            <Clock className="h-10 w-10 text-slate-500/20 mx-auto mb-3" />
                            <p className="text-slate-500 text-sm">Aucune consultation enregistrée</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {profile.records.map(record => (
                                <Card key={record.id}>
                                    <CardContent className="py-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-primary text-sm">
                                                        {new Date(record.visitDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                    {record.prescriptions.length > 0 && (
                                                        <Badge variant="secondary"><Pill className="h-3 w-3 mr-1" />{record.prescriptions.length} ordo.</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium">{record.chiefComplaint}</p>
                                                <p className="text-xs text-slate-500">Diagnostic: {record.diagnosis}</p>
                                                {(record.weight || record.bloodPressure || record.temperature || record.heartRate) && (
                                                    <div className="flex gap-2 mt-2 flex-wrap">
                                                        {record.weight && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{record.weight} kg</span>}
                                                        {record.bloodPressure && <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">TA: {record.bloodPressure}</span>}
                                                        {record.temperature && <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{record.temperature}°C</span>}
                                                        {record.heartRate && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{record.heartRate} bpm</span>}
                                                    </div>
                                                )}
                                            </div>
                                            <Button size="sm" variant="ghost" onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}>
                                                {expandedId === record.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        {expandedId === record.id && (
                                            <div className="mt-4 pt-4 border-t space-y-3">
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Traitement</p>
                                                    <p className="text-sm">{record.treatment}</p>
                                                </div>
                                                {record.notes && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Notes</p>
                                                        <p className="text-sm text-slate-500">{record.notes}</p>
                                                    </div>
                                                )}
                                                {record.prescriptions.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Ordonnances</p>
                                                        <div className="space-y-2">
                                                            {record.prescriptions.map(p => (
                                                                <div key={p.id} className="bg-blue-50 rounded-lg p-3 text-sm">
                                                                    <p className="font-bold text-blue-800">{p.medication}</p>
                                                                    <p className="text-blue-600 text-xs">{p.dosage} · {p.frequency} · {p.duration}</p>
                                                                    {p.instructions && <p className="text-blue-500 text-xs mt-0.5">{p.instructions}</p>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Medical History Sidebar */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Antécédents médicaux</h3>
                        <Button size="sm" variant="outline" onClick={() => setShowHistoryModal(true)}>
                            <Plus className="h-3 w-3 mr-1" /> Ajouter
                        </Button>
                    </div>

                    {/* Active */}
                    {activeHistory.length > 0 && (
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">En cours</p>
                            <div className="space-y-2">
                                {activeHistory.map(h => (
                                    <Card key={h.id}>
                                        <CardContent className="py-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <p className="text-sm font-semibold">{h.condition}</p>
                                                    {h.since && <p className="text-xs text-slate-500">Depuis: {h.since}</p>}
                                                    {h.notes && <p className="text-xs text-slate-500 mt-0.5">{h.notes}</p>}
                                                </div>
                                                <button onClick={() => handleDeleteHistory(h.id)} disabled={isPending} className="text-red-400 hover:text-red-600 shrink-0">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resolved */}
                    {resolvedHistory.length > 0 && (
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Résolus</p>
                            <div className="space-y-2">
                                {resolvedHistory.map(h => (
                                    <Card key={h.id} className="opacity-60">
                                        <CardContent className="py-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <p className="text-sm font-medium line-through">{h.condition}</p>
                                                    {h.since && <p className="text-xs text-slate-500">Depuis: {h.since}</p>}
                                                </div>
                                                <button onClick={() => handleDeleteHistory(h.id)} disabled={isPending} className="text-red-400 hover:text-red-600 shrink-0">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {profile.history.length === 0 && (
                        <div className="border rounded-lg p-6 text-center">
                            <p className="text-sm text-slate-500">Aucun antécédent enregistré</p>
                        </div>
                    )}
                </div>
            </div>

            {/* History Modal */}
            {showHistoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowHistoryModal(false)} />
                    <div className="relative bg-background border rounded-xl shadow-2xl w-full max-w-md">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h3 className="font-bold text-lg">Ajouter un antécédent</h3>
                            <button onClick={() => setShowHistoryModal(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div><label className="text-sm font-semibold block mb-1">Condition / Maladie *</label><Input value={histCondition} onChange={e => setHistCondition(e.target.value)} placeholder="Ex: Diabète type 2" /></div>
                            <div><label className="text-sm font-semibold block mb-1">Depuis (année ou date)</label><Input value={histSince} onChange={e => setHistSince(e.target.value)} placeholder="Ex: 2019" /></div>
                            <div>
                                <label className="text-sm font-semibold block mb-1">Statut</label>
                                <select value={histStatus} onChange={e => setHistStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm bg-background">
                                    <option value="ACTIVE">En cours</option>
                                    <option value="RESOLVED">Résolu</option>
                                </select>
                            </div>
                            <div><label className="text-sm font-semibold block mb-1">Notes</label>
                                <textarea value={histNotes} onChange={e => setHistNotes(e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none" /></div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setShowHistoryModal(false)}>Annuler</Button>
                                <Button className="flex-1" onClick={handleSaveHistory} disabled={isPending || !histCondition}>
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Ajouter
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
