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
    <main className="flex min-h-screen flex-col bg-[#030712]">
      <Navbar user={user} />
      <HeroSection />
      <ServicesOverview services={services} />
      <HowItWorks />
      <SignupSection />

      {/* Footer */}
      <footer className="relative bg-[#030712] border-t border-cyan-900/25 overflow-hidden">
        {/* Atmospheric glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-cyan-950/40 blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

            {/* Brand */}
            <div className="md:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 shrink-0 rounded-lg overflow-hidden ring-1 ring-white/10">
                  <Image
                    src="/Untitled design (13).png"
                    alt="FirstStep Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-syne font-black text-[18px] tracking-tight text-white">
                  First<span className="text-cyan-400">Step</span>
                </span>
              </div>
              <p className="font-figtree text-[13px] text-slate-500 leading-relaxed max-w-xs">
                La plateforme SaaS B2B qui centralise la gestion de votre entreprise au Maroc.
              </p>
              <div className="flex items-center gap-2 text-[12px] font-figtree text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Tous les syst&egrave;mes op&eacute;rationnels
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="font-syne text-[11px] font-bold text-slate-400 uppercase tracking-widest">Produit</h4>
              <ul className="space-y-3">
                {[
                  { href: '#services', label: 'Solutions' },
                  { href: '#how-it-works', label: 'Fonctionnement' },
                  { href: '/services', label: 'Tous les services' },
                  { href: '#signup', label: 'Tarifs' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="font-figtree text-[13px] text-slate-500 hover:text-cyan-400 transition-colors duration-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-syne text-[11px] font-bold text-slate-400 uppercase tracking-widest">L&eacute;gal</h4>
              <ul className="space-y-3">
                {[
                  { href: '/about', label: 'À propos' },
                  { href: '/login', label: 'Connexion' },
                  { href: '#', label: 'Confidentialité' },
                  { href: '/terms', label: 'CGU' },
                  { href: 'mailto:contact@firststep.ma', label: 'Contact' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="font-figtree text-[13px] text-slate-500 hover:text-cyan-400 transition-colors duration-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-figtree text-[12px] text-slate-600">
              &copy; 2026 FirstStep Platform. Tous droits réservés.
            </p>
            <p className="font-figtree text-[12px] text-slate-700">
              Conçu et développé au Maroc 🇲🇦
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
