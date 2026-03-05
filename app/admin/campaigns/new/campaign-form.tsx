'use client'

import { useActionState, useState, useTransition } from 'react'
import { createCampaign, updateCampaign } from '@/app/actions/campaigns'
import { generateEmailContent, improveEmailPrompt } from '@/app/actions/ai'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { Save, Sparkles, ChevronDown, ChevronUp, Eye, Copy, Check, FileCode2, Mail } from 'lucide-react'

// Define the state type based on the action's return type
type State = {
    message: string
}

const initialState: State = {
    message: '',
}

export function CampaignForm({ initialData }: { initialData?: any }) {
    // If initialData is present, we bind the id to the update action
    const action = initialData
        ? updateCampaign.bind(null, initialData.id)
        : createCampaign

    const [state, formAction, isPending] = useActionState(action, initialState)
    const [content, setContent] = useState(initialData?.content || '')
    const [attachments, setAttachments] = useState<Array<{ name: string, url: string }>>(
        initialData?.attachments ? JSON.parse(initialData.attachments) : []
    )
    const [uploading, setUploading] = useState(false)
    const [aiPrompt, setAiPrompt] = useState('')
    const [aiOpen, setAiOpen] = useState(false)
    const [aiError, setAiError] = useState('')
    const [isGenerating, startGenerating] = useTransition()
    const [isImproving, startImproving] = useTransition()
    const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code')
    const [copied, setCopied] = useState(false)
    const [subjectValue, setSubjectValue] = useState(initialData?.subject || '')

    function handleCopy() {
        if (!content) return
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    function handleImprove() {
        if (!aiPrompt.trim()) return
        setAiError('')
        startImproving(async () => {
            const result = await improveEmailPrompt(aiPrompt, subjectValue)
            if (result.error) {
                setAiError(result.error)
            } else if (result.improvedPrompt) {
                setAiPrompt(result.improvedPrompt)
            }
        })
    }

    function handleGenerate() {
        if (!aiPrompt.trim()) return
        setAiError('')
        startGenerating(async () => {
            const result = await generateEmailContent(aiPrompt, subjectValue)
            if (result.error) {
                setAiError(result.error)
            } else if (result.content) {
                setContent(result.content)
                if (result.subject) {
                    setSubjectValue(result.subject)
                }
                setAiOpen(false)
                setActiveTab('preview')
            }
        })
    }

    // Format date for datetime-local input (YYYY-MM-DDThh:mm)
    const formattedScheduledAt = initialData?.scheduledAt
        ? new Date(initialData.scheduledAt).toISOString().slice(0, 16)
        : ''

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()
            if (data.success) {
                setAttachments([...attachments, { name: data.filename || file.name, url: data.url }])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setUploading(false)
            if (e.target) e.target.value = ''
        }
    }

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="testRecipient" id="testRecipient" />

            <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Subject
                </label>
                <Input
                    id="subject"
                    name="subject"
                    value={subjectValue}
                    onChange={e => setSubjectValue(e.target.value)}
                    placeholder="e.g., Important update regarding your service"
                    required
                />
            </div>

            {/* ── AI Generator ── */}
            <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 overflow-hidden">
                <button
                    type="button"
                    onClick={() => setAiOpen(o => !o)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                    <Sparkles className="h-4 w-4" />
                    Générer le contenu avec l&apos;IA
                    {aiOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
                </button>
                {aiOpen && (
                    <div className="px-4 pb-4 space-y-3 border-t border-indigo-200">
                        <p className="text-xs text-indigo-600 pt-3">
                            Décrivez le contenu souhaité — l&apos;IA génèrera le corps HTML de l&apos;email.
                        </p>
                        <textarea
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            placeholder="Ex: Email de promotion pour notre nouvelle offre cabinet médical, ton professionnel et chaleureux, inclure un CTA pour prendre rendez-vous."
                            rows={3}
                            className="w-full rounded-md border border-indigo-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={handleImprove}
                                disabled={isImproving || isGenerating || !aiPrompt.trim()}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Sparkles className={`h-3 w-3 ${isImproving ? 'animate-pulse' : ''}`} />
                                {isImproving ? 'Amélioration...' : 'Améliorer le prompt'}
                            </button>
                            <span className="text-xs text-gray-400">ou</span>
                            <Button
                                type="button"
                                onClick={handleGenerate}
                                disabled={isGenerating || isImproving || !aiPrompt.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Sparkles className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                                {isGenerating ? 'Génération en cours...' : 'Générer l\'email'}
                            </Button>
                        </div>
                        {aiError && <p className="text-xs text-red-600">{aiError}</p>}
                        <p className="text-xs text-gray-400">⚠️ Le contenu existant sera remplacé.</p>
                    </div>
                )}
            </div>

            {/* ── Email Content Editor (IDE-style) ── */}
            <div className="overflow-hidden rounded-xl border border-gray-800 shadow-xl">

                {/* ── Tab bar ── */}
                <div className="flex items-center bg-[#1e2433] border-b border-gray-800/80">
                    <div className="flex">
                        <button
                            type="button"
                            onClick={() => setActiveTab('code')}
                            className={`flex items-center gap-2 px-5 py-3 text-xs font-medium border-r border-gray-800/60 transition-all ${
                                activeTab === 'code'
                                    ? 'bg-[#0d1117] text-white border-t-2 border-t-indigo-500'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border-t-2 border-t-transparent'
                            }`}
                        >
                            <FileCode2 className="h-3.5 w-3.5" />
                            email.html
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('preview')}
                            className={`flex items-center gap-2 px-5 py-3 text-xs font-medium border-r border-gray-800/60 transition-all ${
                                activeTab === 'preview'
                                    ? 'bg-[#050914] text-white border-t-2 border-t-indigo-500'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border-t-2 border-t-transparent'
                            }`}
                        >
                            <Eye className="h-3.5 w-3.5" />
                            Aperçu
                            {content && (
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                            )}
                        </button>
                    </div>

                    {/* Right controls */}
                    <div className="ml-auto flex items-center gap-2 px-4">
                        {content && (
                            <span className="hidden sm:block text-[10px] font-mono text-gray-600">
                                {content.split('\n').length} lignes &middot; {content.length} car.
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={handleCopy}
                            disabled={!content}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-gray-400 hover:text-white hover:bg-gray-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            {copied
                                ? <><Check className="h-3 w-3 text-green-400" /><span className="text-green-400 ml-1">Copié</span></>
                                : <><Copy className="h-3 w-3" /><span className="ml-1">Copier</span></>
                            }
                        </button>
                    </div>
                </div>

                {/* ── Code editor ── */}
                {activeTab === 'code' ? (
                    <div className="flex flex-col bg-[#0d1117]">
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder={`<!-- Collez ou écrivez votre HTML ici -->\n<!-- Ou utilisez le générateur IA ci-dessus -->`}
                            spellCheck={false}
                            className="w-full bg-transparent text-[#c9d1d9] font-mono text-[13px] leading-6 px-6 py-5 focus:outline-none resize-none placeholder:text-gray-700"
                            style={{ minHeight: 520, tabSize: 2 }}
                        />
                        {/* Status bar */}
                        <div className="flex items-center justify-between px-6 py-1.5 bg-indigo-950/40 border-t border-gray-800/60 text-[10px] font-mono text-gray-600">
                            <div className="flex items-center gap-4">
                                <span className="text-indigo-400 font-semibold">HTML</span>
                                <span>UTF-8</span>
                            </div>
                            <div className="flex items-center gap-4">
                                {content && <span>{content.split('\n').length} lignes, {content.length} caractères</span>}
                                <span>FirstStep Email Editor</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── Preview: email client chrome ── */
                    <div className="bg-gray-100">
                        {/* Mock email client toolbar */}
                        <div className="bg-white border-b border-gray-200">
                            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100">
                                <div className="flex gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                                    <div className="h-3 w-3 rounded-full bg-green-400/80" />
                                </div>
                                <div className="flex-1 mx-3 bg-gray-100 rounded px-3 py-1 text-[11px] text-gray-400 font-mono">
                                    Nouveau message — aperçu
                                </div>
                                <Mail className="h-4 w-4 text-gray-300 shrink-0" />
                            </div>
                            {/* Email meta header */}
                            <div className="px-6 py-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-md">
                                        FS
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-baseline gap-2">
                                            <span className="text-sm font-semibold text-gray-900">FirstStep</span>
                                            <span className="text-xs text-gray-400">&lt;contact@firststepco.com&gt;</span>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            À : <span className="text-gray-600">{'{{companyName}}'}</span>
                                            {' · '}
                                            {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 pt-3">
                                    {subjectValue
                                        ? <h2 className="text-xl font-semibold text-gray-900 leading-snug">{subjectValue}</h2>
                                        : <h2 className="text-xl text-gray-300 font-normal italic leading-snug">(Aucun objet)</h2>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Email body */}
                        {content ? (
                            <iframe
                                srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:0;}</style></head><body>${content}</body></html>`}
                                className="w-full border-0 block"
                                style={{ minHeight: 560, background: '#050914' }}
                                sandbox="allow-same-origin"
                                title="Email preview"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Eye className="h-7 w-7 text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-500">Aucun contenu à afficher</p>
                                <p className="text-xs text-gray-400">Générez ou écrivez du HTML dans l&apos;onglet <strong>email.html</strong>.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <input type="hidden" name="content" value={content} />

            {/* ── Variables ── */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Variables disponibles</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                        { variable: '{{email}}', label: 'Email du destinataire' },
                        { variable: '{{companyName}}', label: "Nom de l'entreprise" },
                        { variable: '{{name}}', label: 'Nom (alias)' },
                        { variable: '{{registrationDate}}', label: "Date d'inscription" },
                    ].map(({ variable, label }) => (
                        <button
                            key={variable}
                            type="button"
                            onClick={() => { setContent((c: string) => c + variable); setActiveTab('code') }}
                            className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left group"
                        >
                            <code className="text-xs font-mono text-indigo-600 group-hover:text-indigo-700 shrink-0">{variable}</code>
                            <span className="text-xs text-gray-500 truncate">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Attachments</label>
                <div className="flex items-center gap-2">
                    <Input type="file" onChange={handleFileChange} disabled={uploading} className="max-w-75" />
                    {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                </div>
                {attachments.length > 0 && (
                    <ul className="space-y-1 mt-2">
                        {attachments.map((file, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                                <span className="truncate flex-1">{file.name}</span>
                                <button type="button" onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">Remove</button>
                            </li>
                        ))}
                    </ul>
                )}
                <input type="hidden" name="attachments" value={JSON.stringify(attachments)} />
            </div>

            <div className="space-y-2">
                <label htmlFor="scheduledAt" className="text-sm font-medium">Schedule for (Optional)</label>
                <Input
                    type="datetime-local"
                    name="scheduledAt"
                    id="scheduledAt"
                    className="max-w-75"
                    defaultValue={formattedScheduledAt}
                />
                <p className="text-xs text-gray-500">Leave blank to send immediately / save as draft.</p>
            </div>

            {state?.message && state.message !== 'Unauthorized' && (
                <div aria-live="polite" className="text-sm font-medium text-destructive">
                    {state.message}
                </div>
            )}

            <div className="flex justify-end gap-3">
                <Button
                    type="submit"
                    name="action"
                    value="test"
                    variant="outline"
                    onClick={(e) => {
                        const email = prompt('Enter test email address:');
                        if (!email) {
                            e.preventDefault();
                            return;
                        }
                        const input = document.getElementById('testRecipient') as HTMLInputElement;
                        if (input) input.value = email;
                    }}
                >
                    Send Test
                </Button>
                <Link href="/admin/campaigns">
                    <Button variant="ghost" type="button">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {isPending ? 'Saving...' : (initialData ? 'Update Campaign' : 'Save Draft')}
                </Button>
            </div>
        </form>
    )
}
