'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Loader2, Plus, Trash2, User, KeyRound, MapPin, Copy, Check, Link as LinkIcon, Pencil } from 'lucide-react'
import { createWaiter, deleteWaiter, updateWaiter } from '@/app/actions/waiter'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface WaitersClientProps {
    initialWaiters: any[]
    initialTables: any[]
    tenantSlug: string
}

export default function WaitersClient({ initialWaiters, initialTables, tenantSlug }: WaitersClientProps) {
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
        setNewPin('') // We don't populate the PIN for security, leave blank unless changing
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
        
        // For new waiters, PIN is required. For editing, it's optional.
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

    return (
        <div className="space-y-8">
            {/* Portal Link Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] gap-4">
                <div className="flex items-center gap-4 w-full">
                    <div className="h-12 w-12 bg-white rounded-[1.25rem] flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100 flex-shrink-0">
                        <LinkIcon size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-800">Waiter Portal Link</h4>
                        <p className="text-sm text-slate-500 mt-0.5">Share this specific link with your staff so they can access their assigned tables.</p>
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
                    {copied ? 'Copied to Clipboard!' : 'Copy Portal Link'}
                </Button>
            </div>

            {/* Create / Edit Actions */}
            {!isFormOpen ? (
                <Card className="border-dashed bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={openCreateForm}>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                            <Plus size={24} />
                        </div>
                        <h3 className="font-semibold text-lg">Add New Waiter</h3>
                        <p className="text-slate-500 text-sm">Create a profile and assign tables</p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-indigo-200 shadow-lg ring-4 ring-indigo-500/10 animate-in slide-in-from-top-4">
                    <CardHeader>
                        <CardTitle>{editingId ? 'Edit Waiter Profile' : 'New Waiter Profile'}</CardTitle>
                        <CardDescription>{editingId ? 'Update details or modify assigned tables.' : 'Enter details and select assigned tables.'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="e.g. John Doe"
                                            className="pl-9"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Access PIN (4 Digits) {editingId && <span className="text-xs text-slate-500 font-normal ml-1">(Leave empty to keep current)</span>}
                                    </label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="e.g. 1234"
                                            maxLength={4}
                                            className="pl-9 font-mono tracking-widest"
                                            value={newPin}
                                            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            required={!editingId}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <MapPin size={14} /> Assign Tables
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                    {initialTables.map(table => (
                                        <div
                                            key={table.id}
                                            onClick={() => toggleTable(table.id)}
                                            className={cn(
                                                "h-12 rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer transition-all border-2",
                                                selectedTables.includes(table.id)
                                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md scale-105"
                                                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                                            )}
                                        >
                                            {table.number}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500">{selectedTables.length} tables selected</p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                <Button type="button" variant="ghost" onClick={closeForm} className="w-full sm:w-auto">Cancel</Button>
                                <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || !newName || (!editingId && newPin.length !== 4) || (!!editingId && newPin.length > 0 && newPin.length !== 4)}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingId ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />)}
                                    {editingId ? 'Save Changes' : 'Create Waiter'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialWaiters.map((waiter) => (
                    <Card key={waiter.id} className="group hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                    {waiter.name[0]}
                                </div>
                                <div>
                                    <CardTitle className="text-base">{waiter.name}</CardTitle>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Badge variant="secondary" className="font-mono text-[10px] tracking-widest bg-slate-100 text-slate-500">
                                            PIN: ••••
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 h-8 w-8" onClick={() => openEditForm(waiter)}>
                                    <Pencil size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 h-8 w-8" onClick={() => handleDelete(waiter.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                <MapPin size={12} /> Assigned Tables
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {waiter.tables.length > 0 ? (
                                    waiter.tables.map((table: any) => (
                                        <Badge key={table.id} variant="outline" className="bg-slate-50">
                                            {table.number}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-400 italic">No tables assigned</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
