import Navbar from '@/components/landing/Navbar'
import Image from 'next/image'
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
    <main className="flex min-h-screen flex-col bg-slate-950 relative overflow-hidden">
      <div className="relative z-10">
        <Navbar user={user} />
        <HeroSection />
        <ServicesOverview services={services} />
        <HowItWorks />
        <SignupSection services={services} />
      </div>

      <footer className="relative py-16 border-t border-white/5 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-slate-900/50" />
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex items-center gap-3 font-bold text-xl">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-violet-500/20 ring-2 ring-white/10">
              <Image
                src="/og-image.png"
                alt="FirstStep Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">FirstStep</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            © 2026 FirstStep Platform. Tous droits réservés.
          </p>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-violet-400 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-violet-400 transition-colors">CGU</a>
            <a href="#" className="hover:text-violet-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
