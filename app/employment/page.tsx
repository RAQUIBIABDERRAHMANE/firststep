import { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowLeft,
  Briefcase,
  Code2,
  Clapperboard,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Percent,
  Laptop
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Opportunités & Recrutement Partenaires | FirstStep',
  description: 'Rejoignez l\'écosystème FirstStep en tant que Software Developer ou Video Editor & Motion Designer. Remote et modèle Revenue Share.',
}

export default function EmploymentHubPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-between">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10 w-full">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au site FirstStep
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
              2 Postes Ouverts
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="w-4 h-4" /> FirstStep Talent & Partner Program
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            Construisez le futur avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">FirstStep</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Choisissez votre domaine d&apos;expertise et intégrez un modèle de collaboration moderne avec travail à distance flexible et <span className="text-white font-semibold">Revenue Share transparent par projet</span>.
          </p>
        </div>

        {/* Pathway Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Software Developer */}
          <div className="relative group bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-8 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                  <Code2 className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  Tech & SaaS
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  Software Developer
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Développement d&apos;applications SaaS fullstack, modules interactifs, architectures Next.js/React, bases de données et APIs sécurisées.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Stack moderne : Next.js, React, TypeScript, Node.js</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Modèle Revenue Share par application & module</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Autonomie 100% remote et missions assignées</span>
                </div>
              </div>
            </div>

            <Link href="/employment/dev" className="block pt-2">
              <button className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-97 transition-all cursor-pointer">
                <span>Postuler comme Développeur</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Card 2: Video Editor & Motion Designer */}
          <div className="relative group bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-8 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/10">
                  <Clapperboard className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  Créatif & Motion
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white group-hover:text-purple-300 transition-colors">
                  Video Editor & Motion Designer
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Création de contenus vidéos percutants, formats courts (TikTok, Reels, Shorts), animations graphiques et publicités orientées conversion.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Outils : Premiere Pro, After Effects, DaVinci, CapCut</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Rémunération au pack vidéo & Revenue Share</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Liberté créative et projets de marques SaaS</span>
                </div>
              </div>
            </div>

            <Link href="/employment/video-editor" className="block pt-2">
              <button className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-500 via-rose-600 to-amber-500 hover:from-purple-400 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 active:scale-97 transition-all cursor-pointer">
                <span>Postuler comme Monteur Vidéo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-center">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-1">
            <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold text-sm">
              <Laptop className="w-4 h-4" /> 100% Télétravail
            </div>
            <p className="text-[11px] text-slate-400">Gérez votre temps et vos missions en toute liberté.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-1">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
              <Percent className="w-4 h-4" /> Revenue Share
            </div>
            <p className="text-[11px] text-slate-400">Gagnez un pourcentage direct sur chaque projet livré.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-1">
            <div className="flex items-center justify-center gap-2 text-purple-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" /> Contrat Transparent
            </div>
            <p className="text-[11px] text-slate-400">Accord officiel généré et signé électroniquement.</p>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="text-center text-xs text-slate-600 pt-12">
        © {new Date().getFullYear()} FirstStep. Tous droits réservés.
      </footer>
    </div>
  )
}
