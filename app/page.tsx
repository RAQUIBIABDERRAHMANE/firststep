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
      {/* Navbar is hidden on hero — shown on scroll for sub-sections */}
      <Navbar user={user} />
      <HeroSection />
      <ServicesOverview services={services} />
      <HowItWorks />
      <SignupSection />

      {/* Footer */}
      <footer className="relative bg-[#030712] overflow-hidden">

        {/* Top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0, 102, 255,0.3), transparent)' }} />
        {/* Atmospheric glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'rgba(0, 102, 255,0.03)' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

            {/* Brand */}
            <div className="md:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 shrink-0 rounded-lg overflow-hidden"
                  style={{ boxShadow: '0 0 0 1px rgba(0, 102, 255,0.2), 0 0 12px rgba(0, 102, 255,0.08)' }}
                >
                  <Image
                    src="/Untitled design (13).png"
                    alt="FirstStep Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-syne font-black text-[18px] tracking-tight text-white">
                  First<span style={{ color: '#0066FF' }}>Step</span>
                </span>
              </div>
              <p className="font-figtree text-[13px] text-slate-500 leading-relaxed max-w-xs">
                La plateforme SaaS B2B qui centralise la gestion de votre entreprise au Maroc.
              </p>
              <div className="flex items-center gap-2 text-[12px] font-figtree text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                Tous les systèmes opérationnels
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="font-syne text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(0, 102, 255,0.5)' }}>Produit</h4>
              <ul className="space-y-3">
                {[
                  { href: '#services', label: 'Solutions' },
                  { href: '#how-it-works', label: 'Fonctionnement' },
                  { href: '/services', label: 'Tous les services' },
                  { href: '#signup', label: 'Tarifs' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="font-figtree text-[13px] text-slate-500 hover:text-white transition-colors duration-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-syne text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(0, 102, 255,0.5)' }}>Légal</h4>
              <ul className="space-y-3">
                {[
                  { href: '/about', label: 'À propos' },
                  { href: '/login', label: 'Connexion' },
                  { href: '#', label: 'Confidentialité' },
                  { href: '/terms', label: 'CGU' },
                  { href: 'mailto:contact@firststepco.com', label: 'Contact' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="font-figtree text-[13px] text-slate-500 hover:text-white transition-colors duration-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid rgba(0, 102, 255,0.1)' }}>
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
