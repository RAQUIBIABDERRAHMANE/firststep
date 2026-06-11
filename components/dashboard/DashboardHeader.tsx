'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { signOut } from '@/app/actions/auth'
import MobileDrawer from './MobileDrawer'
import Sidebar from './Sidebar'

interface DashboardHeaderProps {
    user: { companyName?: string | null; email?: string | null }
    subscribedServiceSlugs: string[]
    translations: any
    websites: any[]
}

export default function DashboardHeader({
    user,
    subscribedServiceSlugs,
    translations,
    websites,
}: DashboardHeaderProps) {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <>
            {/* ── Mobile top bar (visible only on < lg) ── */}
            <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/95 backdrop-blur px-4 lg:hidden">
                {/* Hamburger */}
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all"
                    aria-label="Open navigation"
                >
                    <Menu size={20} />
                </button>

                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-slate-900">
                    <div className="h-7 w-7 rounded-lg overflow-hidden border border-slate-100 shadow-sm flex items-center justify-center bg-white">
                        <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-base">FirstStep</span>
                </Link>

                {/* Sign out */}
                <div className="ml-auto">
                    <form action={signOut}>
                        <Button size="sm" variant="ghost" className="h-9 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl gap-1.5 text-xs font-semibold">
                            <LogOut size={14} /> Sign out
                        </Button>
                    </form>
                </div>
            </header>

            {/* ── Mobile Drawer ── */}
            <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                {/* User info inside drawer */}
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-slate-50 mx-3 rounded-xl border border-slate-100">
                    <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                        {user.companyName?.[0] || 'U'}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.companyName}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                </div>

                <Sidebar
                    subscribedServiceSlugs={subscribedServiceSlugs}
                    translations={translations}
                    websites={websites}
                    onNavClick={() => setDrawerOpen(false)}
                />

                {/* Sign out at bottom */}
                <div className="px-3 pt-3 mt-2 border-t border-slate-100">
                    <form action={signOut}>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-all">
                            <LogOut size={16} /> Sign Out
                        </button>
                    </form>
                </div>
            </MobileDrawer>
        </>
    )
}
