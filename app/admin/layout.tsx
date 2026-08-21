import Link from 'next/link'
import { getCurrentUser, signOut } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LogOut, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react'
import AdminSidebarNav from './AdminSidebarNav'
import AdminMobileNav from './AdminMobileNav'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-[#f8fafc]">
            {/* Admin Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col border-r border-slate-800/80 bg-[#0b0f19] text-slate-100 sticky top-0 h-screen">
                {/* Brand Header */}
                <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-6 shrink-0">
                    <Link className="flex items-center gap-2.5 font-bold text-lg tracking-tight group" href="/admin">
                        <div className="h-8 w-8 rounded-xl overflow-hidden flex items-center justify-center bg-slate-900 shadow-inner border border-slate-800 p-1 transition-transform group-hover:scale-105">
                            <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-white font-extrabold tracking-tight">
                            FS <span className="text-cyan-400">Admin</span>
                        </span>
                    </Link>

                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        PROD
                    </span>
                </div>

                {/* Scrolling Navigation Links */}
                <div className="flex-1 overflow-y-auto py-5 scrollbar-thin scrollbar-thumb-slate-800">
                    <AdminSidebarNav />
                </div>

                {/* Sidebar Footer User Card */}
                <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 shrink-0">
                    <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/60 transition-colors hover:border-slate-700/80">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-xs shadow-sm shrink-0">
                            AD
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-xs font-semibold truncate text-slate-200 flex items-center gap-1">
                                Super Admin
                                <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" />
                            </span>
                            <span className="text-[10px] text-slate-500 truncate font-mono">{user.email}</span>
                        </div>
                        <form action={signOut} className="shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                type="submit"
                                title="Se déconnecter"
                                className="h-8 w-8 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer rounded-xl"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex flex-col min-w-0">
                {/* Mobile Top Header */}
                <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-[#0b0f19] px-4 sm:px-6 lg:hidden sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <AdminMobileNav userEmail={user.email} />
                        <Link className="flex items-center gap-2 font-bold text-base" href="/admin">
                            <div className="h-7 w-7 rounded-lg overflow-hidden flex items-center justify-center bg-slate-900 border border-slate-800 p-0.5">
                                <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                            </div>
                            <span className="text-white font-extrabold">FS <span className="text-cyan-400">Admin</span></span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <form action={signOut}>
                            <Button size="sm" variant="ghost" type="submit" className="text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer px-2.5 py-1 rounded-xl">
                                <LogOut className="w-3.5 h-3.5 mr-1" /> Déconnexion
                            </Button>
                        </form>
                    </div>
                </header>

                {/* Desktop Top Status Bar */}
                <div className="hidden lg:flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-8 py-3 shrink-0">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Serveur Opérationnel
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="font-mono text-slate-400">Console d&apos;Administration FirstStep</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition-colors"
                        >
                            <span>Voir le site public</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                    </div>
                </div>

                {/* Main Scrolling Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
