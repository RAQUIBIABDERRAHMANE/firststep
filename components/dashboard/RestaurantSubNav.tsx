'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Utensils,
    ClipboardList,
    MapPin,
    CalendarCheck,
    Users,
    Paintbrush,
    BarChart3,
    TrendingUp,
    ChefHat,
    ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RestaurantSubNavProps {
    tenantSlug: string
    siteName: string
}

export default function RestaurantSubNav({ tenantSlug, siteName }: RestaurantSubNavProps) {
    const pathname = usePathname()
    const base = `/dashboard/restaurant/${tenantSlug}`

    const tabs = [
        { label: 'Overview',     href: base,                       icon: LayoutDashboard, exact: true },
        { label: 'Orders',       href: `${base}/orders`,           icon: ClipboardList },
        { label: 'Menu',         href: `${base}/menu`,             icon: Utensils },
        { label: 'Tables',       href: `${base}/tables`,           icon: MapPin },
        { label: 'Reservations', href: `${base}/reservations`,     icon: CalendarCheck },
        { label: 'Waiters',      href: `${base}/waiters`,          icon: Users },
        { label: 'KDS',          href: `${base}/kds`,              icon: ChefHat },
        { label: 'Design',       href: `${base}/design`,           icon: Paintbrush },
        { label: 'Analytics',    href: `${base}/analytics`,        icon: TrendingUp },
        { label: 'Reports',      href: `${base}/reports`,          icon: BarChart3 },
    ]

    return (
        <div className="sticky top-14 lg:top-0 z-10 bg-white border-b border-slate-200 shadow-sm w-full">
            <div className="flex items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>
                {/* Restaurant name badge */}
                <div className="flex items-center gap-1.5 pr-3 mr-1 border-r border-slate-200 shrink-0 py-3">
                    <div className="h-6 w-6 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Utensils size={12} className="text-blue-500" />
                    </div>
                    <span className="text-xs font-black text-slate-700 whitespace-nowrap max-w-[100px] truncate">
                        {siteName}
                    </span>
                </div>

                {/* Tab links */}
                {tabs.map((tab) => {
                    const isActive = tab.exact
                        ? pathname === tab.href
                        : pathname === tab.href || pathname.startsWith(tab.href + '/')

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-3.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all shrink-0',
                                isActive
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                            )}
                        >
                            <tab.icon size={13} />
                            <span className="hidden sm:inline">{tab.label}</span>
                            {/* On tiny screens, show only icon */}
                            <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
                        </Link>
                    )
                })}

                {/* Live site shortcut */}
                <a
                    href={`/${tenantSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto shrink-0 flex items-center gap-1.5 px-3 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-blue-500 transition-colors border-b-2 border-transparent"
                >
                    <ExternalLink size={13} />
                    <span className="hidden md:inline">Live Site</span>
                </a>
            </div>
        </div>
    )
}
