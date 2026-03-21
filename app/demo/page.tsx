import Link from 'next/link'
import { ArrowRight, Utensils, Stethoscope, Sparkles, Building2 } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import { getCurrentUser } from '@/app/actions/auth'

export const metadata = {
  title: 'Démo FirstStep - Choisissez votre solution',
  description: 'Découvrez les démonstrations de nos solutions pour restaurants et cabinets médicaux.',
}

export default async function DemoPage() {
  const user = await getCurrentUser()

  return (
    <main className="min-h-screen bg-[#030712] relative overflow-hidden flex flex-col">
      <Navbar user={user} />
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-900/15 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-900/15 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 mt-20 lg:mt-0">
        <div className="max-w-4xl w-full mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/30 border border-cyan-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-figtree font-medium text-cyan-300 tracking-wide uppercase">Expérience Immersive</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-syne font-black text-white tracking-tight leading-tight">
              Choisissez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 drop-shadow-sm">Démo</span>
            </h1>
            <p className="text-lg md:text-xl font-figtree text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explorez la puissance de FirstStep adaptée à votre secteur d&apos;activité. Des outils conçus sur-mesure pour l&apos;excellence opérationnelle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mt-12 perspective-1000">
            {/* Restaurant Demo Card */}
            <Link 
              href="/demo/restaurent" 
              className="group relative overflow-hidden rounded-[2rem] bg-slate-900/40 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-900/80 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.15)] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="p-8 sm:p-10 relative z-10 flex flex-col h-full">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-orange-500/20 shadow-inner">
                  <Utensils className="w-8 h-8 text-orange-400" />
                </div>
                
                <h3 className="text-3xl font-syne font-bold text-white mb-4">FirstStep <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Resto</span></h3>
                <p className="text-slate-400 font-figtree text-lg leading-relaxed mb-8 flex-1">
                  Gestion des commandes, plan de salle interactif automatisé, encaissement rapide et analytics en temps réel.
                </p>
                
                <div className="flex items-center text-orange-400 font-figtree font-bold gap-2 group/btn mt-auto">
                  Accéder à la démo
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center group-hover/btn:bg-orange-500 group-hover/btn:text-white transition-all duration-300 group-hover/btn:translate-x-2">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Cabinet Demo Card */}
            <Link 
              href="/demo/cabinet" 
              className="group relative overflow-hidden rounded-[2rem] bg-slate-900/40 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="p-8 sm:p-10 relative z-10 flex flex-col h-full">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 border border-emerald-500/20 shadow-inner">
                  <Stethoscope className="w-8 h-8 text-emerald-400" />
                </div>
                
                <h3 className="text-3xl font-syne font-bold text-white mb-4">FirstStep <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Cabinet</span></h3>
                <p className="text-slate-400 font-figtree text-lg leading-relaxed mb-8 flex-1">
                  Agenda intelligent, dossiers patients numérisés sécurisés, facturation automatique et suivi personnalisé.
                </p>
                
                <div className="flex items-center text-emerald-400 font-figtree font-bold gap-2 group/btn mt-auto">
                  Accéder à la démo
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover/btn:bg-emerald-500 group-hover/btn:text-white transition-all duration-300 group-hover/btn:translate-x-2">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="pt-16 pb-8 text-center flex items-center justify-center gap-3 text-slate-500 font-figtree animate-pulse">
             <Building2 className="w-4 h-4" />
             <span className="text-sm tracking-wide">D&apos;autres secteurs seront bientôt disponibles...</span>
          </div>

        </div>
      </div>
    </main>
  )
}
