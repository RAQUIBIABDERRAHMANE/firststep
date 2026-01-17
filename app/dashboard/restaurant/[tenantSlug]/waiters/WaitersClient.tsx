'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Loader2, Plus, Trash2, User, KeyRound, MapPin, Users } from 'lucide-react'
import { createWaiter, deleteWaiter } from '@/app/actions/waiter'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface WaitersClientProps {
    initialWaiters: any[]
    initialTables: any[]
    tenantSlug: string
}

export default function WaitersClient({ initialWaiters, initialTables, tenantSlug }: WaitersClientProps) {
    const router = useRouter()
    const [isCreating, setIsCreating] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [newName, setNewName] = useState('')
    const [newPin, setNewPin] = useState('')
    const [selectedTables, setSelectedTables] = useState<string[]>([])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName || newPin.length !== 4) return

        setIsLoading(true)
        const res = await createWaiter(newName, newPin, selectedTables, tenantSlug)
        setIsLoading(false)

        if (res.success) {
            setIsCreating(false)
            setNewName('')
            setNewPin('')
            setSelectedTables([])
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
            {/* Create Actions */}
            {!isCreating ? (
                <Card className="border-dashed bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setIsCreating(true)}>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                            <Plus size={24} />
                        </div>
                        <h3 className="font-semibold text-lg">Add New Waiter</h3>
                        <p className="text-muted-foreground text-sm">Create a profile and assign tables</p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-indigo-200 shadow-lg ring-4 ring-indigo-500/10 animate-in slide-in-from-top-4">
                    <CardHeader>
                        <CardTitle>New Waiter Profile</CardTitle>
                        <CardDescription>Enter details and select assigned tables.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-6">
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
                                    <label className="text-sm font-medium">Access PIN (4 Digits)</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="e.g. 1234"
                                            maxLength={4}
                                            className="pl-9 font-mono tracking-widest"
                                            value={newPin}
                                            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <MapPin size={14} /> Assign Tables
                                </label>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
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
                                <p className="text-xs text-muted-foreground">{selectedTables.length} tables selected</p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                                <Button type="submit" disabled={isLoading || !newName || newPin.length !== 4}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                    Create Waiter
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
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={() => handleDelete(waiter.id)}>
                                <Trash2 size={16} />
                            </Button>
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
