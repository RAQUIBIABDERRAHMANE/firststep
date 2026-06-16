'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Loader2, TrendingUp, DollarSign, ShoppingBag, XCircle, ArrowRight, Activity, Percent, Clock, AlertCircle } from 'lucide-react'
import { getRestaurantAnalytics } from '@/app/actions/analytics'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    AreaChart,
    Area
} from 'recharts'

type Period = 'day' | 'month' | 'year'

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-slate-700/50">
                <p className="text-sm font-semibold text-slate-400 mb-2">{label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-black text-white">
                        {payload[0].value.toLocaleString('fr-FR')} <span className="text-sm font-bold text-cyan-400">MAD</span>
                    </p>
                </div>
                {payload[0].payload.orders !== undefined && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800/50 px-2.5 py-1.5 rounded-lg w-fit border border-slate-700/50">
                        <ShoppingBag size={14} className="text-cyan-400" /> {payload[0].payload.orders} commandes
                    </div>
                )}
            </div>
        )
    }
    return null
}

const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-xl p-3 rounded-xl shadow-xl border border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
                    <span className="font-bold text-slate-800">{payload[0].name}</span>
                </div>
                <p className="text-lg font-black text-slate-900 mt-1">{payload[0].value} <span className="text-xs text-slate-500 font-semibold">commandes</span></p>
            </div>
        )
    }
    return null
}

