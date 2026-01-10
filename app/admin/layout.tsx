import Link from 'next/link'
import { getCurrentUser, signOut } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LayoutDashboard, Users, Layers, LogOut, ShieldCheck, ChevronRight } from 'lucide-react'

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
    ]

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-muted/40">
            {/* Admin Sidebar */}
            <div className="hidden lg:block border-r bg-background/50 backdrop-blur-md">
                <div className="flex h-full flex-col gap-4">
                    <div className="flex h-20 items-center border-b px-8">
                        <Link className="flex items-center gap-3 font-semibold text-xl tracking-tight" href="/admin">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <span className="text-foreground">FS Admin</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-4">
                        <nav className="grid items-start px-4 gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    className="group flex items-center justify-between gap-3 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                                    href={item.href}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </div>
                                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-auto p-6 border-t bg-muted/50">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                A
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-semibold truncate text-foreground">Administrator</span>
                                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                            </div>
                            <form action={signOut}>
                                <Button variant="ghost" size="icon" title="Sign Out" className="hover:bg-destructive/10 hover:text-destructive">
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
                <header className="flex h-16 items-center gap-4 border-b bg-background/50 backdrop-blur-md px-6 lg:hidden">
                    <Link className="flex items-center gap-3 font-semibold text-lg" href="/admin">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <span>FS Admin</span>
                    </Link>
                    <div className="ml-auto">
                        <form action={signOut}>
                            <Button size="sm" variant="ghost">Sign Out</Button>
                        </form>
                    </div>
                </header>

                {/* Scrolling Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-6xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
