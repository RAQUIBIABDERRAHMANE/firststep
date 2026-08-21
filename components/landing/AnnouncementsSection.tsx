'use client'

import { Sparkles, Megaphone, Pin, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

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

interface AnnouncementsSectionProps {
    announcements: AnnouncementItem[]
}

const BADGE_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-[#0066FF]', border: 'border-blue-200/70', dot: 'bg-[#0066FF]' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/70', dot: 'bg-emerald-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/70', dot: 'bg-amber-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200/70', dot: 'bg-purple-500' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/70', dot: 'bg-rose-500' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200/70', dot: 'bg-cyan-500' },
}

export default function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
    if (!announcements || announcements.length === 0) {
        return null
    }

    return (
        <section id="announcements" className="relative z-10 py-20 md:py-28 bg-[#FAFBFD] text-slate-900 overflow-hidden">
            {/* Top subtle divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Ambient background glow */}
            <div className="absolute top-[20%] left-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-400/10 via-cyan-300/5 to-transparent blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6">
                {/* Header */}
                <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-14 md:mb-18">
                    <div className="rotating-border-wrapper mb-4 shadow-sm shadow-blue-500/10 inline-flex">
                        <div className="rotating-border-inner inline-flex items-center gap-2 px-3.5 py-1">
                            <Sparkles className="h-3.5 w-3.5 text-[#0066FF]" />
                            <span className="font-figtree text-[11px] font-bold uppercase tracking-[0.2em] text-[#0066FF]">
                                Nouveautés & Mises à Jour
                            </span>
                        </div>
                    </div>

                    <h2 className="font-syne font-black text-slate-900 leading-tight mb-4">
                        <span className="block text-3xl md:text-5xl tracking-tight">Ce qui change</span>
                        <span className="block text-3xl md:text-5xl tracking-tight text-[#0066FF]">sur FirstStep</span>
                    </h2>

                    <p className="font-figtree text-[15px] text-slate-600 leading-relaxed font-medium">
                        Découvrez les dernières fonctionnalités, améliorations et annonces conçues pour accélérer votre entreprise.
                    </p>
                </ScrollReveal>

                {/* Announcements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {announcements.map((item, idx) => {
                        const style = BADGE_STYLES[item.badgeColor || 'blue'] || BADGE_STYLES.blue
                        const isPinned = item.isPinned

                        return (
                            <ScrollReveal
                                key={item.id}
                                delay={idx * 80}
                                direction="up"
                                className={`group relative rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between ${
                                    isPinned
                                        ? 'bg-gradient-to-b from-white via-blue-50/30 to-white border-2 border-[#0066FF]/40 shadow-xl shadow-blue-500/10 hover:-translate-y-1.5'
                                        : 'bg-white/95 backdrop-blur-xl border border-slate-200/80 border-t-white shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300/40 hover:-translate-y-1.5'
                                }`}
                            >
                                <div className="space-y-4">
                                    {/* Top: Badges & Pin icon */}
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {item.badge && (
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border flex items-center gap-1.5 ${style.bg} ${style.text} ${style.border}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                                    {item.badge}
                                                </span>
                                            )}

                                            {isPinned && (
                                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-bold flex items-center gap-1">
                                                    <Pin className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Épinglé
                                                </span>
                                            )}
                                        </div>

                                        <span className="text-[11px] font-figtree font-medium text-slate-400">
                                            {new Date(item.publishedAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    {/* Title & Body */}
                                    <div className="space-y-2">
                                        <h3 className="font-syne font-extrabold text-lg text-slate-900 tracking-tight group-hover:text-[#0066FF] transition-colors leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="font-figtree text-[13.5px] text-slate-600 leading-relaxed">
                                            {item.content}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom CTA link (if present) */}
                                {item.linkUrl && (
                                    <div className="pt-5 mt-4 border-t border-slate-100">
                                        <Link
                                            href={item.linkUrl}
                                            className="inline-flex items-center gap-1.5 text-xs font-syne font-bold text-[#0066FF] hover:text-blue-700 transition-colors group/link active:scale-95"
                                        >
                                            <span>{item.linkLabel || 'Découvrir la nouveauté'}</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                )}
                            </ScrollReveal>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
