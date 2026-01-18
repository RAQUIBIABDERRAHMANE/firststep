'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { Sparkles, Layers, Menu, X } from 'lucide-react'

export default function Navbar({ user }: { user?: any }) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl'
                : 'bg-transparent border-transparent'
                }`}
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight text-white hover:opacity-80 transition-all duration-300 group">
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-violet-500/30 group-hover:shadow-xl group-hover:shadow-violet-500/40 group-hover:scale-110 transition-all duration-300 ring-2 ring-white/10">
                        <Image
                            src="/og-image.png"
                            alt="FirstStep Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent font-bold">FirstStep</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex gap-8 text-sm font-medium text-slate-400">
                        <Link href="#services" className="hover:text-white transition-all duration-300 relative group">
                            Solutions
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 group-hover:w-full transition-all duration-300" />
                        </Link>
                        <Link href="#how-it-works" className="hover:text-white transition-all duration-300 relative group">
                            Comment ça marche
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 group-hover:w-full transition-all duration-300" />
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        {user ? (
                            user.role === 'ADMIN' ? (
                                <Link href="/admin">
                                    <Button size="default" className="font-semibold gap-2 bg-violet-600 hover:bg-violet-500 text-white">
                                        <Layers className="h-4 w-4" />
                                        Admin
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/dashboard">
                                    <Button size="default" className="font-semibold gap-2 bg-violet-600 hover:bg-violet-500 text-white">
                                        <Sparkles className="h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                            )
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="font-medium text-slate-300 hover:text-white hover:bg-white/5">
                                        Connexion
                                    </Button>
                                </Link>
                                <Link href="#signup">
                                    <Button size="default" className="font-semibold gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25">
                                        <Sparkles className="h-4 w-4" />
                                        Commencer
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-b border-white/5 p-6 space-y-4">
                    <nav className="flex flex-col gap-4">
                        <Link href="#services" className="text-slate-300 hover:text-white font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                            Solutions
                        </Link>
                        <Link href="#how-it-works" className="text-slate-300 hover:text-white font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                            Comment ça marche
                        </Link>
                    </nav>
                    <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                        {user ? (
                            <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                                <Button className="w-full font-semibold bg-violet-600 hover:bg-violet-500">
                                    {user.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline" className="w-full font-medium border-white/10 text-white hover:bg-white/5">
                                        Connexion
                                    </Button>
                                </Link>
                                <Link href="#signup">
                                    <Button className="w-full font-semibold bg-gradient-to-r from-violet-600 to-indigo-600">
                                        Commencer
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
