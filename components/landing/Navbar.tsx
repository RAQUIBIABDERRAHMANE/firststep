'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

export default function Navbar({ user }: { user?: any }) {
    const [scrolled, setScrolled] = useState(false)

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
                ? 'bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-lg shadow-primary/5'
                : 'bg-transparent border-transparent'
                }`}
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo: Modern and recognizable */}
                <Link href="/" className="flex items-center gap-3 font-bold text-2xl tracking-tight text-foreground hover:opacity-80 transition-all duration-300 group">
                    <div className="relative h-11 w-11 rounded-2xl overflow-hidden shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-300">
                        <Image
                            src="/og-image.png"
                            alt="FirstStep Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="gradient-text">FirstStep</span>
                </Link>

                {/* Navigation: Direct actions */}
                <div className="flex items-center gap-8">
                    <nav className="hidden md:flex gap-8 text-sm font-semibold text-muted-foreground">
                        <Link href="/services" className="hover:text-primary transition-all duration-300 hover:scale-110 flex items-center gap-1">
                            Solutions
                        </Link>
                        <Link href="#how-it-works" className="hover:text-primary transition-all duration-300 hover:scale-110">
                            How it Works
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link href="/dashboard">
                                <Button size="default" className="font-bold gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="font-semibold">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="#signup">
                                    <Button size="default" className="font-bold gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
