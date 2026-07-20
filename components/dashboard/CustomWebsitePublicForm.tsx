'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createCustomWebsiteRequest } from '@/app/actions/custom-website-request'
import { Check, ArrowRight, ArrowLeft, Loader2, Sparkles, AlertCircle, Laptop, Settings, ListPlus, Send, MessageSquare } from 'lucide-react'

interface CustomWebsitePublicFormProps {
    initialUser?: {
        companyName: string
        email: string
    } | null
}

export default function CustomWebsitePublicForm({ initialUser }: CustomWebsitePublicFormProps) {
    const [step, setStep] = useState(1)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Form inputs
    const [clientName, setClientName] = useState(initialUser ? 'Client' : '')
    const [companyName, setCompanyName] = useState(initialUser?.companyName || '')
    const [email, setEmail] = useState(initialUser?.email || '')
    const [phone, setPhone] = useState('')
    
    const [websiteType, setWebsiteType] = useState('showcase')
    const [stylePreferences, setStylePreferences] = useState('modern')
    const [pages, setPages] = useState<string[]>(['home', 'about', 'services', 'contact'])
    const [specialFeatures, setSpecialFeatures] = useState<string[]>(['contact-form'])
    const [competitors, setCompetitors] = useState('')
    const [additionalNotes, setAdditionalNotes] = useState('')

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
            // Basic validation per step
            if (step === 1) {
                if (!clientName || !companyName || !email) {
                    setError('Veuillez remplir tous les champs obligatoires (*).')
                    return
                }
                setError(null)
            }
            setStep(prev => prev + 1)
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(null)

        const formData = new FormData()
        formData.append('clientName', clientName)
        formData.append('companyName', companyName)
        formData.append('email', email)
        formData.append('phone', phone)
        formData.append('websiteType', websiteType)
        formData.append('stylePreferences', stylePreferences)
        formData.append('competitors', competitors)
        formData.append('additionalNotes', additionalNotes)
        
        pages.forEach(p => formData.append('pages', p))
        specialFeatures.forEach(f => formData.append('specialFeatures', f))

        const result = await createCustomWebsiteRequest(formData)

        if (result.error) {
            setError(result.error)
        } else {
            setSuccess('Votre demande de site web sur mesure a été soumise avec succès !')
            // clear form / redirect or show final screen
            setStep(5)
        }
        setLoading(false)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Step Indicators */}
            {step <= 4 && (
                <div className="flex items-center justify-between px-2 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                    {[
                        { number: 1, label: 'Vos Coordonnées', icon: Laptop },
                        { number: 2, label: 'Type & Style', icon: Settings },
                        { number: 3, label: 'Structure', icon: ListPlus },
                        { number: 4, label: 'Inspirations', icon: Send }
                    ].map((item) => {
                        const Icon = item.icon
                        const isCompleted = step > item.number
                        const isActive = step === item.number
                        return (
                            <div key={item.number} className="flex-1 flex flex-col items-center text-center relative z-10">
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                                    ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                                      isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110' : 'bg-white/5 border border-white/10 text-slate-400'}
                                `}>
                                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                                </div>
                                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-tight mt-2 transition-colors ${
                                    isActive ? 'text-blue-500 font-extrabold' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                                }`}>
                                    {item.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm border border-red-500/20 flex items-start gap-2.5 animate-fade-in">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {success && step !== 5 && (
                <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl text-sm border border-emerald-500/20 flex items-start gap-2.5 animate-fade-in">
                    <Check className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{success}</span>
                </div>
            )}

            {step === 5 ? (
                /* Success Screen */
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6 backdrop-blur-md animate-in fade-in zoom-in-95 duration-500">
                    <div className="mx-auto w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mb-2">
                        <Check className="w-8 h-8 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="font-syne text-2xl sm:text-3xl font-black text-white">Demande reçue avec succès !</h2>
                        <p className="text-slate-400 text-sm max-w-md mx-auto">
                            Merci d&apos;avoir partagé votre projet de site web sur mesure avec FirstStep.
                        </p>
                    </div>
                    
                    <div className="max-w-md mx-auto bg-white/3 border border-white/5 p-5 rounded-2xl text-left space-y-3">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                            Prochaines étapes :
                        </h3>
                        <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
                            <li>Nos ingénieurs et designers analysent vos spécifications techniques.</li>
                            <li>Nous vous recontactons sous 24 heures par email (<span className="text-blue-400 font-semibold">{email}</span>) ou par téléphone pour affiner vos besoins.</li>
                            <li>Nous établissons une proposition technique et tarifaire sur mesure.</li>
                        </ol>
                    </div>

                    <div className="pt-4">
                        <Button onClick={() => window.location.href = '/'} className="px-8 h-12 text-xs uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                            Retour à l&apos;accueil
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-sm space-y-6">
                    
                    {/* STEP 1: Coordonnées */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="border-b border-white/10 pb-3">
                                <h3 className="text-lg font-bold text-white font-syne">Vos Coordonnées</h3>
                                <p className="text-xs text-slate-400">Présentez-vous afin que nous puissions vous recontacter pour discuter de votre site sur mesure.</p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">Votre Nom Complet *</label>
                                    <Input
                                        value={clientName}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setClientName(e.target.value)}
                                        placeholder="Ex: Jean Dupont"
                                        className="bg-white/5 border-white/10 text-white focus-visible:border-blue-500 placeholder:text-slate-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">Nom de votre Entreprise *</label>
                                    <Input
                                        value={companyName}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
                                        placeholder="Ex: Dupont Tech"
                                        className="bg-white/5 border-white/10 text-white focus-visible:border-blue-500 placeholder:text-slate-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">Adresse Email de Contact *</label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        placeholder="Ex: jean@dupont.com"
                                        className="bg-white/5 border-white/10 text-white focus-visible:border-blue-500 placeholder:text-slate-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">Téléphone de Contact</label>
                                    <Input
                                        value={phone}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                                        placeholder="Ex: +212 6 00 00 00 00"
                                        className="bg-white/5 border-white/10 text-white focus-visible:border-blue-500 placeholder:text-slate-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Website Type & Style */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="border-b border-white/10 pb-3">
                                <h3 className="text-lg font-bold text-white font-syne">Type de site et style esthétique</h3>
                                <p className="text-xs text-slate-400">Précisez la nature de votre site et le style de design que vous préférez.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-300 block">Type de site web</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { id: 'showcase', label: 'Site Vitrine', desc: 'Présentez votre entreprise' },
                                        { id: 'ecommerce', label: 'E-commerce', desc: 'Vendez vos produits' },
                                        { id: 'portfolio', label: 'Portfolio', desc: 'Affichez vos travaux' },
                                        { id: 'landing', label: 'Landing Page', desc: 'Page unique de conversion' }
                                    ].map((type) => (
                                        <label
                                            key={type.id}
                                            className={`
                                                border-2 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all hover:bg-white/5
                                                ${websiteType === type.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/2'}
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
                                                <span className="text-sm font-bold text-white block">{type.label}</span>
                                                <span className="text-[10px] text-slate-400 font-medium leading-tight mt-1 block">{type.desc}</span>
                                            </div>
                                            <div className={`
                                                h-4 w-4 rounded-full border-2 mt-4 self-end flex items-center justify-center
                                                ${websiteType === type.id ? 'border-blue-500 bg-blue-500 text-white' : 'border-white/20'}
                                            `}>
                                                {websiteType === type.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-300 block">Style / Ambiance visuelle</label>
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
                                                border-2 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all hover:bg-white/5
                                                ${stylePreferences === style.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/2'}
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
                                                <span className="text-sm font-bold text-white block">{style.label}</span>
                                                <span className="text-[10px] text-slate-400 font-medium leading-tight mt-1 block">{style.desc}</span>
                                            </div>
                                            <div className={`
                                                h-4 w-4 rounded-full border-2 mt-4 self-end flex items-center justify-center
                                                ${stylePreferences === style.id ? 'border-blue-500 bg-blue-500 text-white' : 'border-white/20'}
                                            `}>
                                                {stylePreferences === style.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Structure & Features */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="border-b border-white/10 pb-3">
                                <h3 className="text-lg font-bold text-white font-syne">Pages et Fonctionnalités demandées</h3>
                                <p className="text-xs text-slate-400">Cochez les éléments dont vous estimez avoir besoin.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-300 block">Pages souhaitées</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {[
                                        { id: 'home', label: 'Accueil' },
                                        { id: 'about', label: 'À propos' },
                                        { id: 'services', label: 'Nos Services' },
                                        { id: 'contact', label: 'Contact' },
                                        { id: 'faq', label: 'FAQ / Aide' },
                                        { id: 'portfolio', label: 'Portfolio' },
                                        { id: 'blog', label: 'Blog / Actus' },
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
                                                    p-3 border rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 hover:bg-white/5
                                                    ${isChecked ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/10 text-slate-400 bg-white/2'}
                                                `}
                                            >
                                                <span className="truncate w-full">{p.label}</span>
                                                {isChecked && <Check className="h-3 w-3 text-blue-400 shrink-0" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-300 block">Fonctionnalités spéciales</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {[
                                        { id: 'contact-form', label: 'Formulaire de contact standard' },
                                        { id: 'booking-system', label: 'Réservation / Prise de rdv' },
                                        { id: 'payment-gateway', label: 'Passerelle de paiement en ligne' },
                                        { id: 'chat-bot', label: 'Whatsapp Live Chat' },
                                        { id: 'newsletter', label: 'Inscription Newsletter' },
                                        { id: 'multilingual', label: 'Multi-langue' },
                                        { id: 'custom-auth', label: 'Espace membre (Connexion client)' },
                                        { id: 'advanced-seo', label: 'Optimisation SEO avancée' }
                                    ].map((f) => {
                                        const isChecked = specialFeatures.includes(f.id)
                                        return (
                                            <button
                                                key={f.id}
                                                type="button"
                                                onClick={() => toggleFeature(f.id)}
                                                className={`
                                                    p-4 border rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between hover:bg-white/5
                                                    ${isChecked ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/10 text-slate-400 bg-white/2'}
                                                `}
                                            >
                                                <span className="leading-tight">{f.label}</span>
                                                <div className={`
                                                    w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-3
                                                    ${isChecked ? 'border-blue-500 bg-blue-500 text-white' : 'border-white/20'}
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

                    {/* STEP 4: Inspirations & Details */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="border-b border-white/10 pb-3">
                                <h3 className="text-lg font-bold text-white font-syne">Inspirations & Remarques</h3>
                                <p className="text-xs text-slate-400">Ajoutez des détails pour nous aider à comprendre vos besoins de développement sur mesure.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Sites internet d&apos;inspiration ou concurrents (Séparez par des virgules)</label>
                                <Input
                                    value={competitors}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCompetitors(e.target.value)}
                                    placeholder="Ex: stripe.com, apple.com"
                                    className="bg-white/5 border-white/10 text-white focus-visible:border-blue-500 placeholder:text-slate-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Remarques ou fonctionnalités spécifiques demandées</label>
                                <textarea
                                    value={additionalNotes}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAdditionalNotes(e.target.value)}
                                    placeholder="Ex: Intégrer notre API interne, créer un espace de signature de contrat en ligne..."
                                    rows={5}
                                    className="flex min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all duration-300 placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10 hover:border-white/20"
                                />
                            </div>

                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 text-slate-300">
                                <Sparkles className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                <div className="text-xs space-y-1">
                                    <p className="font-bold text-white">Création 100% sur mesure</p>
                                    <p className="leading-relaxed text-slate-400">Ce formulaire génère un ticket de consultation technique. Notre équipe de développement concevra le code, l&apos;UX/UI, la base de données et l&apos;infrastructure selon vos exigences précises.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="pt-4 flex items-center justify-between border-t border-white/10 gap-4">
                        {step > 1 ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(prev => prev - 1)}
                                disabled={loading}
                                className="gap-2 border-white/10 text-white bg-transparent hover:bg-white/5"
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
                            className="gap-2 px-8 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : step === 4 ? (
                                <>
                                    Soumettre le projet
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
            )}
        </div>
    )
}
