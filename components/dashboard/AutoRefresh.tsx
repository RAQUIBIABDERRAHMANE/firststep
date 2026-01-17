'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AutoRefreshProps {
    interval?: number // in milliseconds
}

export default function AutoRefresh({ interval = 10000 }: AutoRefreshProps) {
    const router = useRouter()

    useEffect(() => {
        const timer = setInterval(() => {
            router.refresh()
        }, interval)

        return () => clearInterval(timer)
    }, [router, interval])

    return null
}
