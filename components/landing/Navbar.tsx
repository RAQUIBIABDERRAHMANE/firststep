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
                ? 'bg-[#030712]/95 backdrop-blur-2xl border-b border-[#0066FF]/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                : 'bg-[#030712]/70 backdrop-blur-xl border-b border-white/[0.08]'
        }`}>
            <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-9 w-9 shrink-0 rounded-lg overflow-hidden ring-1 ring-white/15 group-hover:ring-[#0066FF]/50 transition-all duration-300">
                        <Image
                            src="/Untitled design (13).png"
                            alt="FirstStep Logo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <span className="font-syne font-black text-[20px] tracking-tight text-white">
                        First<span style={{ color: '#0066FF' }}>Step</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative px-4 py-2 text-[13px] font-figtree font-medium text-slate-200 hover:text-white transition-colors duration-200 group"
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-4 right-4 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ backgroundColor: '#0066FF' }} />
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                            <button className="inline-flex items-center gap-2 px-5 py-2 text-black font-syne font-bold text-[13px] rounded-lg transition-all duration-200"
                                style={{ backgroundColor: '#0066FF', boxShadow: '0 0 20px rgba(0, 102, 255,0.25)' }}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                {user.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
                            </button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <button className="px-4 py-2 text-[13px] font-figtree font-medium text-slate-300 hover:text-white transition-colors duration-200">
                                    Connexion
                                </button>
                            </Link>
                            <Link href="#signup">
                                <button className="group inline-flex items-center gap-2 px-5 py-2 text-black font-syne font-bold text-[13px] rounded-lg transition-all duration-200 hover:brightness-110"
                                    style={{ backgroundColor: '#0066FF', boxShadow: '0 0 20px rgba(0, 102, 255,0.25)' }}
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
                    className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#030712]/98 backdrop-blur-2xl border-b border-[#0066FF]/15 px-6 pb-6 pt-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-3 text-sm font-figtree font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4 space-y-2 border-t border-white/5 mt-2">
                        {user ? (
                            <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                                <Button className="w-full text-black font-syne font-bold rounded-lg" style={{ backgroundColor: '#0066FF' }}>
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
                                    <Button className="w-full text-black font-syne font-bold rounded-lg" style={{ backgroundColor: '#0066FF' }}>
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
