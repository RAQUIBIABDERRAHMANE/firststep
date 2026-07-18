'use client'

import { useState, useTransition } from 'react'
import {
    getInventory, createIngredient, updateIngredient, deleteIngredient, setDishRecipe
} from '@/app/actions/restaurant'
import {
    Package, Plus, Pencil, Trash2, AlertTriangle, ChefHat,
    X, Check, RefreshCw
} from 'lucide-react'

type Unit = 'g' | 'kg' | 'pcs' | 'L' | 'ml'

interface Ingredient {
    id: string
    name: string
    stock: number
    unit: string
    minStock: number
    recipes: { dish: { id: string; name: string }; quantity: number }[]
}

interface InventoryClientProps {
    tenantSlug: string
    initialIngredients: Ingredient[]
}

const UNITS: Unit[] = ['g', 'kg', 'pcs', 'L', 'ml']

export default function InventoryClient({ tenantSlug, initialIngredients }: InventoryClientProps) {
    const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients)
    const [isPending, startTransition] = useTransition()
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Ingredient | null>(null)

    const [form, setForm] = useState({ name: '', unit: 'g' as Unit, stock: 0, minStock: 0 })

    const refresh = async () => {
        const data = await getInventory(tenantSlug)
        setIngredients(data as any[])
    }

    const handleSubmit = () => {
        startTransition(async () => {
            if (editing) {
                await updateIngredient(editing.id, form, tenantSlug)
            } else {
                await createIngredient(form, tenantSlug)
            }
            await refresh()
            setShowForm(false)
            setEditing(null)
            setForm({ name: '', unit: 'g', stock: 0, minStock: 0 })
        })
    }

    const handleEdit = (ing: Ingredient) => {
        setEditing(ing)
        setForm({ name: ing.name, unit: ing.unit as Unit, stock: ing.stock, minStock: ing.minStock })
        setShowForm(true)
    }

    const handleDelete = (id: string) => {
        if (!confirm('Supprimer cet ingrédient ?')) return
        startTransition(async () => {
            await deleteIngredient(id, tenantSlug)
            await refresh()
        })
    }

    const lowStock = ingredients.filter(i => i.stock < i.minStock && i.minStock > 0)

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="text-cyan-400" size={24} />
                        Gestion des Stocks
                    </h2>
                    <p className="text-slate-400 mt-1 text-sm">
                        Gérez les ingrédients et les recettes. Les stocks se décrèmentent automatiquement lors du service.
                    </p>
                </div>
                <button
                    onClick={() => { setEditing(null); setForm({ name: '', unit: 'g', stock: 0, minStock: 0 }); setShowForm(true) }}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all"
                >
                    <Plus size={16} /> Ajouter ingrédient
                </button>
            </div>

            {/* Low Stock Alerts */}
            {lowStock.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <AlertTriangle size={18} className="text-amber-400 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-amber-300 font-medium text-sm">Stock bas détecté</p>
                        <p className="text-amber-400/80 text-xs mt-0.5">
                            {lowStock.map(i => `${i.name} (${i.stock} ${i.unit})`).join(' · ')}
                        </p>
                    </div>
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{editing ? 'Modifier ingrédient' : 'Nouvel ingrédient'}</h3>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-xs text-slate-400 mb-1 block">Nom</label>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="ex: Farine"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Unité</label>
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                                value={form.unit}
                                onChange={e => setForm(f => ({ ...f, unit: e.target.value as Unit }))}
                            >
                                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Stock actuel</label>
                            <input
                                type="number" min={0}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                                value={form.stock}
                                onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Seuil d'alerte (stock min)</label>
                            <input
                                type="number" min={0}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                                value={form.minStock}
                                onChange={e => setForm(f => ({ ...f, minStock: Number(e.target.value) }))}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || !form.name}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                    >
                        {isPending ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                        {editing ? 'Enregistrer' : 'Créer'}
                    </button>
                </div>
            )}

            {/* Ingredients Table */}
            {ingredients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                    <ChefHat size={48} />
                    <p className="mt-4 text-slate-400">Aucun ingrédient configuré</p>
                    <p className="text-sm text-slate-500 mt-1">Ajoutez vos ingrédients pour suivre les stocks automatiquement.</p>
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wide">
                                <th className="text-left px-5 py-3">Ingrédient</th>
                                <th className="text-right px-5 py-3">Stock actuel</th>
                                <th className="text-right px-5 py-3">Seuil d'alerte</th>
                                <th className="text-left px-5 py-3">Utilisé dans</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {ingredients.map(ing => {
                                const isLow = ing.minStock > 0 && ing.stock < ing.minStock
                                return (
                                    <tr key={ing.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3 font-medium">{ing.name}</td>
                                        <td className="px-5 py-3 text-right">
                                            <span className={`font-mono ${isLow ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                                                {ing.stock} {ing.unit}
                                            </span>
                                            {isLow && <AlertTriangle size={12} className="inline ml-1 text-amber-400" />}
                                        </td>
                                        <td className="px-5 py-3 text-right text-slate-500 font-mono">
                                            {ing.minStock > 0 ? `${ing.minStock} ${ing.unit}` : '—'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {ing.recipes.slice(0, 3).map((r, i) => (
                                                    <span key={i} className="text-xs bg-white/10 rounded-md px-2 py-0.5">
                                                        {r.dish.name} ({r.quantity}{ing.unit})
                                                    </span>
                                                ))}
                                                {ing.recipes.length > 3 && (
                                                    <span className="text-xs text-slate-500">+{ing.recipes.length - 3}</span>
                                                )}
                                                {ing.recipes.length === 0 && (
                                                    <span className="text-xs text-slate-600">Non assigné</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => handleEdit(ing)}
                                                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ing.id)}
                                                    className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
