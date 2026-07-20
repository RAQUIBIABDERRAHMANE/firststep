'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  ChevronRight, 
  CreditCard, 
  Globe, 
  ExternalLink, 
  Mail, 
  QrCode, 
  FileText, 
  Receipt, 
  Sparkles 
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: any
  badge?: string
}

export default function AdminSidebarNav() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { label: 'Vue d\'ensemble', href: '/admin', icon: LayoutDashboard },
    { label: 'Manage Services', href: '/admin/services', icon: Layers },
    { label: 'User Directory', href: '/admin/users', icon: Users },
    { label: 'Websites', href: '/admin/websites', icon: Globe },
    { label: 'Demandes Sur Mesure', href: '/admin/custom-requests', icon: FileText },
    { label: 'Client Access', href: '/admin/access', icon: ExternalLink },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Factures Émises', href: '/admin/factures', icon: Receipt },
    { label: 'Modèle Facture', href: '/admin/facture-template', icon: FileText },
    { label: 'Assistant Marketing', href: '/admin/marketing', icon: Sparkles, badge: 'IA' },
    { label: 'Campaigns', href: '/admin/campaigns', icon: Mail },
    { label: 'Print Requests', href: '/admin/print-requests', icon: QrCode },
  ]

  return (
    <nav className="grid items-start px-3 gap-1">
      {navItems.map((item) => {
        // Matches exact path or sub-routes (e.g., /admin/campaigns/new matches /admin/campaigns)
        const isActive = 
          item.href === '/admin' 
            ? pathname === '/admin' 
            : pathname.startsWith(item.href)

        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer relative",
              isActive 
                ? "bg-slate-800/60 text-cyan-400 font-semibold border-l-2 border-cyan-400 pl-3.5 shadow-xs" 
                : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon 
                className={cn(
                  "h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                )} 
              />
              <span>{item.label}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                  isActive 
                    ? "bg-cyan-500/20 text-cyan-300" 
                    : "bg-indigo-500/10 text-indigo-300 group-hover:bg-indigo-500/20"
                )}>
                  {item.badge}
                </span>
              )}
              <ChevronRight 
                className={cn(
                  "h-3.5 w-3.5 opacity-0 transition-all duration-200 shrink-0",
                  isActive 
                    ? "opacity-60 text-cyan-400 translate-x-0.5" 
                    : "group-hover:opacity-40 group-hover:translate-x-0.5 text-slate-400"
                )} 
              />
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
