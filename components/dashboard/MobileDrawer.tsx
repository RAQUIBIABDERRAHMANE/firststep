'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileDrawerProps {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

export default function MobileDrawer({ open, onClose, children }: MobileDrawerProps) {
    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    // Prevent body scroll when open
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={cn(
                    'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
                    open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
            />

            {/* Drawer panel */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:hidden shadow-2xl',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Drawer header */}
                <div className="flex h-14 items-center justify-between px-5 border-b border-slate-100">
                    <span className="font-bold text-slate-900 text-base">Navigation</span>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Nav content passed as children */}
                <div className="flex-1 overflow-y-auto py-4">
                    {children}
                </div>
            </div>
        </>
    )
}
