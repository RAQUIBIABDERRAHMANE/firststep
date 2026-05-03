'use client'

import React, { useState } from 'react'
import { X, Calendar, Clock, Users, Phone, Mail, User, MessageSquare, Check, Loader2, CalendarCheck } from 'lucide-react'
import { createReservation } from '@/app/actions/reservations'

interface ReservationModalProps {
    isOpen?: boolean
    tenantId: string
    siteName: string
    primaryColor?: string
    config?: any
    onClose: () => void
}

export default function ReservationModal({ isOpen, tenantId, siteName, primaryColor, config, onClose }: ReservationModalProps) {
    const primary = primaryColor || '#2563eb'

    // Parse configured times or use defaults
    const openStr = config?.reservationOpenTime || '08:00'
    const closeStr = config?.reservationCloseTime || '23:30'
    
    // Dynamically generate time slots based on configuration
    const TIME_SLOTS = React.useMemo(() => {
        const slots = []
        const [openH, openM] = openStr.split(':').map(Number)
        const [closeH, closeM] = closeStr.split(':').map(Number)
        
        const startMinutes = openH * 60 + openM
        const endMinutes = closeH * 60 + closeM
        
        for (let m = startMinutes; m <= endMinutes; m += 30) {
            const h = Math.floor(m / 60)
            const min = m % 60
            slots.push(`${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`)
        }
        return slots
    }, [openStr, closeStr])

    const [step, setStep] = useState<'form' | 'success'>('form')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split('T')[0]

    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        date: minDate,
        time: TIME_SLOTS[0] || '19:00',
        partySize: 2,
        notes: '',
    })

    const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!form.name || !form.phone || !form.date || !form.time) {
            setError('Please fill in all required fields.')
            return
        }
        setIsSubmitting(true)
        try {
            const res = await createReservation({ tenantId, ...form, partySize: Number(form.partySize) })
            if (res.error) { setError(res.error); return }
            setStep('success')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isOpen === false) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 pb-6 relative overflow-hidden" style={{ backgroundColor: primary }}>
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/40 to-transparent" />
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                    >
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                            <CalendarCheck size={28} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">Reserve a Table</h2>
                            <p className="text-white/70 text-sm mt-0.5">{siteName}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[70vh] overflow-y-auto">
                    {step === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                            <div className="h-20 w-20 rounded-full flex items-center justify-center" style={{ backgroundColor: primary + '20' }}>
                                <Check size={40} style={{ color: primary }} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Reservation Confirmed!</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Thank you, <strong>{form.name}</strong>! Your table for <strong>{form.partySize} people</strong> on <strong>{new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong> at <strong>{form.time}</strong> has been requested. We'll confirm shortly.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-4 h-12 px-8 rounded-2xl text-white font-bold transition-all hover:brightness-110 active:scale-95"
                                style={{ backgroundColor: primary }}
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Calendar size={14} style={{ color: primary }} /> Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={minDate}
                                        value={form.date}
                                        onChange={e => update('date', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm bg-slate-50 text-slate-900"
                                        style={{ '--tw-ring-color': primary } as any}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Clock size={14} style={{ color: primary }} /> Time *
                                    </label>
                                    <select
                                        required
                                        value={form.time}
                                        onChange={e => update('time', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm bg-slate-50 text-slate-900"
                                    >
                                        {TIME_SLOTS.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Party Size */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Users size={14} style={{ color: primary }} /> Number of Guests *
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => update('partySize', Math.max(1, form.partySize - 1))}
                                        className="h-11 w-11 rounded-xl border border-slate-200 font-bold text-xl flex items-center justify-center hover:bg-slate-50 transition-colors"
                                    >−</button>
                                    <div className="flex-1 h-11 rounded-xl border border-slate-200 flex items-center justify-center font-black text-xl text-slate-900 bg-slate-50">
                                        {form.partySize}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => update('partySize', Math.min(20, form.partySize + 1))}
                                        className="h-11 w-11 rounded-xl border border-slate-200 font-bold text-xl flex items-center justify-center hover:bg-slate-50 transition-colors"
                                    >+</button>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <User size={14} style={{ color: primary }} /> Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Your name"
                                    value={form.name}
                                    onChange={e => update('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm bg-slate-50 text-slate-900"
                                />
                            </div>

                            {/* Phone & Email */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Phone size={14} style={{ color: primary }} /> Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+212..."
                                        value={form.phone}
                                        onChange={e => update('phone', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm bg-slate-50 text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Mail size={14} style={{ color: primary }} /> Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="optional"
                                        value={form.email}
                                        onChange={e => update('email', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm bg-slate-50 text-slate-900"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <MessageSquare size={14} style={{ color: primary }} /> Special Requests
                                </label>
                                <textarea
                                    placeholder="Allergies, celebrations, seating preferences..."
                                    value={form.notes}
                                    onChange={e => update('notes', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-sm bg-slate-50 text-slate-900 resize-none"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 rounded-2xl text-white font-black text-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                style={{ backgroundColor: primary }}
                            >
                                {isSubmitting ? (
                                    <><Loader2 size={20} className="animate-spin" /> Processing...</>
                                ) : (
                                    <><CalendarCheck size={20} /> Confirm Reservation</>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
