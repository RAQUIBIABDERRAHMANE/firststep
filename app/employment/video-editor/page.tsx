import { Metadata } from 'next'
import VideoEditorFormClient from './VideoEditorFormClient'
import Link from 'next/link'
import { ArrowLeft, Clapperboard, Sparkles, CheckCircle2, Film } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Recrutement Video Editor & Motion Designer | FirstStep Partner Program',
  description: 'Postulez pour rejoindre l\'équipe de création vidéo FirstStep. Montage dynamique, Reels/TikTok, motion design et modèle Revenue Share.',
}

export default function VideoEditorEmploymentPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic background lighting elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/employment"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-purple-400 transition-colors px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Toutes les opportunités
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-xs font-mono text-rose-400 font-semibold uppercase tracking-wider">
              Recrutement Vidéo Ouvert
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Clapperboard className="w-4 h-4" /> Video Editor & Motion Partner Program
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Rejoignez FirstStep en tant que <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-rose-400 to-amber-400">Video Editor & Motion Designer</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Créez des vidéos publicitaires captivantes, des formats courts à haute rétention (TikTok, Reels) et du motion design pour des marques innovantes avec <span className="text-purple-400 font-semibold">Revenue Share par projet vidéo</span>.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> Projets Marques & SaaS
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-rose-400" /> Rémunération par Vidéo
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> Liberté Créative Totale
            </div>
          </div>
        </div>

        {/* Form Container */}
        <VideoEditorFormClient />
      </div>
    </div>
  )
}
