'use client'

import { useState } from 'react'
import { getAIComboRecommendations } from '@/app/actions/ai'
import { Sparkles, TrendingUp, Package, RefreshCw, AlertCircle, ChevronRight } from 'lucide-react'

interface Combo {
    name: string
    dishes: string[]
    suggestedPrice: number
    saving: number
    pitch: string
    frequency: string
}

interface CombosClientProps {
    tenantSlug: string
}

export default function CombosClient({ tenantSlug }: CombosClientProps) {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ combos: Combo[]; ordersAnalyzed: number; pairsAnalyzed: number } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const analyze = async () => {
        setLoading(true)
        setError(null)
        setResult(null)

        const res = await getAIComboRecommendations(tenantSlug) as any
        if (res?.error) {
            setError(res.error)
        } else {
            setResult(res)
        }
        setLoading(false)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="text-yellow-400" size={24} />
                        Recommandations Combos IA
                    </h2>
                    <p className="text-slate-400 mt-1 text-sm">
                        Analyse les 90 derniers jours de commandes et suggère des formules rentables.
                    </p>
                </div>
                <button
                    onClick={analyze}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                >
                    {loading ? (
                        <><RefreshCw size={16} className="animate-spin" /> Analyse en cours...</>
                    ) : (
                        <><Sparkles size={16} /> Analyser le menu</>
                    )}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Stats bar */}
            {result && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-cyan-400">{result.ordersAnalyzed}</div>
                        <div className="text-sm text-slate-400 mt-1">Commandes analysées</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-violet-400">{result.pairsAnalyzed}</div>
                        <div className="text-sm text-slate-400 mt-1">Associations trouvées</div>
                    </div>
                </div>
            )}

            {/* Combo Cards */}
            {result?.combos && result.combos.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-400" />
                        Formules suggérées
                    </h3>
                    {result.combos.map((combo, i) => (
                        <div
                            key={i}
                            className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-yellow-400 text-lg">✨</span>
                                        <h4 className="text-lg font-bold">{combo.name}</h4>
                                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                                            {combo.frequency}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-3">{combo.pitch}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {combo.dishes.map((dish, j) => (
                                            <span key={j} className="flex items-center gap-1 text-xs bg-white/10 rounded-lg px-2.5 py-1">
                                                <Package size={10} /> {dish}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-2xl font-bold text-cyan-400">{combo.suggestedPrice} MAD</div>
                                    {combo.saving > 0 && (
                                        <div className="text-xs text-emerald-400 mt-0.5">
                                            Économie: {combo.saving} MAD
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && !result && !error && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-600 text-center">
                    <Sparkles size={48} className="mb-4" />
                    <p className="text-lg font-medium text-slate-400">Prêt à analyser</p>
                    <p className="text-sm mt-1">Cliquez sur "Analyser le menu" pour générer des recommandations.</p>
                </div>
            )}
        </div>
    )
}
