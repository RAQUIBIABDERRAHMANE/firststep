'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    ChevronLeft,
    ChevronRight,
    Sparkles,
    ArrowRight,
    Pin
} from 'lucide-react'

export interface AnnouncementItem {
    id: string
    title: string
    content: string
    badge: string | null
    badgeColor: string | null
    linkUrl: string | null
    linkLabel: string | null
    isPublished: boolean
    isPinned: boolean
    publishedAt: Date | string
}

interface AnnouncementBarProps {
    announcements: AnnouncementItem[]
}

const BADGE_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-200', border: 'border-blue-400/40' },
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-200', border: 'border-emerald-400/40' },
    amber: { bg: 'bg-amber-500/20', text: 'text-amber-200', border: 'border-amber-400/40' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-200', border: 'border-purple-400/40' },
    rose: { bg: 'bg-rose-500/20', text: 'text-rose-200', border: 'border-rose-400/40' },
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-200', border: 'border-cyan-400/40' },
}

export default function AnnouncementBar({ announcements }: AnnouncementBarProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const items = announcements?.filter(a => a.isPublished) || []

    useEffect(() => {
        if (items.length <= 1 || isPaused) return

        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length)
        }, 4500)

        return () => clearInterval(timer)
    }, [items.length, isPaused])

    if (items.length === 0) {
        return null
    }

    const current = items[currentIndex]
    const colorStyle = BADGE_COLOR_MAP[current.badgeColor || 'blue'] || BADGE_COLOR_MAP.blue

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentIndex(prev => (prev - 1 + items.length) % items.length)
    }

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentIndex(prev => (prev + 1) % items.length)
    }

    return (
        <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white border-b border-blue-500/20 shadow-md text-xs transition-all duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 min-h-[38px]">
                
                {/* Left side: Navigation chevrons (if multiple items) */}
                <div className="flex items-center gap-1 shrink-0">
                    {items.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                aria-label="Annonce précédente"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline-block px-1">
                                {currentIndex + 1}/{items.length}
                            </span>
                            <button
                                onClick={handleNext}
                                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                aria-label="Annonce suivante"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Center: Main Announcement content */}
                <div className="flex-1 flex items-center justify-center gap-2.5 overflow-hidden text-center">
                    {current.badge && (
                        <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${colorStyle.bg} ${colorStyle.text} ${colorStyle.border}`}>
                            {current.isPinned ? <Pin className="w-2.5 h-2.5" /> : <Sparkles className="w-2.5 h-2.5" />}
                            {current.badge}
                        </span>
                    )}

                    <div className="flex items-center gap-2 truncate font-medium text-slate-200">
                        <span className="font-bold text-white tracking-tight">{current.title}</span>
                        <span className="hidden md:inline text-slate-400 font-normal truncate">
                            — {current.content}
                        </span>
                    </div>

                    {current.linkUrl && (
                        <Link
                            href={current.linkUrl}
                            className="inline-flex items-center gap-1 text-[#0066FF] hover:text-blue-300 font-bold ml-1 text-nowrap underline underline-offset-2 transition-colors shrink-0"
                        >
                            <span>{current.linkLabel || 'Découvrir'}</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    )}
                </div>

                {/* Right side spacer for visual balance with the left chevrons */}
                <div className="w-8 shrink-0 hidden sm:block" />
            </div>
        </div>
    )
}
