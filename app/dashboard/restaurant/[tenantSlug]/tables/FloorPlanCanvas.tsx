'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    Plus,
    Trash2,
    Save,
    RotateCw,
    Square,
    Circle,
    Maximize2,
    Check,
    Layers,
    X,
    Sparkles,
    Move
} from 'lucide-react'
import { createSpace, deleteSpace, saveFloorPlanLayout } from '@/app/actions/restaurant'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface TableItem {
    id: string
    number: string
    capacity?: number | null
}

interface FloorPlanTable {
    id: string
    x: number
    y: number
    w: number
    h: number
    shape: 'rectangle' | 'circle'
    rotation: number
    spaceId?: string
}

interface FloorPlanObstacle {
    id: string
    type: 'wall' | 'door' | 'bar'
    x: number
    y: number
    w: number
    h: number
    rotation: number
    spaceId?: string
}

interface Space {
    id: string
    name: string
    order: number
}

interface FloorPlanCanvasProps {
    tenantSlug: string
    initialTables: TableItem[]
    initialSpaces: Space[]
    initialConfig?: string
}

export default function FloorPlanCanvas({
    tenantSlug,
    initialTables,
    initialSpaces,
    initialConfig
}: FloorPlanCanvasProps) {
    const router = useRouter()

    const [spaces, setSpaces] = useState<Space[]>(initialSpaces.length > 0 ? initialSpaces : [
        { id: 'main', name: 'Salle Principale', order: 0 },
        { id: 'terrace', name: 'Terrasse', order: 1 },
        { id: 'roof', name: 'Rooftop', order: 2 }
    ])
    const [activeSpaceId, setActiveSpaceId] = useState<string>(spaces[0]?.id || 'main')
    const [newSpaceName, setNewSpaceName] = useState('')
    const [isCreatingSpace, setIsCreatingSpace] = useState(false)
    const [loading, setLoading] = useState(false)

    // Floor plan layout state
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
            console.error('Failed to parse floor plan config', e)
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

    // Robust space matching (handles CUIDs, space names, and 'main' fallbacks)
    const activeSpaceObj = spaces.find(s => s.id === activeSpaceId)
    const activeSpaceName = activeSpaceObj?.name || 'Salle Principale'
    const isFirstSpace = spaces[0]?.id === activeSpaceId || activeSpaceId === 'main'

    const isElementInSpace = (elementSpaceId?: string | null) => {
        if (!elementSpaceId) return isFirstSpace
        if (elementSpaceId === activeSpaceId) return true
        if (elementSpaceId === activeSpaceName) return true
        if (isFirstSpace && (elementSpaceId === 'main' || elementSpaceId === 'Salle Principale')) return true
        if (activeSpaceObj && (elementSpaceId === activeSpaceObj.id || elementSpaceId === activeSpaceObj.name)) return true
        return false
    }

    // Filter elements by active space
    const currentSpaceTables = floorPlan.tables.filter(t => isElementInSpace(t.spaceId))
    const currentSpaceObstacles = floorPlan.obstacles.filter(o => isElementInSpace(o.spaceId))

    // Positioned table IDs across all space canvases
    const allPositionedIds = new Set(floorPlan.tables.map(t => t.id))

    // Unpositioned tables: any table from initialTables not currently placed on ANY floor canvas.
    // Removing a table from one floor immediately makes it available under TABLES À PLACER for any floor!
    const unpositionedTables = initialTables.filter((t: any) => !allPositionedIds.has(t.id))

    // Handle space creation
    const handleAddSpace = async () => {
        if (!newSpaceName.trim()) return
        setLoading(true)
        try {
            const res = await createSpace(tenantSlug, newSpaceName.trim())
            if (res.error) {
                toast.error(res.error)
            } else if (res.space) {
                setSpaces(prev => [...prev, res.space])
                setActiveSpaceId(res.space.id)
                setNewSpaceName('')
                setIsCreatingSpace(false)
                toast.success(`Espace "${res.space.name}" créé avec succès !`)
            }
        } catch (e) {
            toast.error('Erreur lors de la création de l\'espace')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteSpace = async (spaceId: string) => {
        if (spaces.length <= 1) {
            toast.error('Vous devez conserver au moins un espace.')
            return
        }
        if (!confirm('Voulez-vous supprimer cet espace ? Les tables placées dans cet espace seront repositionnées.')) return
        
        setLoading(true)
        try {
            await deleteSpace(spaceId, tenantSlug)
            setSpaces(prev => prev.filter(s => s.id !== spaceId))
            if (activeSpaceId === spaceId) {
                setActiveSpaceId(spaces[0]?.id || 'main')
            }
            toast.success('Espace supprimé')
        } catch {
            toast.error('Impossible de supprimer l\'espace')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveLayout = async () => {
        setLoading(true)
        try {
            const res = await saveFloorPlanLayout(tenantSlug, JSON.stringify(floorPlan))
            if (res?.error) {
                toast.error(res.error)
            } else {
                toast.success('Plan 2D sauvegardé avec succès !')
            }
        } catch {
            toast.error('Échec de la sauvegarde du plan')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleAddTableToCanvas = (tableId: string) => {
        const tableDb = initialTables.find(t => t.id === tableId)
        if (!tableDb) return

        const newTable: FloorPlanTable = {
            id: tableId,
            x: 120,
            y: 120,
            w: 80,
            h: 80,
            shape: 'rectangle',
            rotation: 0,
            spaceId: activeSpaceId
        }

        setFloorPlan(prev => ({
            ...prev,
            tables: [...prev.tables.filter(t => t.id !== tableId), newTable]
        }))
        setSelectedElement({ id: tableId, type: 'table' })
        toast.success(`Table ${tableDb.number} ajoutée sur le plan !`)
    }

    const handleAddObstacle = (type: 'wall' | 'door' | 'bar') => {
        const id = `${type}-${Date.now()}`
        const newObstacle: FloorPlanObstacle = {
            id,
            type,
            x: 150,
            y: 150,
            w: type === 'bar' ? 200 : 140,
            h: type === 'wall' ? 16 : 32,
            rotation: 0,
            spaceId: activeSpaceId
        }

        setFloorPlan(prev => ({
            ...prev,
            obstacles: [...prev.obstacles, newObstacle]
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
        if (selectedElement?.id === id) setSelectedElement(null)
    }

    // Mouse Drag Handlers
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
        let newX = e.clientX - rect.left - draggingElement.offsetX
        let newY = e.clientY - rect.top - draggingElement.offsetY

        // Snap to 10px grid if enabled
        if (showGrid) {
            newX = Math.round(newX / 10) * 10
            newY = Math.round(newY / 10) * 10
        }

        newX = Math.max(0, Math.min(rect.width - 60, newX))
        newY = Math.max(0, Math.min(rect.height - 60, newY))

        if (draggingElement.type === 'table') {
            setFloorPlan(prev => ({
                ...prev,
                tables: prev.tables.map(t => t.id === draggingElement.id ? { ...t, x: newX, y: newY } : t)
            }))
        } else {
            setFloorPlan(prev => ({
                ...prev,
                obstacles: prev.obstacles.map(o => o.id === draggingElement.id ? { ...o, x: newX, y: newY } : o)
            }))
        }
    }

    const handleMouseUp = () => setDraggingElement(null)

    // Element Transformations
    const selectedTable = floorPlan.tables.find(t => t.id === selectedElement?.id)
    const selectedObstacle = floorPlan.obstacles.find(o => o.id === selectedElement?.id)

    const updateSelectedTableProps = (updates: Partial<FloorPlanTable>) => {
        if (!selectedElement || selectedElement.type !== 'table') return
        setFloorPlan(prev => ({
            ...prev,
            tables: prev.tables.map(t => t.id === selectedElement.id ? { ...t, ...updates } : t)
        }))
    }

    return (
        <div className="space-y-6">
            {/* Space Navigation Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-2 overflow-x-auto">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1.5">
                        <Layers size={16} className="text-cyan-400" /> Espaces :
                    </span>
                    {spaces.map(s => (
                        <div key={s.id} className="relative group flex items-center">
                            <button
                                onClick={() => setActiveSpaceId(s.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                    activeSpaceId === s.id
                                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                                }`}
                            >
                                {s.name}
                            </button>
                            {spaces.length > 1 && (
                                <button
                                    onClick={() => handleDeleteSpace(s.id)}
                                    className="hidden group-hover:flex ml-1 p-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                    title="Supprimer l'espace"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    ))}

                    {isCreatingSpace ? (
                        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-cyan-500/40">
                            <Input
                                value={newSpaceName}
                                onChange={e => setNewSpaceName(e.target.value)}
                                placeholder="Nom (ex: Rooftop)..."
                                className="h-8 w-36 text-xs bg-transparent border-none text-white focus:ring-0"
                                autoFocus
                            />
                            <button
                                onClick={handleAddSpace}
                                disabled={loading}
                                className="p-1.5 bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition-colors font-bold text-xs"
                            >
                                <Check size={14} />
                            </button>
                            <button
                                onClick={() => setIsCreatingSpace(false)}
                                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsCreatingSpace(true)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800/60 hover:bg-slate-800 text-cyan-400 border border-slate-700 border-dashed transition-all"
                        >
                            <Plus size={14} /> Ajouter un Espace
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            showGrid ? 'bg-slate-800 text-cyan-400 border-cyan-500/30' : 'bg-slate-800/40 text-slate-500 border-slate-800'
                        }`}
                    >
                        Grille 10px
                    </button>
                    <Button
                        onClick={handleSaveLayout}
                        disabled={loading}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs h-9 px-4 rounded-xl shadow-lg shadow-cyan-500/20"
                    >
                        <Save size={14} className="mr-1.5" /> Sauvegarder le Plan
                    </Button>
                </div>
            </div>

            {/* Main Interactive Canvas & Sidebar Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Toolbox Panel */}
                <div className="space-y-4">
                    {/* Unpositioned Tables for Active Space */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                            <span>Tables à placer</span>
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                {unpositionedTables.length}
                            </span>
                        </h3>
                        {unpositionedTables.length === 0 ? (
                            <p className="text-xs text-slate-400 italic py-3 text-center border border-dashed rounded-xl">
                                Toutes les tables ont été placées sur le plan !
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                                {unpositionedTables.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => handleAddTableToCanvas(t.id)}
                                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 transition-all text-xs font-bold text-slate-800"
                                    >
                                        <span>Table {t.number}</span>
                                        <Plus size={14} className="text-cyan-600" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Structural Obstacles & Elements */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                            Éléments de structure
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => handleAddObstacle('wall')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50 text-slate-700 text-xs font-bold gap-1 transition-all"
                            >
                                <div className="w-8 h-2 bg-slate-700 rounded-full" />
                                <span>Mur</span>
                            </button>
                            <button
                                onClick={() => handleAddObstacle('door')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-amber-400 bg-amber-50/40 text-slate-700 text-xs font-bold gap-1 transition-all"
                            >
                                <div className="w-8 h-2 bg-amber-600 rounded-full" />
                                <span>Porte</span>
                            </button>
                            <button
                                onClick={() => handleAddObstacle('bar')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-purple-400 bg-purple-50/40 text-slate-700 text-xs font-bold gap-1 transition-all"
                            >
                                <div className="w-8 h-3 bg-purple-600 rounded" />
                                <span>Comptoir</span>
                            </button>
                        </div>
                    </div>

                    {/* Element Properties Inspector */}
                    {selectedElement && (selectedTable || selectedObstacle) && (
                        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                                    Propriétés ({selectedElement.type === 'table' ? `Table ${initialTables.find(t => t.id === selectedTable?.id)?.number}` : 'Structure'})
                                </span>
                                <button
                                    onClick={() => handleRemoveElement(selectedElement.id, selectedElement.type)}
                                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                    title="Retirer du plan"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            {selectedTable && (
                                <div className="space-y-3 text-xs">
                                    <div>
                                        <label className="block text-slate-400 mb-1 font-bold">Forme :</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateSelectedTableProps({ shape: 'rectangle' })}
                                                className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1 font-bold ${
                                                    selectedTable.shape === 'rectangle' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'border-slate-800 text-slate-400'
                                                }`}
                                            >
                                                <Square size={12} /> Carré
                                            </button>
                                            <button
                                                onClick={() => updateSelectedTableProps({ shape: 'circle' })}
                                                className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1 font-bold ${
                                                    selectedTable.shape === 'circle' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'border-slate-800 text-slate-400'
                                                }`}
                                            >
                                                <Circle size={12} /> Rond
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 mb-1 font-bold">Orientation :</label>
                                        <button
                                            onClick={() => updateSelectedTableProps({ rotation: (selectedTable.rotation + 45) % 360 })}
                                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold flex items-center justify-center gap-2"
                                        >
                                            <RotateCw size={14} /> Tourner ({selectedTable.rotation}°)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Interactive 2D Grid Canvas */}
                <div className="lg:col-span-3">
                    <div
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        className="relative w-full h-[620px] bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-2xl select-none"
                        style={showGrid ? {
                            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`,
                            backgroundSize: '20px 20px'
                        } : {}}
                    >
                        {/* Space Title Watermark */}
                        <div className="absolute top-4 left-5 pointer-events-none opacity-20">
                            <span className="text-3xl font-black uppercase text-white tracking-widest">
                                {spaces.find(s => s.id === activeSpaceId)?.name}
                            </span>
                        </div>

                        {/* Obstacles Render */}
                        {currentSpaceObstacles.map(o => (
                            <div
                                key={o.id}
                                onMouseDown={e => handleMouseDown(e, o.id, 'obstacle', o.x, o.y)}
                                className={`absolute cursor-move border transition-shadow ${
                                    selectedElement?.id === o.id ? 'ring-2 ring-cyan-400 shadow-lg' : ''
                                } ${
                                    o.type === 'wall' ? 'bg-slate-700 border-slate-600 rounded-sm' :
                                    o.type === 'door' ? 'bg-amber-600/80 border-amber-400 rounded' :
                                    'bg-purple-900/90 border-purple-500 rounded-xl'
                                }`}
                                style={{
                                    left: `${o.x}px`,
                                    top: `${o.y}px`,
                                    width: `${o.w}px`,
                                    height: `${o.h}px`,
                                    transform: `rotate(${o.rotation}deg)`
                                }}
                            >
                                <span className="text-[9px] font-bold text-white uppercase opacity-80 flex items-center justify-center h-full">
                                    {o.type}
                                </span>
                            </div>
                        ))}

                        {/* Tables Render */}
                        {currentSpaceTables.map(t => {
                            const tableDb = initialTables.find(db => db.id === t.id)
                            const isSelected = selectedElement?.id === t.id

                            return (
                                <div
                                    key={t.id}
                                    onMouseDown={e => handleMouseDown(e, t.id, 'table', t.x, t.y)}
                                    className={`absolute cursor-move flex flex-col items-center justify-center border-2 transition-all shadow-xl ${
                                        t.shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
                                    } ${
                                        isSelected
                                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-cyan-500/30 ring-4 ring-cyan-500/20 scale-105'
                                            : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:border-slate-500'
                                    }`}
                                    style={{
                                        left: `${t.x}px`,
                                        top: `${t.y}px`,
                                        width: `${t.w}px`,
                                        height: `${t.h}px`,
                                        transform: `rotate(${t.rotation}deg)`
                                    }}
                                >
                                    <span className="text-sm font-black tracking-tight">
                                        T{tableDb?.number || '?'}
                                    </span>
                                    {tableDb?.capacity && (
                                        <span className="text-[9px] font-bold text-slate-400">
                                            {tableDb.capacity} pers.
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