export default function AnalyticsClient({ tenantSlug }: { tenantSlug: string }) {
    const [period, setPeriod] = useState<Period>('month')
    const [dateStr, setDateStr] = useState<string>(new Date().toISOString())
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [hoveredBar, setHoveredBar] = useState<number | null>(null)

    useEffect(() => {
        loadData()
    }, [period, dateStr])

    const loadData = async () => {
        setLoading(true)
        try {
            const result = await getRestaurantAnalytics(tenantSlug, period, dateStr)
            setData(result)
        } catch (error) {
            console.error('Failed to load analytics', error)
        } finally {
            setLoading(false)
        }
    }

    const adjustDate = (modifier: number) => {
        const d = new Date(dateStr)
        if (period === 'day') d.setDate(d.getDate() + modifier)
        if (period === 'month') d.setMonth(d.getMonth() + modifier)
        if (period === 'year') d.setFullYear(d.getFullYear() + modifier)
        setDateStr(d.toISOString())
    }

    const getPeriodLabel = () => {
        const d = new Date(dateStr)
        if (period === 'day') return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})
        if (period === 'month') return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric'})
        if (period === 'year') return d.getFullYear().toString()
        return ''
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-16 font-sans">
            {/* Control Bar - Floating Island Style */}
            <div className="flex flex-col xl:flex-row items-center justify-between bg-slate-900 text-white p-4 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10 flex items-center gap-4 mb-4 xl:mb-0 w-full xl:w-auto px-2">
                    <div className="w-12 h-12 bg-cyan-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Pulse Analytics
                        </h1>
                        <p className="text-sm font-medium text-slate-400 mt-1">Intelligence Opérationnelle</p>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                    <div className="bg-slate-800/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/50 flex w-full sm:w-auto">
                        {(['day', 'month', 'year'] as Period[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 capitalize ${period === p ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                            >
                                {p === 'day' ? 'Jour' : p === 'month' ? 'Mois' : 'Année'}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1 bg-slate-800/80 backdrop-blur-md rounded-2xl p-1.5 border border-slate-700/50 w-full sm:w-auto">
                        <button onClick={() => adjustDate(-1)} className="h-10 w-12 flex items-center justify-center rounded-xl hover:bg-slate-700/80 text-slate-300 transition-all">
                            <span className="sr-only">Précédent</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <div className="flex items-center justify-center px-4 min-w-[140px] sm:min-w-[200px] text-xs sm:text-sm font-bold capitalize text-white text-center">
                            {getPeriodLabel()}
                        </div>
                        <button onClick={() => adjustDate(1)} className="h-10 w-12 flex items-center justify-center rounded-xl hover:bg-slate-700/80 text-slate-300 transition-all">
                            <span className="sr-only">Suivant</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="min-h-[600px] flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-cyan-100 rounded-full animate-spin border-t-cyan-500 mix-blend-multiply"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <p className="text-slate-400 font-bold tracking-widest uppercase mt-6 text-sm">Génération des insights...</p>
                </div>
            ) : data ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    
                    {/* Primary Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Revenue Hero Card - takes up more space */}
                        <div className="lg:col-span-8 p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8">
                                <DollarSign className="w-32 h-32 text-slate-50 opacity-50 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
                            </div>
                            
                            <h3 className="text-slate-500 font-bold tracking-widest text-xs uppercase mb-4">Volume Brut</h3>
                            <div className="flex items-baseline gap-3 mb-10">
                                <span className="text-6xl md:text-7xl font-black tracking-tight text-slate-900">
                                    {data.metrics.totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-xl font-bold text-slate-400">MAD</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                                <div>
                                    <p className="text-slate-400 font-semibold text-sm mb-1">Panier Moyen</p>
                                    <p className="text-2xl font-black text-slate-800">{data.metrics.avgOrderValue.toFixed(2)} <span className="text-xs font-bold text-slate-400">MAD</span></p>
                                </div>
                                <div className="md:pl-6 md:border-l md:border-slate-100">
                                    <p className="text-slate-400 font-semibold text-sm mb-1">Total Commandes</p>
                                    <p className="text-2xl font-black text-slate-800">{data.metrics.totalOrders}</p>
                                </div>
                                <div className="md:pl-6 md:border-l md:border-slate-100">
                                    <p className="text-slate-400 font-semibold text-sm mb-1">Articles Vendus</p>
                                    <p className="text-2xl font-black text-slate-800">{data.metrics.totalItemsSold}</p>
                                </div>
                                <div className="md:pl-6 md:border-l md:border-slate-100">
                                    <p className="text-slate-400 font-semibold text-sm mb-1">Articles / Commande</p>
                                    <p className="text-2xl font-black text-slate-800">{data.metrics.avgItemsPerOrder.toFixed(1)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Breakdown Mini Card */}
                        <div className="lg:col-span-4 p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent"></div>
                            <h3 className="text-slate-400 font-bold tracking-widest text-xs uppercase mb-6 relative z-10">Qualité Opérationnelle</h3>
                            
                            <div className="flex flex-col sm:flex-row h-auto sm:h-32 items-stretch sm:items-center justify-between relative z-10 gap-6 sm:gap-2">
                                <div className="w-full sm:w-1/2">
                                    {data.metrics.totalOrders > 0 ? (
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <div className="flex justify-between text-sm font-bold mb-1">
                                                    <span className="text-emerald-400">Succès</span>
                                                    <span className="text-white">{Math.round((data.metrics.successCount / data.metrics.totalOrders) * 100)}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(data.metrics.successCount / data.metrics.totalOrders) * 100}%` }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm font-bold mb-1">
                                                    <span className="text-rose-400">Annulées</span>
                                                    <span className="text-white">{Math.round((data.metrics.cancelCount / data.metrics.totalOrders) * 100)}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-rose-400 rounded-full" style={{ width: `${(data.metrics.cancelCount / data.metrics.totalOrders) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-slate-500 font-semibold text-sm">Aucune donnée</div>
                                    )}
                                </div>
                                <div className="w-full sm:w-1/2 h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Tooltip content={<CustomPieTooltip />} />
                                            <Pie
                                                data={data.statusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={30}
                                                outerRadius={50}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {data.statusData.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Secondary Row: Revenue Dynamics & Rush Hours */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        
                        <div className="xl:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/40">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800">Dynamique des Revenus</h3>
                                    <p className="text-sm text-slate-500 font-semibold mt-1">Comparaison par cycle.</p>
                                </div>
                            </div>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#06b6d4" stopOpacity={1}/>
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                            </linearGradient>
                                            <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#0891b2" stopOpacity={1}/>
                                                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="label" 
                                            stroke="#94a3b8" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false} 
                                            dy={15}
                                            fontWeight={600}
                                            interval={0}
                                        />
                                        <YAxis 
                                            stroke="#94a3b8" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
                                            dx={-10}
                                            fontWeight={600}
                                        />
                                        <Tooltip cursor={{fill: '#f8fafc', opacity: 0.5}} content={<CustomTooltip />} />
                                        <Bar 
                                            dataKey="revenue" 
                                            radius={[8, 8, 8, 8]}
                                            maxBarSize={48}
                                            onMouseEnter={(_, index) => setHoveredBar(index)}
                                            onMouseLeave={() => setHoveredBar(null)}
                                        >
                                            {data.chartData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={hoveredBar === index ? "url(#barGradientHover)" : "url(#barGradient)"} className="transition-all duration-500" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="xl:col-span-4 bg-gradient-to-br from-indigo-50 to-cyan-50 p-8 rounded-[2.5rem] border border-cyan-100 shadow-xl shadow-cyan-100/50 flex flex-col">
                            <div className="mb-8">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                                    <Clock className="w-5 h-5 text-indigo-500" />
                                </div>
                                <h3 className="text-2xl font-black text-indigo-950">Heures de Pointe</h3>
                                <p className="text-sm text-indigo-600/80 font-semibold mt-1">Activité des 24h.</p>
                            </div>
                            
                            <div className="flex-1 min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.peakHoursData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(99, 102, 241, 0.1)" />
                                        <XAxis 
                                            dataKey="hour" 
                                            stroke="#818cf8" 
                                            fontSize={10} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tickFormatter={(val) => val.split(':')[0]}
                                            interval={3}
                                        />
                                        <YAxis 
                                            stroke="#818cf8" 
                                            fontSize={10} 
                                            tickLine={false} 
                                            axisLine={false}
                                        />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', fontWeight: 700, color: '#312e81' }} 
                                            itemStyle={{ color: '#6366f1' }}
                                        />
                                        <Area type="monotone" dataKey="count" name="Commandes" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>

                    {/* Third Row: Top Performance List */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/40">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800">Palmarès des Ventes</h3>
                                <p className="text-sm text-slate-500 font-semibold mt-1">Les produits moteurs de votre croissance.</p>
                            </div>
                            {data.topItems.length > 0 && (
                                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold border border-emerald-100">
                                    Top {data.topItems.length}
                                </div>
                            )}
                        </div>

                        {data.topItems.length === 0 ? (
                            <div className="h-40 flex flex-col items-center justify-center text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                                <p className="text-slate-500 font-bold">Aucune activité enregistrée sur cette période.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.topItems.map((item: any, i: number) => (
                                    <div key={i} className="flex p-5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center shrink-0 border border-cyan-100 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                            <span className="font-black text-xl text-cyan-600">#{i + 1}</span>
                                        </div>
                                        <div className="ml-4 flex-1 min-w-0 flex flex-col justify-center">
                                            <p className="text-base font-black text-slate-800 truncate mb-1">{item.name}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md inline-block">{item.quantity} unités</p>
                                                <p className="text-sm font-black text-slate-900 group-hover:text-cyan-600 transition-colors">
                                                    {item.revenue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} <span className="text-[10px] text-slate-400">MAD</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            ) : null}
        </div>
    )
}
