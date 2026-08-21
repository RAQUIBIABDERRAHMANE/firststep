'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Menu,
  X,
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
  LogOut,
  Megaphone,
} from 'lucide-react'
import { signOut } from '@/app/actions/auth'

interface NavGroup {
  title: string
  items: {
    label: string
    href: string
    icon: any
    badge?: string
  }[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Pilotage',
    items: [
      { label: 'Vue d\'ensemble', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Recrutement & RH',
    items: [
      { label: 'Candidatures Dev', href: '/admin/employment', icon: Briefcase },
      { label: 'Modèle Contrat Dev', href: '/admin/employment-template', icon: FileText },
    ],
  },
  {
    title: 'Gestion Plateforme',
    items: [
      { label: 'Services & Modules', href: '/admin/services', icon: Layers },
      { label: 'Utilisateurs', href: '/admin/users', icon: Users },
      { label: 'Sites Web Clients', href: '/admin/websites', icon: Globe },
      { label: 'Demandes Sur Mesure', href: '/admin/custom-requests', icon: FileText },
      { label: 'Accès Clients', href: '/admin/access', icon: ExternalLink },
    ],
  },
  {
    title: 'Finances & Facturation',
    items: [
      { label: 'Paiements & Virements', href: '/admin/payments', icon: CreditCard },
      { label: 'Factures Émises', href: '/admin/factures', icon: Receipt },
      { label: 'Modèle Facture', href: '/admin/facture-template', icon: FileText },
    ],
  },
  {
    title: 'Marketing & Outils',
    items: [
      { label: 'Annonces Landing Page', href: '/admin/announcements', icon: Megaphone },
      { label: 'Assistant IA', href: '/admin/marketing', icon: Sparkles, badge: 'IA' },
      { label: 'Campagnes Emails', href: '/admin/campaigns', icon: Mail },
      { label: 'Demandes d\'Impression', href: '/admin/print-requests', icon: QrCode },
    ],
  },
]

export default function AdminMobileNav({ userEmail }: { userEmail?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const pathname = usePathname()

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const filteredGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0)

  return (
    <>
      {/* Burger Button in Mobile Header */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700 cursor-pointer lg:hidden"
        aria-label="Ouvrir le menu de navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Slide-over Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#0b0f19] border-r border-slate-800 text-slate-100 flex flex-col shadow-2xl animate-in slide-in-from-left duration-250">
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
              <Link className="flex items-center gap-2.5 font-bold text-base" href="/admin" onClick={() => setIsOpen(false)}>
                <div className="h-7 w-7 rounded-lg overflow-hidden flex items-center justify-center bg-slate-900/50 border border-slate-800 p-0.5">
                  <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                </div>
                <span className="text-white font-extrabold">FS <span className="text-cyan-400">Admin</span></span>
              </Link>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-4 border-b border-slate-800/60">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher un module..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {filteredGroups.map((group) => (
                <div key={group.title} className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3">
                    {group.title}
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
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer",
                            isActive
                              ? "bg-cyan-500/10 text-cyan-400 font-semibold border-l-2 border-cyan-400 pl-3.5"
                              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-cyan-400" : "text-slate-400")} />
                            <span>{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300">
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer User & Sign out */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/40">
              <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                    AD
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">Administrateur</p>
                    {userEmail && <p className="text-[10px] text-slate-400 truncate font-mono">{userEmail}</p>}
                  </div>
                </div>
                <form action={signOut} className="shrink-0">
                  <button
                    type="submit"
                    title="Se déconnecter"
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
