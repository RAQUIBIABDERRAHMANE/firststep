'use client'

import { useState, useTransition } from 'react'
import {
    Plus,
    Megaphone,
    Pin,
    Eye,
    EyeOff,
    Edit2,
    Trash2,
    Search,
    Sparkles,
    Calendar,
    ExternalLink,
    CheckCircle2,
    X,
    Loader2,
    ArrowRight,
    AlertCircle,
    Wand2,
    Bot
} from 'lucide-react'
import {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementPublish,
    toggleAnnouncementPin,
    generateAnnouncementWithAI
} from '@/app/actions/announcements'

interface Announcement {
    id: string
    title: string
    content: string
    badge: string | null
    badgeColor: string | null
    linkUrl: string | null
    linkLabel: string | null
    isPublished: boolean
    isPinned: boolean
    publishedAt: Date | string
    createdAt: Date | string
    updatedAt: Date | string
}

interface AdminAnnouncementsClientProps {
    initialAnnouncements: Announcement[]
}

const BADGE_COLORS: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
    blue: { label: 'Bleu', bg: 'bg-blue-50', text: 'text-[#0066FF]', border: 'border-blue-200/70', dot: 'bg-[#0066FF]' },
    emerald: { label: 'Émeraude', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/70', dot: 'bg-emerald-500' },
    amber: { label: 'Ambre', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/70', dot: 'bg-amber-500' },
    purple: { label: 'Violet', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200/70', dot: 'bg-purple-500' },
    rose: { label: 'Rose', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/70', dot: 'bg-rose-500' },
    cyan: { label: 'Cyan', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200/70', dot: 'bg-cyan-500' },
}

const AI_PRESET_IDEAS = [
    '🔥 Promo Spéciale -30% sur tous les modules SaaS',
    '🍽️ Lancement du nouveau module Restaurant avec menus QR',
    '📊 Nouvelle mise à jour des statistiques financières en direct',
    '🚀 Offre de bienvenue : 1 mois offert pour les nouvelles entreprises',
    '💼 Nouveau générateur de contrats RH et suivi des candidats',
]

export default function AdminAnnouncementsClient({ initialAnnouncements }: AdminAnnouncementsClientProps) {
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'PINNED'>('ALL')
    
    // Modal states
    const [modalOpen, setModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Announcement | null>(null)
    const [deleteModalId, setDeleteModalId] = useState<string | null>(null)
    
    // Form states
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [badge, setBadge] = useState('Nouveau')
    const [badgeColor, setBadgeColor] = useState('blue')
    const [linkUrl, setLinkUrl] = useState('')
    const [linkLabel, setLinkLabel] = useState('')
    const [isPublished, setIsPublished] = useState(true)
    const [isPinned, setIsPinned] = useState(false)
    
    // AI Generation states
    const [aiPrompt, setAiPrompt] = useState('')
    const [isGeneratingAI, setIsGeneratingAI] = useState(false)
    const [aiError, setAiError] = useState<string | null>(null)

    const [isPending, startTransition] = useTransition()
    const [formError, setFormError] = useState<string | null>(null)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const openCreateModal = () => {
        setEditingItem(null)
        setTitle('')
        setContent('')
        setBadge('Nouveau')
        setBadgeColor('blue')
        setLinkUrl('')
        setLinkLabel('')
        setIsPublished(true)
        setIsPinned(false)
        setAiPrompt('')
        setAiError(null)
        setFormError(null)
        setModalOpen(true)
    }

    const openEditModal = (item: Announcement) => {
        setEditingItem(item)
        setTitle(item.title)
        setContent(item.content)
        setBadge(item.badge || 'Nouveau')
        setBadgeColor(item.badgeColor || 'blue')
        setLinkUrl(item.linkUrl || '')
        setLinkLabel(item.linkLabel || '')
        setIsPublished(item.isPublished)
        setIsPinned(item.isPinned)
        setAiPrompt('')
        setAiError(null)
        setFormError(null)
        setModalOpen(true)
    }

    const handleAIGenerate = async (customIdea?: string) => {
        const idea = (customIdea || aiPrompt).trim()
        if (!idea) {
            setAiError('Veuillez renseigner une idée ou choisir une suggestion ci-dessous.')
            return
        }

        setAiError(null)
        setIsGeneratingAI(true)

        try {
            const res = await generateAnnouncementWithAI(idea)
            if (res.error) {
                setAiError(res.error)
            } else if (res.data) {
                setTitle(res.data.title)
                setContent(res.data.content)
                setBadge(res.data.badge)
                setBadgeColor(res.data.badgeColor)
                setLinkUrl(res.data.linkUrl)
                setLinkLabel(res.data.linkLabel)
                showToast('✨ Contenu généré par l\'IA avec succès !')
            }
        } catch (err: any) {
            setAiError(err?.message || 'Erreur lors de la génération avec l\'IA.')
        } finally {
            setIsGeneratingAI(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)

        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        formData.append('badge', badge)
        formData.append('badgeColor', badgeColor)
        formData.append('linkUrl', linkUrl)
        formData.append('linkLabel', linkLabel)
        formData.append('isPublished', isPublished ? 'true' : 'false')
        formData.append('isPinned', isPinned ? 'true' : 'false')

        startTransition(async () => {
            if (editingItem) {
                const res = await updateAnnouncement(editingItem.id, formData)
                if (res.error) {
                    setFormError(res.error)
                } else if (res.announcement) {
                    setAnnouncements(prev => prev.map(a => a.id === editingItem.id ? (res.announcement as Announcement) : a))
                    setModalOpen(false)
                    showToast('Annonce mise à jour avec succès')
                }
            } else {
                const res = await createAnnouncement(formData)
                if (res.error) {
                    setFormError(res.error)
                } else if (res.announcement) {
                    setAnnouncements(prev => [res.announcement as Announcement, ...prev])
                    setModalOpen(false)
                    showToast('Nouvelle annonce créée avec succès')
                }
            }
        })
    }

    const handleTogglePublish = (id: string) => {
        startTransition(async () => {
            const res = await toggleAnnouncementPublish(id)
            if (res.success && res.isPublished !== undefined) {
                setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isPublished: res.isPublished! } : a))
                showToast(res.isPublished ? 'Annonce publiée' : 'Annonce masquée (brouillon)')
            }
        })
    }

    const handleTogglePin = (id: string) => {
        startTransition(async () => {
            const res = await toggleAnnouncementPin(id)
            if (res.success && res.isPinned !== undefined) {
                setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isPinned: res.isPinned! } : a))
                showToast(res.isPinned ? 'Annonce épinglée en tête' : 'Annonce désépinglée')
            }
        })
    }

    const handleDelete = (id: string) => {
        startTransition(async () => {
            const res = await deleteAnnouncement(id)
            if (res.success) {
                setAnnouncements(prev => prev.filter(a => a.id !== id))
                setDeleteModalId(null)
                showToast('Annonce supprimée définitivement')
            }
        })
    }

    // Filter announcements
    const filteredAnnouncements = announcements.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.content.toLowerCase().includes(search.toLowerCase()) ||
            (a.badge && a.badge.toLowerCase().includes(search.toLowerCase()))
        
        if (!matchesSearch) return false
        if (filter === 'PUBLISHED') return a.isPublished
        if (filter === 'DRAFT') return !a.isPublished
        if (filter === 'PINNED') return a.isPinned
        return true
    })

    const selectedColorConf = BADGE_COLORS[badgeColor] || BADGE_COLORS.blue

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-xs font-bold flex items-center gap-1">
                            <Megaphone className="w-3 h-3" /> Communication & Mises à Jour
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            {announcements.length} annonce{announcements.length > 1 ? 's' : ''} au total
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                        Annonces & Nouveautés Landing Page
                    </h1>
                    <p className="text-sm text-slate-500 max-w-xl">
                        Générez avec l&apos;IA et publiez des messages et nouveautés directement sur la barre e-commerce et la page d&apos;accueil.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Créer avec l&apos;IA</span>
                    </button>
                </div>
            </div>

            {/* Controls Bar: Search & Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Rechercher par titre, contenu..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {[
                        { key: 'ALL', label: 'Toutes' },
                        { key: 'PUBLISHED', label: 'Publiées' },
                        { key: 'DRAFT', label: 'Brouillons' },
                        { key: 'PINNED', label: 'Épinglées' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key as any)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                filter === tab.key
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Announcements Grid */}
            {filteredAnnouncements.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-12 text-center space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Megaphone className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">Aucune annonce trouvée</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Utilisez l&apos;assistant IA pour générer instantanément vos annonces e-commerce.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Créer avec l&apos;IA</span>
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAnnouncements.map(item => {
                        const colorConf = BADGE_COLORS[item.badgeColor || 'blue'] || BADGE_COLORS.blue
                        return (
                            <div
                                key={item.id}
                                className={`bg-white rounded-3xl border transition-all duration-200 p-6 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md ${
                                    item.isPinned
                                        ? 'border-cyan-500/50 ring-2 ring-cyan-500/10'
                                        : 'border-slate-200/80'
                                }`}
                            >
                                <div className="space-y-4">
                                    {/* Card Header with Badges & Pin */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {item.badge && (
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border flex items-center gap-1.5 ${colorConf.bg} ${colorConf.text} ${colorConf.border}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${colorConf.dot}`} />
                                                    {item.badge}
                                                </span>
                                            )}

                                            {item.isPinned && (
                                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-bold flex items-center gap-1">
                                                    <Pin className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Épinglé
                                                </span>
                                            )}

                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                item.isPublished
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                            }`}>
                                                {item.isPublished ? 'En ligne' : 'Brouillon'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleTogglePin(item.id)}
                                                title={item.isPinned ? 'Désépingler' : 'Épingler en tête'}
                                                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                                                    item.isPinned
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                                }`}
                                            >
                                                <Pin className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleTogglePublish(item.id)}
                                                title={item.isPublished ? 'Masquer (passer en brouillon)' : 'Publier sur le site'}
                                                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                                                    item.isPublished
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                                }`}
                                            >
                                                {item.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Title & Body */}
                                    <div className="space-y-1.5">
                                        <h3 className="font-bold text-slate-900 text-base leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                                            {item.content}
                                        </p>
                                    </div>

                                    {/* Optional Link Indicator */}
                                    {item.linkUrl && (
                                        <div className="pt-1">
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-600 hover:underline">
                                                {item.linkLabel || 'En savoir plus'}
                                                <ExternalLink className="w-3 h-3" />
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Date & Edit/Delete Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                                    <span className="text-[11px] text-slate-400 font-mono">
                                        {new Date(item.publishedAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="p-1.5 rounded-xl text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors cursor-pointer"
                                            title="Modifier"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteModalId(item.id)}
                                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Create / Edit Modal with AI Copilot & Live Preview */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="space-y-0.5">
                                <h3 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-cyan-600" />
                                    {editingItem ? 'Modifier l\'Annonce' : 'Créer une Annonce avec l\'IA'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Utilisez l&apos;IA pour générer le titre et le texte ou remplissez les champs manuellement.
                                </p>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* ── AI GENERATOR BOX ── */}
                        <div className="p-4 bg-gradient-to-br from-cyan-50/70 via-blue-50/50 to-indigo-50/60 rounded-3xl border border-cyan-200/80 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow-xs">
                                        <Wand2 className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-900">Assistant IA FirstStep</span>
                                </div>
                                <span className="text-[10px] text-cyan-800 font-semibold bg-cyan-100/80 px-2 py-0.5 rounded-full border border-cyan-200">
                                    Modèle LLaMA 3.3
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Ex: Réduction 30% pour l'Aïd sur le module Restaurant..."
                                    value={aiPrompt}
                                    onChange={e => setAiPrompt(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAIGenerate()
                                        }
                                    }}
                                    className="flex-1 px-3.5 py-2 bg-white border border-cyan-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleAIGenerate()}
                                    disabled={isGeneratingAI}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-xs active:scale-95 disabled:opacity-60 cursor-pointer transition-all shrink-0"
                                >
                                    {isGeneratingAI ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                                            <span>Génération...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>Générer</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Preset Idea Chips */}
                            <div className="space-y-1.5 pt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Suggestions Rapides :</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {AI_PRESET_IDEAS.map((idea, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                                setAiPrompt(idea)
                                                handleAIGenerate(idea)
                                            }}
                                            disabled={isGeneratingAI}
                                            className="px-2.5 py-1 rounded-xl bg-white/90 hover:bg-white border border-cyan-200/70 hover:border-cyan-400 text-slate-700 text-[10.5px] font-medium transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 text-left truncate max-w-full"
                                        >
                                            {idea}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {aiError && (
                                <p className="text-[11px] text-rose-600 font-semibold pt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {aiError}
                                </p>
                            )}
                        </div>

                        {formError && (
                            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{formError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700">Titre de l&apos;annonce *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Nouveau module Restaurant avec menus QR dynamiques"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-semibold"
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700">Contenu / Description *</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Expliquez brièvement la nouveauté ou l'offre pour vos visiteurs..."
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all leading-relaxed"
                                />
                            </div>

                            {/* Badge Text & Color */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700">Texte du Badge</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Nouveau, Promo -30%, Mise à jour"
                                        value={badge}
                                        onChange={e => setBadge(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700">Couleur du Badge</label>
                                    <div className="flex items-center gap-2 pt-1">
                                        {Object.entries(BADGE_COLORS).map(([key, col]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setBadgeColor(key)}
                                                className={`h-7 w-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${col.bg} ${col.border} border ${
                                                    badgeColor === key ? 'ring-2 ring-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                                                }`}
                                                title={col.label}
                                            >
                                                <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Link URL & Label */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700">Lien CTA (Optionnel)</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: #signup, /services, https://..."
                                        value={linkUrl}
                                        onChange={e => setLinkUrl(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700">Libellé du Bouton (Optionnel)</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Découvrir, Profiter de l'offre"
                                        value={linkLabel}
                                        onChange={e => setLinkLabel(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Checkboxes: isPublished & isPinned */}
                            <div className="flex flex-wrap items-center gap-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isPublished}
                                        onChange={e => setIsPublished(e.target.checked)}
                                        className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                                    />
                                    <span>Publier immédiatement sur le site</span>
                                </label>

                                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isPinned}
                                        onChange={e => setIsPinned(e.target.checked)}
                                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                                    />
                                    <span>Épingler en première position</span>
                                </label>
                            </div>

                            {/* Live Card Preview Box */}
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aperçu en Direct</span>
                                <div className="p-5 rounded-3xl bg-slate-950 text-white border border-blue-500/20 shadow-md space-y-2.5">
                                    <div className="flex items-center gap-2">
                                        {badge && (
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${selectedColorConf.bg} ${selectedColorConf.text} ${selectedColorConf.border}`}>
                                                {badge}
                                            </span>
                                        )}
                                        {isPinned && (
                                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold flex items-center gap-1">
                                                <Pin className="w-2.5 h-2.5" /> Épinglé
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-200">
                                        <span className="font-bold text-white mr-1">{title || 'Titre de l\'annonce...'}</span>
                                        <span className="text-slate-400">— {content || 'Contenu détaillé de l\'annonce...'}</span>
                                        {linkUrl && (
                                            <span className="inline-flex items-center gap-1 text-[#0066FF] font-bold ml-1.5 underline">
                                                {linkLabel || 'Découvrir'} <ArrowRight className="w-3 h-3" />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit and Cancel Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md disabled:opacity-60 cursor-pointer transition-all"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Enregistrement...</span>
                                        </>
                                    ) : (
                                        <span>{editingItem ? 'Enregistrer les modifications' : 'Créer l\'annonce'}</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalId && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-slate-900">Supprimer cette annonce ?</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Cette action retirera définitivement l&apos;annonce du bandeau et de la base de données.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setDeleteModalId(null)}
                                className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModalId)}
                                disabled={isPending}
                                className="px-5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
                            >
                                {isPending ? 'Suppression...' : 'Supprimer définitivement'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
