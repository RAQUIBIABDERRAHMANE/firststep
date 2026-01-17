'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { LayoutDashboard, Layers, Bell, Settings, ChevronRight, Bot, Users, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
    subscribedServiceSlugs: string[]
    translations: any
    websites: any[]
}

export default function Sidebar({ subscribedServiceSlugs, translations, websites }: SidebarProps) {
    const params = useParams()
    const pathname = usePathname()
    const t = translations
    const tenantSlug = params.tenantSlug as string

    // Base nav items (always shown)
    const baseNavItems = [
        { label: t.dashboard, href: '/dashboard', icon: LayoutDashboard },
    ]

    // Service-specific nav items
    const serviceNavItems: { label: string; href: string; icon: any }[] = []

    // Restaurant Logic
    const hasRestaurantService = subscribedServiceSlugs.includes('restaurant-website') || subscribedServiceSlugs.includes('restaurant-pos')
    if (hasRestaurantService) {
        const restaurantInstance = websites.find(w => w.service.slug.includes('restaurant'))
        const label = restaurantInstance?.siteName || t.restaurant
        const href = pathname.includes('/dashboard/restaurant/') && tenantSlug
            ? `/dashboard/restaurant/${tenantSlug}`
            : '/dashboard/restaurant'

        serviceNavItems.push({ label, href, icon: Users })
    }

    // Cabinet Logic
    const hasCabinetService = subscribedServiceSlugs.some((slug: string) =>
        slug.includes('cabinet') || slug.includes('professional-services')
    )
    if (hasCabinetService) {
        const cabinetInstance = websites.find(w => w.service.slug.includes('cabinet') || w.service.slug.includes('professional'))
        const label = cabinetInstance?.siteName || t.cabinet
        const href = pathname.includes('/dashboard/cabinet/') && tenantSlug
            ? `/dashboard/cabinet/${tenantSlug}`
            : '/dashboard/cabinet'

        serviceNavItems.push({ label, href, icon: Briefcase })
    }

    // Common nav items
    const commonNavItems = [
        { label: t.services, href: '/dashboard/services', icon: Layers },
        { label: t.ai_assistant, href: '/dashboard/ai', icon: Bot },
        { label: t.notifications, href: '/dashboard/notifications', icon: Bell },
        { label: t.settings, href: '/dashboard/settings', icon: Settings },
    ]

    const navItems = [...baseNavItems, ...serviceNavItems, ...commonNavItems]

    return (
        <nav className="grid items-start px-4 gap-1">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

                return (
                    <Link
                        key={item.href}
                        className={cn(
                            "group flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-white dark:hover:bg-zinc-800 hover:text-primary hover:shadow-sm",
                            isActive ? "bg-white dark:bg-zinc-800 text-primary shadow-sm" : "text-muted-foreground"
                        )}
                        href={item.href}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                            {item.label}
                        </div>
                        <ChevronRight className={cn("h-4 w-4 opacity-0 group-hover:opacity-40 transition-opacity", isActive && "opacity-40")} />
                    </Link>
                )
            })}
        </nav>
    )
}
