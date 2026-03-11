'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface DonutChartProps {
    data: { name: string; value: number; color: string }[]
    title: string
    centerLabel?: string
    centerValue?: string | number
}

export default function DonutChart({ data, title, centerLabel, centerValue }: DonutChartProps) {
    const total = data.reduce((sum, entry) => sum + entry.value, 0)

    return (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            </div>
            <div className="flex items-center gap-6">
                <div className="h-48 w-48 relative shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    fontSize: '13px',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {centerLabel && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-slate-900">{centerValue ?? total}</span>
                            <span className="text-xs text-slate-500">{centerLabel}</span>
                        </div>
                    )}
                </div>
                <div className="flex-1 space-y-2.5">
                    {data.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2.5">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-slate-600">{entry.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900">{entry.value}</span>
                                {total > 0 && (
                                    <span className="text-xs text-slate-400">
                                        {Math.round((entry.value / total) * 100)}%
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
