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
} from 'lucide-react'

interface CandidateApplication {
  id: string
  fullName: string
  email: string
  phone: string
  cin: string
  cvUrl: string
  photoUrl: string
  githubUrl: string
  portfolioUrl?: string | null
  linkedinUrl: string
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

  const [selectedApp, setSelectedApp] = useState<CandidateApplication | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/employment?status=${statusFilter}`)
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
  }, [statusFilter])

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
      setActionMsg({ type: 'error', text: err.message || 'Erreur lors de l\'acceptation.' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (appId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir refuser cette candidature ?')) return
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
      setActionMsg({ type: 'error', text: err.message || 'Erreur lors du refus.' })
    } finally {
      setActionLoading(null)
    }
  }

  const filteredApps = applications.filter((app) => {
    const query = searchQuery.toLowerCase()
    const matchName = app.fullName.toLowerCase().includes(query)
    const matchEmail = app.email.toLowerCase().includes(query)
    const matchCin = app.cin.toLowerCase().includes(query)
    const matchSkills = app.skills.toLowerCase().includes(query)
    return matchName || matchEmail || matchCin || matchSkills
  })

  return (
    <div className="space-y-6">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-6 h-6" />
            </span>
            Candidatures & Contrats Développeurs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gérez les demandes d'embauche, examinez les compétences et générez les accords de rémunération par projet.
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {actionMsg && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold flex items-center justify-between ${
            actionMsg.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
          }`}
        >
          <span>{actionMsg.text}</span>
          <button onClick={() => setActionMsg(null)} className="text-xs underline opacity-80 hover:opacity-100">
            Fermer
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, email, CIN, skills..."
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 overflow-x-auto w-full sm:w-auto">
          {[
            { key: 'ALL', label: 'Tous' },
            { key: 'PENDING', label: 'En attente' },
            { key: 'ACCEPTED', label: 'Acceptés' },
            { key: 'REJECTED', label: 'Refusés' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.key
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates List Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Chargement des candidatures...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8">
          <User className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Aucune candidature trouvée</h3>
          <p className="text-sm text-slate-400">Aucune demande d'emploi ne correspond à vos critères actuels.</p>
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

            return (
              <div
                key={app.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top info & Status Pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {app.photoUrl ? (
                        <img
                          src={app.photoUrl}
                          alt={app.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-lg">
                          {app.fullName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-white line-clamp-1">{app.fullName}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-cyan-400" /> CIN: {app.cin}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
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
                      <span>Revenue Share: {app.revenueShare}% per project</span>
                    </p>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-2 text-xs">
                    {app.githubUrl && (
                      <a
                        href={app.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="GitHub Profile"
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
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {app.portfolioUrl && (
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Portfolio Site"
                      >
                        <Globe className="w-4 h-4" />
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
                    {parsedSkills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-lg bg-slate-800/90 text-slate-300 text-[11px] font-mono border border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                    {parsedSkills.length > 5 && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800/60 text-slate-400 text-[11px] font-mono">
                        +{parsedSkills.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> Détails
                  </button>

                  <div className="flex items-center gap-2">
                    {app.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleReject(app.id)}
                          disabled={actionLoading === app.id}
                          className="px-3 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                        >
                          Refuser
                        </button>
                        <button
                          onClick={() => handleAccept(app.id)}
                          disabled={actionLoading === app.id}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === app.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          Accepter & Contrat
                        </button>
                      </>
                    )}

                    {app.status === 'ACCEPTED' && app.agreementPdfUrl && (
                      <a
                        href={app.agreementPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/50 border border-emerald-700/50 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/50 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" /> Contrat PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Candidate Details Drawer Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                {selectedApp.photoUrl ? (
                  <img
                    src={selectedApp.photoUrl}
                    alt={selectedApp.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xl">
                    {selectedApp.fullName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedApp.fullName}</h2>
                  <p className="text-xs text-slate-400">Postulé le : {new Date(selectedApp.createdAt).toLocaleDateString('fr-FR')}</p>
                  <span
                    className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      selectedApp.status === 'ACCEPTED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : selectedApp.status === 'REJECTED'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {selectedApp.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Modal Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-500 uppercase font-semibold block">Coordonnées</span>
                <p className="text-slate-200"><strong>Email:</strong> {selectedApp.email}</p>
                <p className="text-slate-200"><strong>Téléphone:</strong> {selectedApp.phone}</p>
                <p className="text-slate-200"><strong>CIN:</strong> {selectedApp.cin}</p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-500 uppercase font-semibold block">Conditions d'embauche</span>
                <p className="text-cyan-400 font-bold text-base">Revenue Share: {selectedApp.revenueShare}% per project</p>
                <p className="text-slate-400 text-xs">Payment condition: Post client full payment</p>
                <p className="text-slate-400 text-xs">Ownership: 100% FirstStep</p>
              </div>
            </div>

            {/* Social & Files */}
            <div className="space-y-3">
              <span className="text-xs text-slate-500 uppercase font-semibold block">Liens & Fichiers</span>
              <div className="flex flex-wrap gap-3">
                <a
                  href={selectedApp.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-cyan-950/50 border border-cyan-800/50 text-cyan-300 text-xs font-semibold inline-flex items-center gap-2 hover:bg-cyan-900/50"
                >
                  <Download className="w-4 h-4" /> Curriculum Vitae (PDF)
                </a>
                {selectedApp.githubUrl && (
                  <a
                    href={selectedApp.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-2 hover:bg-slate-700"
                  >
                    <Github className="w-4 h-4" /> GitHub Profile
                  </a>
                )}
                {selectedApp.linkedinUrl && (
                  <a
                    href={selectedApp.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-2 hover:bg-slate-700"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn Profile
                  </a>
                )}
                {selectedApp.portfolioUrl && (
                  <a
                    href={selectedApp.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-2 hover:bg-slate-700"
                  >
                    <Globe className="w-4 h-4" /> Portfolio Site
                  </a>
                )}
              </div>
            </div>

            {/* Skills Tags */}
            <div className="space-y-3">
              <span className="text-xs text-slate-500 uppercase font-semibold block">Compétences Déclarées</span>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  try {
                    return JSON.parse(selectedApp.skills).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-xl bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700"
                      >
                        {skill}
                      </span>
                    ))
                  } catch {
                    return null
                  }
                })()}
              </div>
            </div>

            {/* Agreement Actions in Modal */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Fermer
              </button>

              {selectedApp.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    disabled={actionLoading === selectedApp.id}
                    className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold text-xs cursor-pointer disabled:opacity-50"
                  >
                    Refuser
                  </button>
                  <button
                    onClick={() => handleAccept(selectedApp.id)}
                    disabled={actionLoading === selectedApp.id}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {actionLoading === selectedApp.id && <Loader2 className="w-4 h-4 animate-spin" />}
                    Accepter & Générer Contrat PDF
                  </button>
                </>
              )}

              {selectedApp.status === 'ACCEPTED' && selectedApp.agreementPdfUrl && (
                <a
                  href={selectedApp.agreementPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Télécharger Contrat Généré (PDF)
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
