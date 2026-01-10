import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'

export default function HeroSection() {
    return (
        <section className="relative py-32 lg:py-56 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
            
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

            <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
                {/* Badge */}
                <div className="mb-10 animate-slide-down">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 px-5 py-2 text-sm font-bold text-primary border-2 border-primary/30 shadow-lg shadow-primary/20 backdrop-blur-sm">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        Next Generation SaaS Platform
                        <Zap className="h-4 w-4 animate-pulse" />
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-6xl font-black tracking-tighter text-foreground sm:text-8xl mb-10 animate-fade-in leading-[1.1]">
                    Scale your business with{' '}
                    <span className="gradient-text inline-block">
                        clarity and control
                    </span>
                </h1>

                {/* Subheading */}
                <p className="mt-8 text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto mb-14 animate-fade-in stagger-1 font-medium">
                    Stop juggling disconnected tools. FirstStep provides the unified, authoritative system you need to run your operations without friction. Transform chaos into clarity.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in stagger-2">
                    <Link href="#signup">
                        <Button size="lg" className="px-12 text-lg h-16 font-bold gap-3 shadow-2xl shadow-primary/30">
                            Get Started Free
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/services">
                        <Button variant="outline" size="lg" className="px-12 text-lg h-16 font-bold">
                            View Solutions
                        </Button>
                    </Link>
                </div>

                {/* Trust Indicators */}
                <div className="mt-20 animate-fade-in stagger-3">
                    <p className="text-sm text-muted-foreground mb-8 font-semibold">Trusted by forward-thinking companies</p>
                    <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
                        <div className="h-10 w-32 bg-muted-foreground/20 rounded-lg" />
                        <div className="h-10 w-32 bg-muted-foreground/20 rounded-lg" />
                        <div className="h-10 w-32 bg-muted-foreground/20 rounded-lg" />
                        <div className="h-10 w-32 bg-muted-foreground/20 rounded-lg" />
                    </div>
                </div>
            </div>
        </section>
    )
}
