import Sidebar from '@/components/dashboard/Sidebar'
import Link from 'next/link'
import { getCurrentUser, signOut } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LogOut, ChevronRight } from 'lucide-react'
import { translations } from '@/lib/translations'
import { getUserServices } from '@/app/actions/services'

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
        <div className="grid min-h-screen w-full lg:grid-cols-[272px_1fr] bg-slate-50">
            {/* Sidebar */}
            <div className="hidden lg:block border-r border-slate-200 bg-white">
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center border-b border-slate-200 px-6">
                        <Link className="flex items-center gap-2.5 font-semibold text-lg tracking-tight" href="/dashboard">
                            <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
                                <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                            </div>
                            <span className="text-slate-900">FirstStep</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-5">
                        <Sidebar
                            subscribedServiceSlugs={subscribedServiceSlugs}
                            translations={t}
                            websites={websiteInstances}
                        />
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                {user.companyName?.[0] || 'U'}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-medium truncate text-slate-900">{user.companyName}</span>
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
                    <Link className="flex items-center gap-2.5 font-semibold text-base" href="/">
                        <div className="h-7 w-7 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
                            <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-slate-900">FirstStep</span>
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

