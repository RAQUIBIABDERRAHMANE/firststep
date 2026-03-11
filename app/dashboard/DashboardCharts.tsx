'use client'

import BarChartCard from '@/components/dashboard/charts/BarChartCard'
import AreaChartCard from '@/components/dashboard/charts/AreaChartCard'
import DonutChart from '@/components/dashboard/charts/DonutChart'

type ChartData = { name: string; value: number }[]
type DonutData = { name: string; value: number; color: string }[]

type DashboardChartsProps =
    | { chartType: 'general'; paymentChartData: ChartData; serviceDistribution: DonutData }
    | { chartType: 'restaurant'; orderChartData: ChartData; restaurantRevenueChartData: ChartData }
    | { chartType: 'cabinet'; appointmentChartData: ChartData }

export default function DashboardCharts(props: DashboardChartsProps) {
    if (props.chartType === 'restaurant') {
        const hasOrders = props.orderChartData.some(d => d.value > 0)
        const hasRevenue = props.restaurantRevenueChartData.some(d => d.value > 0)
        if (!hasOrders && !hasRevenue) return null
        return (
            <div className="grid gap-4 lg:grid-cols-2">
                {hasOrders && (
                    <BarChartCard
                        data={props.orderChartData}
                        title="Commandes par mois"
                        description="Nombre de commandes reçues"
                        color="#F97316"
                    />
                )}
                {hasRevenue && (
                    <AreaChartCard
                        data={props.restaurantRevenueChartData}
                        title="Revenu par mois"
                        description="Chiffre d'affaires restaurant (MAD)"
                        color="#10B981"
                    />
                )}
            </div>
        )
    }

    if (props.chartType === 'cabinet') {
        const hasAppointments = props.appointmentChartData.some(d => d.value > 0)
        if (!hasAppointments) return null
        return (
            <AreaChartCard
                data={props.appointmentChartData}
                title="Rendez-vous par mois"
                description="Nombre de rendez-vous planifiés"
                color="#8B5CF6"
            />
        )
    }

    // General charts
    const hasPayments = props.paymentChartData.some(d => d.value > 0)
    const hasServices = props.serviceDistribution.length > 0
    if (!hasPayments && !hasServices) return null

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {hasPayments && (
                <BarChartCard
                    data={props.paymentChartData}
                    title="Historique des paiements"
                    description="Montants confirmés par mois (MAD)"
                    color="#3B82F6"
                />
            )}
            {hasServices && (
                <DonutChart
                    data={props.serviceDistribution}
                    title="Vos services"
                    centerLabel="Actifs"
                />
            )}
        </div>
    )
}
