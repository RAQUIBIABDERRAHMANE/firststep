'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import {
    Plus, FileText, Trash2, CheckCircle, Send, Clock,
    AlertCircle, Loader2, X, Printer, Settings
} from 'lucide-react'
import { createInvoice, deleteInvoice, updateInvoiceStatus, saveInvoiceSettings } from '@/app/actions/invoices'

type InvoiceItem = { id: string; description: string; quantity: number; unitPrice: number; total: number }
type Invoice = {
    id: string; number: string; clientName: string; clientEmail: string | null
    status: string; issueDate: Date; dueDate: Date | null; total: number; subtotal: number
    taxRate: number; taxAmount: number; notes: string | null; items: InvoiceItem[]
    client: { id: string; name: string } | null
}
type Client = { id: string; name: string; email: string | null; phone: string | null }
type Settings = { prefix: string; taxRate: number; currency: string; footerNote: string | null; bankDetails: string | null; companyName: string | null; companyAddress: string | null; companyPhone: string | null; companyEmail: string | null } | null

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'; icon: React.ElementType }> = {
    DRAFT: { label: 'Brouillon', variant: 'warning', icon: Clock },
    SENT: { label: 'Envoyée', variant: 'default', icon: Send },
    PAID: { label: 'Payée', variant: 'success', icon: CheckCircle },
    OVERDUE: { label: 'En retard', variant: 'destructive', icon: AlertCircle },
    CANCELLED: { label: 'Annulée', variant: 'secondary', icon: X },
}

