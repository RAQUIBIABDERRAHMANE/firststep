'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Menu, X, ChevronRight } from 'lucide-react'

export default function Navbar({ user }: { user?: any }) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { href: '#services', label: 'Solutions' },
        { href: '#how-it-works', label: 'Fonctionnement' },
        { href: '#signup', label: 'Tarifs' },
    ]

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-[#050914]/95 backdrop-blur-xl border-b border-white/6 shadow-xl shadow-black/20' : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-9 w-9 rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-blue-500/40 transition-all duration-300">
                        <Image src="/og-image.png" alt="FirstStep" fill className="object-cover" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">FirstStep</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href}
                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg">
                                <LayoutDashboard className="h-4 w-4" />
                                {user.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
                                    Connexion
                                </Button>
                            </Link>
                            <Link href="#signup">
                                <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/20">
                                    Commencer gratuitement
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#050914]/98 backdrop-blur-xl border-b border-white/6 px-6 pb-6 pt-2 space-y-1">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href}
                            className="block px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            onClick={() => setMobileMenuOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4 space-y-2 border-t border-white/6 mt-2">
                        {user ? (
                            <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                                <Button className="w-full bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg">
                                    {user.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 rounded-lg">
                                        Connexion
                                    </Button>
                                </Link>
                                <Link href="#signup">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg">
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

