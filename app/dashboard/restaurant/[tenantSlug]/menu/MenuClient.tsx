'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    Plus,
    Trash2,
    Tag,
    Utensils,
    DollarSign,
    Edit2,
    Check,
    X,
    Eye,
    EyeOff
} from 'lucide-react'
import {
    createCategory,
    deleteCategory,
    updateCategory,
    createDish,
    deleteDish,
    updateDish,
    uploadDishImage
} from '@/app/actions/restaurant'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { translations, Language } from '@/lib/translations'
import { ChevronLeft, Globe, Loader2, Upload } from 'lucide-react'

type Dish = {
    id: string
    name: string
    description?: string | null
    price: number
    image?: string | null
    isActive: boolean
    categoryId: string
}

type Category = {
    id: string
    name: string
    isActive: boolean
    dishes?: Dish[]
}

export default function MenuClient({ initialCategories, tenantSlug }: { initialCategories: Category[], tenantSlug: string }) {
    const router = useRouter()
    const [lang, setLang] = useState<Language>('fr')
    const t = translations[lang].admin

    const [newCatName, setNewCatName] = useState('')
    const [loading, setLoading] = useState(false)
    const [addingDishTo, setAddingDishTo] = useState<string | null>(null)
    const [editingCat, setEditingCat] = useState<string | null>(null)
    const [editingDish, setEditingDish] = useState<string | null>(null)
    const [tempCatName, setTempCatName] = useState('')

    // Dish form state
    const [dishForm, setDishForm] = useState({ name: '', description: '', price: '', image: '', isActive: true })
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [optionGroups, setOptionGroups] = useState<any[]>([])
    const [addonsList, setAddonsList] = useState<any[]>([])
    const [uploading, setUploading] = useState(false)

    // Addon adding input state
    const [newAddonName, setNewAddonName] = useState('')
    const [newAddonPrice, setNewAddonPrice] = useState('')

    const AVAILABLE_TAGS = ['Vegan', 'Gluten-Free', 'Spicy 🌶️', 'Halal', 'Vegetarian']

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
    }

    const handleAddAddon = () => {
        if (!newAddonName.trim() || !newAddonPrice) return
        setAddonsList(prev => [...prev, { name: newAddonName.trim(), price: parseFloat(newAddonPrice) }])
        setNewAddonName('')
        setNewAddonPrice('')
    }

    const handleRemoveAddon = (index: number) => {
        setAddonsList(prev => prev.filter((_, i) => i !== index))
    }

    const handleAddOptionGroup = () => {
        setOptionGroups(prev => [...prev, {
            name: 'Option Group',
            required: false,
            choices: [{ name: 'Regular', priceModifier: 0 }]
        }])
    }

    const handleRemoveOptionGroup = (groupIndex: number) => {
        setOptionGroups(prev => prev.filter((_, i) => i !== groupIndex))
    }

    const handleUpdateGroupName = (groupIndex: number, name: string) => {
        setOptionGroups(prev => prev.map((g, i) => i === groupIndex ? { ...g, name } : g))
    }

    const handleToggleGroupRequired = (groupIndex: number) => {
        setOptionGroups(prev => prev.map((g, i) => i === groupIndex ? { ...g, required: !g.required } : g))
    }

    const handleAddChoice = (groupIndex: number) => {
        setOptionGroups(prev => prev.map((g, i) => i === groupIndex ? {
            ...g,
            choices: [...(g.choices || []), { name: '', priceModifier: 0 }]
        } : g))
    }

    const handleRemoveChoice = (groupIndex: number, choiceIndex: number) => {
        setOptionGroups(prev => prev.map((g, i) => i === groupIndex ? {
            ...g,
            choices: g.choices.filter((_: any, ci: number) => ci !== choiceIndex)
        } : g))
    }

    const handleUpdateChoiceChoice = (groupIndex: number, choiceIndex: number, key: string, value: any) => {
        setOptionGroups(prev => prev.map((g, i) => i === groupIndex ? {
            ...g,
            choices: g.choices.map((c: any, ci: number) => ci === choiceIndex ? { ...c, [key]: value } : c)
        } : g))
    }

    const resetDishForm = () => {
        setDishForm({ name: '', description: '', price: '', image: '', isActive: true })
        setSelectedTags([])
        setOptionGroups([])
        setAddonsList([])
        setAddingDishTo(null)
        setEditingDish(null)
        setUploading(false)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('imageFile', file)

        try {
            const res = await uploadDishImage(formData)
            if (res?.error) {
                alert(res.error)
            } else if (res?.url) {
                setDishForm(prev => ({ ...prev, image: res.url }))
            }
        } catch (err) {
            alert('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const toggleLanguage = () => {
        setLang(current => current === 'fr' ? 'en' : 'fr')
    }

    const handleAddCategory = async () => {
        if (!newCatName.trim()) return
        setLoading(true)
        try {
            const res = await createCategory(newCatName, tenantSlug)
            if (res?.error) alert(res.error)
            else setNewCatName('')
        } catch {
            alert('A system error occurred. Please try again.')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleUpdateCategory = async (id: string) => {
        if (!tempCatName.trim()) return
        setLoading(true)
        try {
            const res = await updateCategory(id, { name: tempCatName }, tenantSlug)
            if (res?.error) alert(res.error)
            else setEditingCat(null)
        } catch {
            alert('Failed to update category')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleToggleCategory = async (id: string, currentStatus: boolean) => {
        setLoading(true)
        try {
            const res = await updateCategory(id, { isActive: !currentStatus }, tenantSlug)
            if (res?.error) alert(res.error)
        } catch {
            alert('Failed to toggle status')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure? All dishes in this category will be lost.')) return
        try {
            const res = await deleteCategory(id, tenantSlug)
            if (res?.error) alert(res.error)
        } catch {
            alert('Failed to delete category')
        } finally {
            router.refresh()
        }
    }

    const handleSaveDish = async (categoryId: string) => {
        if (!dishForm.name || !dishForm.price) return
        setLoading(true)

        const payload = {
            ...dishForm,
            price: parseFloat(dishForm.price),
            tags: JSON.stringify(selectedTags),
            options: JSON.stringify(optionGroups),
            addons: JSON.stringify(addonsList)
        }

        try {
            let res;
            if (editingDish) {
                res = await updateDish(editingDish, payload, tenantSlug)
            } else {
                res = await createDish(categoryId, payload, tenantSlug)
            }

            if (res?.error) alert(res.error)
            else {
                resetDishForm()
            }
        } catch {
            alert('Failed to save dish')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleEditDish = (dish: Dish) => {
        setDishForm({
            name: dish.name,
            description: dish.description || '',
            price: dish.price.toString(),
            image: dish.image || '',
            isActive: dish.isActive
        })

        let tags: string[] = []
        try { tags = JSON.parse((dish as any).tags || '[]') } catch {}
        setSelectedTags(tags)

        let options: any[] = []
        try { options = JSON.parse((dish as any).options || '[]') } catch {}
        setOptionGroups(options)

        let addons: any[] = []
        try { addons = JSON.parse((dish as any).addons || '[]') } catch {}
        setAddonsList(addons)

        setEditingDish(dish.id)
        setAddingDishTo(dish.categoryId)
    }

    const handleToggleDish = async (id: string, currentStatus: boolean) => {
        try {
            const res = await updateDish(id, { isActive: !currentStatus }, tenantSlug)
            if (res?.error) alert(res.error)
        } catch {
            alert('Failed to update item availability')
        } finally {
            router.refresh()
        }
    }

    const handleDeleteDish = async (id: string) => {
        if (!confirm('Delete this item?')) return
        try {
            const res = await deleteDish(id, tenantSlug)
            if (res?.error) alert(res.error)
        } catch {
            alert('Failed to delete item')
        } finally {
            router.refresh()
        }
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href={`/dashboard/restaurant/${tenantSlug}`} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> {t.back_dashboard}
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Utensils className="text-blue-600" /> {t.menu_management}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {t.menu_desc}
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={toggleLanguage}
                    className="gap-2 bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white transition-all"
                >
                    <Globe size={16} />
                    {lang === 'fr' ? 'Français' : 'English'}
                </Button>
            </div>

            <div className="space-y-6">
                {/* Category Creator */}
                <Card className="glass-card bg-blue-50/50 border-blue-100 shadow-none">
                    <CardContent className="pt-6 px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Input
                                placeholder={t.new_cat_placeholder}
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                disabled={loading}
                                className="bg-white border-blue-100 h-12 rounded-xl w-full"
                            />
                            <Button onClick={handleAddCategory} disabled={loading || !newCatName.trim()} className="w-full sm:w-auto shrink-0 gap-2 h-12 px-8 rounded-xl shadow-lg shadow-blue-500/10">
                                <Plus size={18} /> {t.add_category}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Category List */}
                <div className="grid gap-8">
                    {initialCategories.length === 0 ? (
                        <div className="text-center py-24 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                            <Tag className="mx-auto text-slate-300 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-slate-900">{t.empty_menu}</h3>
                            <p className="text-slate-500">{t.empty_menu_desc}</p>
                        </div>
                    ) : (
                        initialCategories.map((cat) => (
                            <Card key={cat.id} className={`overflow-hidden border-slate-200/60 shadow-none rounded-4xl transition-all ${!cat.isActive ? 'opacity-60 bg-slate-50' : 'bg-white'}`}>
                                <CardHeader className="bg-slate-50/50 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 sm:py-6 px-5 sm:px-8 border-b border-slate-100">
                                    <div className="flex items-center gap-4 flex-1 w-full">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ring-1 ring-slate-200/50 shrink-0 ${cat.isActive ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                                            <Tag size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {editingCat === cat.id ? (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        value={tempCatName}
                                                        onChange={(e) => setTempCatName(e.target.value)}
                                                        className="h-10 text-lg font-bold w-full max-w-sm"
                                                        autoFocus
                                                    />
                                                    <Button size="icon" className="h-10 w-10 rounded-xl shrink-0" onClick={() => handleUpdateCategory(cat.id)}>
                                                        <Check size={18} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl shrink-0" onClick={() => setEditingCat(null)}>
                                                        <X size={18} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <CardTitle className="text-xl sm:text-2xl font-black truncate">{cat.name}</CardTitle>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 shrink-0" onClick={() => { setEditingCat(cat.id); setTempCatName(cat.name); }}>
                                                        <Edit2 size={14} />
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cat.dishes?.length || 0} {t.items}</p>
                                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${cat.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                    {cat.isActive ? t.visible : t.hidden}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t border-slate-100 sm:border-0 pt-3 sm:pt-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`rounded-xl gap-2 h-10 flex-1 sm:flex-none ${cat.isActive ? 'text-slate-600' : 'text-emerald-600 border-emerald-100 bg-emerald-50'}`}
                                            onClick={() => handleToggleCategory(cat.id, cat.isActive)}
                                        >
                                            {cat.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                            {cat.isActive ? t.disable : t.enable}
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)} className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-10 w-10 shrink-0">
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {cat.dishes?.map((dish: Dish) => (
                                            <div key={dish.id} className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 group transition-all ${!dish.isActive ? 'bg-slate-50/50 grayscale-[0.5]' : 'hover:bg-slate-50/30'}`}>
                                                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-white flex items-center justify-center overflow-hidden ring-1 ring-slate-100 shadow-sm shrink-0 relative">
                                                        {dish.image ? (
                                                            <Image src={dish.image} fill sizes="80px" className="object-cover" alt={dish.name} />
                                                        ) : (
                                                            <Utensils size={24} className="text-slate-100 sm:h-7 sm:w-7" />
                                                        )}
                                                        {!dish.isActive && (
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                                                <EyeOff size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <h4 className="font-bold text-base sm:text-lg truncate">{dish.name}</h4>
                                                            {!dish.isActive && (
                                                                <span className="text-[9px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-black uppercase shrink-0">{t.out_of_stock}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs sm:text-sm text-slate-500 max-w-md line-clamp-1 italic">{dish.description || 'No description.'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 w-full sm:w-auto pt-3 sm:pt-0 border-t border-slate-100 sm:border-0">
                                                    <span className="font-black text-lg sm:text-xl text-blue-600 tracking-tight">{dish.price.toFixed(2)} MAD</span>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleToggleDish(dish.id, dish.isActive)}
                                                            className={`rounded-xl h-10 w-10 shrink-0 ${dish.isActive ? 'text-slate-300 hover:text-emerald-500 hover:bg-emerald-50' : 'text-emerald-600 bg-emerald-50'}`}
                                                            title={dish.isActive ? 'Hide item' : 'Show item'}
                                                        >
                                                            {dish.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEditDish(dish)}
                                                            className="rounded-xl h-10 w-10 text-slate-300 hover:text-blue-600 hover:bg-blue-50 shrink-0"
                                                        >
                                                            <Edit2 size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteDish(dish.id)}
                                                            className="rounded-xl h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50 shrink-0"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {addingDishTo === cat.id ? (
                                            <div className="p-4 sm:p-10 bg-slate-50/50 space-y-6 animate-in slide-in-from-top-4 duration-300 border-t border-slate-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-xl font-black">{editingDish ? t.edit_dish : t.create_dish}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-500">{t.available_question}</span>
                                                        <button
                                                            onClick={() => setDishForm({ ...dishForm, isActive: !dishForm.isActive })}
                                                            className={`h-6 w-11 rounded-full transition-colors relative ${dishForm.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                                        >
                                                            <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${dishForm.isActive ? 'left-6' : 'left-1'}`} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black text-slate-400 uppercase ml-1">{t.dish_name}</label>
                                                        <Input
                                                            placeholder="e.g. Italian Pizza"
                                                            value={dishForm.name}
                                                            onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                                                            className="h-12 rounded-xl text-lg font-medium"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Price (MAD)</label>
                                                        <div className="relative">
                                                            <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                            <Input
                                                                placeholder="0.00"
                                                                type="text"
                                                                inputMode="decimal"
                                                                className="pl-10 h-12 rounded-xl text-lg font-bold"
                                                                value={dishForm.price}
                                                                onChange={(e) => {
                                                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                                                    setDishForm({ ...dishForm, price: val });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase ml-1">{t.ingredients}</label>
                                                    <Input
                                                        placeholder="Tomatoes, mozzarella, fresh basil..."
                                                        value={dishForm.description}
                                                        onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                                                        className="h-12 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs font-black text-slate-400 uppercase ml-1">
                                                        {lang === 'fr' ? 'Image du plat' : 'Dish Image'}
                                                    </label>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                                                        {/* Image Preview & File Upload */}
                                                        <div className="flex flex-col gap-3">
                                                            <div className="relative h-32 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden group">
                                                                {dishForm.image ? (
                                                                    <>
                                                                        <Image src={dishForm.image} fill className="object-cover" alt="Dish Preview" />
                                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setDishForm(prev => ({ ...prev, image: '' }))}
                                                                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-md"
                                                                            >
                                                                                {lang === 'fr' ? 'Supprimer' : 'Remove'}
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                ) : uploading ? (
                                                                    <div className="flex flex-col items-center gap-2">
                                                                        <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                                                                        <span className="text-xs text-slate-500 font-bold">
                                                                            {lang === 'fr' ? 'Téléversement...' : 'Uploading...'}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-slate-100/50 transition-colors">
                                                                        <Upload className="h-6 w-6 text-slate-400" />
                                                                        <span className="text-xs text-slate-500 font-bold text-center px-4">
                                                                            {lang === 'fr' ? 'Téléverser un fichier' : 'Upload Image File'}
                                                                        </span>
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            className="hidden"
                                                                            onChange={handleImageUpload}
                                                                            disabled={uploading}
                                                                        />
                                                                    </label>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Manual URL Input fallback */}
                                                        <div className="space-y-2">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase ml-1">
                                                                {lang === 'fr' ? "Ou coller l'URL d'une image" : "Or paste image URL"}
                                                            </span>
                                                            <Input
                                                                placeholder="https://images.unsplash.com/..."
                                                                value={dishForm.image}
                                                                onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                                                                className="h-12 rounded-xl text-sm"
                                                                disabled={uploading}
                                                            />
                                                            <p className="text-[10px] text-slate-400 ml-1 leading-normal">
                                                                {lang === 'fr' 
                                                                    ? "Sélectionnez un fichier pour l'héberger localement ou entrez directement l'URL d'une image en ligne."
                                                                    : "Select an image file to host it locally or enter a web URL directly."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dietary Tags */}
                                                <div className="space-y-3 pt-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Dietary & Allergen Tags</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {AVAILABLE_TAGS.map(tag => {
                                                            const isSelected = selectedTags.includes(tag)
                                                            return (
                                                                <button
                                                                    key={tag}
                                                                    type="button"
                                                                    onClick={() => toggleTag(tag)}
                                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                                                        isSelected
                                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                                    }`}
                                                                >
                                                                    {tag}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Option Groups */}
                                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Option Groups (e.g., Size, Doneness)</label>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleAddOptionGroup}
                                                            className="h-8 rounded-lg text-xs font-bold text-blue-600 border-blue-100 hover:bg-blue-50"
                                                        >
                                                            <Plus size={14} className="mr-1" /> Add Group
                                                        </Button>
                                                    </div>

                                                    {optionGroups.map((group, gIndex) => (
                                                        <div key={gIndex} className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-4 shadow-sm relative">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveOptionGroup(gIndex)}
                                                                className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors p-1 animate-all duration-300"
                                                                title="Remove group"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-6">
                                                                <div className="space-y-1">
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase ml-0.5">Group Name</span>
                                                                    <Input
                                                                        value={group.name}
                                                                        onChange={(e) => handleUpdateGroupName(gIndex, e.target.value)}
                                                                        className="h-9 text-sm rounded-lg"
                                                                        placeholder="e.g. Size"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-2 pt-5">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`req-${gIndex}`}
                                                                        checked={group.required}
                                                                        onChange={() => handleToggleGroupRequired(gIndex)}
                                                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                                    />
                                                                    <label htmlFor={`req-${gIndex}`} className="text-xs font-bold text-slate-600 cursor-pointer">
                                                                        Required selection
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            {/* Choices */}
                                                            <div className="space-y-2.5">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase ml-0.5">Choices & Price Modifiers</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleAddChoice(gIndex)}
                                                                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                                                                    >
                                                                        <Plus size={12} /> Add Choice
                                                                    </button>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    {group.choices?.map((choice: any, cIndex: number) => (
                                                                        <div key={cIndex} className="flex gap-3 items-center">
                                                                            <Input
                                                                                value={choice.name}
                                                                                onChange={(e) => handleUpdateChoiceChoice(gIndex, cIndex, 'name', e.target.value)}
                                                                                placeholder="Choice name (e.g. Large)"
                                                                                className="h-9 text-sm rounded-lg flex-1"
                                                                            />
                                                                            <div className="relative w-32">
                                                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">+</span>
                                                                                <Input
                                                                                    value={choice.priceModifier}
                                                                                    onChange={(e) => {
                                                                                        const val = parseFloat(e.target.value) || 0
                                                                                        handleUpdateChoiceChoice(gIndex, cIndex, 'priceModifier', val)
                                                                                    }}
                                                                                    placeholder="0.00"
                                                                                    type="number"
                                                                                    className="pl-6 h-9 text-sm rounded-lg text-right pr-2 font-bold text-slate-700"
                                                                                />
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveChoice(gIndex, cIndex)}
                                                                                disabled={group.choices.length <= 1}
                                                                                className="text-slate-300 hover:text-rose-500 disabled:opacity-30 transition-colors p-1"
                                                                            >
                                                                                <X size={16} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Add-ons */}
                                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Extra Add-ons (e.g. Extra Cheese, Avocado)</label>
                                                    
                                                    {addonsList.length > 0 && (
                                                        <div className="flex flex-wrap gap-2.5 p-4 bg-white border border-slate-100 rounded-2xl">
                                                            {addonsList.map((addon, index) => (
                                                                <div key={index} className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-3 pr-2 text-xs font-bold text-slate-700">
                                                                    <span>{addon.name} (+{addon.price} MAD)</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveAddon(index)}
                                                                        className="text-slate-400 hover:text-rose-500 rounded p-0.5"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex gap-3 items-center">
                                                        <Input
                                                            value={newAddonName}
                                                            onChange={(e) => setNewAddonName(e.target.value)}
                                                            placeholder="Addon name (e.g. Extra Cheese)"
                                                            className="h-10 text-sm rounded-xl flex-1 bg-white"
                                                        />
                                                        <div className="relative w-36">
                                                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                            <Input
                                                                value={newAddonPrice}
                                                                onChange={(e) => setNewAddonPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                                                                placeholder="Price (MAD)"
                                                                className="pl-8 h-10 text-sm rounded-xl bg-white font-bold"
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={handleAddAddon}
                                                            className="h-10 rounded-xl font-bold text-xs border-blue-100 text-blue-600 bg-white"
                                                        >
                                                            Add Addon
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 justify-end pt-4 border-t border-slate-100">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={resetDishForm}
                                                        className="rounded-xl h-12 px-8 font-bold text-slate-500"
                                                    >
                                                        {t.cancel}
                                                    </Button>
                                                    <Button onClick={() => handleSaveDish(cat.id)} disabled={!dishForm.name || !dishForm.price || loading} className="rounded-xl h-12 px-10 font-bold shadow-xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-700">
                                                        {editingDish ? t.update : t.create_dish}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setAddingDishTo(cat.id)}
                                                className="w-full py-8 text-sm font-black text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-3 active:scale-[0.99] border-t border-slate-100"
                                            >
                                                <div className="p-1.5 bg-blue-100 rounded-xl">
                                                    <Plus size={16} />
                                                </div>
                                                {t.add_item_to} {cat.name}
                                            </button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
