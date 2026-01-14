'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button, buttonVariants } from '@/components/ui/Button'
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
    Users
} from 'lucide-react'
import { createTable, updateTable, deleteTable } from '@/app/actions/restaurant'
import { signTableIdBrowser } from '@/lib/crypto'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import { cn } from '@/lib/utils'

export default function TablesClient({ initialTables, tenantSlug }: { initialTables: any[], tenantSlug: string }) {
    const router = useRouter()
    const [newTableName, setNewTableName] = useState('')
    const [loading, setLoading] = useState(false)
    const [qrCodes, setQrCodes] = useState<Record<string, string>>({})
    const [editingTable, setEditingTable] = useState<string | null>(null)
    const [tempName, setTempName] = useState('')
    const [tempCapacity, setTempCapacity] = useState('')

    // Generate QR code data URLs for each table
    useEffect(() => {
        const generateQRs = async () => {
            const codes: Record<string, string> = {}
            for (const table of initialTables) {
                try {
                    const token = await signTableIdBrowser(table.number)
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
            const res = await createTable(newTableName)
            if (res?.error) alert(res.error)
            else setNewTableName('')
        } catch (e) {
            alert('A system error occurred while adding the table.')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleUpdateTable = async (id: string) => {
        setLoading(true)
        try {
            const res = await updateTable(id, {
                number: tempName,
                capacity: tempCapacity ? parseInt(tempCapacity) : undefined
            })
            if (res?.error) alert(res.error)
            else setEditingTable(null)
        } catch (e) {
            alert('Failed to update table')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleToggleTable = async (id: string, currentStatus: boolean) => {
        try {
            const res = await updateTable(id, { isActive: !currentStatus })
            if (res?.error) alert(res.error)
        } catch (e) {
            alert('Failed to toggle visibility')
        } finally {
            router.refresh()
        }
    }

    const handleDeleteTable = async (id: string) => {
        if (!confirm('Delete this table mapping? Customers using this QR will no longer be able to order.')) return
        try {
            const res = await deleteTable(id)
            if (res?.error) alert(res.error)
        } catch (e) {
            alert('Failed to delete table')
        } finally {
            router.refresh()
        }
    }

    return (
        <div className="space-y-8">
            {/* Table Creator */}
            <Card className="glass-card bg-indigo-50/50 border-indigo-100 shadow-none rounded-[2.5rem]">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
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
                        <Button onClick={handleAddTable} disabled={loading || !newTableName.trim()} className="shrink-0 gap-2 h-12 px-10 rounded-2xl shadow-xl shadow-indigo-500/10 bg-indigo-600 hover:bg-indigo-700 font-black tracking-tight">
                            <Plus size={22} /> Add Physical Point
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Grid of Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {initialTables.map((table) => (
                    <Card key={table.id} className={cn(
                        "overflow-hidden border-slate-200/60 shadow-xl shadow-slate-200/20 rounded-[3rem] flex flex-col p-10 group transition-all duration-500 bg-white border",
                        !table.isActive ? "opacity-60 bg-slate-50 grayscale-[0.5]" : "hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100/50"
                    )}>
                        {/* Header actions */}
                        <div className="flex justify-between w-full mb-6">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ring-4 transition-colors ${table.isActive ? 'bg-indigo-50 text-indigo-600 ring-indigo-50/50' : 'bg-slate-200 text-slate-400 ring-slate-200/50'}`}>
                                {table.number[0]}
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleToggleTable(table.id, table.isActive)}
                                    className={`rounded-xl h-10 w-10 ${table.isActive ? 'text-slate-300 hover:text-emerald-500 hover:bg-emerald-50' : 'text-emerald-600 bg-emerald-50'}`}
                                >
                                    {table.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => { setEditingTable(table.id); setTempName(table.number); setTempCapacity(table.capacity?.toString() || ''); }}
                                    className="rounded-xl h-10 w-10 text-slate-300 hover:text-blue-600 hover:bg-blue-50"
                                >
                                    <Edit2 size={18} />
                                </Button>
                            </div>
                        </div>

                        {editingTable === table.id ? (
                            <div className="w-full space-y-4 mb-8">
                                <Input
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    className="h-10 text-xl font-bold rounded-xl"
                                    placeholder="Number"
                                />
                                <div className="relative">
                                    <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        value={tempCapacity}
                                        onChange={(e) => setTempCapacity(e.target.value)}
                                        className="h-10 pl-9 text-sm rounded-xl"
                                        placeholder="Capacity (optional)"
                                        type="number"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" className="flex-1 rounded-xl" onClick={() => handleUpdateTable(table.id)}>Save</Button>
                                    <Button variant="ghost" size="sm" className="flex-1 rounded-xl" onClick={() => setEditingTable(null)}>Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center w-full mb-8">
                                <h3 className="text-3xl font-black mb-1 group-hover:text-indigo-600 transition-colors">Table {table.number}</h3>
                                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.3em] mb-4">Secure Point {table.id.substring(0, 6)}</p>
                                <div className="flex items-center justify-center gap-2">
                                    {table.capacity && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase">
                                            <Users size={10} /> {table.capacity} Seats
                                        </span>
                                    )}
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full",
                                        table.isActive ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                                    )}>
                                        {table.isActive ? "Active" : "Disabled"}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="relative group/qr p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 mb-10 transition-all duration-500 group-hover:scale-105 group-hover:bg-white group-hover:shadow-2xl shadow-inner mx-auto">
                            {qrCodes[table.id] ? (
                                <img src={qrCodes[table.id]} className="h-44 w-44 object-contain mix-blend-multiply" alt="Table QR" />
                            ) : (
                                <div className="h-44 w-44 flex items-center justify-center text-slate-200 animate-pulse">
                                    <QrCode size={64} />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 w-full mt-auto">
                            {qrCodes[table.id] && (
                                <a
                                    href={qrCodes[table.id]}
                                    download={`Table-${table.number}-QR.png`}
                                    className={cn(
                                        buttonVariants({ variant: 'outline' }),
                                        "flex-1 rounded-2xl h-14 font-black gap-2 border-slate-200 hover:border-indigo-500 hover:text-indigo-600 shadow-sm"
                                    )}
                                >
                                    <Download size={18} /> Print
                                </a>
                            )}
                            <Button variant="ghost" onClick={() => handleDeleteTable(table.id)} className="rounded-2xl h-14 w-14 text-slate-300 hover:text-rose-500 hover:bg-rose-100 border border-transparent hover:border-rose-200">
                                <Trash2 size={24} />
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
        </div>
    )
}
