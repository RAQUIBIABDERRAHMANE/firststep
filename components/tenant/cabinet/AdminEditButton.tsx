'use client'

import { Pencil } from 'lucide-react'
import Link from 'next/link'

interface AdminEditButtonProps {
    href: string
    label?: string
}

export default function AdminEditButton({ href, label }: AdminEditButtonProps) {
    return (
        <Link
            href={href}
            className="group absolute top-4 left-4 z-[100] flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-slate-900 transition-all shadow-xl hover:scale-105 active:scale-95"
        >
            <Pencil className="h-3 w-3 transition-transform group-hover:rotate-12" />
            <span className="text-[10px] font-black uppercase tracking-widest">{label || 'Edit Section'}</span>
        </Link>
    )
}
