'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface BarChartCardProps {
    data: { name: string; value: number }[]
    title: string
    description?: string
    color?: string
}

export default function BarChartCard({ data, title, description, color = '#3B82F6' }: BarChartCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 sm:p-6">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
            <div className="h-44 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                fontSize: '13px',
                            }}
                            cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar
                            dataKey="value"
                            fill={color}
                            radius={[6, 6, 0, 0]}
                            barSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
