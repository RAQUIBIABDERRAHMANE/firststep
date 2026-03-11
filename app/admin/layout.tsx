import Link from 'next/link'
import { getCurrentUser, signOut } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LayoutDashboard, Users, Layers, LogOut, ShieldCheck, ChevronRight, CreditCard, Globe, ExternalLink, Mail } from 'lucide-react'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
        redirect('/login')
    }

    const navItems = [
        { label: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
        { label: 'Manage Services', href: '/admin/services', icon: Layers },
        { label: 'User Directory', href: '/admin/users', icon: Users },
        { label: 'Websites', href: '/admin/websites', icon: Globe },
        { label: 'Client Access', href: '/admin/access', icon: ExternalLink },
        { label: 'Payments', href: '/admin/payments', icon: CreditCard },
        { label: 'Campaigns', href: '/admin/campaigns', icon: Mail },
    ]

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[272px_1fr] bg-slate-50">
            {/* Admin Sidebar */}
            <div className="hidden lg:block border-r border-slate-200 bg-white">
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center border-b border-slate-200 px-6">
                        <Link className="flex items-center gap-2.5 font-semibold text-lg tracking-tight" href="/admin">
                            <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100 p-0.5">
                                <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                            </div>
                            <span className="text-slate-900">FS Admin</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-5">
                        <nav className="grid items-start px-3 gap-0.5">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
                                    href={item.href}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-4.5 w-4.5" />
                                        {item.label}
                                    </div>
                                    <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                A
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-medium truncate text-slate-900">Administrator</span>
                                <span className="text-xs text-slate-400 truncate">{user.email}</span>
                            </div>
                            <form action={signOut}>
                                <Button variant="ghost" size="icon" title="Sign Out" className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-500">
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
                <header className="flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-6 lg:hidden">
                    <Link className="flex items-center gap-2.5 font-semibold text-base" href="/admin">
                        <div className="h-7 w-7 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100 p-0.5">
                            <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-slate-900">FS Admin</span>
                    </Link>
                    <div className="ml-auto">
                        <form action={signOut}>
                            <Button size="sm" variant="ghost" className="text-slate-500 hover:text-red-500">Sign Out</Button>
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
