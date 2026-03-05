import Navbar from '@/components/landing/Navbar'
import Image from 'next/image'
import HeroSection from '@/components/landing/HeroSection'
import ServicesOverview from '@/components/landing/ServicesOverview'
import HowItWorks from '@/components/landing/HowItWorks'
import SignupSection from '@/components/landing/SignupSection'
import { getServices } from '@/app/actions/services'
import { getCurrentUser } from '@/app/actions/auth'
import Link from 'next/link'

export default async function Home() {
  const services = await getServices()
  const user = await getCurrentUser()

  return (
    <main className="flex min-h-screen flex-col bg-[#050914]">
      <Navbar user={user} />
      <HeroSection />
      <ServicesOverview services={services} />
      <HowItWorks />
<SignupSection />

      {/* Footer */}
      <footer className="relative bg-[#050914] border-t border-white/6">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 rounded-lg overflow-hidden ring-1 ring-white/10">
                  <Image src="/og-image.png" alt="FirstStep" fill className="object-cover" />
                </div>
                <span className="text-white font-bold text-lg">FirstStep</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                La plateforme SaaS B2B qui centralise la gestion de votre entreprise au Maroc.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Tous les systèmes opérationnels
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Produit</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link href="#services" className="hover:text-white transition-colors">Solutions</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">Fonctionnement</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Tous les services</Link></li>
                <li><Link href="#signup" className="hover:text-white transition-colors">Tarifs</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Légal</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link href="/login" className="hover:text-white transition-colors">Connexion</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">CGU</Link></li>
                <li><a href="mailto:contact@firststep.ma" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-600">© 2026 FirstStep Platform. Tous droits réservés.</p>
            <p className="text-xs text-slate-700">Conçu et développé au Maroc 🇲🇦</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
