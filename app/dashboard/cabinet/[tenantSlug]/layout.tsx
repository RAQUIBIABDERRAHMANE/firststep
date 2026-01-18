import Link from 'next/link'
import { getCurrentUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { Briefcase, ClipboardList, Users, Calendar, Settings } from 'lucide-react'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface CabinetLayoutProps {
    children: React.ReactNode
    params: Promise<{ tenantSlug: string }>
}

export default async function CabinetLayout({
    children,
    params,
}: CabinetLayoutProps) {
    const { tenantSlug } = await params
    const user = await getCurrentUser()

    if (!user) {
        redirect(`/login?redirect=/dashboard/cabinet/${tenantSlug}`)
    }

    // Verify the user owns this cabinet website
    const cabinetWebsite = await prisma.tenantWebsite.findFirst({
        where: {
            slug: tenantSlug,
            userId: user.id,
        },
        include: {
            service: true,
        }
    })

    if (!cabinetWebsite) {
        notFound()
    }

    const navItems = [
        { label: 'Services', href: `/dashboard/cabinet/${tenantSlug}/services`, icon: Briefcase },
        { label: 'Clients', href: `/dashboard/cabinet/${tenantSlug}/clients`, icon: Users },
        { label: 'Calendar', href: `/dashboard/cabinet/${tenantSlug}/calendar`, icon: Calendar },
        { label: 'Settings', href: `/dashboard/cabinet/${tenantSlug}/settings`, icon: Settings },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        {cabinetWebsite.siteName}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Gérez vos services professionnels, clients et rendez-vous
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
