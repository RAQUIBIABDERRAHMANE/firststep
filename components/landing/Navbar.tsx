'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Menu, X, ArrowRight, Sparkles } from 'lucide-react'
import AnnouncementBar, { AnnouncementItem } from './AnnouncementBar'

interface NavbarProps {
    user?: any
    announcements?: AnnouncementItem[]
}

export default function Navbar({ user, announcements = [] }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { href: '/#services', label: 'Solutions' },
        { href: '/#how-it-works', label: 'Comment ça marche' },
        { href: '/#signup', label: 'Tarifs' },
        { href: '/about', label: 'À propos' },
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none">
            {/* E-Commerce Top Announcement Bar */}
            {announcements && announcements.length > 0 && (
                <div className="pointer-events-auto">
                    <AnnouncementBar announcements={announcements} />
                </div>
            )}

            {/* Floating Navigation Pill */}
            <div className="px-4 md:px-6 pt-3">
                <div
                    className={`max-w-7xl mx-auto h-[64px] px-6 flex items-center justify-between rounded-2xl transition-all duration-300 pointer-events-auto border ${
                        scrolled
                            ? 'bg-white/85 backdrop-blur-2xl border-slate-200/80 border-t-white/90 shadow-xl shadow-slate-900/5 max-w-6xl'
                            : 'bg-white/60 backdrop-blur-xl border-slate-200/60 border-t-white/80 shadow-xs'
                    }`}
                    style={{
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    }}
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-9 w-9 shrink-0 rounded-xl overflow-hidden ring-1 ring-slate-200 group-hover:ring-[#0066FF]/60 transition-all duration-200 shadow-xs group-active:scale-95">
                            <Image
                                src="/Untitled design (13).png"
                                alt="FirstStep Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <span className="font-syne font-black text-[20px] tracking-tight text-slate-900">
                            First<span className="text-[#0066FF]">Step</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-4 py-2 text-[13px] font-figtree font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200 group active:scale-97"
                            >
                                {link.label}
                                <span className="absolute bottom-1 left-4 right-4 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left bg-[#0066FF] rounded-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                                <button
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-syne font-bold text-[13px] rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-md shadow-blue-500/20 hover:shadow-blue-500/30"
                                    style={{
                                        backgroundColor: '#0066FF',
                                    }}
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    {user.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <button className="px-4 py-2 text-[13px] font-figtree font-semibold text-slate-700 hover:text-[#0066FF] transition-colors duration-200 active:scale-95 cursor-pointer">
                                        Connexion
                                    </button>
                                </Link>
                                <Link href="#signup">
                                    <button
                                        className="group inline-flex items-center gap-2 px-5 py-2.5 text-white font-syne font-bold text-[13px] rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-md shadow-blue-500/20 hover:shadow-blue-500/30"
                                        style={{
                                            backgroundColor: '#0066FF',
                                        }}
                                    >
                                        Commencer
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-colors active:scale-95 cursor-pointer"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-2 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl px-6 pb-6 pt-3 shadow-2xl pointer-events-auto max-w-7xl mx-auto animate-in fade-in slide-in-from-top-2 duration-200">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-4 py-3 text-sm font-figtree font-medium text-slate-700 hover:text-[#0066FF] hover:bg-slate-50 rounded-xl transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 space-y-2 border-t border-slate-100 mt-2">
                            {user ? (
                                <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                                    <Button className="w-full text-white font-syne font-bold rounded-xl active:scale-97 cursor-pointer" style={{ backgroundColor: '#0066FF' }}>
                                        {user.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-figtree active:scale-97 cursor-pointer">
                                            Connexion
                                        </Button>
                                    </Link>
                                    <Link href="#signup">
                                        <Button className="w-full text-white font-syne font-bold rounded-xl active:scale-97 cursor-pointer shadow-md shadow-blue-500/20" style={{ backgroundColor: '#0066FF' }}>
                                            Commencer gratuitement
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
