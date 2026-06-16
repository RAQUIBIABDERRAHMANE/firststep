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
    Users,
    Layers,
    RotateCw,
    Save,
    Maximize2,
    FileCode,
    LayoutGrid,
    Square,
    Circle,
    Sliders,
    Sparkles
} from 'lucide-react'
import { createTable, updateTable, deleteTable, createBulkTables, saveFloorPlanLayout, createPrintRequest } from '@/app/actions/restaurant'
import { signTableIdBrowser } from '@/lib/crypto-client'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FloorPlanTable {
    id: string
    x: number
    y: number
    w: number
    h: number
    shape: 'rectangle' | 'circle'
    rotation: number
}

interface FloorPlanObstacle {
    id: string
    type: 'wall' | 'door'
    x: number
    y: number
    w: number
    h: number
    rotation: number
}

export default function TablesClient({ 
    initialTables, 
    tenantSlug, 
    initialConfig 
}: { 
    initialTables: any[]
    tenantSlug: string
    initialConfig?: string 
}) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'list' | 'floorplan'>('list')
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

    // --- Floor Planner States ---
    const [floorPlan, setFloorPlan] = useState<{
        tables: FloorPlanTable[]
        obstacles: FloorPlanObstacle[]
    }>(() => {
        try {
            if (initialConfig) {
                const configObj = JSON.parse(initialConfig)
                if (configObj.floorPlan) {
                    return configObj.floorPlan
                }
            }
        } catch (e) {
            console.error('Failed to parse initial floor plan config', e)
        }
        return { tables: [], obstacles: [] }
    })

    const [selectedElement, setSelectedElement] = useState<{
        id: string
        type: 'table' | 'obstacle'
    } | null>(null)

    const [draggingElement, setDraggingElement] = useState<{
        id: string
        type: 'table' | 'obstacle'
        offsetX: number
        offsetY: number
    } | null>(null)

    const [showGrid, setShowGrid] = useState(true)

    // Reconcile and calculate unpositioned active tables
    const positionedTableIds = new Set(floorPlan.tables.map(t => t.id))
    const unpositionedTables = initialTables.filter(t => !positionedTableIds.has(t.id) && t.isActive)

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
                setNewTableName('')
                toast.success('Table created successfully')
            }
        } catch (e) {
            toast.error('A system error occurred.')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleBulkAdd = async () => {
        const count = parseInt(bulkQuantity)
        if (isNaN(count) || count <= 0 || count > 100) {
            toast.error('Please enter a valid quantity between 1 and 100.')
            return
        }
        
        setLoading(true)
        try {
            const existingCount = initialTables.length
            const defaultStart = existingCount + 1
            const capacity = bulkCapacity ? parseInt(bulkCapacity) : undefined
            
            const res = await createBulkTables(count, bulkPrefix, defaultStart, capacity, tenantSlug)
            if (res?.error) toast.error(res.error)
            else {
                setBulkQuantity('10')
                setMode('single')
                toast.success(`Generated ${count} tables successfully`)
            }
        } catch (e) {
            toast.error('A system error occurred.')
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
            }, tenantSlug)
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
            // Remove from floor plan layout if present
            setFloorPlan(prev => ({
                ...prev,
                tables: prev.tables.filter(t => t.id !== id)
            }))
            const res = await deleteTable(id, tenantSlug)
            if (res?.error) toast.error(res.error)
            else toast.success('Table deleted successfully')
        } catch (e) {
            toast.error('Failed to delete table')
        } finally {
            router.refresh()
        }
    }

    // --- Floor Planner Operations ---
    const handleSaveLayout = async () => {
        setLoading(true)
        try {
            // Filter out any layout tables that no longer exist in initialTables
            const activeDbIds = new Set(initialTables.map(t => t.id))
            const cleanedTables = floorPlan.tables.filter(t => activeDbIds.has(t.id))
            const cleanedPlan = { ...floorPlan, tables: cleanedTables }

            const res = await saveFloorPlanLayout(tenantSlug, JSON.stringify(cleanedPlan))
            if (res?.error) toast.error(res.error)
            else {
                toast.success('Floor plan layout saved successfully!')
                setFloorPlan(cleanedPlan)
            }
        } catch (e) {
            toast.error('Failed to save layout')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleAddTableToLayout = (tableId: string) => {
        const tableDb = initialTables.find(t => t.id === tableId)
        if (!tableDb) return

        const newTable: FloorPlanTable = {
            id: tableId,
            x: 100,
            y: 100,
            w: 80,
            h: 80,
            shape: 'rectangle',
            rotation: 0
        }

        setFloorPlan(prev => ({
            ...prev,
            tables: [...prev.tables, newTable]
        }))
        setSelectedElement({ id: tableId, type: 'table' })
        toast.success(`Placed ${tableDb.number} on the canvas`)
    }

    const handleAddWall = () => {
        const id = `wall-${Date.now()}`
        const newWall: FloorPlanObstacle = {
            id,
            type: 'wall',
            x: 120,
            y: 120,
            w: 160,
            h: 20,
            rotation: 0
        }

        setFloorPlan(prev => ({
            ...prev,
            obstacles: [...prev.obstacles, newWall]
        }))
        setSelectedElement({ id, type: 'obstacle' })
    }

    const handleAddDoor = () => {
        const id = `door-${Date.now()}`
        const newDoor: FloorPlanObstacle = {
            id,
            type: 'door',
            x: 120,
            y: 120,
            w: 80,
            h: 20,
            rotation: 0
        }

        setFloorPlan(prev => ({
            ...prev,
            obstacles: [...prev.obstacles, newDoor]
        }))
        setSelectedElement({ id, type: 'obstacle' })
    }

    const handleRemoveElement = (id: string, type: 'table' | 'obstacle') => {
        if (type === 'table') {
            setFloorPlan(prev => ({
                ...prev,
                tables: prev.tables.filter(t => t.id !== id)
            }))
        } else {
            setFloorPlan(prev => ({
                ...prev,
                obstacles: prev.obstacles.filter(o => o.id !== id)
            }))
        }
        if (selectedElement?.id === id) {
            setSelectedElement(null)
        }
    }

    // --- Drag and Drop Mouse Handlers ---
    const handleMouseDown = (e: React.MouseEvent, id: string, type: 'table' | 'obstacle', currentX: number, currentY: number) => {
        e.preventDefault()
        e.stopPropagation()
        const rect = e.currentTarget.parentElement?.getBoundingClientRect()
        if (!rect) return
        
        const clientX = e.clientX - rect.left
        const clientY = e.clientY - rect.top
        
        setDraggingElement({
            id,
            type,
            offsetX: clientX - currentX,
            offsetY: clientY - currentY
        })
        setSelectedElement({ id, type })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingElement) return
        const rect = e.currentTarget.getBoundingClientRect()
        if (!rect) return

        const clientX = e.clientX - rect.left
        const clientY = e.clientY - rect.top

        let rawX = clientX - draggingElement.offsetX
        let rawY = clientY - draggingElement.offsetY

        // Snap to grid of 20px
        const snappedX = Math.round(rawX / 20) * 20
        const snappedY = Math.round(rawY / 20) * 20

        const element = draggingElement.type === 'table'
            ? floorPlan.tables.find(t => t.id === draggingElement.id)
            : floorPlan.obstacles.find(o => o.id === draggingElement.id)
        
        if (!element) return
        
        const w = element.w
        const h = element.h

        const constrainedX = Math.max(0, Math.min(800 - w, snappedX))
        const constrainedY = Math.max(0, Math.min(600 - h, snappedY))

        if (draggingElement.type === 'table') {
            setFloorPlan(prev => ({
                ...prev,
                tables: prev.tables.map(t => t.id === draggingElement.id ? { ...t, x: constrainedX, y: constrainedY } : t)
            }))
        } else {
            setFloorPlan(prev => ({
                ...prev,
                obstacles: prev.obstacles.map(o => o.id === draggingElement.id ? { ...o, x: constrainedX, y: constrainedY } : o)
            }))
        }
    }

    const handleMouseUp = () => {
        setDraggingElement(null)
    }

    const handleTouchStart = (e: React.TouchEvent, id: string, type: 'table' | 'obstacle', currentX: number, currentY: number) => {
        e.stopPropagation()
        const touch = e.touches[0]
        const rect = e.currentTarget.parentElement?.getBoundingClientRect()
        if (!rect) return
        
        const clientX = touch.clientX - rect.left
        const clientY = touch.clientY - rect.top
        
        setDraggingElement({
            id,
            type,
            offsetX: clientX - currentX,
            offsetY: clientY - currentY
        })
        setSelectedElement({ id, type })
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!draggingElement) return
        // Prevent scroll when dragging
        if (e.cancelable) e.preventDefault()
        const touch = e.touches[0]
        const rect = e.currentTarget.getBoundingClientRect()
        if (!rect) return

        const clientX = touch.clientX - rect.left
        const clientY = touch.clientY - rect.top

        let rawX = clientX - draggingElement.offsetX
        let rawY = clientY - draggingElement.offsetY

        // Snap to grid of 20px
        const snappedX = Math.round(rawX / 20) * 20
        const snappedY = Math.round(rawY / 20) * 20

        const element = draggingElement.type === 'table'
            ? floorPlan.tables.find(t => t.id === draggingElement.id)
            : floorPlan.obstacles.find(o => o.id === draggingElement.id)
        
        if (!element) return
        
        const w = element.w
        const h = element.h

        const constrainedX = Math.max(0, Math.min(800 - w, snappedX))
        const constrainedY = Math.max(0, Math.min(600 - h, snappedY))

        if (draggingElement.type === 'table') {
            setFloorPlan(prev => ({
                ...prev,
                tables: prev.tables.map(t => t.id === draggingElement.id ? { ...t, x: constrainedX, y: constrainedY } : t)
            }))
        } else {
            setFloorPlan(prev => ({
                ...prev,
                obstacles: prev.obstacles.map(o => o.id === draggingElement.id ? { ...o, x: constrainedX, y: constrainedY } : o)
            }))
        }
    }

    // Get currently selected element details
    const selectedDetails = (() => {
        if (!selectedElement) return null
        if (selectedElement.type === 'table') {
            const item = floorPlan.tables.find(t => t.id === selectedElement.id)
            const dbTable = initialTables.find(t => t.id === selectedElement.id)
            return item && dbTable ? { ...item, number: dbTable.number, capacity: dbTable.capacity } : null
        } else {
            return floorPlan.obstacles.find(o => o.id === selectedElement.id) || null
        }
    })()

    // Update selected element property
    const updateSelectedProp = (key: string, value: any) => {
        if (!selectedElement) return
        if (selectedElement.type === 'table') {
            setFloorPlan(prev => ({
                ...prev,
                tables: prev.tables.map(t => t.id === selectedElement.id ? { ...t, [key]: value } : t)
            }))
        } else {
            setFloorPlan(prev => ({
                ...prev,
                obstacles: prev.obstacles.map(o => o.id === selectedElement.id ? { ...o, [key]: value } : o)
            }))
        }
    }

    return (
        <div className="space-y-8">
            {/* View Tab Toggle */}
            <div className="flex justify-between items-center bg-slate-100 p-1.5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('list')}
                    className={cn(
                        "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                        activeTab === 'list' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                >
                    <LayoutGrid size={14} /> List View
                </button>
                <button
                    onClick={() => setActiveTab('floorplan')}
                    className={cn(
                        "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                        activeTab === 'floorplan' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                >
                    <Sliders size={14} /> Interactive Floor Plan
                </button>
            </div>

            {activeTab === 'list' ? (
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
                                            <label className="text-xs font-bold text-indigo-900/60 uppercase tracking-widest pl-2">Capacity (Optional)</label>
                                            <div className="relative">
                                                <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                                                <Input
                                                    type="number"
                                                    placeholder="Seats auto-applied"
                                                    value={bulkCapacity}
                                                    onChange={(e) => setBulkCapacity(e.target.value)}
                                                    disabled={loading}
                                                    className="bg-white border-indigo-100 pl-11 h-12 rounded-2xl text-lg font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 p-4 bg-indigo-100/50 rounded-2xl border border-indigo-100 gap-4">
                                        <span className="text-sm font-semibold text-indigo-900/70">
                                            Will generate tables numbered <strong className="text-indigo-700">{initialTables.length + 1}</strong> to <strong className="text-indigo-700">{initialTables.length + (parseInt(bulkQuantity) || 0)}</strong>.
                                        </span>
                                        <Button onClick={handleBulkAdd} disabled={loading || !bulkQuantity} className="w-full sm:w-auto justify-center gap-2 h-10 px-8 rounded-xl shadow-lg shadow-indigo-500/10 bg-indigo-600 hover:bg-indigo-700 font-bold">
                                            <Plus size={18} /> Generate {bulkQuantity || 0} Tables
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Grid of Tables */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                        {initialTables.map((table) => (
                            <Card key={table.id} className={cn(
                                "overflow-hidden border-slate-200/60 shadow-xl shadow-slate-200/20 rounded-[3rem] flex flex-col p-5 sm:p-10 group transition-all duration-500 bg-white border",
                                !table.isActive ? "opacity-60 bg-slate-50 grayscale-[0.5]" : "hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100/50"
                            )}>
                                {/* Header actions */}
                                <div className="flex justify-between w-full mb-6">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedTableIds.includes(table.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedTableIds(prev => [...prev, table.id])
                                                } else {
                                                    setSelectedTableIds(prev => prev.filter(id => id !== table.id))
                                                }
                                            }}
                                            className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ring-4 transition-colors ${table.isActive ? 'bg-indigo-50 text-indigo-600 ring-indigo-50/50' : 'bg-slate-200 text-slate-400 ring-slate-200/50'}`}>
                                            {table.number[0]}
                                        </div>
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

                                <div className="relative group/qr p-4 sm:p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 mb-6 sm:mb-10 transition-all duration-500 group-hover:scale-105 group-hover:bg-white group-hover:shadow-2xl shadow-inner mx-auto">
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
                </>
            ) : (
                /* Interactive Floor Plan Editor */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
                    
                    {/* Left Canvas Panel (Columns 1 to 8) */}
                    <div className="lg:col-span-9 flex flex-col space-y-4">
                        {/* Canvas Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 border border-slate-200 rounded-[1.5rem]">
                            <div className="flex items-center gap-3">
                                <Button 
                                    onClick={handleAddWall}
                                    variant="outline" 
                                    className="rounded-xl h-10 px-4 font-bold border-slate-200 text-xs flex items-center gap-2 hover:bg-white hover:text-indigo-600"
                                >
                                    <Square size={14} className="fill-slate-400 stroke-none" /> Add Wall
                                </Button>
                                <Button 
                                    onClick={handleAddDoor}
                                    variant="outline" 
                                    className="rounded-xl h-10 px-4 font-bold border-slate-200 text-xs flex items-center gap-2 hover:bg-white hover:text-indigo-600"
                                >
                                    <Square size={14} className="fill-amber-400 stroke-none" /> Add Door
                                </Button>
                                <div className="h-6 w-px bg-slate-200 mx-1" />
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowGrid(!showGrid)}
                                    className={cn(
                                        "rounded-xl h-10 px-4 font-bold text-xs flex items-center gap-2",
                                        showGrid ? "text-indigo-600 bg-indigo-50/60" : "text-slate-500"
                                    )}
                                >
                                    <Layers size={14} /> {showGrid ? "Grid On" : "Grid Off"}
                                </Button>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        if (confirm("Reset layout? All placements will be lost.")) {
                                            setFloorPlan({ tables: [], obstacles: [] })
                                            setSelectedElement(null)
                                        }
                                    }}
                                    className="rounded-xl h-10 px-4 font-bold text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-200"
                                >
                                    Clear Map
                                </Button>
                                <Button
                                    onClick={handleSaveLayout}
                                    disabled={loading}
                                    className="rounded-xl h-10 px-6 font-black text-xs uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/10"
                                >
                                    <Save size={14} /> Save Layout
                                </Button>
                            </div>
                        </div>

                        {/* Interactive Drag & Drop Grid Canvas */}
                        <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
                            <div 
                                className={cn(
                                    "relative w-[800px] h-[600px] bg-slate-50 rounded-[2.5rem] border-2 border-slate-200/80 shadow-inner overflow-hidden cursor-default select-none shrink-0 mx-auto",
                                    draggingElement ? "cursor-grabbing" : ""
                                )}
                                style={{
                                    backgroundImage: showGrid ? 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)' : 'none',
                                    backgroundSize: '20px 20px'
                                }}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleMouseUp}
                                onClick={() => setSelectedElement(null)}
                            >
                                {/* Static Entrance Label or other hints */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-slate-200/50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    Restaurant Floor Area ($800 \times 600$ px)
                                </div>

                                {/* Positioned tables */}
                                {floorPlan.tables.map((table) => {
                                    const dbTable = initialTables.find(t => t.id === table.id)
                                    if (!dbTable) return null
                                    const isSelected = selectedElement?.id === table.id && selectedElement.type === 'table'

                                    return (
                                        <div
                                            key={table.id}
                                            className={cn(
                                                "absolute flex flex-col items-center justify-center font-bold text-slate-800 border-2 transition-shadow select-none shadow-sm cursor-grab active:cursor-grabbing",
                                                table.shape === 'circle' ? "rounded-full" : "rounded-2xl",
                                                isSelected ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-600/10 z-30 shadow-md" : "border-slate-300 bg-white hover:border-slate-400 z-10"
                                            )}
                                            style={{
                                                left: `${table.x}px`,
                                                top: `${table.y}px`,
                                                width: `${table.w}px`,
                                                height: `${table.h}px`,
                                                transform: `rotate(${table.rotation}deg)`,
                                                touchAction: 'none'
                                            }}
                                            onMouseDown={(e) => handleMouseDown(e, table.id, 'table', table.x, table.y)}
                                            onTouchStart={(e) => handleTouchStart(e, table.id, 'table', table.x, table.y)}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedElement({ id: table.id, type: 'table' })
                                            }}
                                        >
                                            <span className="text-xl font-black tracking-tighter">T-{dbTable.number}</span>
                                            {dbTable.capacity && (
                                                <span className="text-[9px] font-extrabold uppercase text-slate-400 flex items-center gap-0.5 mt-0.5">
                                                    <Users size={8} /> {dbTable.capacity}
                                                </span>
                                            )}
                                        </div>
                                    )
                                })}

                                {/* Obstacles (Walls & Doors) */}
                                {floorPlan.obstacles.map((obstacle) => {
                                    const isSelected = selectedElement?.id === obstacle.id && selectedElement.type === 'obstacle'
                                    const isWall = obstacle.type === 'wall'

                                    return (
                                        <div
                                            key={obstacle.id}
                                            className={cn(
                                                "absolute border select-none cursor-grab active:cursor-grabbing transition-shadow",
                                                isWall 
                                                    ? "bg-slate-700 border-slate-800 rounded-sm" 
                                                    : "bg-amber-100 border-amber-300 rounded-sm flex items-center justify-center",
                                                isSelected ? "border-indigo-600 ring-4 ring-indigo-600/15 z-30 shadow-md" : "z-10 shadow-sm"
                                            )}
                                            style={{
                                                left: `${obstacle.x}px`,
                                                top: `${obstacle.y}px`,
                                                width: `${obstacle.w}px`,
                                                height: `${obstacle.h}px`,
                                                transform: `rotate(${obstacle.rotation}deg)`,
                                                touchAction: 'none'
                                            }}
                                            onMouseDown={(e) => handleMouseDown(e, obstacle.id, 'obstacle', obstacle.x, obstacle.y)}
                                            onTouchStart={(e) => handleTouchStart(e, obstacle.id, 'obstacle', obstacle.x, obstacle.y)}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedElement({ id: obstacle.id, type: 'obstacle' })
                                            }}
                                        >
                                            {!isWall && (
                                                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-none rotate-0">Door</span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Toolbar & Settings Panel (Columns 9 to 12) */}
                    <div className="lg:col-span-3 flex flex-col space-y-6">
                        
                        {/* Selected Element Editor */}
                        {selectedDetails ? (
                            <Card className="glass-card shadow-xl shadow-slate-200/20 border-slate-200 p-6 rounded-[2rem] bg-white animate-in slide-in-from-right duration-300">
                                <CardHeader className="p-0 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-400">Settings</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                                        onClick={() => setSelectedElement(null)}
                                    >
                                        <X size={16} />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0 pt-6 space-y-6">
                                    {/* Display Info */}
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 leading-tight">
                                            {selectedElement?.type === 'table' 
                                                ? `Table ${(selectedDetails as any).number}` 
                                                : (selectedDetails as any).type === 'wall' ? 'Wall Obstacle' : 'Door Passage'}
                                        </h3>
                                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-1">
                                            ID: {selectedDetails.id.substring(0, 10)}
                                        </p>
                                    </div>

                                    {/* Dimensions Editor (Resize) */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Dimensions (px)</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-semibold text-slate-400 pl-1">Width</span>
                                                <Input 
                                                    type="number" 
                                                    step={20}
                                                    min={20}
                                                    value={selectedDetails.w}
                                                    onChange={(e) => updateSelectedProp('w', Math.max(20, parseInt(e.target.value) || 20))}
                                                    className="h-10 rounded-xl font-bold bg-slate-50 border-slate-200 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-semibold text-slate-400 pl-1">Height</span>
                                                <Input 
                                                    type="number" 
                                                    step={20}
                                                    min={20}
                                                    value={selectedDetails.h}
                                                    onChange={(e) => updateSelectedProp('h', Math.max(20, parseInt(e.target.value) || 20))}
                                                    className="h-10 rounded-xl font-bold bg-slate-50 border-slate-200 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sizing Controls */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                updateSelectedProp('w', selectedDetails.w + 20)
                                                updateSelectedProp('h', selectedDetails.h + 20)
                                            }}
                                            className="flex-1 rounded-xl h-9 text-[10px] font-bold border-slate-200"
                                        >
                                            Enlarge
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                updateSelectedProp('w', Math.max(40, selectedDetails.w - 20))
                                                updateSelectedProp('h', Math.max(40, selectedDetails.h - 20))
                                            }}
                                            className="flex-1 rounded-xl h-9 text-[10px] font-bold border-slate-200"
                                        >
                                            Shrink
                                        </Button>
                                    </div>

                                    {/* Shape configuration (Only Tables) */}
                                    {selectedElement?.type === 'table' && (
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Shape</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    variant={(selectedDetails as any).shape === 'rectangle' ? 'default' : 'outline'}
                                                    className="rounded-xl h-10 font-bold text-xs flex gap-1.5 shadow-none"
                                                    onClick={() => updateSelectedProp('shape', 'rectangle')}
                                                >
                                                    <Square size={14} /> Rectangle
                                                </Button>
                                                <Button
                                                    variant={(selectedDetails as any).shape === 'circle' ? 'default' : 'outline'}
                                                    className="rounded-xl h-10 font-bold text-xs flex gap-1.5 shadow-none"
                                                    onClick={() => updateSelectedProp('shape', 'circle')}
                                                >
                                                    <Circle size={14} /> Round
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Rotation & Position */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Position & Angle</label>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1 rounded-xl h-10 font-bold text-xs flex items-center justify-center gap-2 border-slate-200"
                                                onClick={() => {
                                                    const nextRot = ((selectedDetails.rotation || 0) + 90) % 360
                                                    updateSelectedProp('rotation', nextRot)
                                                }}
                                            >
                                                <RotateCw size={14} /> Rotate 90°
                                            </Button>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-semibold text-center mt-1">
                                            Coordinates: X: {selectedDetails.x} px, Y: {selectedDetails.y} px
                                        </p>
                                    </div>

                                    {/* Remove from canvas */}
                                    <Button
                                        onClick={() => selectedElement && handleRemoveElement(selectedDetails.id, selectedElement.type)}
                                        className="w-full rounded-xl h-12 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} /> Delete Element
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="glass-card shadow-sm border-slate-200 p-6 rounded-[2rem] bg-slate-50/50 flex flex-col justify-center items-center py-12 text-center">
                                <Sparkles size={24} className="text-indigo-400 animate-pulse mb-3" />
                                <h4 className="font-bold text-slate-800 text-sm">Select Element</h4>
                                <p className="text-xs text-slate-400 max-w-[160px] mx-auto mt-1 leading-relaxed">
                                    Click any table, wall, or door on the map to resize, rotate, or customize details.
                                </p>
                            </Card>
                        )}

                        {/* Unpositioned Tables List */}
                        <Card className="glass-card shadow-sm border-slate-200 p-6 rounded-[2rem] bg-white flex flex-col flex-1 min-h-[300px]">
                            <CardHeader className="p-0 pb-4 border-b border-slate-100">
                                <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-500">Unplaced Tables</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 pt-4 flex-1 overflow-y-auto max-h-[300px] space-y-3 pr-1">
                                {unpositionedTables.map((table) => (
                                    <div 
                                        key={table.id}
                                        className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between bg-slate-50 hover:bg-indigo-50/20 hover:border-indigo-100 transition-all group cursor-pointer"
                                        onClick={() => handleAddTableToLayout(table.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-black text-xs">
                                                {table.number[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-slate-800">Table {table.number}</span>
                                                {table.capacity && (
                                                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 mt-0.5">
                                                        <Users size={8} /> {table.capacity} seats
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="h-8 rounded-lg text-[10px] font-bold bg-white text-indigo-600 border border-slate-200 hover:bg-indigo-600 hover:text-white"
                                        >
                                            Place
                                        </Button>
                                    </div>
                                ))}

                                {unpositionedTables.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400">
                                        <Check size={28} className="text-emerald-500 mb-2" />
                                        <p className="font-serif text-sm font-medium">All active tables placed</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
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
