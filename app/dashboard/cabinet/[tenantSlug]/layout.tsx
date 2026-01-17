import Link from 'next/link'
import { getCurrentUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { Briefcase, ClipboardList, Users, Calendar } from 'lucide-react'

export default async function CabinetLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login?redirect=/dashboard/cabinet')
    }

    const navItems = [
        { label: 'Services', href: '/dashboard/cabinet/services', icon: Briefcase },
        { label: 'Clients', href: '/dashboard/cabinet/clients', icon: Users },
        { label: 'Calendar', href: '/dashboard/cabinet/calendar', icon: Calendar },
        { label: 'Settings', href: '/dashboard/cabinet/settings', icon: ClipboardList },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        Cabinet Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your professional services, clients, and appointments
                    </p>
                </div>
            </div>

            {/* Sub Navigation */}
            <nav className="flex gap-2 border-b border-border">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-muted-foreground hover:text-primary border-b-2 border-transparent hover:border-primary transition-all"
                        href={item.href}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Content */}
            <div>
                {children}
            </div>
        </div>
    )
}
