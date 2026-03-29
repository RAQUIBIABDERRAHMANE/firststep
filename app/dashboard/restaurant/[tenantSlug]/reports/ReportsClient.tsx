'use client'

import React, { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
    FileText,
    Download,
    Mail,
    Trash2,
    Plus,
    BarChart3,
    Calendar,
    TrendingUp,
    ShoppingBag,
    ChevronDown,
    Globe,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Clock,
} from 'lucide-react'
import { generateMonthlyReport, resendReportEmail, downloadReportPdf, deleteReport } from '@/app/actions/restaurant'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getMonthLabel(month: number, lang: string) {
    return lang === 'fr' ? MONTHS_FR[month - 1] : MONTHS_EN[month - 1]
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'SENT':
            return <Badge className="gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 rounded-full px-3 py-1 text-xs font-bold"><CheckCircle2 size={11} />Envoyé</Badge>
        case 'SENDING':
        case 'GENERATING':
            return <Badge className="gap-1.5 bg-blue-50 text-blue-600 border-blue-200 rounded-full px-3 py-1 text-xs font-bold"><Loader2 size={11} className="animate-spin" />Envoi en cours</Badge>
        case 'GENERATED':
            return <Badge className="gap-1.5 bg-amber-50 text-amber-700 border-amber-200 rounded-full px-3 py-1 text-xs font-bold"><Clock size={11} />Généré</Badge>
        case 'FAILED':
            return <Badge className="gap-1.5 bg-red-50 text-red-600 border-red-200 rounded-full px-3 py-1 text-xs font-bold"><AlertCircle size={11} />Échec</Badge>
        default:
            return <Badge variant="outline" className="text-xs rounded-full px-3">{status}</Badge>
    }
}

type Report = {
    id: string
    month: number
    year: number
    status: string
    language: string
    data: string
    createdAt: Date
}

type Props = {
    initialReports: Report[]
    tenantSlug: string
    restaurantName: string
    userEmail: string
}

