'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Layers, Bell, Settings, ChevronRight, Bot, Users, Briefcase, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
    subscribedServiceSlugs: string[]
    translations: any
    websites: any[]
    onNavClick?: () => void   // optional: called when a nav link is clicked (used by mobile drawer)
}

export default function Sidebar({ subscribedServiceSlugs, translations, websites, onNavClick }: SidebarProps) {
    const pathname = usePathname()
    const t = translations

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
        const href = restaurantInstance?.slug
            ? `/dashboard/restaurant/${restaurantInstance.slug}`
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
        const href = cabinetInstance?.slug
            ? `/dashboard/cabinet/${cabinetInstance.slug}`
            : '/dashboard/cabinet'
        serviceNavItems.push({ label, href, icon: Briefcase })
    }

    // Common nav items
    const commonNavItems = [
        { label: 'Paiements', href: '/dashboard/payments', icon: CreditCard },
        { label: t.services, href: '/dashboard/services', icon: Layers },
        { label: t.ai_assistant, href: '/dashboard/ai', icon: Bot },
        { label: t.notifications, href: '/dashboard/notifications', icon: Bell },
        { label: t.settings, href: '/dashboard/settings', icon: Settings },
    ]

    const sections = [
        { heading: null, items: baseNavItems },
        ...(serviceNavItems.length > 0 ? [{ heading: 'My Services', items: serviceNavItems }] : []),
        { heading: 'Account', items: commonNavItems },
    ]

    return (
        <nav className="px-3 space-y-4">
            {sections.map((section, si) => (
                <div key={si}>
                    {section.heading && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 mb-1.5">
                            {section.heading}
                        </p>
                    )}
                    <div className="space-y-0.5">
                        {section.items.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onNavClick}
                                    className={cn(
                                        'group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                                        isActive
                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn('h-[18px] w-[18px]', isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600')} />
                                        {item.label}
                                    </div>
                                    <ChevronRight className={cn('h-3.5 w-3.5 transition-opacity shrink-0', isActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-40')} />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            ))}
        </nav>
    )
}
