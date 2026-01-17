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
    EyeOff,
    MoreVertical
} from 'lucide-react'
import {
    createCategory,
    deleteCategory,
    updateCategory,
    createDish,
    deleteDish,
    updateDish
} from '@/app/actions/restaurant'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { translations, Language } from '@/lib/translations'
import { ChevronLeft, Globe } from 'lucide-react'

export default function MenuClient({ initialCategories, tenantSlug }: { initialCategories: any[], tenantSlug: string }) {
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
        } catch (e) {
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
        } catch (e) {
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
        } catch (e) {
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
        } catch (e) {
            alert('Failed to delete category')
        } finally {
            router.refresh()
        }
    }

    const handleSaveDish = async (categoryId: string) => {
        if (!dishForm.name || !dishForm.price) return
        setLoading(true)

        try {
            let res;
            if (editingDish) {
                res = await updateDish(editingDish, {
                    ...dishForm,
                    price: parseFloat(dishForm.price)
                }, tenantSlug)
            } else {
                res = await createDish(categoryId, {
                    ...dishForm,
                    price: parseFloat(dishForm.price)
                }, tenantSlug)
            }

            if (res?.error) alert(res.error)
            else {
                setDishForm({ name: '', description: '', price: '', image: '', isActive: true })
                setAddingDishTo(null)
                setEditingDish(null)
            }
        } catch (e) {
            alert('Failed to save dish')
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    const handleEditDish = (dish: any) => {
        setDishForm({
            name: dish.name,
            description: dish.description || '',
            price: dish.price.toString(),
            image: dish.image || '',
            isActive: dish.isActive
        })
        setEditingDish(dish.id)
        setAddingDishTo(dish.categoryId)
    }

    const handleToggleDish = async (id: string, currentStatus: boolean) => {
        try {
            const res = await updateDish(id, { isActive: !currentStatus }, tenantSlug)
            if (res?.error) alert(res.error)
        } catch (e) {
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
        } catch (e) {
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
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <Input
                                placeholder={t.new_cat_placeholder}
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                disabled={loading}
                                className="bg-white border-blue-100 h-12 rounded-xl"
                            />
                            <Button onClick={handleAddCategory} disabled={loading || !newCatName.trim()} className="shrink-0 gap-2 h-12 px-8 rounded-xl shadow-lg shadow-blue-500/10">
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
                            <Card key={cat.id} className={`overflow-hidden border-slate-200/60 shadow-none rounded-[2rem] transition-all ${!cat.isActive ? 'opacity-60 bg-slate-50' : 'bg-white'}`}>
                                <CardHeader className="bg-slate-50/50 backdrop-blur-sm flex flex-row items-center justify-between py-6 px-8 border-b border-slate-100">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ring-1 ring-slate-200/50 ${cat.isActive ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                                            <Tag size={20} />
                                        </div>
                                        <div className="flex-1">
                                            {editingCat === cat.id ? (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        value={tempCatName}
                                                        onChange={(e) => setTempCatName(e.target.value)}
                                                        className="h-10 text-lg font-bold w-full max-w-sm"
                                                        autoFocus
                                                    />
                                                    <Button size="icon" className="h-10 w-10 rounded-xl" onClick={() => handleUpdateCategory(cat.id)}>
                                                        <Check size={18} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => setEditingCat(null)}>
                                                        <X size={18} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <CardTitle className="text-2xl font-black">{cat.name}</CardTitle>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => { setEditingCat(cat.id); setTempCatName(cat.name); }}>
                                                        <Edit2 size={14} />
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cat.dishes?.length || 0} {t.items}</p>
                                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${cat.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                    {cat.isActive ? t.visible : t.hidden}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`rounded-xl gap-2 h-10 ${cat.isActive ? 'text-slate-600' : 'text-emerald-600 border-emerald-100 bg-emerald-50'}`}
                                            onClick={() => handleToggleCategory(cat.id, cat.isActive)}
                                        >
                                            {cat.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                            {cat.isActive ? t.disable : t.enable}
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)} className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-10 w-10">
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {cat.dishes?.map((dish: any) => (
                                            <div key={dish.id} className={`p-6 flex items-center justify-between group transition-all ${!dish.isActive ? 'bg-slate-50/50 grayscale-[0.5]' : 'hover:bg-slate-50/30'}`}>
                                                <div className="flex items-center gap-6">
                                                    <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center overflow-hidden ring-1 ring-slate-100 shadow-sm flex-shrink-0 relative">
                                                        {dish.image ? (
                                                            <img src={dish.image} className="object-cover h-full w-full" alt={dish.name} />
                                                        ) : (
                                                            <Utensils size={28} className="text-slate-100" />
                                                        )}
                                                        {!dish.isActive && (
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                                                <EyeOff size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="font-bold text-lg">{dish.name}</h4>
                                                            {!dish.isActive && (
                                                                <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-lg font-black uppercase">{t.out_of_stock}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-500 max-w-md line-clamp-1 italic">{dish.description || 'No description.'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <span className="font-black text-xl text-blue-600 tracking-tight">{dish.price.toFixed(2)} MAD</span>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleToggleDish(dish.id, dish.isActive)}
                                                            className={`rounded-xl h-10 w-10 ${dish.isActive ? 'text-slate-300 hover:text-emerald-500 hover:bg-emerald-50' : 'text-emerald-600 bg-emerald-50'}`}
                                                            title={dish.isActive ? 'Hide item' : 'Show item'}
                                                        >
                                                            {dish.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEditDish(dish)}
                                                            className="rounded-xl h-10 w-10 text-slate-300 hover:text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <Edit2 size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteDish(dish.id)}
                                                            className="rounded-xl h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {addingDishTo === cat.id ? (
                                            <div className="p-10 bg-slate-50/50 space-y-6 animate-in slide-in-from-top-4 duration-300 border-t border-slate-100">
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
                                                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Price ($)</label>
                                                        <div className="relative">
                                                            <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                            <Input
                                                                placeholder="0.00"
                                                                type="number"
                                                                className="pl-10 h-12 rounded-xl text-lg font-bold"
                                                                value={dishForm.price}
                                                                onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
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
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase ml-1">{t.image_url}</label>
                                                    <Input
                                                        placeholder="https://images.unsplash.com/..."
                                                        value={dishForm.image}
                                                        onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                                                        className="h-12 rounded-xl"
                                                    />
                                                </div>
                                                <div className="flex gap-4 justify-end pt-4">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => { setAddingDishTo(null); setEditingDish(null); setDishForm({ name: '', description: '', price: '', image: '', isActive: true }); }}
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
