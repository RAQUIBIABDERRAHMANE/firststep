'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { upsertWebsite } from '@/app/actions/tenant'
import { useRouter } from 'next/navigation'
import { Check, ArrowRight, ArrowLeft, Loader2, Sparkles, AlertCircle, Laptop, Settings, ListPlus, Send } from 'lucide-react'

interface CustomWebsiteFormProps {
    initialData?: any
    serviceId: string
    serviceName?: string
    userEmail: string
}

export default function CustomWebsiteForm({ initialData, serviceId, serviceName = 'custom website', userEmail }: CustomWebsiteFormProps) {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Parse existing config if available
    const existingConfig = initialData?.config ? JSON.parse(initialData.config) : {}

    // Form states
    const [slug, setSlug] = useState(initialData?.slug || '')
    const [siteName, setSiteName] = useState(initialData?.siteName || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || '#3B82F6')
    const [logo, setLogo] = useState(initialData?.logo || '')
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || '')
    
    // Custom Questionnaire states
    const [websiteType, setWebsiteType] = useState(existingConfig.websiteType || 'corporate')
    const [stylePreferences, setStylePreferences] = useState(existingConfig.stylePreferences || 'modern')
    const [pages, setPages] = useState<string[]>(existingConfig.pages || ['home', 'about', 'services', 'contact'])
    const [specialFeatures, setSpecialFeatures] = useState<string[]>(existingConfig.specialFeatures || ['contact-form'])
    const [competitors, setCompetitors] = useState(existingConfig.competitors || '')
    const [additionalNotes, setAdditionalNotes] = useState(existingConfig.additionalNotes || '')
    
    // Contact Info
    const [phone, setPhone] = useState(existingConfig.phone || '')
    const [email, setEmail] = useState(existingConfig.email || userEmail)
    const [address, setAddress] = useState(existingConfig.address || '')

    const togglePage = (pageVal: string) => {
        setPages(prev => 
            prev.includes(pageVal) ? prev.filter(p => p !== pageVal) : [...prev, pageVal]
        )
    }

    const toggleFeature = (featureVal: string) => {
        setSpecialFeatures(prev => 
            prev.includes(featureVal) ? prev.filter(f => f !== featureVal) : [...prev, featureVal]
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        
        if (step < 4) {
            setStep(prev => prev + 1)
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(null)

        // Validate slug
        if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
            setError('Website address (slug) is required and can only contain lowercase letters, numbers, and hyphens')
            setLoading(false)
            return
        }

        if (!siteName) {
            setError('Site Title is required')
            setLoading(false)
            return
        }

        const formData = new FormData()
        formData.append('serviceId', serviceId)
        formData.append('slug', slug)
        formData.append('siteName', siteName)
        formData.append('description', description)
        formData.append('primaryColor', primaryColor)
        formData.append('logo', logo)
        formData.append('coverImage', coverImage)
        
        // Contact details
        formData.append('phone', phone)
        formData.append('email', email)
        formData.append('address', address)

        // Questionnaire details
        formData.append('websiteType', websiteType)
        formData.append('stylePreferences', stylePreferences)
        formData.append('competitors', competitors)
        formData.append('additionalNotes', additionalNotes)
        
        // Append arrays
        pages.forEach(p => formData.append('pages', p))
        specialFeatures.forEach(f => formData.append('specialFeatures', f))

        const result = await upsertWebsite(formData)

        if (result.error) {
            setError(result.error)
        } else {
            setSuccess('Vos spécifications ont été enregistrées avec succès !')
            
            const website = result.website
            const tenantSlug = website?.slug
            
            setTimeout(() => {
                router.push(`/dashboard/custom-website/${tenantSlug}`)
            }, 1500)
        }
        setLoading(false)
    }

    const C = '59, 130, 246' // primary RGB (blue-500)

    return (
        <div className="space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-between px-2 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
                {[
                    { number: 1, label: 'Identité & Design', icon: Laptop },
                    { number: 2, label: 'Type & Style', icon: Settings },
                    { number: 3, label: 'Pages & Fonctionnalités', icon: ListPlus },
                    { number: 4, label: 'Inspirations & Soumission', icon: Send }
                ].map((item) => {
                    const Icon = item.icon
                    const isCompleted = step > item.number
                    const isActive = step === item.number
                    return (
                        <div key={item.number} className="flex-1 flex flex-col items-center text-center relative group">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10
                                ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110' : 'bg-white border-2 border-slate-200 text-slate-400'}
                            `}>
                                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                            </div>
                            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-tight mt-2 transition-colors ${
                                isActive ? 'text-blue-600 font-extrabold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                            }`}>
                                {item.label}
                            </span>
                        </div>
                    )
                })}
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 flex items-start gap-2.5 animate-fade-in">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm border border-emerald-200 flex items-start gap-2.5 animate-fade-in">
                    <Check className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* STEP 1: Basic Identity */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-900">Identité du site</h3>
                            <p className="text-sm text-slate-500">Configurez l&apos;adresse de votre site web ainsi que ses informations de marque de base.</p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Adresse URL souhaitée (Slug) *</label>
                                <div className="flex items-center">
                                    <span className="text-slate-400 bg-slate-50 px-3 py-3 rounded-l-xl border border-slate-200 border-r-0 text-sm font-medium">
                                        /
                                    </span>
                                    <Input
                                        value={slug}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        placeholder="mon-site-perso"
                                        className="rounded-l-none"
                                        required
                                        disabled={!!initialData?.slug}
                                    />
                                </div>
                                {initialData?.slug ? (
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">
                                        L&apos;adresse URL ne peut plus être modifiée après création.
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-400">
                                        Uniquement des lettres minuscules, chiffres et tirets. Exemple: `mon-entreprise`
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Titre officiel du site *</label>
                                <Input
                                    value={siteName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSiteName(e.target.value)}
                                    placeholder="Ex: FirstStep Solutions"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Slogan ou Description courte</label>
                            <Input
                                value={description}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                                placeholder="Ex: Cabinet de conseil en innovation technologique"
                            />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Couleur principale de marque</label>
                                <div className="flex gap-3">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPrimaryColor(e.target.value)}
                                        className="w-12 h-12 rounded-xl cursor-pointer border border-slate-200 p-0 overflow-hidden shrink-0"
                                    />
                                    <Input
                                        value={primaryColor}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPrimaryColor(e.target.value)}
                                        placeholder="#3B82F6"
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Lien vers votre Logo (URL)</label>
                                <Input
                                    value={logo}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLogo(e.target.value)}
                                    placeholder="https://.../logo.png"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Lien de l&apos;image de couverture principale (URL)</label>
                            <Input
                                value={coverImage}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCoverImage(e.target.value)}
                                placeholder="https://.../hero-image.jpg"
                            />
                        </div>
                    </div>
                )}

                {/* STEP 2: Website Type & Style */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-900">Type de site et style esthétique</h3>
                            <p className="text-sm text-slate-500">Précisez la nature de votre site et le style de design que vous préférez.</p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 block">Type de site web</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { id: 'showcase', label: 'Site Vitrine', desc: 'Présentez votre entreprise' },
                                    { id: 'ecommerce', label: 'E-commerce', desc: 'Vendez vos produits' },
                                    { id: 'portfolio', label: 'Portfolio', desc: 'Affichez vos travaux' },
                                    { id: 'landing', label: 'Landing Page', desc: 'Page unique optimisée' }
                                ].map((type) => (
                                    <label
                                        key={type.id}
                                        className={`
                                            border-2 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all hover:bg-slate-50
                                            ${websiteType === type.id ? 'border-blue-600 bg-blue-50/20' : 'border-slate-200'}
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="websiteType"
                                            value={type.id}
                                            checked={websiteType === type.id}
                                            onChange={() => setWebsiteType(type.id)}
                                            className="sr-only"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-slate-900 block">{type.label}</span>
                                            <span className="text-[11px] text-slate-400 font-medium leading-tight mt-1 block">{type.desc}</span>
                                        </div>
                                        <div className={`
                                            h-4 w-4 rounded-full border-2 mt-4 self-end flex items-center justify-center
                                            ${websiteType === type.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}
                                        `}>
                                            {websiteType === type.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 block">Style / Ambiance visuelle</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { id: 'modern', label: 'Moderne & Dynamique', desc: 'Animations, gradients, vifs' },
                                    { id: 'minimalist', label: 'Minimaliste épuré', desc: 'Espacé, propre, sobre' },
                                    { id: 'luxury', label: 'Sombre & Luxueux', desc: 'Premium, tons dorés/noirs' },
                                    { id: 'creative', label: 'Créatif & Artistique', desc: 'Audacieux, asymétrique' }
                                ].map((style) => (
                                    <label
                                        key={style.id}
                                        className={`
                                            border-2 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all hover:bg-slate-50
                                            ${stylePreferences === style.id ? 'border-blue-600 bg-blue-50/20' : 'border-slate-200'}
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="stylePreferences"
                                            value={style.id}
                                            checked={stylePreferences === style.id}
                                            onChange={() => setStylePreferences(style.id)}
                                            className="sr-only"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-slate-900 block">{style.label}</span>
                                            <span className="text-[11px] text-slate-400 font-medium leading-tight mt-1 block">{style.desc}</span>
                                        </div>
                                        <div className={`
                                            h-4 w-4 rounded-full border-2 mt-4 self-end flex items-center justify-center
                                            ${stylePreferences === style.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}
                                        `}>
                                            {stylePreferences === style.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Pages & Special Features */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-900">Pages et Fonctionnalités demandées</h3>
                            <p className="text-sm text-slate-500">Cochez les éléments dont vous aurez besoin sur votre site internet sur mesure.</p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 block">Pages souhaitées</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                {[
                                    { id: 'home', label: 'Accueil' },
                                    { id: 'about', label: 'À propos' },
                                    { id: 'services', label: 'Nos Services' },
                                    { id: 'contact', label: 'Contact' },
                                    { id: 'faq', label: 'FAQ / Aide' },
                                    { id: 'portfolio', label: 'Portfolio / Réalisations' },
                                    { id: 'blog', label: 'Blog / Actualités' },
                                    { id: 'testimonials', label: 'Témoignages' },
                                    { id: 'team', label: 'Notre équipe' }
                                ].map((p) => {
                                    const isChecked = pages.includes(p.id)
                                    return (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => togglePage(p.id)}
                                            className={`
                                                p-3 border rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 hover:bg-slate-50
                                                ${isChecked ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 text-slate-600'}
                                            `}
                                        >
                                            <span className="truncate w-full">{p.label}</span>
                                            {isChecked && <Check className="h-3 w-3 text-blue-600 shrink-0" />}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 block">Fonctionnalités spéciales nécessaires</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { id: 'contact-form', label: 'Formulaire de contact standard' },
                                    { id: 'booking-system', label: 'Système de réservation / Prise de rdv' },
                                    { id: 'payment-gateway', label: 'Passerelle de paiement en ligne' },
                                    { id: 'chat-bot', label: 'Bouton Chatbot ou Live Chat Whatsapp' },
                                    { id: 'newsletter', label: 'Inscription Newsletter' },
                                    { id: 'multilingual', label: 'Support Multi-langue (FR/EN/AR)' },
                                    { id: 'custom-auth', label: 'Portail de connexion client (Espace membre)' },
                                    { id: 'advanced-seo', label: 'Optimisation SEO & Référencement avancée' }
                                ].map((f) => {
                                    const isChecked = specialFeatures.includes(f.id)
                                    return (
                                        <button
                                            key={f.id}
                                            type="button"
                                            onClick={() => toggleFeature(f.id)}
                                            className={`
                                                p-4 border rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between hover:bg-slate-50
                                                ${isChecked ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}
                                            `}
                                        >
                                            <span className="leading-tight">{f.label}</span>
                                            <div className={`
                                                w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-3
                                                ${isChecked ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}
                                            `}>
                                                {isChecked && <Check className="h-2.5 w-2.5" />}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: Competitors & Notes & Submission */}
                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-900">Inspirations et Coordonnées de contact</h3>
                            <p className="text-sm text-slate-500">Fournissez des exemples de sites et les informations qui apparaîtront sur votre site.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Sites d&apos;inspiration ou concurrents (Séparez par des virgules)</label>
                            <Input
                                value={competitors}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCompetitors(e.target.value)}
                                placeholder="Ex: stripe.com, apple.com/fr, concurrentsite.com"
                            />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Email de contact public</label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    placeholder="contact@monentreprise.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Téléphone public</label>
                                <Input
                                    value={phone}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                                    placeholder="+212 6..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Adresse postale publique</label>
                                <Input
                                    value={address}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                                    placeholder="Ex: Bd Zerktouni, Casablanca"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Instructions particulières pour notre équipe de développement</label>
                            <textarea
                                value={additionalNotes}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAdditionalNotes(e.target.value)}
                                placeholder="Décrivez en détail vos attentes, la structure des pages, les intégrations spécifiques dont vous avez besoin, ou tout autre détail que nos développeurs doivent savoir..."
                                rows={5}
                                className="flex min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-all duration-300 placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 hover:border-slate-400"
                            />
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex gap-3 text-slate-600">
                            <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <div className="text-xs space-y-1">
                                <p className="font-bold text-slate-900">Que se passe-t-il après la soumission ?</p>
                                <p className="leading-relaxed">Notre équipe de développeurs et de designers examinera vos spécifications pour créer un site internet entièrement sur mesure (code, structure et logique de A à Z). Vous pourrez suivre l&apos;avancement directement depuis votre tableau de bord.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100 gap-4">
                    {step > 1 ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(prev => prev - 1)}
                            disabled={loading}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </Button>
                    ) : (
                        <div />
                    )}

                    <Button
                        type={step === 4 ? 'submit' : 'button'}
                        onClick={step === 4 ? undefined : handleSubmit}
                        disabled={loading}
                        className="gap-2 px-8"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Enregistrement...
                            </>
                        ) : step === 4 ? (
                            <>
                                Soumettre les spécifications
                                <Check className="h-4 w-4" />
                            </>
                        ) : (
                            <>
                                Suivant
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
