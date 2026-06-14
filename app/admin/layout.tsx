import Link from 'next/link'
import { getCurrentUser, signOut } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LogOut } from 'lucide-react'
import AdminSidebarNav from './AdminSidebarNav'

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
        <div className="grid min-h-screen w-full lg:grid-cols-[272px_1fr] bg-[#f8fafc]">
            {/* Admin Sidebar */}
            <div className="hidden lg:block border-r border-slate-800/80 bg-[#0b0f19] text-slate-100">
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center border-b border-slate-800/80 px-6">
                        <Link className="flex items-center gap-2.5 font-bold text-lg tracking-tight" href="/admin">
                            <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-slate-900/50 shadow-inner border border-slate-800 p-0.5">
                                <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                            </div>
                            <span className="text-white font-extrabold">FS <span className="text-cyan-400">Admin</span></span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-5">
                        <AdminSidebarNav />
                    </div>
                    <div className="p-4 border-t border-slate-800/80 bg-slate-950/30">
                        <div className="flex items-center gap-3 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50">
                            <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-cyan-400 font-bold text-sm shadow-sm shrink-0">
                                AD
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-semibold truncate text-slate-200">Administrateur</span>
                                <span className="text-[11px] text-slate-500 truncate font-mono">{user.email}</span>
                            </div>
                            <form action={signOut} className="shrink-0">
                                <Button variant="ghost" size="icon" type="submit" title="Se déconnecter" className="h-8 w-8 text-slate-400 hover:bg-red-500/10 hover:text-red-400 cursor-pointer">
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col">
                {/* Mobile Header */}
                <header className="flex h-16 items-center gap-4 border-b border-slate-800 bg-[#0b0f19] px-6 lg:hidden">
                    <Link className="flex items-center gap-2.5 font-bold text-base" href="/admin">
                        <div className="h-7 w-7 rounded-lg overflow-hidden flex items-center justify-center bg-slate-900/50 border border-slate-800 p-0.5">
                            <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-white font-extrabold">FS <span className="text-cyan-400">Admin</span></span>
                    </Link>
                    <div className="ml-auto">
                        <form action={signOut}>
                            <Button size="sm" variant="ghost" type="submit" className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer">Se déconnecter</Button>
                        </form>
                    </div>
                </header>

                {/* Scrolling Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
