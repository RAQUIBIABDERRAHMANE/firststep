'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function WaiterDashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const params = useParams()
    const pathname = usePathname()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const id = localStorage.getItem('waiter_id')
        if (!id) {
            router.push(`/${params.tenantSlug}/waiter/login?redirect=${encodeURIComponent(pathname)}`)
        } else {
            setIsAuthorized(true)
        }
    }, [params.tenantSlug, pathname, router])

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    return <>{children}</>
}
