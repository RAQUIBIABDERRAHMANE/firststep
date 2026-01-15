'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { updateRestaurantDesign } from '@/app/actions/restaurant'
import { Check, Loader2, Paintbrush, Monitor, Smartphone } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Props {
    initialDesign: string
}

export default function DesignSelectionClient({ initialDesign }: Props) {
    const [currentDesign, setCurrentDesign] = useState(initialDesign)
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    const handleSelect = async (design: string) => {
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

    const designs = [
        {
            id: 'classic',
            name: 'Classic Bistro',
            description: 'The original vibrant light theme. Perfect for casual dining and cafes.',
            features: ['Light Theme', 'Colorful Accents', 'Card-based Layout'],
            color: 'bg-white border-slate-200'
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
            color: 'bg-stone-50 border-stone-200'
        }
    ]

    return (
        <div className="space-y-8 max-w-6xl animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    <Paintbrush className="text-purple-600" /> Design Studio
                </h1>
                <p className="text-muted-foreground mt-1">
                    Choose the visual theme that best fits your restaurant's brand.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {designs.map((design) => (
                    <div
                        key={design.id}
                        className={`relative group cursor-pointer transition-all duration-300 ${currentDesign === design.id
                                ? 'transform scale-105 ring-4 ring-primary/20 shadow-2xl'
                                : 'hover:scale-[1.02] hover:shadow-xl'
                            }`}
                        onClick={() => !isSaving && handleSelect(design.id)}
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
        </div>
    )
}
