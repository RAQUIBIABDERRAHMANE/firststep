'use client'

import AreaChartCard from '@/components/dashboard/charts/AreaChartCard'
import BarChartCard from '@/components/dashboard/charts/BarChartCard'
import DonutChart from '@/components/dashboard/charts/DonutChart'

interface AdminChartsProps {
    userGrowthData: { name: string; value: number }[]
    revenueData: { name: string; value: number }[]
    serviceDistribution: { name: string; value: number; color: string }[]
}

export default function AdminCharts({ userGrowthData, revenueData, serviceDistribution }: AdminChartsProps) {
    return (
        <>
            <div className="grid gap-4 lg:grid-cols-2">
                <AreaChartCard
                    data={userGrowthData}
                    title="Croissance des utilisateurs"
                    description="Nouvelles inscriptions par mois"
                    color="#3B82F6"
                />
                <BarChartCard
                    data={revenueData}
                    title="Revenus mensuels"
                    description="Paiements confirmés (MAD)"
                    color="#10B981"
                />
            </div>
            {serviceDistribution.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-2">
                    <DonutChart
                        data={serviceDistribution}
                        title="Répartition des services"
                        centerLabel="Total"
                    />
                </div>
            )}
        </>
    )
}
