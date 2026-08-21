import Navbar from '@/components/landing/Navbar'
import Image from 'next/image'
import HeroSection from '@/components/landing/HeroSection'
import AnnouncementsSection from '@/components/landing/AnnouncementsSection'
import ServicesOverview from '@/components/landing/ServicesOverview'
import HowItWorks from '@/components/landing/HowItWorks'
import SignupSection from '@/components/landing/SignupSection'
import { getServices } from '@/app/actions/services'
import { getCurrentUser } from '@/app/actions/auth'
import { getPublishedAnnouncements } from '@/app/actions/announcements'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [services, user, announcements] = await Promise.all([
    getServices(),
    getCurrentUser(),
    getPublishedAnnouncements()
  ])

  return (
    <main className="flex min-h-screen flex-col bg-[#FAFBFD] text-slate-900 selection:bg-blue-500/15 selection:text-[#0066FF]">
      <Navbar user={user} announcements={announcements} />
      <HeroSection />
      <AnnouncementsSection announcements={announcements} />
      <ServicesOverview services={services} />
      <HowItWorks />
      <SignupSection />

      {/* Footer */}
      <footer className="relative bg-white border-t border-slate-200/80 overflow-hidden text-slate-900">

        {/* Top border accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066FF]/30 to-transparent" />
        
        {/* Soft background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

            {/* Brand column */}
            <div className="md:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 shrink-0 rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-2xs">
                  <Image
                    src="/Untitled design (13).png"
                    alt="FirstStep Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-syne font-black text-[20px] tracking-tight text-slate-900">
                  First<span className="text-[#0066FF]">Step</span>
                </span>
              </div>
              <p className="font-figtree text-[13.5px] text-slate-500 leading-relaxed max-w-xs">
                La plateforme SaaS B2B qui centralise la gestion de votre entreprise au Maroc.
              </p>
              <div className="flex items-center gap-2 text-[12px] font-figtree text-slate-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                Tous les systèmes opérationnels
              </div>
            </div>

            {/* Product links */}
            <div className="space-y-4">
              <h4 className="font-syne text-[11px] font-bold uppercase tracking-widest text-[#0066FF]">Produit</h4>
              <ul className="space-y-3">
                {[
                  { href: '#services', label: 'Solutions' },
                  { href: '#how-it-works', label: 'Fonctionnement' },
                  { href: '/services', label: 'Tous les services' },
                  { href: '#signup', label: 'Tarifs' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="font-figtree text-[13.5px] text-slate-600 hover:text-[#0066FF] transition-colors duration-200 active:scale-95 inline-block">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal links */}
            <div className="space-y-4">
              <h4 className="font-syne text-[11px] font-bold uppercase tracking-widest text-[#0066FF]">Légal</h4>
              <ul className="space-y-3">
                {[
                  { href: '/about', label: 'À propos' },
                  { href: '/login', label: 'Connexion' },
                  { href: '#', label: 'Confidentialité' },
                  { href: '/terms', label: 'CGU' },
                  { href: 'mailto:contact@firststepco.com', label: 'Contact' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="font-figtree text-[13.5px] text-slate-600 hover:text-[#0066FF] transition-colors duration-200 active:scale-95 inline-block">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-100">
            <p className="font-figtree text-[12.5px] text-slate-500">
              &copy; 2026 FirstStep Platform. Tous droits réservés.
            </p>
            <p className="font-figtree text-[12.5px] text-slate-500 font-medium">
              Conçu et développé au Maroc 🇲🇦
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