export default function InvoicesClient({ invoices, clients, settings, tenantId, tenantSlug }: {
    invoices: Invoice[]; clients: Client[]; settings: Settings; tenantId: string; tenantSlug: string
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [filterStatus, setFilterStatus] = useState<string>('ALL')
    const [emailMsg, setEmailMsg] = useState<{ text: string; ok: boolean } | null>(null)

    // Form state
    const [formClientId, setFormClientId] = useState('')
    const [formClientName, setFormClientName] = useState('')
    const [formClientEmail, setFormClientEmail] = useState('')
    const [formClientPhone, setFormClientPhone] = useState('')
    const [formDueDate, setFormDueDate] = useState('')
    const [formNotes, setFormNotes] = useState('')
    const [formTaxRate, setFormTaxRate] = useState(settings?.taxRate ?? 0)
    const [formItems, setFormItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }])

    // Settings state
    const [settingPrefix, setSettingPrefix] = useState(settings?.prefix ?? 'FAC')
    const [settingTax, setSettingTax] = useState(settings?.taxRate ?? 0)
    const [settingCurrency, setSettingCurrency] = useState(settings?.currency ?? 'MAD')
    const [settingCompanyName, setSettingCompanyName] = useState(settings?.companyName ?? '')
    const [settingCompanyAddress, setSettingCompanyAddress] = useState(settings?.companyAddress ?? '')
    const [settingCompanyPhone, setSettingCompanyPhone] = useState(settings?.companyPhone ?? '')
    const [settingCompanyEmail, setSettingCompanyEmail] = useState(settings?.companyEmail ?? '')
    const [settingFooter, setSettingFooter] = useState(settings?.footerNote ?? '')
    const [settingBank, setSettingBank] = useState(settings?.bankDetails ?? '')

    const addItem = () => setFormItems([...formItems, { description: '', quantity: 1, unitPrice: 0 }])
    const removeItem = (i: number) => setFormItems(formItems.filter((_, idx) => idx !== i))
    const updateItem = (i: number, field: string, value: string | number) => {
        const updated = [...formItems]
        updated[i] = { ...updated[i], [field]: value }
        setFormItems(updated)
    }

    const subtotal = formItems.reduce((s, item) => s + item.quantity * item.unitPrice, 0)
    const taxAmount = subtotal * (formTaxRate / 100)
    const total = subtotal + taxAmount

    const handleClientSelect = (clientId: string) => {
        setFormClientId(clientId)
        const c = clients.find(c => c.id === clientId)
        if (c) { setFormClientName(c.name); setFormClientEmail(c.email ?? ''); setFormClientPhone(c.phone ?? '') }
    }

    const handleCreate = () => {
        startTransition(async () => {
            await createInvoice({
                tenantId,
                clientId: formClientId || undefined,
                clientName: formClientName,
                clientEmail: formClientEmail || undefined,
                clientPhone: formClientPhone || undefined,
                dueDate: formDueDate ? new Date(formDueDate) : undefined,
                taxRate: formTaxRate,
                notes: formNotes || undefined,
                items: formItems.filter(i => i.description)
            }, tenantSlug)
            setShowCreateModal(false)
            setFormItems([{ description: '', quantity: 1, unitPrice: 0 }])
            setFormClientId(''); setFormClientName(''); setFormClientEmail('')
            router.refresh()
        })
    }

    const handleDelete = (id: string) => {
        if (!confirm('Supprimer cette facture ?')) return
        startTransition(async () => {
            await deleteInvoice(id, tenantSlug)
            router.refresh()
        })
    }

    const handleStatus = (id: string, status: string) => {
        startTransition(async () => {
            const res = await updateInvoiceStatus(id, status, tenantSlug)
            router.refresh()
            if (status === 'SENT') {
                if (res && 'emailSent' in res) {
                    if (res.emailSent) {
                        setEmailMsg({ text: 'Facture envoyée par email ✓', ok: true })
                    } else {
                        setEmailMsg({ text: res.emailError ?? 'Email non envoyé', ok: false })
                    }
                    setTimeout(() => setEmailMsg(null), 4000)
                }
            }
        })
    }

    const handleSaveSettings = () => {
        startTransition(async () => {
            await saveInvoiceSettings({
                tenantId, prefix: settingPrefix, taxRate: settingTax,
                currency: settingCurrency, companyName: settingCompanyName,
                companyAddress: settingCompanyAddress, companyPhone: settingCompanyPhone,
                companyEmail: settingCompanyEmail, footerNote: settingFooter, bankDetails: settingBank
            }, tenantSlug)
            setShowSettingsModal(false)
            router.refresh()
        })
    }

    const filtered = filterStatus === 'ALL' ? invoices : invoices.filter(i => i.status === filterStatus)
    const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.total, 0)
    const pending = invoices.filter(i => i.status === 'SENT' || i.status === 'DRAFT').reduce((s, i) => s + i.total, 0)
    const currency = settings?.currency ?? 'MAD'

    return (
        <div className="space-y-6">
            {/* Email feedback toast */}
            {emailMsg && (
                <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${emailMsg.ok ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'}`}>
                    {emailMsg.text}
                </div>
            )}
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Factures</h2>
                    <p className="text-sm text-muted-foreground">Gérez vos factures et suivez vos paiements</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowSettingsModal(true)}>
                        <Settings className="h-4 w-4 mr-2" /> Paramètres
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Nouvelle facture
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100"><CheckCircle className="h-5 w-5 text-green-600" /></div>
                            <div><p className="text-sm text-muted-foreground">Revenus perçus</p><p className="text-2xl font-bold">{totalRevenue.toFixed(0)} {currency}</p></div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-100"><Clock className="h-5 w-5 text-yellow-600" /></div>
                            <div><p className="text-sm text-muted-foreground">En attente</p><p className="text-2xl font-bold">{pending.toFixed(0)} {currency}</p></div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100"><FileText className="h-5 w-5 text-blue-600" /></div>
                            <div><p className="text-sm text-muted-foreground">Total factures</p><p className="text-2xl font-bold">{invoices.length}</p></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {['ALL', 'DRAFT', 'SENT', 'PAID', 'OVERDUE'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterStatus === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                        {s === 'ALL' ? 'Toutes' : STATUS_CONFIG[s]?.label}
                        <span className="ml-1.5 text-xs opacity-70">
                            ({s === 'ALL' ? invoices.length : invoices.filter(i => i.status === s).length})
                        </span>
                    </button>
                ))}
            </div>

            {/* Invoice List */}
            {filtered.length === 0 ? (
                <div className="border rounded-lg p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Aucune facture trouvée</p>
                    <Button className="mt-4" onClick={() => setShowCreateModal(true)}><Plus className="h-4 w-4 mr-2" /> Créer une facture</Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(inv => {
                        const sc = STATUS_CONFIG[inv.status] ?? STATUS_CONFIG.DRAFT
                        const Icon = sc.icon
                        return (
                            <Card key={inv.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-muted"><FileText className="h-5 w-5 text-muted-foreground" /></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-sm">{inv.number}</span>
                                                <Badge variant={sc.variant}><Icon className="h-3 w-3 mr-1" />{sc.label}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-0.5">{inv.clientName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Émise le {new Date(inv.issueDate).toLocaleDateString('fr-FR')}
                                                {inv.dueDate && ` · Échéance: ${new Date(inv.dueDate).toLocaleDateString('fr-FR')}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">{inv.total.toFixed(0)} {currency}</p>
                                            <p className="text-xs text-muted-foreground">{inv.items.length} article(s)</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button size="sm" variant="outline" onClick={() => window.open(`/dashboard/cabinet/${tenantSlug}/invoices/${inv.id}/print`, '_blank')}>
                                                <Printer className="h-4 w-4" />
                                            </Button>
                                            {inv.status === 'DRAFT' && (
                                                <Button size="sm" variant="outline" onClick={() => handleStatus(inv.id, 'SENT')} disabled={isPending}>
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {(inv.status === 'SENT' || inv.status === 'DRAFT') && (
                                                <Button size="sm" variant="outline" className="text-green-600" onClick={() => handleStatus(inv.id, 'PAID')} disabled={isPending}>
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(inv.id)} disabled={isPending}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Create Invoice Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
                    <div className="relative bg-background border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold">Nouvelle Facture</h3>
                            <button onClick={() => setShowCreateModal(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Client */}
                            <div>
                                <label className="text-sm font-semibold block mb-1">Client</label>
                                <select value={formClientId} onChange={e => handleClientSelect(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background">
                                    <option value="">-- Sélectionner un client existant --</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-semibold block mb-1">Nom du client *</label>
                                    <Input value={formClientName} onChange={e => setFormClientName(e.target.value)} placeholder="Nom complet" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold block mb-1">Email</label>
                                    <Input value={formClientEmail} onChange={e => setFormClientEmail(e.target.value)} placeholder="email@example.com" type="email" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-semibold block mb-1">Date d&apos;échéance</label>
                                    <Input value={formDueDate} onChange={e => setFormDueDate(e.target.value)} type="date" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold block mb-1">TVA (%)</label>
                                    <Input value={formTaxRate} onChange={e => setFormTaxRate(Number(e.target.value))} type="number" min={0} max={100} />
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-semibold">Articles / Prestations</label>
                                    <Button size="sm" variant="outline" onClick={addItem}><Plus className="h-3 w-3 mr-1" /> Ajouter</Button>
                                </div>
                                <div className="space-y-2">
                                    {formItems.map((item, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-2 items-center">
                                            <Input className="col-span-6" placeholder="Description" value={item.description}
                                                onChange={e => updateItem(i, 'description', e.target.value)} />
                                            <Input className="col-span-2" placeholder="Qté" type="number" min={1} value={item.quantity}
                                                onChange={e => updateItem(i, 'quantity', Number(e.target.value))} />
                                            <Input className="col-span-2" placeholder="Prix" type="number" min={0} value={item.unitPrice}
                                                onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))} />
                                            <div className="col-span-1 text-sm font-medium text-right">{(item.quantity * item.unitPrice).toFixed(0)}</div>
                                            <button className="col-span-1 text-red-400 hover:text-red-600" onClick={() => removeItem(i)}><X className="h-4 w-4" /></button>
                                        </div>
                                    ))}
                                </div>
                                {/* Totals */}
                                <div className="mt-4 bg-muted/50 rounded-lg p-4 space-y-1 text-sm">
                                    <div className="flex justify-between"><span>Sous-total</span><span>{subtotal.toFixed(0)} {currency}</span></div>
                                    {formTaxRate > 0 && <div className="flex justify-between"><span>TVA ({formTaxRate}%)</span><span>{taxAmount.toFixed(0)} {currency}</span></div>}
                                    <div className="flex justify-between font-bold text-base border-t pt-1 mt-1"><span>Total</span><span>{total.toFixed(0)} {currency}</span></div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold block mb-1">Notes</label>
                                <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={2}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none" placeholder="Notes additionnelles..." />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Annuler</Button>
                                <Button className="flex-1" onClick={handleCreate} disabled={isPending || !formClientName || formItems.every(i => !i.description)}>
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                                    Créer la facture
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettingsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowSettingsModal(false)} />
                    <div className="relative bg-background border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold">Paramètres des Factures</h3>
                            <button onClick={() => setShowSettingsModal(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-sm font-semibold block mb-1">Préfixe</label><Input value={settingPrefix} onChange={e => setSettingPrefix(e.target.value)} placeholder="FAC" /></div>
                                <div><label className="text-sm font-semibold block mb-1">TVA par défaut (%)</label><Input value={settingTax} onChange={e => setSettingTax(Number(e.target.value))} type="number" min={0} /></div>
                            </div>
                            <div><label className="text-sm font-semibold block mb-1">Devise</label><Input value={settingCurrency} onChange={e => setSettingCurrency(e.target.value)} placeholder="MAD" /></div>
                            <div><label className="text-sm font-semibold block mb-1">Nom de l&apos;entreprise</label><Input value={settingCompanyName} onChange={e => setSettingCompanyName(e.target.value)} /></div>
                            <div><label className="text-sm font-semibold block mb-1">Adresse</label><Input value={settingCompanyAddress} onChange={e => setSettingCompanyAddress(e.target.value)} /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-sm font-semibold block mb-1">Téléphone</label><Input value={settingCompanyPhone} onChange={e => setSettingCompanyPhone(e.target.value)} /></div>
                                <div><label className="text-sm font-semibold block mb-1">Email</label><Input value={settingCompanyEmail} onChange={e => setSettingCompanyEmail(e.target.value)} /></div>
                            </div>
                            <div><label className="text-sm font-semibold block mb-1">Coordonnées bancaires</label>
                                <textarea value={settingBank} onChange={e => setSettingBank(e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none" placeholder="RIB, IBAN, etc." /></div>
                            <div><label className="text-sm font-semibold block mb-1">Note de bas de page</label>
                                <textarea value={settingFooter} onChange={e => setSettingFooter(e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none" placeholder="Merci de votre confiance..." /></div>
                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowSettingsModal(false)}>Annuler</Button>
                                <Button className="flex-1" onClick={handleSaveSettings} disabled={isPending}>
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Sauvegarder
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
