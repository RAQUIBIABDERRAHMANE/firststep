import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import { getCurrentUser } from '@/app/actions/auth'
import { ArrowLeft, Target, Eye, User, Sparkles, Cpu, Layers, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: "About FirstStep — Centralized Business Management",
  description: "Learn about FirstStep, our mission, vision, and founder Abderrahmane Raquibi.",
}

export default async function AboutPage() {
  const user = await getCurrentUser()

  return (
    <main className="flex min-h-screen flex-col bg-[#030712] text-slate-300 font-sans antialiased overflow-x-hidden">
      {/* Navbar */}
      <Navbar user={user} />

      {/* Hero Header Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto w-full text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[200px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-4 py-1.5 rounded-full hover:bg-cyan-950/60 transition-all duration-300">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <h1 className="font-syne font-black text-4xl md:text-6xl text-white tracking-tight leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">FirstStep</span>
          </h1>
          <p className="font-figtree text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
            FirstStep is a scalable, multi-tenant SaaS platform designed to modernize business operations through centralized, modular management systems.
          </p>
        </div>
      </section>

      {/* Main Content & Core Pillars */}
      <section className="relative max-w-7xl mx-auto w-full px-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Platform Overview */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-500">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
          <div className="space-y-6 relative z-10 max-w-4xl">
            <div className="h-12 w-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers size={22} />
            </div>
            <h2 className="font-syne text-2xl md:text-3xl font-bold text-white tracking-tight">Centralized Ecosystem</h2>
            <p className="font-figtree text-slate-400 leading-relaxed text-base">
              It provides industry-specific solutions for stock management, hospitality, automotive rentals, healthcare, and service-based organizations within a unified digital ecosystem.
            </p>
            <p className="font-figtree text-slate-400 leading-relaxed text-base">
              The platform is engineered to support both small businesses and enterprise environments, offering flexibility, performance, and extensibility without compromising usability. Each module operates independently while remaining fully integrable within the broader FirstStep infrastructure, enabling organizations to evolve their systems without operational disruption.
            </p>
          </div>
        </div>

        {/* Mission Card */}
        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between hover:border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-950/10 transition-all duration-500 group">
          <div className="space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Target size={22} />
            </div>
            <h3 className="font-syne text-2xl font-bold text-white">Our Mission</h3>
            <p className="font-figtree text-slate-400 leading-relaxed text-sm">
              To deliver a unified, intelligent, and scalable SaaS ecosystem that simplifies business operations and enables organizations to focus on growth rather than complexity.
            </p>
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-950/10 transition-all duration-500 group">
          <div className="space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-indigo-950/50 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Eye size={22} />
            </div>
            <h3 className="font-syne text-2xl font-bold text-white">Our Vision</h3>
            <p className="font-figtree text-slate-400 leading-relaxed text-sm">
              To establish FirstStep as a leading global business management platform by redefining how companies digitize, automate, and scale their operations through modern software infrastructure and AI-driven systems.
            </p>
          </div>
        </div>

        {/* Tech Specs Summary */}
        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-950/10 transition-all duration-500 group">
          <div className="space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Cpu size={22} />
            </div>
            <h3 className="font-syne text-2xl font-bold text-white">Infrastructure</h3>
            <p className="font-figtree text-slate-400 leading-relaxed text-sm">
              Built on Next.js, Laravel 11, PostgreSQL, Redis, Docker, and Cloud infrastructure to ensure high availability, security, and horizontal scalability.
            </p>
          </div>
        </div>

      </section>

      {/* Advanced Capabilities */}
      <section className="relative bg-[#050914] border-y border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/55 border border-cyan-800/30 px-3.5 py-1 rounded-full">Architecture Specs</span>
            <h2 className="font-syne text-3xl md:text-4xl font-bold text-white tracking-tight">Advanced Capabilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "WebSocket Updates", desc: "Real-time communication and instantaneous operational dashboard sync." },
              { title: "AI-Assisted Workflows", desc: "Intelligent helper modules automating business processes and decisions." },
              { title: "Secure Stripe Payments", desc: "Highly secure, localized payment processing channels." },
              { title: "PWA Support", desc: "Progressive Web App support ensuring seamless tablet/mobile integration." }
            ].map((tech, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300">
                <div className="h-8 w-8 rounded-lg bg-cyan-950/30 flex items-center justify-center text-cyan-400 mb-4 font-bold text-sm">
                  0{i + 1}
                </div>
                <h4 className="font-syne font-bold text-white text-lg mb-2">{tech.title}</h4>
                <p className="font-figtree text-slate-400 text-sm leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto w-full">
        {/* Glow */}
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        <div className="bg-gradient-to-br from-indigo-950/20 to-cyan-950/20 border border-white/5 p-8 md:p-16 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center relative z-10">
            {/* Avatar representation */}
            <div className="flex justify-center">
              <div className="relative h-48 w-48 rounded-[2rem] overflow-hidden bg-gradient-to-tr from-cyan-900/50 to-indigo-900/50 border border-white/10 flex items-center justify-center shadow-2xl group">
                <User size={80} className="text-cyan-400/50 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-center border border-white/5">
                  <span className="text-xs font-semibold text-white tracking-wider uppercase">Founder</span>
                </div>
              </div>
            </div>

            {/* Founder details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <h2 className="font-syne text-3xl md:text-4xl font-bold text-white tracking-tight">Abderrahmane Raquibi</h2>
                <p className="text-cyan-400 font-medium font-figtree text-sm">Full-Stack Software Engineer & Founder</p>
              </div>

              <p className="font-figtree text-slate-400 leading-relaxed text-base">
                FirstStep was founded by Abderrahmane Raquibi, a full-stack software engineer specializing in scalable web architectures and SaaS product development. With a strong focus on system design and operational efficiency, he aims to build robust digital ecosystems that transform traditional business workflows into streamlined, technology-driven processes.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {["Scalable Web Architectures", "SaaS Systems", "Operational Efficiency", "AI Workflows"].map((spec) => (
                  <span key={spec} className="px-3 py-1 text-xs text-slate-400 bg-white/5 border border-white/5 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  { href: '/#services', label: 'Solutions' },
                  { href: '/#how-it-works', label: 'Fonctionnement' },
                  { href: '/services', label: 'Tous les services' },
                  { href: '/#signup', label: 'Tarifs' },
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
                  { href: '/login', label: 'Connexion' },
                  { href: '#', label: 'Confidentialité' },
                  { href: '/terms', label: 'CGU' },
                  { href: 'mailto:contact@firststepco.com', label: 'Contact' },
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
