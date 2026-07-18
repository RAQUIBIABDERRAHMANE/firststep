'use client'

import { useState, useTransition } from 'react'
import { createBillSplit } from '@/app/actions/restaurant'
import { Users, CheckSquare, Square, X, Split } from 'lucide-react'

interface CartItem {
    cartItemId: string
    id: string
    name: string
    price: number
    quantity: number
}

interface SplitBillModalProps {
    orderId: string
    items: CartItem[]
    totalPrice: number
    onClose: () => void
}

type SplitMode = 'EQUAL' | 'ITEMIZED'

export default function SplitBillModal({ orderId, items, totalPrice, onClose }: SplitBillModalProps) {
    const [mode, setMode] = useState<SplitMode>('EQUAL')
    const [parts, setParts] = useState(2)
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set())
    const [isPending, startTransition] = useTransition()
    const [done, setDone] = useState(false)

    const equalShare = totalPrice / parts

    const toggleItem = (itemId: string) => {
        setSelectedItemIds(prev => {
            const next = new Set(prev)
            if (next.has(itemId)) next.delete(itemId)
            else next.add(itemId)
            return next
        })
    }

    const itemizedTotal = items
        .filter(i => selectedItemIds.has(i.cartItemId))
        .reduce((sum, i) => sum + i.price * i.quantity, 0)

    const handleConfirm = () => {
        startTransition(async () => {
            await createBillSplit(
                orderId,
                mode,
                mode === 'EQUAL' ? parts : undefined,
                mode === 'ITEMIZED' ? Array.from(selectedItemIds) : undefined
            )
            setDone(true)
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Split size={20} className="text-cyan-400" />
                        <h3 className="font-bold text-lg">Partager l'addition</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {done ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckSquare size={28} className="text-emerald-400" />
                        </div>
                        <p className="font-semibold text-lg">Partage enregistré</p>
                        <p className="text-slate-400 text-sm mt-1">
                            {mode === 'EQUAL'
                                ? `Chaque personne paye ${equalShare.toFixed(2)} MAD`
                                : `Votre part: ${itemizedTotal.toFixed(2)} MAD`
                            }
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-5 px-6 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-medium transition-all"
                        >
                            Fermer
                        </button>
                    </div>
                ) : (
                    <div className="p-5 space-y-5">
                        {/* Mode toggle */}
                        <div className="grid grid-cols-2 gap-2 bg-white/5 rounded-xl p-1">
                            {(['EQUAL', 'ITEMIZED'] as SplitMode[]).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                                        mode === m ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {m === 'EQUAL' ? '⚖️ Partage égal' : '✅ Par articles'}
                                </button>
                            ))}
                        </div>

                        {/* Equal split */}
                        {mode === 'EQUAL' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Users size={18} className="text-slate-400" />
                                    <span className="text-sm text-slate-300">Nombre de personnes</span>
                                </div>
                                <div className="flex items-center gap-4 justify-center">
                                    <button
                                        onClick={() => setParts(p => Math.max(2, p - 1))}
                                        className="w-10 h-10 bg-white/10 hover:bg-white/15 rounded-xl text-xl font-bold transition-all"
                                    >
                                        −
                                    </button>
                                    <span className="text-3xl font-bold w-12 text-center">{parts}</span>
                                    <button
                                        onClick={() => setParts(p => Math.min(20, p + 1))}
                                        className="w-10 h-10 bg-white/10 hover:bg-white/15 rounded-xl text-xl font-bold transition-all"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 text-center">
                                    <p className="text-sm text-slate-400">Votre part</p>
                                    <p className="text-3xl font-bold text-cyan-400 mt-1">
                                        {equalShare.toFixed(2)} <span className="text-lg">MAD</span>
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Total: {totalPrice.toFixed(2)} MAD ÷ {parts}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Itemized split */}
                        {mode === 'ITEMIZED' && (
                            <div className="space-y-3">
                                <p className="text-sm text-slate-400">Sélectionnez vos articles :</p>
                                {items.map(item => {
                                    const isSelected = selectedItemIds.has(item.cartItemId)
                                    return (
                                        <button
                                            key={item.cartItemId}
                                            onClick={() => toggleItem(item.cartItemId)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                                                isSelected
                                                    ? 'border-cyan-500/50 bg-cyan-500/10'
                                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                            }`}
                                        >
                                            {isSelected
                                                ? <CheckSquare size={18} className="text-cyan-400 shrink-0" />
                                                : <Square size={18} className="text-slate-500 shrink-0" />
                                            }
                                            <span className="flex-1 text-sm">
                                                {item.quantity}× {item.name}
                                            </span>
                                            <span className="text-sm font-medium text-slate-300">
                                                {(item.price * item.quantity).toFixed(2)} MAD
                                            </span>
                                        </button>
                                    )
                                })}
                                {selectedItemIds.size > 0 && (
                                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 flex justify-between items-center">
                                        <span className="text-sm text-slate-400">Votre total sélectionné</span>
                                        <span className="text-lg font-bold text-cyan-400">
                                            {itemizedTotal.toFixed(2)} MAD
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Confirm button */}
                        <button
                            onClick={handleConfirm}
                            disabled={isPending || (mode === 'ITEMIZED' && selectedItemIds.size === 0)}
                            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                        >
                            {isPending ? 'Enregistrement...' : 'Confirmer le partage'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
