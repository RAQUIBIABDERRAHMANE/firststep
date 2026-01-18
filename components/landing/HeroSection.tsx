'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Play, ChevronRight, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Particle {
    id: number
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    opacity: number
    color: string
}

function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const particlesRef = useRef<Particle[]>([])
    const animationRef = useRef<number | undefined>(undefined)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        // Initialize particles
        const colors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#7C3AED', '#6D28D9']
        const particleCount = 80

        for (let i = 0; i < particleCount; i++) {
            particlesRef.current.push({
                id: i,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 4 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: colors[Math.floor(Math.random() * colors.length)]
            })
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener('mousemove', handleMouseMove)

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particlesRef.current.forEach((particle) => {
                // Calculate distance from mouse
                const dx = mouseRef.current.x - particle.x
                const dy = mouseRef.current.y - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                const maxDistance = 200

                // Move particles away from mouse
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance
                    particle.x -= (dx / distance) * force * 3
                    particle.y -= (dy / distance) * force * 3
                }

                // Update position
                particle.x += particle.speedX
                particle.y += particle.speedY

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

                // Keep in bounds
                particle.x = Math.max(0, Math.min(canvas.width, particle.x))
                particle.y = Math.max(0, Math.min(canvas.height, particle.y))

                // Draw particle
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fillStyle = particle.color
                ctx.globalAlpha = particle.opacity
                ctx.fill()

                // Draw connections
                particlesRef.current.forEach((otherParticle) => {
                    const dx2 = particle.x - otherParticle.x
                    const dy2 = particle.y - otherParticle.y
                    const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2)

                    if (dist < 120) {
                        ctx.beginPath()
                        ctx.strokeStyle = particle.color
                        ctx.globalAlpha = (1 - dist / 120) * 0.15
                        ctx.lineWidth = 1
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(otherParticle.x, otherParticle.y)
                        ctx.stroke()
                    }
                })
            })

            ctx.globalAlpha = 1
            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            window.removeEventListener('mousemove', handleMouseMove)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
        />
    )
}

export default function HeroSection() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
            {/* Deep gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
            
            {/* Radial glow effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[100px]" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px]" />

            {/* Interactive Particles */}
            <ParticleBackground />

            {/* Grid pattern overlay */}
            <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10 pt-20 pb-32">
                <div className="max-w-5xl mx-auto text-center">
                    
                    {/* Floating Badge */}
                    <div className="mb-8 animate-fade-in">
                        <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium text-violet-300 shadow-lg">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            Plateforme SaaS Nouvelle Génération
                            <ChevronRight className="h-4 w-4 text-violet-400" />
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 animate-fade-in leading-[1.05]">
                        Développez votre
                        <br />
                        <span className="relative inline-block mt-2">
                            <span className="relative z-10 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                business digital
                            </span>
                            {/* Glow effect behind text */}
                            <span className="absolute -inset-2 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 blur-2xl rounded-full" />
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in font-medium">
                        Arrêtez de jongler entre différents outils. FirstStep vous offre une plateforme unifiée pour gérer votre activité sans friction. Transformez le chaos en clarté.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in">
                        <Link href="#signup">
                            <Button 
                                size="lg" 
                                className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-0 shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:-translate-y-0.5 group"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <Sparkles className="h-5 w-5 mr-2" />
                                Commencer gratuitement
                                <ArrowRight className={`h-5 w-5 ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                            </Button>
                        </Link>
                        <Link href="/services">
                            <Button 
                                variant="outline" 
                                size="lg" 
                                className="h-14 px-8 text-base font-semibold bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm"
                            >
                                <Play className="h-4 w-4 mr-2 fill-current" />
                                Voir les solutions
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 animate-fade-in">
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">500+</div>
                            <div className="text-sm text-slate-500 font-medium">Entreprises</div>
                        </div>
                        <div className="h-12 w-px bg-white/10 hidden sm:block" />
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">99.9%</div>
                            <div className="text-sm text-slate-500 font-medium">Disponibilité</div>
                        </div>
                        <div className="h-12 w-px bg-white/10 hidden sm:block" />
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-3xl sm:text-4xl font-bold text-white mb-1">
                                4.9
                                <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
                            </div>
                            <div className="text-sm text-slate-500 font-medium">Satisfaction</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
            
            {/* Decorative elements */}
            <div className="absolute bottom-20 left-10 w-20 h-20 border border-white/5 rounded-2xl rotate-12 animate-pulse" />
            <div className="absolute top-32 right-16 w-16 h-16 border border-violet-500/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute top-1/2 left-8 w-2 h-2 bg-violet-400 rounded-full animate-ping" />
            <div className="absolute top-1/3 right-12 w-3 h-3 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </section>
    )
}
