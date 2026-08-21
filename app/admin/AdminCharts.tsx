'use client'

import AreaChartCard from '@/components/dashboard/charts/AreaChartCard'
import BarChartCard from '@/components/dashboard/charts/BarChartCard'
import DonutChart from '@/components/dashboard/charts/DonutChart'
import { Layers, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react'

interface AdminChartsProps {
    userGrowthData: { name: string; value: number }[]
    revenueData: { name: string; value: number }[]
    serviceDistribution: { name: string; value: number; color: string }[]
}

export default function AdminCharts({ userGrowthData, revenueData, serviceDistribution }: AdminChartsProps) {
    const totalServiceSubs = serviceDistribution.reduce((acc, curr) => acc + curr.value, 0)
    const topService = serviceDistribution.length > 0
        ? [...serviceDistribution].sort((a, b) => b.value - a.value)[0]
        : null

    return (
        <div className="space-y-6">
            {/* Upper charts grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200">
                    <AreaChartCard
                        data={userGrowthData}
                        title="Croissance des Utilisateurs"
                        description="Inscriptions mensuelles sur les 6 derniers mois"
                        color="#06B6D4"
                    />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200">
                    <BarChartCard
                        data={revenueData}
                        title="Revenus Mensuels Confirmés"
                        description="Volume des encaissements par mois (MAD)"
                        color="#10B981"
                    />
                </div>
            </div>

            {/* Bottom Service Distribution & Analytics Section */}
            {serviceDistribution.length > 0 && (
                <div className="grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-8 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200">
                        <DonutChart
                            data={serviceDistribution}
                            title="Répartition des Modules & Services Souscrits"
                            centerLabel="Modules"
                            centerValue={totalServiceSubs}
                        />
                    </div>

                    {/* Service Highlights Card */}
                    <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow duration-200">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Analyse Modules
                                </span>
                                <div className="h-8 w-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                    <Layers className="w-4 h-4" />
                                </div>
                            </div>

                            <h3 className="text-base font-bold text-slate-900">
                                Performance Catalogue
                            </h3>
                            <p className="text-xs text-slate-500">
                                Vue d&apos;ensemble sur la popularité des solutions digitales FirstStep.
                            </p>

                            {topService && (
                                <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-500/20 space-y-1">
                                    <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Module le plus souscrit
                                    </span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-900">{topService.name}</span>
                                        <span className="text-xs font-extrabold text-cyan-600">
                                            {topService.value} abonnés
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Catalogue en direct
                            </span>
                            <span className="font-mono text-slate-400">
                                {serviceDistribution.length} service{serviceDistribution.length > 1 ? 's' : ''} actif{serviceDistribution.length > 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
