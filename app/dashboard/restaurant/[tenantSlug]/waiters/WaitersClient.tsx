'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Loader2, Plus, Trash2, User, KeyRound, MapPin, Copy, Check, Link as LinkIcon, Pencil, Layers } from 'lucide-react'
import { createWaiter, deleteWaiter, updateWaiter } from '@/app/actions/waiter'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface WaitersClientProps {
    initialWaiters: any[]
    initialTables: any[]
    initialSpaces?: any[]
    tenantSlug: string
}

function formatTableLabel(num: string) {
    if (!num) return ''
    if (num.toLowerCase().startsWith('table ')) return num
    const clean = num.replace(/^T-+/i, '').replace(/^T/i, '').trim()
    return clean ? `T-${clean}` : num
}

export default function WaitersClient({ 
    initialWaiters, 
    initialTables, 
    initialSpaces = [], 
    tenantSlug 
}: WaitersClientProps) {
    const router = useRouter()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const [newName, setNewName] = useState('')
    const [newPin, setNewPin] = useState('')
    const [selectedTables, setSelectedTables] = useState<string[]>([])

    const openCreateForm = () => {
        setEditingId(null)
        setNewName('')
        setNewPin('')
        setSelectedTables([])
        setIsFormOpen(true)
    }

    const openEditForm = (waiter: any) => {
        setEditingId(waiter.id)
        setNewName(waiter.name)
        setNewPin('')
        setSelectedTables(waiter.tables.map((t: any) => t.id))
        setIsFormOpen(true)
    }

    const closeForm = () => {
        setIsFormOpen(false)
        setEditingId(null)
        setNewName('')
        setNewPin('')
        setSelectedTables([])
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName) return
        
        if (!editingId && newPin.length !== 4) return
        if (editingId && newPin.length > 0 && newPin.length !== 4) return

        setIsLoading(true)
        
        let res
        if (editingId) {
            res = await updateWaiter(editingId, newName, newPin, selectedTables, tenantSlug)
        } else {
            res = await createWaiter(newName, newPin, selectedTables, tenantSlug)
        }
        
        setIsLoading(false)

        if (res.success) {
            closeForm()
            router.refresh()
        } else {
            alert(res.error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this waiter?')) return
        await deleteWaiter(id, tenantSlug)
        router.refresh()
    }

    const toggleTable = (tableId: string) => {
        setSelectedTables(prev =>
            prev.includes(tableId)
                ? prev.filter(id => id !== tableId)
                : [...prev, tableId]
        )
    }

    const toggleSpaceTables = (spaceId: string | null, spaceTables: any[]) => {
        const spaceTableIds = spaceTables.map(t => t.id)
        const allSelected = spaceTableIds.every(id => selectedTables.includes(id))

        if (allSelected) {
            setSelectedTables(prev => prev.filter(id => !spaceTableIds.includes(id)))
        } else {
            setSelectedTables(prev => Array.from(new Set([...prev, ...spaceTableIds])))
        }
    }

    // Group tables by space dynamically
    const spaceMapObj = new Map<string, { space: { id: string; name: string }; tables: any[] }>()

    // 1. Process explicit spaces
    initialSpaces.forEach(space => {
        spaceMapObj.set(space.id, {
            space: { id: space.id, name: space.name },
            tables: []
        })
    })

    // 2. Populate tables into their matching space
    initialTables.forEach(table => {
        const sId = table.spaceId || table.space?.id || (table.space?.name ? `name-${table.space.name}` : 'unassigned')
        const sName = table.space?.name || 'Salle Principale'

        if (!spaceMapObj.has(sId)) {
            spaceMapObj.set(sId, {
                space: { id: sId, name: sName },
                tables: []
            })
        }
        spaceMapObj.get(sId)!.tables.push(table)
    })

    const spacesMap = Array.from(spaceMapObj.values()).filter(item => item.tables.length > 0)

    return (
        <div className="space-y-8">
            {/* Portal Link Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] gap-4">
                <div className="flex items-center gap-4 w-full">
                    <div className="h-12 w-12 bg-white rounded-[1.25rem] flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100 flex-shrink-0">
                        <LinkIcon size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-800">Lien Portail Serveur</h4>
                        <p className="text-sm text-slate-500 mt-0.5">Partagez ce lien avec votre équipe afin qu'ils puissent prendre en charge leurs tables de service.</p>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    className={cn(
                        "rounded-xl h-12 px-6 shadow-sm border-indigo-200 transition-all font-bold tracking-tight w-full sm:w-auto flex-shrink-0",
                        copied ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" : "bg-white text-indigo-600 hover:bg-indigo-50"
                    )}
                    onClick={() => {
                        const url = `${window.location.origin}/${tenantSlug}/waiter`;
                        navigator.clipboard.writeText(url);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    }}
                >
                    {copied ? <Check size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
                    {copied ? 'Copié dans le presse-papier !' : 'Copier le Lien'}
                </Button>
            </div>

            {/* Create / Edit Actions */}
            {!isFormOpen ? (
                <Card className="border-dashed bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={openCreateForm}>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                            <Plus size={24} />
                        </div>
                        <h3 className="font-semibold text-lg">Ajouter un Serveur</h3>
                        <p className="text-slate-500 text-sm">Créer un profil et affecter les tables par salle/étage</p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-indigo-200 shadow-lg ring-4 ring-indigo-500/10 animate-in slide-in-from-top-4">
                    <CardHeader>
                        <CardTitle>{editingId ? 'Modifier Profil Serveur' : 'Nouveau Profil Serveur'}</CardTitle>
                        <CardDescription>{editingId ? 'Mettre à jour les informations ou réaffecter les tables par étage.' : 'Saisissez les détails et affectez les tables par salle/étage.'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nom Complet</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="ex. Youssef El Amrani"
                                            className="pl-9"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        PIN d'Accès (4 Chiffres) {editingId && <span className="text-xs text-slate-500 font-normal ml-1">(Laisser vide pour conserver)</span>}
                                    </label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="ex. 1234"
                                            maxLength={4}
                                            className="pl-9 font-mono tracking-widest"
                                            value={newPin}
                                            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            required={!editingId}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tables Affectation grouped by Floor Space */}
                            <div className="space-y-6 pt-2">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                                        <Layers size={16} className="text-indigo-600" /> Affectation des Tables par Salle / Étage
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                const allTableIds = initialTables.map(t => t.id)
                                                const allSelected = allTableIds.every(id => selectedTables.includes(id))
                                                setSelectedTables(allSelected ? [] : allTableIds)
                                            }}
                                            className="h-7 text-xs font-bold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                                        >
                                            {initialTables.length > 0 && initialTables.every(t => selectedTables.includes(t.id))
                                                ? 'Tout désélectionner'
                                                : 'Tout sélectionner'}
                                        </Button>
                                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                                            {selectedTables.length}/{initialTables.length} table(s)
                                        </span>
                                    </div>
                                </div>

                                {spacesMap.map(({ space, tables }) => {
                                    if (tables.length === 0) return null
                                    const selectedInSpace = tables.filter(t => selectedTables.includes(t.id)).length
                                    const allSpaceSelected = selectedInSpace === tables.length
                                    const someSpaceSelected = selectedInSpace > 0

                                    return (
                                        <div key={space.id} className={cn(
                                            "rounded-2xl p-4 space-y-3 transition-all border-2",
                                            allSpaceSelected
                                                ? "bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-200/50"
                                                : someSpaceSelected
                                                ? "bg-indigo-50/40 border-indigo-200/80"
                                                : "bg-slate-50/70 border-slate-200/80"
                                        )}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "h-6 w-6 rounded-lg flex items-center justify-center transition-colors",
                                                        allSpaceSelected
                                                            ? "bg-emerald-500 text-white"
                                                            : someSpaceSelected
                                                            ? "bg-indigo-500 text-white"
                                                            : "bg-slate-200 text-slate-500"
                                                    )}>
                                                        {allSpaceSelected ? <Check size={14} /> : <MapPin size={14} />}
                                                    </div>
                                                    <h4 className="font-black text-sm text-slate-800">{space.name}</h4>
                                                    <Badge variant="outline" className={cn(
                                                        "text-[10px] font-bold",
                                                        allSpaceSelected
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : "bg-white text-slate-500"
                                                    )}>
                                                        {selectedInSpace}/{tables.length} table(s)
                                                    </Badge>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleSpaceTables(space.id, tables)}
                                                    className={cn(
                                                        "h-7 text-xs font-bold",
                                                        allSpaceSelected
                                                            ? "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                                            : "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                    )}
                                                >
                                                    {allSpaceSelected ? 'Désélectionner l\'étage' : 'Sélectionner tout l\'étage'}
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2 pt-1">
                                                {tables.map(table => (
                                                    <div
                                                        key={table.id}
                                                        onClick={() => toggleTable(table.id)}
                                                        className={cn(
                                                            "h-12 rounded-xl flex flex-col items-center justify-center font-bold text-sm cursor-pointer transition-all border-2 select-none",
                                                            selectedTables.includes(table.id)
                                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md scale-105"
                                                                : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                                                        )}
                                                    >
                                                        <span>{formatTableLabel(table.number)}</span>
                                                        {table.capacity && (
                                                            <span className="text-[9px] font-normal opacity-80">{table.capacity}p</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
                                <Button type="button" variant="ghost" onClick={closeForm} className="w-full sm:w-auto">Annuler</Button>
                                <Button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 font-bold" disabled={isLoading || !newName || (!editingId && newPin.length !== 4) || (!!editingId && newPin.length > 0 && newPin.length !== 4)}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingId ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />)}
                                    {editingId ? 'Enregistrer les modifications' : 'Créer le Serveur'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Waiters List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialWaiters.map((waiter) => {
                    // Group waiter assigned tables by space
                    const waiterAssignedTables = waiter.tables || []
                    const groupedAssignedTables: Record<string, any[]> = {}

                    waiterAssignedTables.forEach((t: any) => {
                        const spaceName = t.space?.name || 'Général / Sans Espace'
                        if (!groupedAssignedTables[spaceName]) groupedAssignedTables[spaceName] = []
                        groupedAssignedTables[spaceName].push(t)
                    })

                    return (
                        <Card key={waiter.id} className="group hover:shadow-md transition-all rounded-[2rem] border-slate-200/80">
                            <CardHeader className="flex flex-row items-start justify-between pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-lg">
                                        {waiter.name[0]}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold text-slate-900">{waiter.name}</CardTitle>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Badge variant="secondary" className="font-mono text-[10px] tracking-widest bg-slate-100 text-slate-500">
                                                PIN: ••••
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 h-8 w-8 rounded-lg" onClick={() => openEditForm(waiter)}>
                                        <Pencil size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 h-8 w-8 rounded-lg" onClick={() => handleDelete(waiter.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-2 space-y-4">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                                    <span className="flex items-center gap-1.5">
                                        <Layers size={13} className="text-indigo-500" /> Tables par Étage
                                    </span>
                                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 font-black text-[10px]">
                                        {waiterAssignedTables.length} table(s)
                                    </span>
                                </div>

                                {Object.keys(groupedAssignedTables).length > 0 ? (
                                    <div className="space-y-2.5">
                                        {Object.entries(groupedAssignedTables).map(([spaceName, spaceTables]) => (
                                            <div key={spaceName} className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1">
                                                        <MapPin size={10} className="text-indigo-500" /> {spaceName}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400">
                                                        {spaceTables.length} table(s)
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {spaceTables.map((t: any) => (
                                                        <Badge key={t.id} variant="outline" className="bg-white border-slate-200 text-slate-700 font-bold text-xs">
                                                            {formatTableLabel(t.number)}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400 italic block py-2">Aucune table affectée</span>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