export default function ReportsClient({ initialReports, tenantSlug, restaurantName, userEmail }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    // Generate form state
    const now = new Date()
    const [genMonth, setGenMonth] = useState(now.getMonth() + 1)
    const [genYear, setGenYear] = useState(now.getFullYear())
    const [genLang, setGenLang] = useState<'fr' | 'en'>('fr')
    const [showForm, setShowForm] = useState(false)

    const years = Array.from({ length: 3 }, (_, i) => now.getFullYear() - i)

    const handleGenerate = () => {
        startTransition(async () => {
            const toastId = toast.loading(genLang === 'fr' ? 'Génération du rapport en cours…' : 'Generating report…')
            const result = await generateMonthlyReport(genMonth, genYear, genLang, tenantSlug)
            if ('error' in result) {
                toast.error(result.error, { id: toastId })
            } else {
                toast.success(
                    genLang === 'fr'
                        ? `✅ Rapport ${MONTHS_FR[genMonth - 1]} ${genYear} généré et envoyé à ${userEmail}`
                        : `✅ Report ${MONTHS_EN[genMonth - 1]} ${genYear} generated and sent to ${userEmail}`,
                    { id: toastId, duration: 5000 }
                )
                setShowForm(false)
                router.refresh()
            }
        })
    }

    const handleDownload = async (report: Report) => {
        setLoadingId(`dl-${report.id}`)
        const result = await downloadReportPdf(report.id, tenantSlug)
        setLoadingId(null)
        if ('error' in result) {
            toast.error(result.error)
            return
        }
        // Trigger browser download
        const link = document.createElement('a')
        link.href = `data:application/pdf;base64,${result.pdfBase64}`
        link.download = result.filename
        link.click()
        toast.success('PDF téléchargé !')
    }

    const handleResend = async (report: Report) => {
        setLoadingId(`resend-${report.id}`)
        const result = await resendReportEmail(report.id, tenantSlug)
        setLoadingId(null)
        if ('error' in result) {
            toast.error(result.error)
        } else {
            toast.success(`Email renvoyé à ${userEmail}`)
            router.refresh()
        }
    }

    const handleDelete = async (report: Report) => {
        if (!confirm('Supprimer ce rapport définitivement ?')) return
        setLoadingId(`del-${report.id}`)
        const result = await deleteReport(report.id, tenantSlug)
        setLoadingId(null)
        if ('error' in result) {
            toast.error(result.error)
        } else {
            toast.success('Rapport supprimé')
            router.refresh()
        }
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <BarChart3 className="text-violet-600" />
                        Rapports Mensuels
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Analyses automatiques de <span className="font-semibold text-foreground">{restaurantName}</span> — envoyées à <span className="font-semibold text-foreground">{userEmail}</span>
                    </p>
                </div>
                <Button
                    id="btn-new-report"
                    onClick={() => setShowForm(v => !v)}
                    className="gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/20 active:scale-95 transition-all"
                >
                    <Plus size={16} />
                    Nouveau rapport
                </Button>
            </div>

            {/* Generate Form */}
            {showForm && (
                <Card className="glass-card border-violet-200/60 shadow-xl shadow-violet-100/20 overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-blue-500" />
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <FileText size={18} className="text-violet-600" />
                            Générer un Rapport
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            {/* Month */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                    <Calendar size={11} /> Mois
                                </label>
                                <div className="relative">
                                    <select
                                        id="select-month"
                                        value={genMonth}
                                        onChange={e => setGenMonth(Number(e.target.value))}
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-colors"
                                    >
                                        {MONTHS_FR.map((m, i) => (
                                            <option key={i} value={i + 1}>{m} / {MONTHS_EN[i]}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            {/* Year */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                    <Calendar size={11} /> Année
                                </label>
                                <div className="relative">
                                    <select
                                        id="select-year"
                                        value={genYear}
                                        onChange={e => setGenYear(Number(e.target.value))}
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-colors"
                                    >
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            {/* Language */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                    <Globe size={11} /> Langue du rapport
                                </label>
                                <div className="flex gap-2">
                                    {(['fr', 'en'] as const).map(lang => (
                                        <button
                                            key={lang}
                                            id={`btn-lang-${lang}`}
                                            type="button"
                                            onClick={() => setGenLang(lang)}
                                            className={cn(
                                                'flex-1 py-3 rounded-xl text-sm font-bold border transition-all',
                                                genLang === lang
                                                    ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/20'
                                                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-violet-300 hover:text-violet-600'
                                            )}
                                        >
                                            {lang === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                            <Button
                                id="btn-generate-confirm"
                                onClick={handleGenerate}
                                disabled={isPending}
                                className="bg-violet-600 hover:bg-violet-700 rounded-xl gap-2 shadow-md shadow-violet-500/20 active:scale-95 transition-all"
                            >
                                {isPending ? <Loader2 size={14} className="animate-spin" /> : <BarChart3 size={14} />}
                                {isPending ? 'Génération…' : `Générer — ${getMonthLabel(genMonth, genLang)} ${genYear}`}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setShowForm(false)}
                                className="text-slate-400 rounded-xl"
                                disabled={isPending}
                            >
                                Annuler
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Reports List */}
            {initialReports.length === 0 ? (
                <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center">
                    <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-sm mb-8">
                        <BarChart3 size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Aucun rapport</h3>
                    <p className="text-slate-500 max-w-sm leading-relaxed mb-6">
                        Les rapports mensuels sont générés automatiquement le 1er de chaque mois. Vous pouvez aussi en créer un manuellement.
                    </p>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-violet-600 hover:bg-violet-700 rounded-xl gap-2"
                    >
                        <Plus size={14} /> Créer mon premier rapport
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {initialReports.map((report) => {
                        const parsed = (() => { try { return JSON.parse(report.data) } catch { return null } })()
                        const isLoading = (k: string) => loadingId === `${k}-${report.id}`

                        return (
                            <Card key={report.id} className="glass-card shadow-none border-slate-200/60 overflow-hidden group hover:border-violet-200 transition-all">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-6">

                                        {/* Icon + period */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="h-14 w-14 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                                <FileText size={26} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-black text-lg tracking-tight flex items-center gap-2 flex-wrap">
                                                    {getMonthLabel(report.month, report.language)} {report.year}
                                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                                        {report.language === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                    {getStatusBadge(report.status)}
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {new Date(report.createdAt).toLocaleDateString(
                                                            report.language === 'fr' ? 'fr-FR' : 'en-US',
                                                            { day: 'numeric', month: 'long', year: 'numeric' }
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* KPIs */}
                                        {parsed && (
                                            <div className="hidden lg:flex items-center gap-6 shrink-0">
                                                <div className="text-center">
                                                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">CA</div>
                                                    <div className="text-lg font-black text-blue-600">{parsed.totalRevenue?.toFixed(0)} MAD</div>
                                                </div>
                                                <div className="h-8 w-px bg-slate-100" />
                                                <div className="text-center">
                                                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                                        <ShoppingBag size={9} /> Cmd.
                                                    </div>
                                                    <div className="text-lg font-black text-slate-700">{parsed.totalOrders}</div>
                                                </div>
                                                <div className="h-8 w-px bg-slate-100" />
                                                <div className="text-center">
                                                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                                        <TrendingUp size={9} /> Moy.
                                                    </div>
                                                    <div className="text-lg font-black text-emerald-600">{parsed.averageOrderValue?.toFixed(0)} MAD</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                id={`btn-download-${report.id}`}
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDownload(report)}
                                                disabled={isLoading('dl')}
                                                className="rounded-xl gap-1.5 text-xs font-bold border-slate-200 hover:border-violet-400 hover:text-violet-600 transition-colors"
                                                title="Télécharger le PDF"
                                            >
                                                {isLoading('dl') ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                                                PDF
                                            </Button>
                                            <Button
                                                id={`btn-resend-${report.id}`}
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleResend(report)}
                                                disabled={isLoading('resend')}
                                                className="rounded-xl gap-1.5 text-xs font-bold border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                title="Renvoyer par email"
                                            >
                                                {isLoading('resend') ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
                                                Email
                                            </Button>
                                            <Button
                                                id={`btn-delete-${report.id}`}
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(report)}
                                                disabled={isLoading('del')}
                                                className="rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                title="Supprimer"
                                            >
                                                {isLoading('del') ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={14} />}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Mobile KPIs */}
                                    {parsed && (
                                        <div className="flex lg:hidden items-center gap-4 px-6 pb-5 pt-0 border-t border-slate-100 mt-0">
                                            <div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">CA</div>
                                                <div className="text-base font-black text-blue-600">{parsed.totalRevenue?.toFixed(0)} MAD</div>
                                            </div>
                                            <div className="h-6 w-px bg-slate-100" />
                                            <div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Commandes</div>
                                                <div className="text-base font-black text-slate-700">{parsed.totalOrders}</div>
                                            </div>
                                            <div className="h-6 w-px bg-slate-100" />
                                            <div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Panier Moy.</div>
                                                <div className="text-base font-black text-emerald-600">{parsed.averageOrderValue?.toFixed(0)} MAD</div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Info box */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    <Calendar size={14} />
                </div>
                <div>
                    <p className="text-sm font-bold text-blue-900 mb-0.5">Génération automatique</p>
                    <p className="text-xs text-blue-600 leading-relaxed">
                        Les rapports sont générés et envoyés automatiquement le <strong>1er de chaque mois</strong> à 08h00 UTC pour le mois précédent. Ils sont envoyés à <strong>{userEmail}</strong> avec le PDF en pièce jointe.
                    </p>
                </div>
            </div>
        </div>
    )
}
