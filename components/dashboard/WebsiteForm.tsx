'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { upsertWebsite } from '@/app/actions/tenant'
import { generateWebsiteSuggestions } from '@/app/actions/ai'
import { useRouter } from 'next/navigation'
import { Sparkles, Wand2, Loader2, Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useEffect } from 'react'

interface WebsiteFormProps {
    initialData?: any
    serviceId: string
    serviceName?: string
    userEmail: string
}

export default function WebsiteForm({ initialData, serviceId, serviceName = 'professional service', userEmail }: WebsiteFormProps) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState(initialData?.designTemplate || 'classic')
    const [aiSuggestions, setAiSuggestions] = useState<any[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [siteName, setSiteName] = useState(initialData?.siteName || '')
    const [description, setDescription] = useState(initialData?.description || '')

    // Parse existing config if available
    const existingConfig = initialData?.config ? JSON.parse(initialData.config) : {}

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const highlightField = params.get('edit') || params.get('highlight')

        if (highlightField) {
            const element = document.getElementById(`field-${highlightField}`)
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    element.classList.add('ring-4', 'ring-primary/20', 'bg-primary/5', 'duration-1000')
                    setTimeout(() => {
                        element.classList.remove('ring-4', 'ring-primary/20', 'bg-primary/5')
                    }, 3000)
                }, 500)
            }
        }
    }, [])

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        setSuccess(null)

        // Validate slug client-side basics
        const slug = formData.get('slug') as string
        if (!/^[a-z0-9-]+$/.test(slug)) {
            setError('Slug can only contain lowercase letters, numbers, and hyphens')
            setLoading(false)
            return
        }

        const result = await upsertWebsite(formData)

        if (result.error) {
            setError(result.error)
        } else {
            setSuccess('Website saved successfully!')

            // Determine redirect path based on service type and slug
            const website = result.website
            const serviceSlug = website?.service?.slug
            const tenantSlug = website?.slug

            let redirectPath = '/dashboard'
            if (serviceSlug?.includes('restaurant')) {
                redirectPath = `/dashboard/restaurant/${tenantSlug}`
            } else if (serviceSlug?.includes('cabinet') || serviceSlug?.includes('professional')) {
                redirectPath = `/dashboard/cabinet/${tenantSlug}`
            }

            // Small delay to show success message before redirecting if it's a new creation or slug change
            if (!initialData?.slug || initialData.slug !== tenantSlug) {
                setTimeout(() => {
                    router.push(redirectPath)
                }, 1500)
            } else {
                router.refresh()
            }
        }
        setLoading(false)
    }

    async function handleAiMagic() {
        setIsGenerating(true)
        setError(null)
        // Pass current service name and inputs to AI to refine
        const result = await generateWebsiteSuggestions(serviceName, siteName || description)

        if (result.error) {
            setError(result.error)
        } else if (result.suggestions) {
            setAiSuggestions(result.suggestions)
        }
        setIsGenerating(false)
    }

    function applySuggestion(s: any) {
        setSiteName(s.siteName)
        setDescription(s.description)
        setAiSuggestions([]) // Clear suggestions after applying
        setSuccess('AI suggestions applied!')
        setTimeout(() => setSuccess(null), 3000)
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-4xl">
            <input type="hidden" name="serviceId" value={serviceId} />

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 animate-fade-in">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm border border-emerald-200 animate-fade-in">
                    {success}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Column: Core Info */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-lg font-semibold">Business Presence</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAiMagic}
                            disabled={isGenerating}
                            className="h-8 gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 group transition-all"
                        >
                            {isGenerating ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Sparkles className="h-3 w-3 text-primary group-hover:scale-125 transition-transform" />
                            )}
                            <span className="text-[10px] font-black uppercase tracking-widest">Magic Suggest</span>
                        </Button>
                    </div>

                    {aiSuggestions.length > 0 && (
                        <div className="bg-slate-900 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 border border-white/10 shadow-2xl">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Wand2 className="h-3 w-3 text-primary" /> AI Branding Ideas
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setAiSuggestions([])}
                                    className="text-[10px] font-bold text-slate-500 hover:text-white"
                                >
                                    Dismiss
                                </button>
                            </div>
                            <div className="grid gap-2">
                                {aiSuggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => applySuggestion(s)}
                                        className="group w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/50 transition-all space-y-1 relative"
                                    >
                                        <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">{s.siteName}</p>
                                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">{s.description}</p>
                                        <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                                <Check className="h-3 w-3 text-primary" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Website Address (Slug)</label>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground bg-muted/50 px-3 py-2 rounded-l-xl border border-r-0 text-sm">
                                /
                            </span>
                            <Input
                                name="slug"
                                defaultValue={initialData?.slug || ''}
                                placeholder="my-restaurant"
                                className="rounded-l-none"
                                required
                                readOnly={!!initialData?.slug}
                            />
                        </div>
                        {initialData?.slug && (
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">
                                Website address cannot be changed once set.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 p-4 rounded-2xl transition-all border border-transparent" id="field-siteName">
                        <label className="text-sm font-medium">Site Title</label>
                        <Input
                            name="siteName"
                            value={siteName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSiteName(e.target.value)}
                            placeholder="Delicious Eats"
                            required
                        />
                    </div>

                    <div className="space-y-2 p-4 rounded-2xl transition-all border border-transparent" id="field-description">
                        <label className="text-sm font-medium">Tagline / Description</label>
                        <Input
                            name="description"
                            value={description}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                            placeholder="Best organic food in town"
                        />
                    </div>

                    <div className="space-y-2 p-4 rounded-2xl transition-all border border-transparent" id="field-primaryColor">
                        <label className="text-sm font-medium">Primary Brand Color</label>
                        <div className="flex gap-3">
                            <input
                                type="color"
                                name="primaryColor"
                                defaultValue={initialData?.primaryColor || '#3B82F6'}
                                className="w-12 h-10 rounded-xl cursor-pointer border-none p-0"
                            />
                            <Input
                                value={initialData?.primaryColor || '#3B82F6'}
                                className="flex-1"
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Imagery & Contact */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Branding & Media</h3>

                    <div className="space-y-4 p-4 rounded-2xl transition-all border border-transparent" id="field-template">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-400">Website Template</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'classic', name: 'Classic', desc: 'Professional & Trustworthy' },
                                { id: 'modern', name: 'Modern', desc: 'Sleek & Visual' },
                                { id: 'minimal', name: 'Minimal', desc: 'Clean & Bold' },
                            ].map((tpl) => (
                                <label
                                    key={tpl.id}
                                    className={`
                                        relative flex flex-col p-3 border-2 rounded-2xl cursor-pointer transition-all hover:border-primary/50 group
                                        ${selectedTemplate === tpl.id ? 'border-primary bg-primary/5 shadow-inner' : 'border-slate-100 bg-white'}
                                    `}
                                >
                                    <input
                                        type="radio"
                                        name="designTemplate"
                                        value={tpl.id}
                                        checked={selectedTemplate === tpl.id}
                                        onChange={() => setSelectedTemplate(tpl.id)}
                                        className="sr-only"
                                    />
                                    <div className="flex-1">
                                        <p className="font-black text-xs uppercase tracking-tighter truncate">{tpl.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-tight mt-1">
                                            {tpl.desc}
                                        </p>
                                    </div>
                                    <div className={`
                                        absolute top-2 right-2 h-3 w-3 rounded-full border-2 
                                        ${selectedTemplate === tpl.id ? 'bg-primary border-primary' : 'border-slate-200'}
                                    `} />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 p-4 rounded-2xl transition-all border border-transparent" id="field-logo">
                        <label className="text-sm font-medium">Logo URL</label>
                        <Input
                            name="logo"
                            defaultValue={initialData?.logo || ''}
                            placeholder="https://.../logo.png"
                        />
                    </div>

                    <div className="space-y-2 p-4 rounded-2xl transition-all border border-transparent" id="field-coverImage">
                        <label className="text-sm font-medium">Cover Hero Image URL</label>
                        <Input
                            name="coverImage"
                            defaultValue={initialData?.coverImage || ''}
                            placeholder="https://.../hero.jpg"
                        />
                    </div>

                    <h3 className="text-lg font-semibold border-b pb-2 mt-8">Contact Information</h3>

                    <div className="space-y-2 p-4 rounded-2xl transition-all border border-transparent" id="field-address">
                        <label className="text-sm font-medium">Business Address</label>
                        <Input
                            name="address"
                            defaultValue={existingConfig.address || ''}
                            placeholder="123 Food Street, Downtown"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 p-4 rounded-2xl transition-all border border-transparent" id="field-phone">
                            <label className="text-sm font-medium">Phone</label>
                            <Input
                                name="phone"
                                defaultValue={existingConfig.phone || ''}
                                placeholder="+123..."
                            />
                        </div>
                        <div className="space-y-2 p-4 rounded-2xl transition-all border border-transparent" id="field-email">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                name="email"
                                defaultValue={existingConfig.email || userEmail}
                                placeholder="contact@business.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 p-4 rounded-2xl transition-all border border-transparent" id="field-businessHours">
                        <label className="text-sm font-medium">Business Hours</label>
                        <Input
                            name="businessHours"
                            defaultValue={existingConfig.businessHours || ''}
                            placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t gap-4">
                <Button disabled={loading} size="lg" className="px-12">
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>

                {initialData?.slug && (
                    <a
                        href={`/${initialData.slug}`}
                        target="_blank"
                        className="text-sm font-semibold flex items-center gap-2 text-primary hover:underline hover:translate-x-1 transition-all"
                    >
                        View Live Website ↗
                    </a>
                )}
            </div>
        </form>
    )
}
