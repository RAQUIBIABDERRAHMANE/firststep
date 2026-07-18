'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { updateRestaurantDesign, updateRestaurantConfig } from '@/app/actions/restaurant'
import { DEFAULT_TEMPLATE_COLORS } from '@/lib/theme-colors'
import { Check, Loader2, Paintbrush, Save, Type, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Props {
    initialData: any
}

export default function DesignSelectionClient({ initialData }: Props) {
    const [currentDesign, setCurrentDesign] = useState(initialData.designTemplate || 'classic')
    const [config, setConfig] = useState(initialData.config ? JSON.parse(initialData.config) : {})
    const [primaryColor, setPrimaryColor] = useState(initialData.primaryColor || '#3B82F6')
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'themes' | 'customize'>('themes')
    const router = useRouter()

    const getTemplateColor = (colorKey: string) => {
        if (colorKey === 'primaryColor') {
            return config.templatesConfigs?.[currentDesign]?.primaryColor || DEFAULT_TEMPLATE_COLORS[currentDesign]?.primaryColor || primaryColor
        }
        return config.templatesConfigs?.[currentDesign]?.[colorKey] || DEFAULT_TEMPLATE_COLORS[currentDesign]?.[colorKey] || DEFAULT_TEMPLATE_COLORS.classic[colorKey]
    }

    const setTemplateColor = (colorKey: string, value: string) => {
        const currentTemplatesConfigs = config.templatesConfigs || {}
        const currentDesignConfig = currentTemplatesConfigs[currentDesign] || {}
        const updatedDesignConfig = {
            ...currentDesignConfig,
            [colorKey]: value
        }
        if (colorKey === 'primaryColor') {
            setPrimaryColor(value)
        }
        setConfig({
            ...config,
            templatesConfigs: {
                ...currentTemplatesConfigs,
                [currentDesign]: updatedDesignConfig
            }
        })
    }

    const handleSelectDesign = async (design: string) => {
        setIsSaving(true)
        try {
            const res = await updateRestaurantDesign(design)
            if (res.success) {
                setCurrentDesign(design)
                toast.success("Design updated successfully!")
                router.refresh()
            } else {
                toast.error("Failed to update design")
            }
        } catch (e) {
            toast.error("An error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveConfig = async () => {
        setIsSaving(true)
        try {
            const activePrimaryColor = getTemplateColor('primaryColor')
            const activeBgColor = getTemplateColor('backgroundColor')
            const activeTextColor = getTemplateColor('textColor')
            const activeCardColor = getTemplateColor('cardColor')
            const activeBtnBg = getTemplateColor('buttonBgColor')
            const activeBtnText = getTemplateColor('buttonTextColor')
            const activeHeaderBg = getTemplateColor('headerBgColor')
            const activeHeaderTextColor = getTemplateColor('headerTextColor')
            const activeFooterBg = getTemplateColor('footerBgColor')
            const activeFooterText = getTemplateColor('footerTextColor')
            const activeCatBg = getTemplateColor('categoryBgColor')
            const activeCatHighlight = getTemplateColor('categoryHighlightColor')
            const activePriceColor = getTemplateColor('priceColor')

            const res = await updateRestaurantConfig({
                primaryColor: activePrimaryColor,
                heroTitle: config.heroTitle,
                description: initialData.description,
                logo: config.logo,
                coverImage: config.coverImage,
                address: config.address,
                phone: config.phone,
                hours: config.hours,
                pageTitle: config.pageTitle,
                backgroundColor: activeBgColor,
                textColor: activeTextColor,
                cardColor: activeCardColor,
                reservationOpenTime: config.reservationOpenTime,
                reservationCloseTime: config.reservationCloseTime,
                buttonBgColor: activeBtnBg,
                buttonTextColor: activeBtnText,
                headerBgColor: activeHeaderBg,
                headerTextColor: activeHeaderTextColor,
                footerBgColor: activeFooterBg,
                footerTextColor: activeFooterText,
                categoryBgColor: activeCatBg,
                categoryHighlightColor: activeCatHighlight,
                priceColor: activePriceColor,
                templatesConfigs: config.templatesConfigs
            })

            if (res.success) {
                toast.success("Configuration saved!")
                router.refresh()
            } else {
                toast.error("Failed to save configuration")
            }
        } catch (e) {
            toast.error("An error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    const designs = [
        {
            id: 'classic',
            name: 'Classic Bistro',
            description: 'The original vibrant light theme. Perfect for casual dining and cafes.',
            features: ['Light Theme', 'Colorful Accents', 'Card-based Layout'],
            color: 'bg-white border-slate-200 text-slate-900'
        },
        {
            id: 'modern',
            name: 'Midnight Modern',
            description: 'A sleek, dark aesthetic with glassmorphism effects. Ideal for fine dining and bars.',
            features: ['Dark Theme', 'Glass Effects', 'Premium Typography'],
            color: 'bg-slate-950 text-white border-slate-800'
        },
        {
            id: 'minimal',
            name: 'Clean Minimalist',
            description: 'Focus on your food with typography-first design. Great for upscale modern spots.',
            features: ['Monochrome', 'Big Imagery', 'Elegant Spacing'],
            color: 'bg-stone-50 border-stone-200 text-slate-900'
        },
        {
            id: 'light',
            name: 'Minimalist Light',
            description: 'A premium, clean luxury design with gold highlights, serif typography, and glassmorphism cards.',
            features: ['Light Theme', 'Ivory & Gold Accents', 'Luxury Typography'],
            color: 'bg-amber-50/20 border-amber-200 text-stone-900'
        },
        {
            id: 'luxury',
            name: 'Dark Luxury',
            description: 'A deep, cozy, and cinematic chocolate theme with warm orange/gold accents and glowing category borders.',
            features: ['Dark Theme', 'Warm Glows', 'Cinematic Layout'],
            color: 'bg-stone-950 text-orange-200 border-amber-900/40'
        },
        {
            id: 'moroccan',
            name: 'Riad Marocain',
            description: 'A rich traditional Moroccan aesthetic with zellige patterns, terracotta and gold accents.',
            features: ['Terracotta & Gold', 'Geometric Patterns', 'Arch-Styled Cards'],
            color: 'bg-amber-50 border-amber-300 text-amber-900'
        },
        {
            id: 'italian',
            name: 'Trattoria Italiana',
            description: 'A warm, rustic Italian aesthetic with terracotta colors, olive accents, and serif typography.',
            features: ['Ivory Plaster Background', 'Olive & Terracotta Accents', 'Classic serif headers'],
            color: 'bg-[#FDFBF7] text-green-900 border-orange-200'
        }
    ]

    return (
        <div className="space-y-8 max-w-6xl animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                    <Paintbrush className="text-purple-600" /> Design Studio
                </h1>
                <p className="text-slate-500 mt-1">
                    Customize your restaurant's appearance and branding.
                </p>
            </div>

            <div className="flex gap-4 border-b">
                <button
                    onClick={() => setActiveTab('themes')}
                    className={`pb-4 px-2 font-medium transition-all border-b-2 ${activeTab === 'themes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                >
                    Themes
                </button>
                <button
                    onClick={() => setActiveTab('customize')}
                    className={`pb-4 px-2 font-medium transition-all border-b-2 ${activeTab === 'customize' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                >
                    Customization
                </button>
            </div>

            {activeTab === 'themes' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {designs.map((design) => (
                        <div
                            key={design.id}
                            className={`relative group cursor-pointer transition-all duration-300 ${currentDesign === design.id
                                ? 'transform scale-105 ring-4 ring-primary/20 shadow-2xl'
                                : 'hover:scale-[1.02] hover:shadow-xl'
                                }`}
                            onClick={() => !isSaving && handleSelectDesign(design.id)}
                        >
                            <div className={`h-full rounded-3xl border overflow-hidden flex flex-col ${design.color}`}>
                                {/* Preview Header */}
                                <div className="h-32 w-full bg-gradient-to-br from-current to-transparent opacity-10 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                        <Paintbrush size={64} />
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-black mb-2">{design.name}</h3>
                                        <p className="text-sm opacity-70 leading-relaxed font-medium">
                                            {design.description}
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-8 flex-1">
                                        {design.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60">
                                                <Check size={12} strokeWidth={4} /> {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        className={`w-full h-14 rounded-2xl font-bold text-lg shadow-lg ${currentDesign === design.id
                                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                            }`}
                                        disabled={isSaving}
                                    >
                                        {isSaving && currentDesign === design.id ? (
                                            <Loader2 className="animate-spin mr-2" />
                                        ) : currentDesign === design.id ? (
                                            <>Active Theme <Check className="ml-2" strokeWidth={3} /></>
                                        ) : (
                                            "Select Theme"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Type size={20} /> Text & Branding
                            </CardTitle>
                            <CardDescription>
                                Customize the text that appears on your landing page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Page Title (Browser Tab)</label>
                                <input
                                    type="text"
                                    value={config.pageTitle || ''}
                                    onChange={(e) => setConfig({ ...config, pageTitle: e.target.value })}
                                    placeholder="e.g. Best Restaurant in Town"
                                    className="w-full p-3 rounded-xl border bg-background text-slate-900 dark:text-white"
                                />
                                <p className="text-xs text-slate-500">The text shown in the browser tab and search results.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hero Title</label>
                                <input
                                    type="text"
                                    value={config.heroTitle || ''}
                                    onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                                    placeholder="e.g. Delicious moments, served fresh."
                                    className="w-full p-3 rounded-xl border bg-background text-slate-900 dark:text-white"
                                />
                                <p className="text-xs text-slate-500">The main big text displayed on top of your page.</p>
                            </div>

                            {/* Add more fields as needed */}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon size={20} /> Appearance
                            </CardTitle>
                            <CardDescription>
                                Adjust visual aspects of your site.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Primary Highlight Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('primaryColor')}
                                        onChange={(e) => setTemplateColor('primaryColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('primaryColor')}
                                        onChange={(e) => setTemplateColor('primaryColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        maxLength={7}
                                    />
                                </div>
                                <p className="text-xs text-slate-500">Used for buttons, links, and important accents.</p>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <label className="text-sm font-medium">Background Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('backgroundColor')}
                                        onChange={(e) => setTemplateColor('backgroundColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('backgroundColor')}
                                        onChange={(e) => setTemplateColor('backgroundColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        placeholder="#FFFFFF"
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <label className="text-sm font-medium">Text Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('textColor')}
                                        onChange={(e) => setTemplateColor('textColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('textColor')}
                                        onChange={(e) => setTemplateColor('textColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        placeholder="#0F172A"
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <label className="text-sm font-medium">Card / Secondary Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('cardColor')}
                                        onChange={(e) => setTemplateColor('cardColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('cardColor')}
                                        onChange={(e) => setTemplateColor('cardColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        placeholder="#F8FAFC"
                                        maxLength={7}
                                    />
                                </div>
                                <p className="text-xs text-slate-500">Background for cards, headers, or contrast sections.</p>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <label className="text-sm font-semibold text-purple-700">Button Background Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('buttonBgColor')}
                                        onChange={(e) => setTemplateColor('buttonBgColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('buttonBgColor')}
                                        onChange={(e) => setTemplateColor('buttonBgColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        placeholder="#3B82F6"
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <label className="text-sm font-semibold text-purple-700">Button Text Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('buttonTextColor')}
                                        onChange={(e) => setTemplateColor('buttonTextColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('buttonTextColor')}
                                        onChange={(e) => setTemplateColor('buttonTextColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        placeholder="#FFFFFF"
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <label className="text-sm font-semibold text-emerald-700">Header Background Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('headerBgColor')}
                                        onChange={(e) => setTemplateColor('headerBgColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('headerBgColor')}
                                        onChange={(e) => setTemplateColor('headerBgColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        placeholder="#FFFFFF"
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <label className="text-sm font-semibold text-emerald-700">Header Text/Link Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('headerTextColor')}
                                        onChange={(e) => setTemplateColor('headerTextColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('headerTextColor')}
                                        onChange={(e) => setTemplateColor('headerTextColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        placeholder="#0F172A"
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <label className="text-sm font-semibold text-amber-700">Footer Background Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('footerBgColor')}
                                        onChange={(e) => setTemplateColor('footerBgColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('footerBgColor')}
                                        onChange={(e) => setTemplateColor('footerBgColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        placeholder="#1E293B"
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <label className="text-sm font-semibold text-amber-700">Footer Text/Link Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('footerTextColor')}
                                        onChange={(e) => setTemplateColor('footerTextColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('footerTextColor')}
                                        onChange={(e) => setTemplateColor('footerTextColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        placeholder="#F8FAFC"
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <label className="text-sm font-semibold text-blue-700">Category Bar Background Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('categoryBgColor')}
                                        onChange={(e) => setTemplateColor('categoryBgColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('categoryBgColor')}
                                        onChange={(e) => setTemplateColor('categoryBgColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        placeholder="#FFFFFF"
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <label className="text-sm font-semibold text-blue-700">Category Active Text/Highlight</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('categoryHighlightColor')}
                                        onChange={(e) => setTemplateColor('categoryHighlightColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('categoryHighlightColor')}
                                        onChange={(e) => setTemplateColor('categoryHighlightColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        placeholder="#3B82F6"
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <label className="text-sm font-semibold text-rose-700">Price Text Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={getTemplateColor('priceColor')}
                                        onChange={(e) => setTemplateColor('priceColor', e.target.value)}
                                        className="h-12 w-12 p-1 rounded-lg cursor-pointer transition-transform active:scale-95"
                                    />
                                    <input
                                        type="text"
                                        value={getTemplateColor('priceColor')}
                                        onChange={(e) => setTemplateColor('priceColor', e.target.value)}
                                        className="flex-1 p-3 rounded-xl border bg-background text-slate-900 dark:text-white font-mono uppercase"
                                        placeholder="#2563EB"
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Logo URL</label>
                                <input
                                    type="text"
                                    value={config.logo || initialData.logo || ''}
                                    onChange={(e) => setConfig({ ...config, logo: e.target.value })}
                                    placeholder="https://example.com/logo.png"
                                    className="w-full p-3 rounded-xl border bg-background text-slate-900 dark:text-white"
                                />
                                <p className="text-xs text-slate-500">URL to your logo image. Leave empty to use site initial.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cover Image URL</label>
                                <input
                                    type="text"
                                    value={config.coverImage || initialData.coverImage || ''}
                                    onChange={(e) => setConfig({ ...config, coverImage: e.target.value })}
                                    placeholder="https://example.com/cover.jpg"
                                    className="w-full p-3 rounded-xl border bg-background text-slate-900 dark:text-white"
                                />
                                <p className="text-xs text-slate-500">Main background image for the hero section.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Check size={20} /> Contact Details
                            </CardTitle>
                            <CardDescription>
                                Information displayed in the footer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <input
                                        type="text"
                                        value={config.phone || ''}
                                        onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                                        placeholder="+1 234 567 890"
                                        className="w-full p-3 rounded-xl border bg-background text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Address</label>
                                    <input
                                        type="text"
                                        value={config.address || ''}
                                        onChange={(e) => setConfig({ ...config, address: e.target.value })}
                                        placeholder="123 Main St, City"
                                        className="w-full p-3 rounded-xl border bg-background text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Opening Hours (Text for footer)</label>
                                <textarea
                                    value={config.hours || ''}
                                    onChange={(e) => setConfig({ ...config, hours: e.target.value })}
                                    placeholder="Mon-Fri: 9am - 10pm"
                                    className="w-full p-3 rounded-xl border bg-background text-slate-900 dark:text-white min-h-[80px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6 mt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--primary)] flex items-center gap-2">Reservation Open Time</label>
                                    <input
                                        type="time"
                                        value={config.reservationOpenTime || '08:00'}
                                        onChange={(e) => setConfig({ ...config, reservationOpenTime: e.target.value })}
                                        className="w-full p-3 rounded-xl border bg-background text-slate-900 dark:text-white text-sm"
                                    />
                                    <p className="text-xs text-slate-500">The earliest time customers can book.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--primary)] flex items-center gap-2">Reservation Close Time</label>
                                    <input
                                        type="time"
                                        value={config.reservationCloseTime || '23:30'}
                                        onChange={(e) => setConfig({ ...config, reservationCloseTime: e.target.value })}
                                        className="w-full p-3 rounded-xl border bg-background text-slate-900 dark:text-white text-sm"
                                    />
                                    <p className="text-xs text-slate-500">The latest time customers can book.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="col-span-1 md:col-span-2 flex justify-end">
                        <Button
                            onClick={handleSaveConfig}
                            disabled={isSaving}
                            className="bg-primary h-12 px-8 rounded-xl font-bold"
                        >
                            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
