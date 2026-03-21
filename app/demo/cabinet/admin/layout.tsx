import Sidebar from '@/components/dashboard/Sidebar'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { LogOut, Briefcase, Calendar, Users, LayoutDashboard } from 'lucide-react'
import { translations } from '@/lib/translations'

export default function CabinetAdminLayout({ children }: { children: React.ReactNode }) {
    const t = translations['fr'].admin

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[272px_1fr] bg-slate-50">
            <div className="hidden lg:block border-r border-slate-200 bg-white">
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center border-b border-slate-200 px-6">
                        <Link className="flex items-center gap-2.5 font-semibold text-lg tracking-tight" href="/demo">
                            <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
                                <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                            </div>
                            <span className="text-slate-900">FirstStep Démo</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-5">
                        <nav className="grid items-start px-3 gap-0.5">
                            <Link href="/demo/cabinet/admin" className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-all hover:bg-slate-100 text-slate-700 font-medium">
                                <div className="flex items-center gap-3">
                                    <LayoutDashboard className="h-4.5 w-4.5" /> Système Global
                                </div>
                            </Link>
                            <Link href="/demo/cabinet/admin/services" className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-slate-700 hover:bg-slate-100">
                                <div className="flex items-center gap-3">
                                    <Briefcase className="h-4.5 w-4.5" /> Gestion des Prestations
                                </div>
                            </Link>
                            <Link href="/demo/cabinet/admin/clients" className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-slate-700 hover:bg-slate-100">
                                <div className="flex items-center gap-3">
                                    <Users className="h-4.5 w-4.5" /> Dossiers Patients
                                </div>
                            </Link>
                            <Link href="/demo/cabinet/admin/calendar" className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-slate-700 hover:bg-slate-100">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4.5 w-4.5" /> Agenda & Planning
                                </div>
                            </Link>
                        </nav>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">D</div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-medium truncate text-slate-900">Dr. Cabinet</span>
                                <span className="text-xs text-slate-400 truncate">demo@cabinet.com</span>
                            </div>
                            <Link href="/demo">
                                <Button variant="ghost" size="icon" title="Quitter" className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-500">
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-6 lg:hidden">
                    <Link className="flex items-center gap-2.5 font-semibold text-base" href="/demo">
                        <div className="h-7 w-7 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
                            <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-slate-900">FirstStep</span>
                    </Link>
                </header>
                <main className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
