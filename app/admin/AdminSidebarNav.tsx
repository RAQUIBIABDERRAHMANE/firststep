'use client'

import { useState } from 'react'
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
  Sparkles,
  Briefcase,
  Search,
  Megaphone,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: any
  badge?: string
}

interface NavGroup {
  category: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    category: 'Pilotage',
    items: [
      { label: 'Vue d\'ensemble', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    category: 'Recrutement & RH',
    items: [
      { label: 'Candidatures Dev', href: '/admin/employment', icon: Briefcase },
      { label: 'Modèle Contrat Dev', href: '/admin/employment-template', icon: FileText },
    ],
  },
  {
    category: 'Gestion Plateforme',
    items: [
      { label: 'Services & Modules', href: '/admin/services', icon: Layers },
      { label: 'Utilisateurs', href: '/admin/users', icon: Users },
      { label: 'Sites Web Clients', href: '/admin/websites', icon: Globe },
      { label: 'Demandes Sur Mesure', href: '/admin/custom-requests', icon: FileText },
      { label: 'Accès Clients', href: '/admin/access', icon: ExternalLink },
    ],
  },
  {
    category: 'Finances & Facturation',
    items: [
      { label: 'Paiements & Virements', href: '/admin/payments', icon: CreditCard },
      { label: 'Factures Émises', href: '/admin/factures', icon: Receipt },
      { label: 'Modèle Facture', href: '/admin/facture-template', icon: FileText },
    ],
  },
  {
    category: 'Marketing & Outils',
    items: [
      { label: 'Annonces Landing Page', href: '/admin/announcements', icon: Megaphone },
      { label: 'Assistant IA', href: '/admin/marketing', icon: Sparkles, badge: 'IA' },
      { label: 'Campagnes Emails', href: '/admin/campaigns', icon: Mail },
      { label: 'Demandes d\'Impression', href: '/admin/print-requests', icon: QrCode },
    ],
  },
]

export default function AdminSidebarNav() {
  const pathname = usePathname()
  const [search, setSearch] = useState('')

  const filteredGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="space-y-4 px-3">
      {/* Quick Search Filter */}
      <div className="relative px-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Filtrer les modules..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/70 focus:bg-slate-900 transition-all font-sans"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 hover:text-slate-300 font-mono"
          >
            ESC
          </button>
        )}
      </div>

      {/* Categorized Nav List */}
      <nav className="space-y-4">
        {filteredGroups.map((group) => (
          <div key={group.category} className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1">
              {group.category}
            </h4>
            <div className="space-y-0.5">
              {group.items.map((item) => {
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
                      "group flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 cursor-pointer relative",
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 font-semibold border-l-2 border-cyan-400 pl-3.5 shadow-xs shadow-cyan-950/20"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                          isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider",
                            isActive
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                              : "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 group-hover:bg-indigo-500/25"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={cn(
                          "h-3 w-3 transition-all duration-200 shrink-0",
                          isActive
                            ? "opacity-80 text-cyan-400 translate-x-0.5"
                            : "opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5 text-slate-500"
                        )}
                      />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
