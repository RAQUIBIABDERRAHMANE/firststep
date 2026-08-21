import { Metadata } from 'next'
import DevEmploymentFormClient from './DevEmploymentFormClient'
import Link from 'next/link'
import { ArrowLeft, Briefcase, Code, Sparkles, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Recrutement Software Developer | FirstStep Partner Program',
  description: 'Postulez pour rejoindre l\'équipe de développement FirstStep. Remote, projets innovants et modèle Revenue Share transparent.',
}

export default function DevEmploymentPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic background lighting elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/employment"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Toutes les opportunités
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
              Recrutement Développeur Ouvert
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Code className="w-4 h-4" /> Software Developer Partner Program
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Rejoignez FirstStep en tant que <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Software Developer</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Travaillez sur des applications SaaS modernes, des fonctionnalités Next.js et des architectures robustes. Bénéficiez d&apos;un modèle transparent avec <span className="text-cyan-400 font-semibold">Revenue Share par projet</span>.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Remote Flexibility
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Revenue Share Model
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> Modern Tech Stack
            </div>
          </div>
        </div>

        {/* Form Container */}
        <DevEmploymentFormClient />
      </div>
    </div>
  )
}
