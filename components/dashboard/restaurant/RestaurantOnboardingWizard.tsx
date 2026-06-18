'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
    Utensils, MapPin, Paintbrush, PartyPopper,
    ChevronRight, ChevronLeft, Check, Plus, Trash2,
    ExternalLink, ClipboardList, Star, X
} from 'lucide-react'
import {
    createCategory,
    createDish,
    createBulkTables,
    updateRestaurantDesign,
    updateRestaurantConfig,
} from '@/app/actions/restaurant'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DishInput {
    name: string
    price: string
}

interface WizardData {
    // Step 2 — Identity & Design
    pageTitle: string
    address: string
    phone: string
    designTemplate: string
    primaryColor: string
    // Step 3 — Menu
    categoryName: string
    dishes: DishInput[]
    // Step 4 — Tables
    tableCount: number
    tablePrefix: string
    tableCapacity: string
}

interface Props {
    tenantSlug: string
    siteName: string
    currentConfig: Record<string, any>
    currentDesign: string
    currentColor: string
}

// ─── Design Themes ───────────────────────────────────────────────────────────

const themes = [
    { id: 'classic',  label: 'Classic',  emoji: '🏛️',  bg: 'from-slate-800 to-slate-600',  accent: 'bg-amber-400' },
    { id: 'modern',   label: 'Modern',   emoji: '✨',  bg: 'from-zinc-900 to-zinc-700',     accent: 'bg-blue-500' },
    { id: 'minimal',  label: 'Minimal',  emoji: '🤍',  bg: 'from-white to-slate-100',       accent: 'bg-slate-800' },
    { id: 'moroccan', label: 'Moroccan', emoji: '🌙',  bg: 'from-amber-900 to-amber-700',   accent: 'bg-amber-400' },
    { id: 'italian',  label: 'Italian',  emoji: '🍕',  bg: 'from-green-800 to-red-700',     accent: 'bg-white' },
    { id: 'luxury',   label: 'Luxury',   emoji: '👑',  bg: 'from-yellow-900 to-yellow-700', accent: 'bg-yellow-300' },
]

const STEP_LABELS = [
    { label: 'Bienvenue',  icon: Star },
    { label: 'Design',     icon: Paintbrush },
    { label: 'Menu',       icon: Utensils },
    { label: 'Tables',     icon: MapPin },
    { label: 'Terminé',    icon: PartyPopper },
]

// ─── Confetti Component ───────────────────────────────────────────────────────

