'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Minus, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SelectedOption, SelectedAddon } from '@/lib/contexts/CartContext'

interface DishCustomizationModalProps {
    isOpen: boolean
    dish: any // The dish being customized
    onClose: () => void
    onConfirm: (selectedOptions: SelectedOption[], selectedAddons: SelectedAddon[], calculatedPrice: number) => void
    primaryColor?: string
}

export default function DishCustomizationModal({
    isOpen,
    dish,
    onClose,
    onConfirm,
    primaryColor = '#3B82F6'
}: DishCustomizationModalProps) {
    const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([])
    const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([])

    // Parse options and addons
    const options = React.useMemo(() => {
        if (!dish) return []
        try {
            return typeof dish.options === 'string' ? JSON.parse(dish.options || '[]') : (dish.options || [])
        } catch {
            return []
        }
    }, [dish])

    const addons = React.useMemo(() => {
        if (!dish) return []
        try {
            return typeof dish.addons === 'string' ? JSON.parse(dish.addons || '[]') : (dish.addons || [])
        } catch {
            return []
        }
    }, [dish])

    // Pre-populate required option groups with their first choice
    useEffect(() => {
        if (!dish) return
        const initialOptions: SelectedOption[] = []
        
        try {
            const opts = typeof dish.options === 'string' ? JSON.parse(dish.options || '[]') : (dish.options || [])
            for (const group of opts) {
                if (group.required && group.choices && group.choices.length > 0) {
                    initialOptions.push({
                        group: group.name,
                        choice: group.choices[0].name,
                        priceModifier: parseFloat(group.choices[0].priceModifier) || 0
                    })
                }
            }
        } catch (e) {
            console.error('Failed to parse options for customization initial state', e)
        }
        
        setSelectedOptions(initialOptions)
        setSelectedAddons([])
    }, [dish])

    if (!isOpen || !dish) return null

    const basePrice = dish.price || 0
    const optionsPrice = selectedOptions.reduce((sum, o) => sum + o.priceModifier, 0)
    const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0)
    const currentPrice = basePrice + optionsPrice + addonsPrice

    const handleOptionSelect = (groupName: string, choiceName: string, priceModifier: number) => {
        setSelectedOptions(prev => {
            const filtered = prev.filter(o => o.group !== groupName)
            return [...filtered, { group: groupName, choice: choiceName, priceModifier }]
        })
    }

    const handleAddonToggle = (addonName: string, price: number) => {
        setSelectedAddons(prev => {
            const exists = prev.some(a => a.name === addonName)
            if (exists) {
                return prev.filter(a => a.name !== addonName)
            }
            return [...prev, { name: addonName, price }]
        })
    }

    const isGroupSelected = (groupName: string) => {
        return selectedOptions.some(o => o.group === groupName)
    }

    const getSelectedChoice = (groupName: string) => {
        return selectedOptions.find(o => o.group === groupName)?.choice
    }

    const isAddonSelected = (addonName: string) => {
        return selectedAddons.some(a => a.name === addonName)
    }

    const handleConfirm = () => {
        // Validation: check if all required groups are selected
        for (const group of options) {
            if (group.required && !isGroupSelected(group.name)) {
                alert(`Please select an option for ${group.name}`)
                return
            }
        }
        onConfirm(selectedOptions, selectedAddons, currentPrice)
    }

    const containerStyle = {
        '--primary': primaryColor,
    } as React.CSSProperties

    return (
        <div 
            style={containerStyle}
            className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-lg rounded-[2.5rem] border border-slate-100 shadow-3xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-serif font-black text-slate-950 leading-tight">{dish.name}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Customize your dish</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full text-slate-400 hover:text-slate-950 hover:bg-slate-200"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                    {dish.image && (
                        <div className="h-44 w-full rounded-2xl overflow-hidden mb-2 shadow-sm border border-slate-100">
                            <img src={dish.image} className="w-full h-full object-cover" alt={dish.name} />
                        </div>
                    )}

                    {/* Options Groups */}
                    {options.map((group: any, gIndex: number) => (
                        <div key={gIndex} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-serif font-black text-slate-950 text-lg">{group.name}</h4>
                                {group.required ? (
                                    <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Required</span>
                                ) : (
                                    <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Optional</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {group.choices?.map((choice: any, cIndex: number) => {
                                    const isSelected = getSelectedChoice(group.name) === choice.name
                                    const priceMod = parseFloat(choice.priceModifier) || 0
                                    return (
                                        <button
                                            key={cIndex}
                                            type="button"
                                            onClick={() => handleOptionSelect(group.name, choice.name, priceMod)}
                                            className={`px-5 py-3.5 rounded-2xl text-sm font-bold border transition-all text-left flex justify-between items-center ${
                                                isSelected
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]'
                                                    : 'border-slate-100 hover:border-slate-200 bg-white text-slate-700'
                                            }`}
                                        >
                                            <span>{choice.name}</span>
                                            <span className={`text-xs ${isSelected ? 'font-black text-[var(--primary)]' : 'text-slate-400'}`}>
                                                {priceMod > 0 ? `+${priceMod} MAD` : priceMod < 0 ? `${priceMod} MAD` : 'Included'}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Add-ons */}
                    {addons.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-serif font-black text-slate-950 text-lg">Add Extras</h4>
                            <div className="grid grid-cols-1 gap-2.5">
                                {addons.map((addon: any, index: number) => {
                                    const isSelected = isAddonSelected(addon.name)
                                    const price = parseFloat(addon.price) || 0
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleAddonToggle(addon.name, price)}
                                            className={`px-5 py-4 rounded-2xl text-sm font-bold border transition-all flex justify-between items-center text-left ${
                                                isSelected
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]'
                                                    : 'border-slate-100 hover:border-slate-200 bg-white text-slate-700'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`h-5 w-5 rounded border flex items-center justify-center ${
                                                    isSelected ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-slate-200'
                                                }`}>
                                                    {isSelected && <Check size={12} strokeWidth={4} />}
                                                </div>
                                                <span>{addon.name}</span>
                                            </div>
                                            <span className={`text-xs font-bold ${isSelected ? 'text-[var(--primary)]' : 'text-slate-400'}`}>
                                                +{price} MAD
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Customized Price</span>
                        <span className="text-3xl font-serif font-black text-slate-950 tracking-tighter">
                            {currentPrice.toFixed(0)} <span className="text-sm font-normal">MAD</span>
                        </span>
                    </div>

                    <Button
                        onClick={handleConfirm}
                        className="w-full sm:w-auto h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-95 transition-all"
                        style={{ backgroundColor: 'var(--primary)' }}
                    >
                        Add to Order
                    </Button>
                </div>
            </div>
        </div>
    )
}
