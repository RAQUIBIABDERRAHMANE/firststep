'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Github,
  Linkedin,
  Globe,
  Download,
  Eye,
  Percent,
  Mail,
  Phone,
  User,
  Sparkles,
  Loader2,
  ExternalLink,
  Code2,
  RefreshCw,
  Clapperboard,
  Video,
  PlaySquare,
  Share2
} from 'lucide-react'

interface CandidateApplication {
  id: string
  roleType?: 'DEVELOPER' | 'VIDEO_EDITOR' | string
  fullName: string
  email: string
  phone: string
  cin: string
  cvUrl: string
  photoUrl: string
  githubUrl?: string | null
  portfolioUrl?: string | null
  linkedinUrl?: string | null
  skills: string
  revenueShare: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  agreementPdfUrl?: string | null
  createdAt: string
}

export default function EmploymentAdminClient() {
  const [applications, setApplications] = useState<CandidateApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')

  const [selectedApp, setSelectedApp] = useState<CandidateApplication | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/employment?status=${statusFilter}&role=${roleFilter}`)
      const data = await res.json()
      if (data.success && data.applications) {
        setApplications(data.applications)
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [statusFilter, roleFilter])

  const handleAccept = async (appId: string) => {
    setActionLoading(appId)
    setActionMsg(null)
    try {
      const res = await fetch(`/api/admin/employment/${appId}/accept`, {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'acceptation.')
      }
      setActionMsg({ type: 'success', text: 'Candidat accepté ! Le contrat PDF a été généré et envoyé par email.' })
      fetchApplications()
      if (selectedApp?.id === appId) {
        setSelectedApp(data.application)
      }
    } catch (err: any) {
      console.error('Accept error:', err)
      setActionMsg({ type: 'error', text: err.message || 'Erreur lors de l\'acceptation.' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (appId: string) => {
    setActionLoading(appId)
    setActionMsg(null)
    try {
      const res = await fetch(`/api/admin/employment/${appId}/reject`, {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors du refus.')
      }
      setActionMsg({ type: 'success', text: 'Candidature refusée.' })
      fetchApplications()
      if (selectedApp?.id === appId) {
        setSelectedApp(data.application)
      }
    } catch (err: any) {
      console.error('Reject error:', err)
      setActionMsg({ type: 'error', text: err.message || 'Erreur lors du refus.' })
    } finally {
      setActionLoading(null)
    }
  }

  const filteredApps = applications.filter((app) => {
    const query = searchQuery.toLowerCase()
    return (
      app.fullName.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query) ||
      app.cin.toLowerCase().includes(query) ||
      app.skills.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {actionMsg && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200 ${
            actionMsg.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          <span>{actionMsg.text}</span>
          <button
            onClick={() => setActionMsg(null)}
            className="text-slate-400 hover:text-white ml-4 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Top Controls: Search, Status & Role Tabs */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, CIN, skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={fetchApplications}
              className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Rafraîchir la liste"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Role & Status Filter Badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          {/* Role Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Rôle :</span>
            {[
              { key: 'ALL', label: 'Tous les profils' },
              { key: 'DEVELOPER', label: '💻 Développeurs' },
              { key: 'VIDEO_EDITOR', label: '🎬 Monteurs Vidéo' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setRoleFilter(tab.key)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  roleFilter === tab.key
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs'
                    : 'bg-slate-950/50 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Statut :</span>
            {[
              { key: 'ALL', label: 'Tous' },
              { key: 'PENDING', label: 'En attente' },
              { key: 'ACCEPTED', label: 'Acceptés' },
              { key: 'REJECTED', label: 'Refusés' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.key
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-slate-950/50 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Candidates List Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Chargement des candidatures...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 space-y-2">
          <User className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white">Aucune candidature trouvée</h3>
          <p className="text-xs text-slate-400">Aucune demande ne correspond à vos critères actuels.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => {
            let parsedSkills: string[] = []
            try {
              parsedSkills = JSON.parse(app.skills)
            } catch {
              parsedSkills = []
            }

            const isVideo = app.roleType === 'VIDEO_EDITOR'

            return (
              <div
                key={app.id}
                className={`bg-slate-900/80 border rounded-3xl p-6 transition-all duration-300 hover:shadow-xl flex flex-col justify-between space-y-5 ${
                  isVideo
                    ? 'border-purple-500/30 hover:border-purple-500/60 hover:shadow-purple-950/20'
                    : 'border-slate-800 hover:border-cyan-500/50 hover:shadow-cyan-950/20'
                }`}
              >
                <div className="space-y-4">
                  {/* Top info & Role + Status Pills */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {app.photoUrl ? (
                        <img
                          src={app.photoUrl}
                          alt={app.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-sm"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-bold text-base ${
                          isVideo ? 'bg-purple-950/50 border-purple-800 text-purple-300' : 'bg-slate-800 border-slate-700 text-cyan-400'
                        }`}>
                          {app.fullName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-white line-clamp-1">{app.fullName}</h3>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                            isVideo
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {isVideo ? <Clapperboard className="w-2.5 h-2.5" /> : <Code2 className="w-2.5 h-2.5" />}
                            {isVideo ? 'Monteur Vidéo' : 'Développeur'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                        app.status === 'ACCEPTED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : app.status === 'REJECTED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {app.status === 'ACCEPTED' && <CheckCircle2 className="w-3 h-3" />}
                      {app.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                      {app.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {app.status}
                    </span>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{app.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{app.phone}</span>
                    </p>
                    <p className="flex items-center gap-2 text-cyan-400 font-semibold pt-1 border-t border-slate-800">
                      <Percent className="w-3.5 h-3.5" />
                      <span>Revenue Share : {app.revenueShare}% par projet</span>
                    </p>
                  </div>

                  {/* Social & Showreel Links */}
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    {isVideo && app.portfolioUrl && (
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-700/50 text-purple-300 font-bold transition-colors"
                        title="Voir le Showreel Vidéo"
                      >
                        <PlaySquare className="w-3.5 h-3.5" /> Showreel
                      </a>
                    )}
                    {app.githubUrl && (
                      <a
                        href={app.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="GitHub / Portfolio"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {app.linkedinUrl && (
                      <a
                        href={app.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="LinkedIn / Social Profile"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={app.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 px-2.5 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40"
                    >
                      <Download className="w-3.5 h-3.5" /> CV (PDF)
                    </a>
                  </div>

                  {/* Skills tags preview */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {parsedSkills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-lg bg-slate-800/90 text-slate-300 text-[11px] font-mono border border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                    {parsedSkills.length > 4 && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800/60 text-slate-400 text-[11px] font-mono">
                        +{parsedSkills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Détails
                  </button>

                  <div className="flex items-center gap-2">
                    {app.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleAccept(app.id)}
                          disabled={actionLoading === app.id}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-3 py-2 rounded-xl transition-all shadow-md shadow-emerald-950/30 cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === app.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          Accepter
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          disabled={actionLoading === app.id}
                          className="p-2 text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                          title="Refuser"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {app.status === 'ACCEPTED' && app.agreementPdfUrl && (
                      <a
                        href={app.agreementPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" /> Contrat PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Candidate Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                {selectedApp.photoUrl ? (
                  <img
                    src={selectedApp.photoUrl}
                    alt={selectedApp.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-2xl">
                    {selectedApp.fullName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-extrabold text-white">{selectedApp.fullName}</h2>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-mono text-slate-400">CIN: {selectedApp.cin}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      selectedApp.roleType === 'VIDEO_EDITOR'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {selectedApp.roleType === 'VIDEO_EDITOR' ? '🎬 Monteur Vidéo' : '💻 Développeur'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Sections */}
            <div className="space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Coordonnées</p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{selectedApp.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{selectedApp.phone}</span>
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Conditions & Statut</p>
                  <p className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Percent className="w-4 h-4 shrink-0" />
                    <span>Revenue Share: {selectedApp.revenueShare}% par projet</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Postulé le : {new Date(selectedApp.createdAt).toLocaleDateString('fr-FR')}</span>
                  </p>
                </div>
              </div>

              {/* Links & Showreel */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Liens & Références</p>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.portfolioUrl && (
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-300 font-bold hover:bg-purple-900"
                    >
                      <PlaySquare className="w-3.5 h-3.5" /> Showreel / Portfolio
                    </a>
                  )}
                  {selectedApp.githubUrl && (
                    <a
                      href={selectedApp.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                    >
                      <Github className="w-3.5 h-3.5" /> Profil GitHub
                    </a>
                  )}
                  {selectedApp.linkedinUrl && (
                    <a
                      href={selectedApp.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                    >
                      <Linkedin className="w-3.5 h-3.5" /> Profil LinkedIn / Social
                    </a>
                  )}
                  <a
                    href={selectedApp.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-bold hover:bg-cyan-900"
                  >
                    <Download className="w-3.5 h-3.5" /> Télécharger CV (PDF)
                  </a>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Compétences Sélectionnées</p>
                <div className="flex flex-wrap gap-1.5">
                  {(() => {
                    try {
                      const tags: string[] = JSON.parse(selectedApp.skills)
                      return tags.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 font-mono text-xs border border-slate-700">
                          {s}
                        </span>
                      ))
                    } catch {
                      return <span className="text-slate-500">Aucune compétence listée</span>
                    }
                  })()}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
              >
                Fermer
              </button>

              {selectedApp.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    disabled={actionLoading === selectedApp.id}
                    className="px-4 py-2 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-600/40 text-xs font-bold hover:bg-rose-600/30 cursor-pointer disabled:opacity-50"
                  >
                    Refuser
                  </button>
                  <button
                    onClick={() => handleAccept(selectedApp.id)}
                    disabled={actionLoading === selectedApp.id}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-extrabold cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {actionLoading === selectedApp.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Valider & Signer Contrat
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
