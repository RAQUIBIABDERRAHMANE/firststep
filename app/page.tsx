import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import ServicesOverview from '@/components/landing/ServicesOverview'
import HowItWorks from '@/components/landing/HowItWorks'
import SignupSection from '@/components/landing/SignupSection'
import { getServices } from '@/app/actions/services'
import { getCurrentUser } from '@/app/actions/auth'

export default async function Home() {
  const services = await getServices()
  const user = await getCurrentUser()

  return (
    <main className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Large Gradient Orbs */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s', animationDuration: '15s' }} />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '20s' }} />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s', animationDuration: '18s' }} />

        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/3 w-32 h-32 border-2 border-primary/20 rounded-3xl rotate-45 animate-spin-slow" />
        <div className="absolute top-2/3 right-1/4 w-24 h-24 border-2 border-accent/20 rounded-2xl rotate-12 animate-spin-reverse" />
        <div className="absolute bottom-1/4 left-1/2 w-40 h-40 border border-primary/10 rounded-full animate-pulse-slow" />

        {/* Gradient Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-shimmer" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent animate-shimmer" style={{ animationDelay: '2s' }} />

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.02]" />
      </div>

      <div className="relative z-10">
        <Navbar user={user} />
        <HeroSection />
        <ServicesOverview services={services} />
        <HowItWorks />
        <SignupSection services={services} />
      </div>

      <footer className="relative py-16 border-t border-border/50 bg-gradient-to-br from-muted/30 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex items-center gap-3 font-bold text-2xl">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/30">F</div>
            <span className="gradient-text">FirstStep</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            © 2026 FirstStep Platform. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#" className="hover:text-primary transition-all duration-300 hover:scale-110">Privacy</a>
            <a href="#" className="hover:text-primary transition-all duration-300 hover:scale-110">Terms</a>
            <a href="#" className="hover:text-primary transition-all duration-300 hover:scale-110">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
