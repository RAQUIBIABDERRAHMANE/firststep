'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Menu, X, ArrowRight } from 'lucide-react'

export default function Navbar({ user }: { user?: any }) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40)
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
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled
                ? 'bg-[#030712]/92 backdrop-blur-2xl border-b border-cyan-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-9 w-9 shrink-0 rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-cyan-400/40 transition-all duration-300">
                        <Image
                            src="/Untitled design (13).png"
                            alt="FirstStep Logo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <span className="font-syne font-black text-[20px] tracking-tight text-white">
                        First<span className="text-cyan-400">Step</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative px-4 py-2 text-[13px] font-figtree font-medium text-slate-400 hover:text-white transition-colors duration-200 group"
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-4 right-4 h-px bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                            <button className="inline-flex items-center gap-2 px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-syne font-bold text-[13px] rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                                <LayoutDashboard className="h-4 w-4" />
                                {user.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
                            </button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <button className="px-4 py-2 text-[13px] font-figtree font-medium text-slate-400 hover:text-white transition-colors duration-200">
                                    Connexion
                                </button>
                            </Link>
                            <Link href="#signup">
                                <button className="group inline-flex items-center gap-2 px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-syne font-bold text-[13px] rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                                    Commencer
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                                </button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#030712]/98 backdrop-blur-2xl border-b border-cyan-900/30 px-6 pb-6 pt-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-3 text-sm font-figtree font-medium text-slate-400 hover:text-white hover:bg-white/4 rounded-lg transition-all"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4 space-y-2 border-t border-white/5 mt-2">
                        {user ? (
                            <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                                <Button className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-syne font-bold rounded-lg">
                                    {user.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 rounded-lg font-figtree">
                                        Connexion
                                    </Button>
                                </Link>
                                <Link href="#signup">
                                    <Button className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-syne font-bold rounded-lg">
                                        Commencer gratuitement
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

