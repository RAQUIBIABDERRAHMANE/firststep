'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
    Plus, Stethoscope, User, X, Loader2, Trash2, Pill, Activity,
    ChevronDown, ChevronRight, FileText
} from 'lucide-react'
import { saveMedicalRecord, deleteMedicalRecord } from '@/app/actions/medical'

type Prescription = { id: string; medication: string; dosage: string | null; frequency: string | null; duration: string | null; instructions: string | null }
type MedicalRecord = {
    id: string; visitDate: Date; chiefComplaint: string | null; diagnosis: string | null; treatment: string | null
    notes: string | null; weight: number | null; bloodPressure: string | null
    temperature: number | null; heartRate: number | null
    prescriptions: Prescription[]; client: { id: string; name: string }
}
type Client = { id: string; name: string; email: string | null }

export default function MedicalClient({ clients, records, tenantId, tenantSlug }: {
    clients: Client[]; records: MedicalRecord[]; tenantId: string; tenantSlug: string
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedClientId, setSelectedClientId] = useState<string>('')
    const [showRecordModal, setShowRecordModal] = useState(false)
    const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null)

    // Record form
    const [formVisitDate, setFormVisitDate] = useState(new Date().toISOString().split('T')[0])
    const [formComplaint, setFormComplaint] = useState('')
    const [formDiagnosis, setFormDiagnosis] = useState('')
    const [formTreatment, setFormTreatment] = useState('')
    const [formNotes, setFormNotes] = useState('')
    const [formWeight, setFormWeight] = useState('')
    const [formBP, setFormBP] = useState('')
    const [formTemp, setFormTemp] = useState('')
    const [formHR, setFormHR] = useState('')
    const [formPrescriptions, setFormPrescriptions] = useState([{ medication: '', dosage: '', frequency: '', duration: '', instructions: '' }])

    const selectedClient = clients.find(c => c.id === selectedClientId)
    const clientRecords = records.filter(r => r.client.id === selectedClientId)

    const addPrescription = () => setFormPrescriptions([...formPrescriptions, { medication: '', dosage: '', frequency: '', duration: '', instructions: '' }])
    const removePrescription = (i: number) => setFormPrescriptions(formPrescriptions.filter((_, idx) => idx !== i))
    const updatePrescription = (i: number, field: string, value: string) => {
        const updated = [...formPrescriptions]
        updated[i] = { ...updated[i], [field]: value }
        setFormPrescriptions(updated)
    }

    const resetRecordForm = () => {
        setFormVisitDate(new Date().toISOString().split('T')[0])
        setFormComplaint(''); setFormDiagnosis(''); setFormTreatment('')
        setFormNotes(''); setFormWeight(''); setFormBP(''); setFormTemp(''); setFormHR('')
        setFormPrescriptions([{ medication: '', dosage: '', frequency: '', duration: '', instructions: '' }])
    }

    const handleSaveRecord = () => {
        startTransition(async () => {
            await saveMedicalRecord({
                tenantId, clientId: selectedClientId,
                visitDate: new Date(formVisitDate),
                chiefComplaint: formComplaint, diagnosis: formDiagnosis, treatment: formTreatment,
                notes: formNotes || undefined,
                weight: formWeight ? Number(formWeight) : undefined,
                bloodPressure: formBP || undefined,
                temperature: formTemp ? Number(formTemp) : undefined,
                heartRate: formHR ? Number(formHR) : undefined,
                prescriptions: formPrescriptions.filter(p => p.medication).map(p => ({
                    medication: p.medication, dosage: p.dosage, frequency: p.frequency,
                    duration: p.duration, instructions: p.instructions || undefined
                }))
            }, tenantSlug)
            setShowRecordModal(false)
            resetRecordForm()
            router.refresh()
        })
    }

    const handleDeleteRecord = (id: string) => {
        if (!confirm('Supprimer cette consultation ?')) return
        startTransition(async () => {
            await deleteMedicalRecord(id, tenantSlug)
            router.refresh()
        })
    }



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Dossiers Médicaux</h2>
                    <p className="text-sm text-muted-foreground">Consultations, prescriptions et historique médical</p>
                </div>
            </div>

            {/* Client selector */}
            <Card>
                <CardContent className="pt-6">
                    <label className="text-sm font-semibold block mb-2">Sélectionner un patient</label>
                    <div className="flex gap-3">
                        <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}
                            className="flex-1 border rounded-lg px-3 py-2 text-sm bg-background">
                            <option value="">-- Choisir un patient --</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {selectedClientId && (
                            <Button onClick={() => router.push(`/dashboard/cabinet/${tenantSlug}/medical/${selectedClientId}`)} variant="outline">
                                <User className="h-4 w-4 mr-2" /> Profil complet
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {!selectedClientId ? (
                <div className="border rounded-lg p-16 text-center">
                    <Stethoscope className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Sélectionnez un patient pour voir son dossier médical</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Records list */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Consultations de {selectedClient?.name}</h3>
                            <Button onClick={() => setShowRecordModal(true)} size="sm">
                                <Plus className="h-4 w-4 mr-2" /> Nouvelle consultation
                            </Button>
                        </div>

                        {clientRecords.length === 0 ? (
                            <div className="border rounded-lg p-10 text-center">
                                <FileText className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                                <p className="text-muted-foreground text-sm">Aucune consultation enregistrée</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {clientRecords.map(record => (
                                    <Card key={record.id} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="py-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-semibold text-primary">
                                                            {new Date(record.visitDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </span>
                                                        {record.prescriptions.length > 0 && (
                                                            <Badge variant="secondary"><Pill className="h-3 w-3 mr-1" />{record.prescriptions.length} ordonnance(s)</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-medium">{record.chiefComplaint}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">Diagnostic: {record.diagnosis}</p>

                                                    {/* Vitals quick view */}
                                                    {(record.weight || record.bloodPressure || record.temperature || record.heartRate) && (
                                                        <div className="flex gap-3 mt-2 flex-wrap">
                                                            {record.weight && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{record.weight} kg</span>}
                                                            {record.bloodPressure && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">TA: {record.bloodPressure}</span>}
                                                            {record.temperature && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{record.temperature}°C</span>}
                                                            {record.heartRate && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{record.heartRate} bpm</span>}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Button size="sm" variant="ghost" onClick={() => setExpandedRecordId(expandedRecordId === record.id ? null : record.id)}>
                                                        {expandedRecordId === record.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteRecord(record.id)} disabled={isPending}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Expanded details */}
                                            {expandedRecordId === record.id && (
                                                <div className="mt-4 pt-4 border-t space-y-3">
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Traitement</p>
                                                        <p className="text-sm">{record.treatment}</p>
                                                    </div>
                                                    {record.notes && (
                                                        <div>
                                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
                                                            <p className="text-sm text-muted-foreground">{record.notes}</p>
                                                        </div>
                                                    )}
                                                    {record.prescriptions.length > 0 && (
                                                        <div>
                                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Ordonnances</p>
                                                            <div className="space-y-2">
                                                                {record.prescriptions.map(p => (
                                                                    <div key={p.id} className="bg-blue-50 rounded-lg p-3 text-sm">
                                                                        <p className="font-semibold text-blue-800">{p.medication}</p>
                                                                        <p className="text-blue-600">{p.dosage} · {p.frequency} · {p.duration}</p>
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

                    {/* Sidebar: Medical History */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Antécédents</h3>
                            <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/cabinet/${tenantSlug}/medical/${selectedClientId}`)}>
                                <Plus className="h-3 w-3 mr-1" /> Ajouter
                            </Button>
                        </div>
                        <Card>
                            <CardContent className="pt-4">
                                <p className="text-xs text-muted-foreground text-center py-4">
                                    Voir le profil complet pour les antécédents
                                </p>
                                <Button variant="outline" className="w-full" size="sm"
                                    onClick={() => router.push(`/dashboard/cabinet/${tenantSlug}/medical/${selectedClientId}`)}>
                                    <User className="h-4 w-4 mr-2" /> Ouvrir le profil complet
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* New Record Modal */}
            {showRecordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowRecordModal(false)} />
                    <div className="relative bg-background border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold">Nouvelle Consultation</h3>
                            <button onClick={() => setShowRecordModal(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-semibold block mb-1">Date de visite</label>
                                <Input type="date" value={formVisitDate} onChange={e => setFormVisitDate(e.target.value)} />
                            </div>

                            {/* Vitals */}
                            <div>
                                <p className="text-sm font-semibold mb-2 flex items-center gap-2"><Activity className="h-4 w-4 text-red-500" /> Signes vitaux</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="text-xs text-muted-foreground block mb-1">Poids (kg)</label><Input value={formWeight} onChange={e => setFormWeight(e.target.value)} placeholder="70" /></div>
                                    <div><label className="text-xs text-muted-foreground block mb-1">Tension (ex: 120/80)</label><Input value={formBP} onChange={e => setFormBP(e.target.value)} placeholder="120/80" /></div>
                                    <div><label className="text-xs text-muted-foreground block mb-1">Température (°C)</label><Input value={formTemp} onChange={e => setFormTemp(e.target.value)} placeholder="37.0" /></div>
                                    <div><label className="text-xs text-muted-foreground block mb-1">Fréquence cardiaque (bpm)</label><Input value={formHR} onChange={e => setFormHR(e.target.value)} placeholder="75" /></div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold block mb-1">Motif de consultation *</label>
                                <Input value={formComplaint} onChange={e => setFormComplaint(e.target.value)} placeholder="Ex: Douleur dorsale chronique" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold block mb-1">Diagnostic *</label>
                                <textarea value={formDiagnosis} onChange={e => setFormDiagnosis(e.target.value)} rows={2}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none" placeholder="Diagnostic établi..." />
                            </div>
                            <div>
                                <label className="text-sm font-semibold block mb-1">Traitement *</label>
                                <textarea value={formTreatment} onChange={e => setFormTreatment(e.target.value)} rows={2}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none" placeholder="Plan de traitement..." />
                            </div>
                            <div>
                                <label className="text-sm font-semibold block mb-1">Notes</label>
                                <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={2}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none" placeholder="Observations additionnelles..." />
                            </div>

                            {/* Prescriptions */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold flex items-center gap-2"><Pill className="h-4 w-4 text-blue-500" /> Ordonnances</p>
                                    <Button size="sm" variant="outline" onClick={addPrescription}><Plus className="h-3 w-3 mr-1" /> Ajouter</Button>
                                </div>
                                <div className="space-y-3">
                                    {formPrescriptions.map((p, i) => (
                                        <div key={i} className="bg-muted/30 rounded-lg p-3 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-muted-foreground">Médicament {i + 1}</span>
                                                {formPrescriptions.length > 1 && (
                                                    <button onClick={() => removePrescription(i)} className="text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
                                                )}
                                            </div>
                                            <Input placeholder="Nom du médicament *" value={p.medication} onChange={e => updatePrescription(i, 'medication', e.target.value)} />
                                            <div className="grid grid-cols-3 gap-2">
                                                <Input placeholder="Dosage" value={p.dosage} onChange={e => updatePrescription(i, 'dosage', e.target.value)} />
                                                <Input placeholder="Fréquence" value={p.frequency} onChange={e => updatePrescription(i, 'frequency', e.target.value)} />
                                                <Input placeholder="Durée" value={p.duration} onChange={e => updatePrescription(i, 'duration', e.target.value)} />
                                            </div>
                                            <Input placeholder="Instructions (optionnel)" value={p.instructions} onChange={e => updatePrescription(i, 'instructions', e.target.value)} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowRecordModal(false)}>Annuler</Button>
                                <Button className="flex-1" onClick={handleSaveRecord} disabled={isPending || !formComplaint || !formDiagnosis || !formTreatment}>
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Enregistrer
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
