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

    // Get user's subscribed services
    const userServices = await getUserServices()
    const subscribedServiceSlugs = userServices.map((us: any) => us.service.slug)

    // Get all website instances
    const websiteInstances = await prisma.tenantWebsite.findMany({
        where: { userId: user.id },
        include: { service: true }
    })

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-muted/40">
            {/* Sidebar */}
            <div className="hidden lg:block border-r bg-background/50 backdrop-blur-md">
                <div className="flex h-full flex-col gap-4">
                    <div className="flex h-20 items-center border-b px-8">
                        <Link className="flex items-center gap-3 font-bold text-xl tracking-tight" href="/dashboard">
                            <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
                                <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                            </div>
                            <span className="text-foreground">FirstStep</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-4">
                        <Sidebar
                            subscribedServiceSlugs={subscribedServiceSlugs}
                            translations={t}
                            websites={websiteInstances}
                        />
                    </div>
                    <div className="mt-auto p-6 border-t bg-white/30 dark:bg-zinc-900/30">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {user.companyName?.[0] || 'U'}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-semibold truncate text-foreground">{user.companyName}</span>
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
                    <Link className="flex items-center gap-3 font-semibold text-lg" href="/">
                        <div className="h-7 w-7 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
                            <img src="/logo.ico" alt="FirstStep" className="h-full w-full object-contain" />
                        </div>
                        <span>FirstStep</span>
                    </Link>
                    <div className="ml-auto">
                        <form action={signOut}>
                            <Button size="sm" variant="ghost" className="hover:bg-destructive/10 hover:text-destructive">Sign Out</Button>
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

