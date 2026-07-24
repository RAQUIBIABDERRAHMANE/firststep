'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    Plus,
    Trash2,
    MapPin,
    Download,
    QrCode,
    Edit2,
    Check,
    X,
    Eye,
    EyeOff,
    Users,
    Layers,
    LayoutGrid,
    Sliders,
    Sparkles
} from 'lucide-react'
import { createTable, updateTable, deleteTable, createBulkTables, createPrintRequest } from '@/app/actions/restaurant'
import { signTableIdBrowser } from '@/lib/crypto-client'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import FloorPlanCanvas from './FloorPlanCanvas'
import LiveFloorMonitor from './LiveFloorMonitor'

export default function TablesClient({ 
    initialTables,
    initialSpaces = [], 
    tenantSlug, 
    initialConfig 
}: { 
    initialTables: any[]
    initialSpaces?: any[]
    tenantSlug: string
    initialConfig?: string 
}) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'list' | 'floorplan' | 'live'>('live')
    const [newTableName, setNewTableName] = useState('')
    const [loading, setLoading] = useState(false)
    const [qrCodes, setQrCodes] = useState<Record<string, string>>({})
    const [editingTable, setEditingTable] = useState<string | null>(null)
    const [tempName, setTempName] = useState('')
    const [tempCapacity, setTempCapacity] = useState('')
    const [selectedTableIds, setSelectedTableIds] = useState<string[]>([])

    // Bulk Add State
    const [mode, setMode] = useState<'single' | 'bulk'>('single')
    const [bulkQuantity, setBulkQuantity] = useState('10')
    const [bulkPrefix, setBulkPrefix] = useState('Table ')
    const [bulkCapacity, setBulkCapacity] = useState('')

    // Generate QR code data URLs for each table
    useEffect(() => {
        const generateQRs = async () => {
            const codes: Record<string, string> = {}
            for (const table of initialTables) {
                try {
                    const token = await signTableIdBrowser(table.id)
                    const baseUrl = window.location.origin
                    const url = `${baseUrl}/${tenantSlug}?table=${token}`
                    const dataUrl = await QRCode.toDataURL(url, {
                        width: 800,
                        margin: 2,
                        color: {
                            dark: '#1e293b',
                            light: '#ffffff'
                        }
                    })
                    codes[table.id] = dataUrl
                } catch (e) {
                    console.error('Failed to generate QR', e)
                }
            }
            setQrCodes(codes)
        }
        generateQRs()
    }, [initialTables, tenantSlug])

    const handleAddTable = async () => {
        if (!newTableName.trim()) return
        setLoading(true)
        try {
            const res = await createTable(newTableName, undefined, tenantSlug)
            if (res?.error) toast.error(res.error)
            else {
                toast.success('Table added successfully')
                setNewTableName('')
            }
        } catch (e) {
            toast.error('Failed to add table')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleBulkCreate = async () => {
        const qty = parseInt(bulkQuantity, 10)
        if (isNaN(qty) || qty <= 0 || qty > 100) {
            toast.error('Please enter a valid quantity between 1 and 100')
            return
        }
        setLoading(true)
        try {
            const res = await createBulkTables(
                qty,
                bulkPrefix,
                1,
                bulkCapacity ? parseInt(bulkCapacity, 10) : undefined,
                tenantSlug
            )
            if ('error' in res && res.error) toast.error(res.error)
            else if ('count' in res) toast.success(`Successfully generated ${res.count} tables`)
        } catch (e) {
            toast.error('Failed to bulk generate tables')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleSaveEdit = async (id: string) => {
        setLoading(true)
        try {
            const updates: any = {}
            if (tempName.trim()) updates.number = tempName.trim()
            if (tempCapacity) updates.capacity = parseInt(tempCapacity, 10)

            const res = await updateTable(id, updates, tenantSlug)
            if (res?.error) toast.error(res.error)
            else {
                setEditingTable(null)
                toast.success('Table details updated')
            }
        } catch (e) {
            toast.error('Failed to update table')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleToggleTable = async (id: string, currentStatus: boolean) => {
        try {
            const res = await updateTable(id, { isActive: !currentStatus }, tenantSlug)
            if (res?.error) toast.error(res.error)
            else toast.success(currentStatus ? 'Table hidden' : 'Table visible')
        } catch (e) {
            toast.error('Failed to toggle visibility')
        } finally {
            router.refresh()
        }
    }

    const handleDeleteTable = async (id: string) => {
        if (!confirm('Delete this table mapping? Customers using this QR will no longer be able to order.')) return
        try {
            const res = await deleteTable(id, tenantSlug)
            if (res?.error) toast.error(res.error)
            else toast.success('Table deleted successfully')
        } catch (e) {
            toast.error('Failed to delete table')
        } finally {
            router.refresh()
        }
    }

    return (
        <div className="space-y-8">
            {/* View Tab Toggle */}
            <div className="inline-flex p-1.5 bg-slate-200/60 backdrop-blur-md rounded-2xl gap-1 border border-slate-300/40">
                <button
                    onClick={() => setActiveTab('live')}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                        activeTab === 'live' ? "bg-slate-900 text-cyan-400 shadow-lg shadow-slate-900/20" : "text-slate-600 hover:text-slate-900"
                    )}
                >
                    <Sparkles size={14} className="text-emerald-400" /> Moniteur En Direct
                </button>
                <button
                    onClick={() => setActiveTab('floorplan')}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                        activeTab === 'floorplan' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    )}
                >
                    <Sliders size={14} /> Éditeur Plan 2D
                </button>
                <button
                    onClick={() => setActiveTab('list')}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                        activeTab === 'list' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    )}
                >
                    <LayoutGrid size={14} /> Vue Liste & QR Codes
                </button>
            </div>

            {activeTab === 'live' ? (
                <LiveFloorMonitor tenantSlug={tenantSlug} spaces={initialSpaces} />
            ) : activeTab === 'floorplan' ? (
                <FloorPlanCanvas
                    tenantSlug={tenantSlug}
                    initialTables={initialTables}
                    initialSpaces={initialSpaces}
                    initialConfig={initialConfig}
                />
            ) : (
                <>
                    {/* Table Creator */}
                    <Card className="glass-card bg-indigo-50/50 border-indigo-100 shadow-none rounded-[2.5rem] overflow-hidden">
                        <div className="flex border-b border-indigo-100/50">
                            <button 
                                className={`flex-1 py-4 font-bold text-sm transition-colors ${mode === 'single' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100/50 text-indigo-900/60'}`}
                                onClick={() => setMode('single')}
                            >
                                Single Add
                            </button>
                            <button 
                                className={`flex-1 py-4 font-bold text-sm transition-colors ${mode === 'bulk' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100/50 text-indigo-900/60'}`}
                                onClick={() => setMode('bulk')}
                            >
                                Bulk Generate
                            </button>
                        </div>
                        <CardContent className="pt-6">
                            {mode === 'single' ? (
                                <div className="flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="relative flex-1">
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                                        <Input
                                            placeholder="Identifier (e.g., Table 1, Terrace-A...)"
                                            value={newTableName}
                                            onChange={(e) => setNewTableName(e.target.value)}
                                            disabled={loading}
                                            className="bg-white border-indigo-100 pl-11 h-12 rounded-2xl text-lg font-medium"
                                        />
                                    </div>
                                    <Button onClick={handleAddTable} disabled={loading || !newTableName.trim()} className="w-full md:w-auto shrink-0 justify-center gap-2 h-12 px-10 rounded-2xl shadow-xl shadow-indigo-500/10 bg-indigo-600 hover:bg-indigo-700 font-black tracking-tight">
                                        <Plus size={22} /> Add Physical Point
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="space-y-1.5 flex-[2]">
                                            <label className="text-xs font-bold text-indigo-900/60 uppercase tracking-widest pl-2">Quantity</label>
                                            <div className="relative">
                                                <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 10"
                                                    value={bulkQuantity}
                                                    onChange={(e) => setBulkQuantity(e.target.value)}
                                                    disabled={loading}
                                                    className="bg-white border-indigo-100 pl-11 h-12 rounded-2xl text-lg font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 flex-[3]">
                                            <label className="text-xs font-bold text-indigo-900/60 uppercase tracking-widest pl-2">Prefix (Optional)</label>
                                            <Input
                                                placeholder="e.g. Table "
                                                value={bulkPrefix}
                                                onChange={(e) => setBulkPrefix(e.target.value)}
                                                disabled={loading}
                                                className="bg-white border-indigo-100 px-4 h-12 rounded-2xl text-lg font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5 flex-[2]">
                                            <label className="text-xs font-bold text-indigo-900/60 uppercase tracking-widest pl-2">Seats / Capacity</label>
                                            <Input
                                                type="number"
                                                placeholder="e.g. 4"
                                                value={bulkCapacity}
                                                onChange={(e) => setBulkCapacity(e.target.value)}
                                                disabled={loading}
                                                className="bg-white border-indigo-100 px-4 h-12 rounded-2xl text-lg font-medium"
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={handleBulkCreate} disabled={loading} className="w-full shrink-0 justify-center gap-2 h-12 rounded-2xl shadow-xl shadow-indigo-500/10 bg-indigo-600 hover:bg-indigo-700 font-black tracking-tight mt-2">
                                        <Plus size={22} /> Generate Batch of Tables
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tables Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initialTables.map((table) => (
                            <Card key={table.id} className={cn(
                                "glass-card transition-all duration-300 border-slate-200/80 hover:shadow-2xl hover:shadow-indigo-500/5 rounded-[2.5rem] overflow-hidden flex flex-col justify-between group",
                                !table.isActive && "opacity-60 bg-slate-50 border-dashed"
                            )}>
                                <CardHeader className="flex flex-row items-start justify-between pb-4 pt-6 px-6 border-b border-slate-100/50">
                                    <div className="space-y-1 flex-1 pr-2">
                                        {editingTable === table.id ? (
                                            <div className="space-y-2">
                                                <Input
                                                    value={tempName}
                                                    onChange={(e) => setTempName(e.target.value)}
                                                    className="h-9 font-black text-lg bg-white border-indigo-200"
                                                    placeholder="Table Name"
                                                />
                                                <Input
                                                    type="number"
                                                    value={tempCapacity}
                                                    onChange={(e) => setTempCapacity(e.target.value)}
                                                    className="h-8 font-bold text-xs bg-white border-indigo-200"
                                                    placeholder="Capacity (e.g. 4)"
                                                />
                                                <div className="flex gap-2 pt-1">
                                                    <Button size="sm" onClick={() => handleSaveEdit(table.id)} className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700">
                                                        <Check size={14} /> Save
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => setEditingTable(null)} className="h-7 text-xs">
                                                        <X size={14} /> Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
                                                        {table.number}
                                                    </CardTitle>
                                                    <Button variant="ghost" size="icon" onClick={() => {
                                                        setEditingTable(table.id)
                                                        setTempName(table.number)
                                                        setTempCapacity(table.capacity ? table.capacity.toString() : '')
                                                    }} className="h-7 w-7 text-slate-400 hover:text-slate-900">
                                                        <Edit2 size={14} />
                                                    </Button>
                                                </div>
                                                {table.capacity && (
                                                    <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-1">
                                                        <Users size={14} className="text-indigo-400" />
                                                        <span>{table.capacity} Guests</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleToggleTable(table.id, table.isActive)}
                                            className={cn(
                                                "h-10 w-10 rounded-2xl transition-colors",
                                                table.isActive ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" : "text-slate-400 bg-slate-100 hover:bg-slate-200"
                                            )}
                                        >
                                            {table.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 flex flex-col items-center justify-center bg-slate-50/50">
                                    {qrCodes[table.id] ? (
                                        <div className="p-4 bg-white rounded-3xl border border-slate-200/60 shadow-sm relative group/qr">
                                            <img src={qrCodes[table.id]} alt={`QR Code ${table.number}`} className="w-40 h-40 object-contain" />
                                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs rounded-3xl opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <a
                                                    href={qrCodes[table.id]}
                                                    download={`QR-${tenantSlug}-${table.number}.png`}
                                                    className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-lg"
                                                >
                                                    <Download size={20} />
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-40 h-40 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
                                            <QrCode size={48} className="animate-pulse" />
                                        </div>
                                    )}
                                </CardContent>

                                <div className="p-4 bg-white border-t border-slate-100/50 flex items-center justify-between gap-2">
                                    {qrCodes[table.id] && (
                                        <a
                                            href={qrCodes[table.id]}
                                            download={`QR-${tenantSlug}-${table.number}.png`}
                                            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Download size={16} /> Download PNG
                                        </a>
                                    )}
                                    <Button variant="ghost" onClick={() => handleDeleteTable(table.id)} className="rounded-2xl h-12 w-12 text-slate-300 hover:text-rose-500 hover:bg-rose-100 border border-transparent hover:border-rose-200">
                                        <Trash2 size={20} />
                                    </Button>
                                </div>
                            </Card>
                        ))}

                        {initialTables.length === 0 && (
                            <div className="col-span-full text-center py-32 bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-200 flex flex-col items-center">
                                <div className="h-24 w-24 bg-white rounded-[2rem] flex items-center justify-center text-indigo-100 shadow-sm mb-8 ring-8 ring-indigo-50/50">
                                    <MapPin size={48} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">No tables mapped</h3>
                                <p className="text-slate-500 max-w-sm leading-relaxed text-lg font-medium">Add your physical tables to generate unique, secure QR codes for your customers.</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {selectedTableIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-slate-200 shadow-2xl rounded-2xl py-3 px-6 flex items-center gap-4 animate-in slide-in-from-bottom duration-300">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        {selectedTableIds.length} Selected
                    </span>
                    <div className="h-6 w-px bg-slate-200" />
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-9 text-xs font-bold border-slate-200 hover:bg-slate-50"
                        onClick={() => setSelectedTableIds(initialTables.map(t => t.id))}
                    >
                        Select All
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl h-9 text-xs font-bold text-slate-500 hover:text-slate-905"
                        onClick={() => setSelectedTableIds([])}
                    >
                        Clear
                    </Button>
                    <Button
                        size="sm"
                        disabled={loading}
                        className="rounded-xl h-9 text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/10"
                        onClick={async () => {
                            setLoading(true)
                            try {
                                const res = await createPrintRequest(selectedTableIds, tenantSlug)
                                if (res?.error) toast.error(res.error)
                                else {
                                    toast.success('Print request submitted successfully!')
                                    setSelectedTableIds([])
                                }
                            } catch (e) {
                                toast.error('Failed to submit print request')
                            } finally {
                                setLoading(false)
                            }
                        }}
                    >
                        Send to Admin to Print
                    </Button>
                </div>
            )}
        </div>
    )
}
