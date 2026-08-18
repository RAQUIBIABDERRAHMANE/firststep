'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Player, PlayerRef } from '@remotion/player';
import { FirstStepAdVideo } from '@/remotion/FirstStepAdVideo';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Subtitles,
  Layers,
  Film,
  Download,
  ArrowLeft,
  CheckCircle2,
  Tv,
} from 'lucide-react';

const SCENES = [
  { name: '1. Le Chaos (Hook)', frame: 0, time: '0:00' },
  { name: '2. Révélation FirstStep', frame: 140, time: '0:05' },
  { name: '3. Finances & Cursors Live', frame: 280, time: '0:10' },
  { name: '4. Modules Métiers', frame: 480, time: '0:16' },
  { name: '5. Automatisation IA', frame: 680, time: '0:23' },
  { name: '6. CTA & Offre', frame: 820, time: '0:28' },
];

export default function AdPreviewPage() {
  const playerRef = useRef<PlayerRef>(null);

  const [enableMusic, setEnableMusic] = useState(true);
  const [enableSfx, setEnableSfx] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);

  const handleJumpToScene = (frame: number, idx: number) => {
    setCurrentSceneIdx(idx);
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
      playerRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans pb-24">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au site
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0066FF] animate-pulse" />
              <span className="font-bold text-sm tracking-wide text-white">
                Studio Publicitaire Remotion · FirstStep
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
              1920 × 1080 · 30 FPS · 31.5s
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Vidéo Publicitaire Produit (SaaS Launch)
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Spot Commercial FirstStep — Business OS
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Animation multi-scènes dynamique, typographie cinétique, simulation interactive de curseurs en temps réel, graphiques financiers et sous-titres synchronisés.
            </p>
          </div>

          {/* Quick Scene Buttons */}
          <div className="flex flex-wrap gap-2">
            {SCENES.map((scene, i) => (
              <button
                key={i}
                onClick={() => handleJumpToScene(scene.frame, i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  currentSceneIdx === i
                    ? 'bg-[#0066FF] text-white border-blue-400 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {scene.name}
              </button>
            ))}
          </div>
        </div>

        {/* Video Player Canvas Card */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#0B0F19] shadow-2xl shadow-black/80 mb-10">
          
          {/* Remotion Interactive Player Component */}
          <div className="w-full aspect-video relative flex items-center justify-center bg-black">
            <Player
              ref={playerRef}
              component={FirstStepAdVideo}
              inputProps={{
                enableMusic,
                enableSfx,
                showCaptions,
                primaryColor: '#0066FF',
                accentColor: '#38BDF8',
                brandName: 'FirstStep',
              }}
              durationInFrames={945}
              compositionWidth={1920}
              compositionHeight={1080}
              fps={30}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '75vh',
              }}
              controls
              autoPlay
              loop
            />
          </div>

          {/* Player Custom Controls Toolbar */}
          <div className="p-4 md:p-6 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
            
            {/* Playback Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => playerRef.current?.toggle()}
                className="h-10 px-4 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
              >
                <Play className="h-4 w-4" />
                Lecture / Pause
              </button>

              <button
                onClick={() => {
                  playerRef.current?.seekTo(0);
                  playerRef.current?.play();
                  setCurrentSceneIdx(0);
                }}
                className="h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Recommencer
              </button>
            </div>

            {/* Audio & Caption Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEnableMusic((v) => !v)}
                className={`h-10 px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
                  enableMusic
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                    : 'bg-slate-800/60 border-slate-700 text-slate-500 line-through'
                }`}
              >
                {enableMusic ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                Musique
              </button>

              <button
                onClick={() => setEnableSfx((v) => !v)}
                className={`h-10 px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
                  enableSfx
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                    : 'bg-slate-800/60 border-slate-700 text-slate-500 line-through'
                }`}
              >
                <Tv className="h-4 w-4" />
                Effets SFX
              </button>

              <button
                onClick={() => setShowCaptions((v) => !v)}
                className={`h-10 px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
                  showCaptions
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-800/60 border-slate-700 text-slate-500 line-through'
                }`}
              >
                <Subtitles className="h-4 w-4" />
                Sous-titres Cinétiques
              </button>
            </div>
          </div>
        </div>

        {/* Feature Breakdown & Export Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Storyboard Overview */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Film className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Structure Scénarisée</h3>
                <p className="text-slate-400 text-xs">6 Scènes synchronisées</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>00:00 - 00:05</strong> : Friction des tableurs & outils fragmentés</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>00:05 - 00:10</strong> : Révélation FirstStep Business OS</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>00:10 - 00:17</strong> : Finance live, curseurs Directeur & CFO</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>00:17 - 00:24</strong> : Modules Resto, Retail, Flotte, Cabinets</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>00:24 - 00:29</strong> : IA & Workflows WhatsApp automatisés</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>00:29 - 00:32</strong> : Grand CTA & Domaine firststep.ma</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Production Engine */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Technologies Remotion</h3>
                <p className="text-slate-400 text-xs">Rendu déterministe 60fps</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-semibold text-blue-400">TransitionSeries :</span> Transitions slide/fade fluides entre scènes sans saccade.
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-semibold text-emerald-400">Animated Cursors :</span> Curseur physique avec avatar, halo d'onde de clic et coordonnées synchronisées.
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-semibold text-sky-400">Captions Engine :</span> Tokens horodatés avec mise en valeur dynamique mot-par-mot.
              </div>
            </div>
          </div>

          {/* Card 3: CLI Commands & Export */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Commandes de Rendu</h3>
                <p className="text-slate-400 text-xs">Studio et Export MP4</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-1">Ouvrir Remotion Studio :</div>
                <pre className="p-2.5 rounded-xl bg-black border border-slate-800 text-[11.5px] font-mono text-emerald-400 select-all overflow-x-auto">
npx remotion studio remotion/index.ts
                </pre>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-1">Exporter en Vidéo MP4 HD :</div>
                <pre className="p-2.5 rounded-xl bg-black border border-slate-800 text-[11.5px] font-mono text-sky-400 select-all overflow-x-auto">
npx remotion render remotion/index.ts FirstStepAdVideo out/firststep-ad.mp4
                </pre>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-1">Capture d'une image fixe :</div>
                <pre className="p-2.5 rounded-xl bg-black border border-slate-800 text-[11.5px] font-mono text-slate-300 select-all overflow-x-auto">
npx remotion still remotion/index.ts FirstStepAdVideo --frame=320 out/preview.png
                </pre>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