function Confetti() {
    const pieces = Array.from({ length: 40 }, (_, i) => i)
    const colors = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {pieces.map((i) => (
                <div
                    key={i}
                    className="absolute animate-bounce"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 60}%`,
                        width: `${6 + Math.random() * 8}px`,
                        height: `${6 + Math.random() * 8}px`,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        backgroundColor: colors[i % colors.length],
                        animationDelay: `${Math.random() * 1.5}s`,
                        animationDuration: `${0.8 + Math.random()}s`,
                        opacity: 0.8,
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                />
            ))}
        </div>
    )
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export default function RestaurantOnboardingWizard({ tenantSlug, siteName, currentConfig, currentDesign, currentColor }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [step, setStep] = useState(0)
    const [error, setError] = useState('')
    const [createdSummary, setCreatedSummary] = useState({ dishes: 0, tables: 0 })

    const [data, setData] = useState<WizardData>({
        pageTitle: currentConfig?.pageTitle || siteName,
        address: currentConfig?.address || '',
        phone: currentConfig?.phone || '',
        designTemplate: currentDesign || 'classic',
        primaryColor: currentColor || '#f97316',
        categoryName: '',
        dishes: [{ name: '', price: '' }, { name: '', price: '' }],
        tableCount: 10,
        tablePrefix: 'Table ',
        tableCapacity: '',
    })

    const updateField = (field: keyof WizardData, value: any) =>
        setData(prev => ({ ...prev, [field]: value }))

    const updateDish = (i: number, field: keyof DishInput, value: string) =>
        setData(prev => {
            const dishes = [...prev.dishes]
            dishes[i] = { ...dishes[i], [field]: value }
            return { ...prev, dishes }
        })

    const addDish = () => {
        if (data.dishes.length < 5) updateField('dishes', [...data.dishes, { name: '', price: '' }])
    }

    const removeDish = (i: number) => {
        if (data.dishes.length > 1) updateField('dishes', data.dishes.filter((_, idx) => idx !== i))
    }

    // ── Step validation ──────────────────────────────────────────────────────

    const canProceed = () => {
        if (step === 1) return data.designTemplate !== ''
        if (step === 2) return data.categoryName.trim() !== '' && data.dishes.some(d => d.name.trim() && d.price)
        if (step === 3) return data.tableCount >= 1 && data.tableCount <= 500
        return true
    }

    // ── Step submission ──────────────────────────────────────────────────────

    const handleNext = () => {
        setError('')
        if (step === STEP_LABELS.length - 1) {
            // Mark done & close
            localStorage.setItem(`onboarding_done_${tenantSlug}`, '1')
            router.push(`/dashboard/restaurant/${tenantSlug}`)
            return
        }

        if (step === 1) {
            // Save design + config
            startTransition(async () => {
                const r1 = await updateRestaurantDesign(data.designTemplate, tenantSlug)
                const r2 = await updateRestaurantConfig({
                    pageTitle: data.pageTitle,
                    address: data.address,
                    phone: data.phone,
                    primaryColor: data.primaryColor,
                }, tenantSlug)
                if ('error' in r1 || 'error' in r2) {
                    setError('Erreur lors de la sauvegarde du design.')
                    return
                }
                setStep(s => s + 1)
            })
            return
        }

        if (step === 2) {
            // Create category + dishes
            startTransition(async () => {
                const catResult = await createCategory(data.categoryName.trim(), tenantSlug)
                if ('error' in catResult || !catResult.category) {
                    setError('Erreur lors de la création de la catégorie.')
                    return
                }
                const catId = catResult.category.id
                const validDishes = data.dishes.filter(d => d.name.trim() && d.price)
                for (const dish of validDishes) {
                    await createDish(catId, {
                        name: dish.name.trim(),
                        description: '',
                        price: parseFloat(dish.price) || 0,
                    }, tenantSlug)
                }
                setCreatedSummary(prev => ({ ...prev, dishes: validDishes.length }))
                setStep(s => s + 1)
            })
            return
        }

        if (step === 3) {
            // Create tables in bulk
            startTransition(async () => {
                const result = await createBulkTables(
                    data.tableCount,
                    data.tablePrefix,
                    1,
                    data.tableCapacity ? parseInt(data.tableCapacity) : undefined,
                    tenantSlug
                )
                if ('error' in result) {
                    setError(result.error || 'Erreur lors de la création des tables.')
                    return
                }
                setCreatedSummary(prev => ({ ...prev, tables: data.tableCount }))
                setStep(s => s + 1)
            })
            return
        }

        setStep(s => s + 1)
    }

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(8px)' }}>
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                style={{ maxHeight: '92vh' }}>

                {/* ── Progress bar ── */}
                <div className="relative px-8 pt-8 pb-4 bg-gradient-to-r from-orange-500 to-amber-400 shrink-0">
                    <div className="flex items-center justify-between mb-5">
                        {STEP_LABELS.map((s, i) => {
                            const Icon = s.icon
                            const isActive = i === step
                            const isDone = i < step
                            return (
                                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-xs font-bold
                                        ${isActive ? 'bg-white border-white text-orange-500 shadow-lg scale-110' :
                                          isDone ? 'bg-white/30 border-white/60 text-white' :
                                                   'bg-white/10 border-white/30 text-white/60'}`}>
                                        {isDone ? <Check size={14} /> : <Icon size={13} />}
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wide hidden sm:block
                                        ${isActive ? 'text-white' : 'text-white/60'}`}>
                                        {s.label}
                                    </span>
                                    {i < STEP_LABELS.length - 1 && (
                                        <div className={`h-0.5 w-full mt-1 rounded hidden sm:block
                                            ${isDone ? 'bg-white/70' : 'bg-white/20'}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${(step / (STEP_LABELS.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>

                {/* ── Step content ── */}
                <div className="flex-1 overflow-y-auto px-8 py-6">

                    {/* STEP 0 — Bienvenue */}
                    {step === 0 && (
                        <div className="text-center space-y-6 py-4">
                            <div className="text-7xl animate-bounce">🍽️</div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900">Bienvenue, {siteName} !</h2>
                                <p className="text-slate-500 mt-2 text-base">Configurons votre restaurant en <strong>4 étapes rapides</strong>.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-left mt-4">
                                {[
                                    { icon: '🎨', title: 'Identité & Design', desc: 'Choisissez votre thème visuel' },
                                    { icon: '🍔', title: 'Menu de départ',    desc: 'Ajoutez vos premiers plats' },
                                    { icon: '🪑', title: 'Vos tables',        desc: 'Créez votre plan de salle' },
                                    { icon: '🚀', title: 'En ligne !',        desc: 'Votre QR code est prêt' },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{item.title}</p>
                                            <p className="text-xs text-slate-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 1 — Design */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">🎨 Identité & Design</h2>
                                <p className="text-slate-500 text-sm mt-1">Personnalisez l'apparence de votre site client.</p>
                            </div>

                            {/* Theme picker */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Thème visuel</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {themes.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => updateField('designTemplate', t.id)}
                                            className={`relative rounded-xl overflow-hidden h-20 border-2 transition-all ${data.designTemplate === t.id ? 'border-orange-500 ring-2 ring-orange-200 scale-105' : 'border-slate-200 hover:border-slate-400'}`}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br ${t.bg}`} />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                                                <span className="text-2xl">{t.emoji}</span>
                                                <span className="text-[10px] font-bold text-white drop-shadow">{t.label}</span>
                                            </div>
                                            {data.designTemplate === t.id && (
                                                <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center">
                                                    <Check size={10} className="text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Couleur principale</label>
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50">
                                        <input
                                            type="color"
                                            value={data.primaryColor}
                                            onChange={e => updateField('primaryColor', e.target.value)}
                                            className="h-8 w-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                                        />
                                        <span className="text-sm font-mono text-slate-600">{data.primaryColor}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nom de la page</label>
                                    <input
                                        value={data.pageTitle}
                                        onChange={e => updateField('pageTitle', e.target.value)}
                                        placeholder={siteName}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Téléphone</label>
                                    <input
                                        value={data.phone}
                                        onChange={e => updateField('phone', e.target.value)}
                                        placeholder="+212 6XX XXX XXX"
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Adresse (optionnel)</label>
                                <input
                                    value={data.address}
                                    onChange={e => updateField('address', e.target.value)}
                                    placeholder="123 Rue Mohammed V, Casablanca"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2 — Menu */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">🍔 Votre premier menu</h2>
                                <p className="text-slate-500 text-sm mt-1">Créez une catégorie et quelques plats de départ. Vous pourrez tout compléter plus tard.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Nom de la catégorie</label>
                                <input
                                    value={data.categoryName}
                                    onChange={e => updateField('categoryName', e.target.value)}
                                    placeholder="ex: Plats principaux, Entrées, Boissons…"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Plats</label>
                                {data.dishes.map((dish, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
                                        <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-black text-sm shrink-0">
                                            {i + 1}
                                        </div>
                                        <input
                                            value={dish.name}
                                            onChange={e => updateDish(i, 'name', e.target.value)}
                                            placeholder="Nom du plat"
                                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                        />
                                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shrink-0">
                                            <input
                                                value={dish.price}
                                                onChange={e => updateDish(i, 'price', e.target.value)}
                                                placeholder="Prix"
                                                type="number"
                                                min="0"
                                                className="w-16 text-sm focus:outline-none"
                                            />
                                            <span className="text-xs text-slate-400 font-medium">MAD</span>
                                        </div>
                                        <button
                                            onClick={() => removeDish(i)}
                                            disabled={data.dishes.length <= 1}
                                            className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}

                                {data.dishes.length < 5 && (
                                    <button
                                        onClick={addDish}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-orange-200 text-orange-500 text-sm font-semibold hover:border-orange-400 hover:bg-orange-50 transition-all"
                                    >
                                        <Plus size={15} /> Ajouter un plat
                                    </button>
                                )}
                            </div>

                            <p className="text-xs text-slate-400 bg-blue-50 text-blue-600 rounded-xl px-3 py-2">
                                💡 Vous pouvez ajouter autant de catégories et plats que vous voulez depuis le module Menu.
                            </p>
                        </div>
                    )}

                    {/* STEP 3 — Tables */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">🪑 Vos tables</h2>
                                <p className="text-slate-500 text-sm mt-1">Combien de tables souhaitez-vous créer ? Chaque table aura son propre QR code.</p>
                            </div>

                            {/* Table count slider */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-semibold text-slate-700">Nombre de tables</label>
                                    <span className="text-3xl font-black text-orange-500">{data.tableCount}</span>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={50}
                                    value={data.tableCount}
                                    onChange={e => updateField('tableCount', parseInt(e.target.value))}
                                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-orange-500 bg-orange-100"
                                />
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>1</span><span>25</span><span>50+</span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Ou saisir manuellement:</span>
                                    <input
                                        type="number"
                                        min={1}
                                        max={500}
                                        value={data.tableCount}
                                        onChange={e => updateField('tableCount', Math.min(500, Math.max(1, parseInt(e.target.value) || 1)))}
                                        className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Préfixe</label>
                                    <input
                                        value={data.tablePrefix}
                                        onChange={e => updateField('tablePrefix', e.target.value)}
                                        placeholder="Table "
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Capacité (optionnel)</label>
                                    <input
                                        value={data.tableCapacity}
                                        onChange={e => updateField('tableCapacity', e.target.value)}
                                        placeholder="ex: 4 couverts"
                                        type="number"
                                        min={1}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Aperçu</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {Array.from({ length: Math.min(data.tableCount, 12) }, (_, i) => (
                                        <span key={i} className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700">
                                            {data.tablePrefix}{i + 1}
                                        </span>
                                    ))}
                                    {data.tableCount > 12 && (
                                        <span className="bg-orange-50 border border-orange-200 rounded-lg px-2 py-1 text-xs font-medium text-orange-600">
                                            +{data.tableCount - 12} autres…
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4 — Done */}
                    {step === 4 && (
                        <div className="relative text-center space-y-5 py-4 overflow-hidden">
                            <Confetti />
                            <div className="text-7xl">🎉</div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900">Votre restaurant est prêt !</h2>
                                <p className="text-slate-500 mt-2">Tout est configuré. Vos clients peuvent déjà scanner vos QR codes.</p>
                            </div>

                            {/* Summary */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                                    <div className="text-2xl mb-1">🎨</div>
                                    <p className="text-xs font-bold text-green-700">Design</p>
                                    <p className="text-xs text-green-600">Configuré</p>
                                </div>
                                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                                    <div className="text-2xl mb-1">🍔</div>
                                    <p className="text-xs font-bold text-orange-700">{createdSummary.dishes} plat{createdSummary.dishes > 1 ? 's' : ''}</p>
                                    <p className="text-xs text-orange-600">Créés</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                                    <div className="text-2xl mb-1">🪑</div>
                                    <p className="text-xs font-bold text-blue-700">{createdSummary.tables} table{createdSummary.tables > 1 ? 's' : ''}</p>
                                    <p className="text-xs text-blue-600">Créées</p>
                                </div>
                            </div>

                            {/* Quick links */}
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <a
                                    href={`/${tenantSlug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-semibold hover:border-orange-300 hover:text-orange-600 transition-all"
                                >
                                    <ExternalLink size={14} /> Voir le site live
                                </a>
                                <a
                                    href={`/dashboard/restaurant/${tenantSlug}/orders`}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all"
                                >
                                    <ClipboardList size={14} /> Monitor de commandes
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="mt-4 flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm border border-red-100">
                            <X size={14} className="shrink-0" />
                            {error}
                        </div>
                    )}
                </div>

                {/* ── Footer actions ── */}
                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                    <button
                        onClick={() => { setError(''); setStep(s => Math.max(0, s - 1)) }}
                        disabled={step === 0 || isPending}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-200 transition-all disabled:opacity-30"
                    >
                        <ChevronLeft size={16} /> Précédent
                    </button>

                    <span className="text-xs text-slate-400">{step + 1} / {STEP_LABELS.length}</span>

                    <button
                        onClick={handleNext}
                        disabled={!canProceed() || isPending}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold shadow-lg shadow-orange-200 hover:from-orange-600 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Sauvegarde…
                            </span>
                        ) : step === STEP_LABELS.length - 1 ? (
                            <>Aller au dashboard <ChevronRight size={16} /></>
                        ) : step === 0 ? (
                            <>Commencer <ChevronRight size={16} /></>
                        ) : (
                            <>Suivant <ChevronRight size={16} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
