import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import Link from 'next/link'
import { getCurrentUser, signOut } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LogOut } from 'lucide-react'
import { translations } from '@/lib/translations'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login?redirect=/dashboard')
    }

    const t = translations['fr'].admin

    // Get user's subscribed services (only active ones)
    const userServices = await prisma.userService.findMany({
        where: {
            userId: user.id,
            isActive: true
        },
        include: { service: true }
    })
    const subscribedServiceSlugs = userServices.map((us: any) => us.service.slug)

    // Get all website instances (only for active services)
    const activeServiceIds = userServices.map(us => us.serviceId)
    const websiteInstances = await prisma.tenantWebsite.findMany({
        where: {
            userId: user.id,
            serviceId: { in: activeServiceIds }
        },
        include: { service: true }
    })

    return (
        <div className="flex min-h-screen w-full bg-slate-50">

            {/* ── Desktop Sidebar (lg+) ── */}
            <aside className="hidden lg:flex lg:flex-col w-[272px] shrink-0 border-r border-slate-200 bg-white fixed inset-y-0 left-0 z-20">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-slate-100 px-5">
                    <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold text-base">
                        <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
                            <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-slate-900 text-lg">FirstStep</span>
                    </Link>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto py-5">
                    <Sidebar
                        subscribedServiceSlugs={subscribedServiceSlugs}
                        translations={t}
                        websites={websiteInstances}
                    />
                </div>

                {/* User footer */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                            {user.companyName?.[0] || 'U'}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-semibold truncate text-slate-900">{user.companyName}</span>
                            <span className="text-xs text-slate-400 truncate">{user.email}</span>
                        </div>
                        <form action={signOut}>
                            <Button
                                variant="ghost"
                                size="icon"
                                title="Sign Out"
                                className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* ── Right column: mobile header + content ── */}
            <div className="flex flex-col flex-1 lg:pl-[272px] min-h-screen">

                {/* Mobile header (injected as a client component) */}
                <DashboardHeader
                    user={{ companyName: user.companyName, email: user.email }}
                    subscribedServiceSlugs={subscribedServiceSlugs}
                    translations={t}
                    websites={websiteInstances}
                />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
