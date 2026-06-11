'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    CalendarCheck,
    Search,
    Check,
    X,
    Phone,
    Users,
    Clock,
    Loader2,
    LayoutGrid,
    Calendar,
    ChevronLeft,
    ChevronRight,
    MapPin,
    AlertTriangle,
    UserCheck,
    Sparkles,
    CalendarDays,
    CheckCircle2,
    XCircle,
    Trash2,
    Info,
    StickyNote,
} from 'lucide-react'
import {
    updateReservationStatus,
    deleteReservation,
    assignTableToReservation,
    autoAssignTable,
} from '@/app/actions/reservations'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

/* ── Types ── */
interface Reservation {
    id: string
    name: string
    phone: string
    email: string | null
    date: Date
    time: string
    partySize: number
    notes: string | null
    status: string
    tableId: string | null
}

interface Table {
    id: string
    number: string
    capacity: number | null
    isActive: boolean
}

/* ── Constants ── */
const TIMESLOTS = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00',
]

const STATUS_META = {
    PENDING:   { label: 'Pending',   ringCls: 'ring-amber-400/30',   dotCls: 'bg-amber-400',   textCls: 'text-amber-600',   bgCls: 'bg-amber-50',   borderCls: 'border-amber-200' },
    CONFIRMED: { label: 'Confirmed', ringCls: 'ring-emerald-400/30', dotCls: 'bg-emerald-500', textCls: 'text-emerald-700', bgCls: 'bg-emerald-50', borderCls: 'border-emerald-200' },
    CANCELLED: { label: 'Cancelled', ringCls: 'ring-rose-400/30',   dotCls: 'bg-rose-400',    textCls: 'text-rose-600',   bgCls: 'bg-rose-50',   borderCls: 'border-rose-200' },
} as const

function StatusBadge({ status }: { status: string }) {
    const m = STATUS_META[status as keyof typeof STATUS_META] ?? STATUS_META.PENDING
    return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border', m.bgCls, m.textCls, m.borderCls)}>
            <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', m.dotCls, status === 'PENDING' && 'animate-pulse')} />
            {m.label}
        </span>
    )
}

/* ── Component ── */
export default function ReservationsClient({
    tenantSlug,
    initialReservations,
    initialTables,
}: {
    tenantSlug: string
    initialReservations: Reservation[]
    initialTables: Table[]
}) {
    const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
    const [searchTerm, setSearchTerm]     = useState('')
    const [loading, setLoading]           = useState<string | null>(null)
    const [activeTab, setActiveTab]       = useState<'list' | 'calendar'>('list')
    const [selectedResId, setSelectedResId] = useState<string | null>(null)
    const dateStripRef = useRef<HTMLDivElement>(null)

    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const d = new Date()
        d.setHours(0, 0, 0, 0)
        return d
    })

    /* Generate 30-day strip */
    const dateStrip = React.useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() + i)
            d.setHours(0, 0, 0, 0)
            return d
        })
    }, [])

    /* Scroll helpers */
    const scrollStrip = (dir: 'left' | 'right') => {
        if (!dateStripRef.current) return
        dateStripRef.current.scrollBy({ left: dir === 'right' ? 240 : -240, behavior: 'smooth' })
    }

    /* Actions */
    const handleUpdateStatus = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
        setLoading(id)
        try {
            const res = await updateReservationStatus(id, status)
            if (res.error) toast.error(res.error)
            else {
                setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
                toast.success(`Reservation ${status.toLowerCase()}`)
            }
        } finally { setLoading(null) }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this reservation?')) return
        setLoading(id)
        try {
            const res = await deleteReservation(id)
            if (res.error) toast.error(res.error)
            else {
                setReservations(prev => prev.filter(r => r.id !== id))
                toast.success('Reservation deleted')
                if (selectedResId === id) setSelectedResId(null)
            }
        } finally { setLoading(null) }
    }

    const handleAssignTable = async (reservationId: string, tableId: string | null) => {
        setLoading(`assign-${reservationId}`)
        try {
            const res = await assignTableToReservation(reservationId, tableId)
            if (res.error) toast.error(res.error)
            else {
                setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, tableId } : r))
                toast.success(tableId ? 'Table assigned' : 'Table unassigned')
            }
        } catch { toast.error('Failed to assign table') }
        finally { setLoading(null) }
    }

    const handleAutoAssign = async (reservationId: string) => {
        setLoading(`auto-${reservationId}`)
        try {
            const res = await autoAssignTable(reservationId)
            if (res.error) toast.error(res.error)
            else {
                toast.success('Auto-assigned best table')
                if (res.table) setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, tableId: res.table.id } : r))
            }
        } catch { toast.error('Failed to auto-assign') }
        finally { setLoading(null) }
    }

    /* Derived */
    const filtered = reservations.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.includes(searchTerm)
    )

    const dayReservations = React.useMemo(() =>
        reservations.filter(r => {
            const d = new Date(r.date); d.setHours(0, 0, 0, 0)
            return d.toDateString() === selectedDate.toDateString()
        }), [reservations, selectedDate])

    const selectedRes = React.useMemo(() =>
        selectedResId ? reservations.find(r => r.id === selectedResId) ?? null : null,
        [reservations, selectedResId])

    const tableAvailability = React.useMemo(() => {
        if (!selectedRes) return []
        return initialTables.map(t => {
            const occupant = reservations.find(r =>
                r.tableId === t.id &&
                r.status === 'CONFIRMED' &&
                r.id !== selectedRes.id &&
                new Date(r.date).toDateString() === new Date(selectedRes.date).toDateString() &&
                r.time === selectedRes.time
            )
            return { ...t, isOccupied: !!occupant, occupantName: occupant?.name ?? null, capacityOk: t.capacity ? t.capacity >= selectedRes.partySize : true }
        })
    }, [selectedRes, reservations, initialTables])

    const pendingCount   = reservations.filter(r => r.status === 'PENDING').length
    const confirmedCount = reservations.filter(r => r.status === 'CONFIRMED').length

    /* ── Render ── */
    return (
        <div className="space-y-6 animate-fade-in max-w-7xl">

            {/* ════ PAGE HEADER ════ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <CalendarCheck size={18} className="text-blue-500" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bookings &amp; Reservations</h1>
                    </div>
                    <p className="text-sm text-slate-500 pl-11">Manage guest tables and schedules dynamically.</p>
                </div>

                {/* Stats + Tab toggle */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Stat chips */}
                    <div className="flex gap-2">
                        <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-100">
                            <p className="text-lg font-black text-amber-600 leading-none">{pendingCount}</p>
                            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mt-0.5">Pending</p>
                        </div>
                        <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100">
                            <p className="text-lg font-black text-emerald-600 leading-none">{confirmedCount}</p>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mt-0.5">Confirmed</p>
                        </div>
                        <div className="px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200">
                            <p className="text-lg font-black text-slate-700 leading-none">{reservations.length}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total</p>
                        </div>
                    </div>

                    {/* View toggle */}
                    <div className="flex items-center bg-slate-100 border border-slate-200 p-1 rounded-xl gap-0.5">
                        <button
                            onClick={() => { setActiveTab('list'); setSelectedResId(null) }}
                            className={cn(
                                'px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5',
                                activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                            )}
                        >
                            <LayoutGrid size={13} /> List
                        </button>
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={cn(
                                'px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5',
                                activeTab === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                            )}
                        >
                            <Calendar size={13} /> Timeline
                        </button>
                    </div>
                </div>
            </div>

            {/* ════ LIST VIEW ════ */}
            {activeTab === 'list' ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                    {/* Toolbar */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                            <Input
                                placeholder="Search name or phone…"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 h-10 rounded-xl border-slate-200 bg-white text-sm"
                            />
                        </div>
                        <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
                            {filtered.length} result{filtered.length !== 1 && 's'}
                        </span>
                    </div>

                    {/* Empty */}
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70">
                            <CalendarDays size={40} className="text-slate-300 mb-3" />
                            <h3 className="text-base font-black text-slate-700">No reservations found</h3>
                            <p className="text-sm text-slate-400 mt-1">Try adjusting your search filters.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((res) => {
                                const assignedTable = initialTables.find(t => t.id === res.tableId)
                                const isLoading = loading === res.id
                                return (
                                    <div
                                        key={res.id}
                                        className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden"
                                    >
                                        {/* Left accent stripe */}
                                        <div className={cn(
                                            'absolute left-0 top-0 bottom-0 w-[3px]',
                                            res.status === 'CONFIRMED' ? 'bg-emerald-400' :
                                            res.status === 'CANCELLED' ? 'bg-rose-400' : 'bg-amber-400'
                                        )} />

                                        <div className="pl-5 pr-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            {/* Left info */}
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                {/* Avatar */}
                                                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-600 text-base shrink-0">
                                                    {res.name[0]?.toUpperCase()}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="font-black text-slate-900 text-base">{res.name}</span>
                                                        <StatusBadge status={res.status} />
                                                        {assignedTable ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 border border-blue-100 text-blue-600">
                                                                <MapPin size={9} /> Table {assignedTable.number}
                                                            </span>
                                                        ) : res.status === 'CONFIRMED' && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-50 border border-amber-100 text-amber-600 animate-pulse">
                                                                <AlertTriangle size={9} /> Needs Table
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1"><Phone size={11} className="text-slate-300" /> {res.phone}</span>
                                                        <span className="flex items-center gap-1"><Users size={11} className="text-slate-300" /> {res.partySize} guests</span>
                                                        <span className="flex items-center gap-1"><CalendarDays size={11} className="text-slate-300" /> {new Date(res.date).toLocaleDateString()}</span>
                                                        <span className="flex items-center gap-1"><Clock size={11} className="text-slate-300" /> {res.time}</span>
                                                    </div>

                                                    {res.notes && (
                                                        <p className="mt-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-100 max-w-md italic flex items-center gap-1.5">
                                                            <StickyNote size={11} className="text-slate-300 shrink-0" />
                                                            {res.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0 pl-1">
                                                {res.status === 'PENDING' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(res.id, 'CONFIRMED')}
                                                            disabled={isLoading}
                                                            className="h-8 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black gap-1.5 shadow-sm"
                                                        >
                                                            {isLoading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                                                            Confirm
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleUpdateStatus(res.id, 'CANCELLED')}
                                                            disabled={isLoading}
                                                            className="h-8 px-3.5 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 text-[11px] font-black gap-1.5"
                                                        >
                                                            {isLoading ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                                                            Cancel
                                                        </Button>
                                                    </>
                                                )}
                                                {res.status !== 'PENDING' && (
                                                    <button
                                                        onClick={() => handleDelete(res.id)}
                                                        disabled={isLoading}
                                                        className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                                    >
                                                        {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={14} />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            ) : (
                /* ════ CALENDAR / TIMELINE VIEW ════ */
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 animate-in fade-in duration-400">

                    {/* ── Left: Date Strip + Timeline ── */}
                    <div className="xl:col-span-8 space-y-4">

                        {/* ─ Date Strip ─ */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Date</p>
                                    <p className="font-black text-slate-900 text-base mt-0.5">
                                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => scrollStrip('left')}
                                        className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => scrollStrip('right')}
                                        className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable strip */}
                            <div
                                ref={dateStripRef}
                                className="flex gap-2 overflow-x-auto pb-1"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {dateStrip.map((date) => {
                                    const isSelected = date.toDateString() === selectedDate.toDateString()
                                    const isToday    = date.toDateString() === new Date().toDateString()
                                    const count      = reservations.filter(r => {
                                        const rd = new Date(r.date); rd.setHours(0, 0, 0, 0)
                                        return rd.toDateString() === date.toDateString()
                                    }).length
                                    return (
                                        <button
                                            key={date.toISOString()}
                                            onClick={() => { setSelectedDate(date); setSelectedResId(null) }}
                                            className={cn(
                                                'flex flex-col items-center justify-center px-3 py-2.5 rounded-xl border transition-all duration-200 shrink-0 relative min-w-[54px]',
                                                isSelected
                                                    ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/25'
                                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-blue-300 hover:shadow-sm'
                                            )}
                                        >
                                            <span className={cn('text-[9px] font-black uppercase tracking-widest', isSelected ? 'text-blue-100' : 'text-slate-400')}>
                                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                            </span>
                                            <span className="text-lg font-black leading-tight">{date.getDate()}</span>
                                            {count > 0 && (
                                                <span className={cn(
                                                    'text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none mt-0.5',
                                                    isSelected ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-600'
                                                )}>
                                                    {count}
                                                </span>
                                            )}
                                            {isToday && !isSelected && (
                                                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* ─ Timeline ─ */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Header */}
                            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-blue-500" />
                                    <span className="font-black text-slate-800 text-sm">
                                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <span className={cn(
                                    'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border',
                                    dayReservations.length > 0 ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-400'
                                )}>
                                    {dayReservations.length} booking{dayReservations.length !== 1 && 's'}
                                </span>
                            </div>

                            {/* Slots */}
                            <div className="max-h-[540px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                                {TIMESLOTS.map((slot, idx) => {
                                    const slotRes = dayReservations.filter(r => r.time === slot)
                                    const isDivider = idx === 7 // visual gap between lunch and dinner
                                    return (
                                        <React.Fragment key={slot}>
                                            {isDivider && (
                                                <div className="px-5 py-1.5 bg-slate-50 border-y border-slate-100 flex items-center gap-2">
                                                    <div className="flex-1 h-px bg-slate-200" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Evening Service</span>
                                                    <div className="flex-1 h-px bg-slate-200" />
                                                </div>
                                            )}
                                            <div className={cn(
                                                'flex border-b border-slate-50 last:border-0 transition-colors',
                                                slotRes.length > 0 ? 'hover:bg-blue-50/30' : 'hover:bg-slate-50/50'
                                            )}>
                                                {/* Time column */}
                                                <div className="w-16 shrink-0 flex items-start justify-end pr-3 pt-3.5 pb-3">
                                                    <span className={cn('text-xs font-black tabular-nums', slotRes.length > 0 ? 'text-blue-500' : 'text-slate-300')}>
                                                        {slot}
                                                    </span>
                                                </div>

                                                {/* Divider dot */}
                                                <div className="w-px relative flex flex-col items-center pt-4">
                                                    <div className={cn('h-2 w-2 rounded-full border-2', slotRes.length > 0 ? 'border-blue-400 bg-blue-100' : 'border-slate-200 bg-white')} />
                                                    <div className={cn('flex-1 w-px mt-1', slotRes.length > 0 ? 'bg-blue-100' : 'bg-slate-100')} />
                                                </div>

                                                {/* Cards */}
                                                <div className="flex-1 px-4 py-2.5 flex flex-wrap gap-2 items-start min-h-[52px]">
                                                    {slotRes.length === 0 ? (
                                                        <span className="text-xs text-slate-200 italic self-center">No bookings</span>
                                                    ) : slotRes.map(res => {
                                                        const isSelected    = selectedResId === res.id
                                                        const assignedTable = initialTables.find(t => t.id === res.tableId)
                                                        return (
                                                            <button
                                                                key={res.id}
                                                                onClick={() => setSelectedResId(isSelected ? null : res.id)}
                                                                className={cn(
                                                                    'flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all duration-200',
                                                                    isSelected
                                                                        ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-400/20'
                                                                        : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm'
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    'h-6 w-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0',
                                                                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                                                                )}>
                                                                    {res.name[0]?.toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-xs leading-none truncate max-w-[90px]">{res.name}</p>
                                                                    <p className={cn('text-[10px] mt-0.5 flex items-center gap-1', isSelected ? 'text-blue-100' : 'text-slate-400')}>
                                                                        <Users size={9} /> {res.partySize}
                                                                        {assignedTable ? <><MapPin size={9} /> T{assignedTable.number}</> : res.status === 'CONFIRMED' && <span className={isSelected ? 'text-amber-200' : 'text-amber-500'}> · No table</span>}
                                                                    </p>
                                                                </div>
                                                                <span className={cn(
                                                                    'w-1.5 h-1.5 rounded-full shrink-0',
                                                                    res.status === 'CONFIRMED' ? (isSelected ? 'bg-emerald-300' : 'bg-emerald-400') :
                                                                    res.status === 'CANCELLED' ? (isSelected ? 'bg-rose-200' : 'bg-rose-400') :
                                                                    'bg-amber-400 animate-pulse'
                                                                )} />
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Assigner Panel ── */}
                    <div className="xl:col-span-4">
                        {selectedRes ? (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden animate-in slide-in-from-right duration-300 sticky top-6">
                                {/* Panel Header */}
                                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Selected Booking</p>
                                        <h3 className="font-black text-slate-900 text-lg leading-tight truncate">{selectedRes.name}</h3>
                                    </div>
                                    <button
                                        onClick={() => setSelectedResId(null)}
                                        className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>

                                <div className="p-5 space-y-5">
                                    {/* Info grid */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { icon: <Users size={13} />, label: 'Party', value: `${selectedRes.partySize} guests` },
                                            { icon: <Clock size={13} />, label: 'Time',  value: selectedRes.time },
                                            { icon: <CalendarDays size={13} />, label: 'Date', value: new Date(selectedRes.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
                                            { icon: <Phone size={13} />, label: 'Phone', value: selectedRes.phone },
                                        ].map(item => (
                                            <div key={item.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                                                    {item.icon} {item.label}
                                                </div>
                                                <p className="font-black text-slate-900 text-sm truncate">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Status + quick actions */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <StatusBadge status={selectedRes.status} />
                                        {selectedRes.status === 'PENDING' && (
                                            <div className="flex gap-1.5 ml-auto">
                                                <button
                                                    onClick={() => handleUpdateStatus(selectedRes.id, 'CONFIRMED')}
                                                    disabled={!!loading}
                                                    className="h-8 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black flex items-center gap-1 transition-colors"
                                                >
                                                    <Check size={12} /> Confirm
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(selectedRes.id, 'CANCELLED')}
                                                    disabled={!!loading}
                                                    className="h-8 px-3 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 text-[11px] font-black flex items-center gap-1 transition-colors"
                                                >
                                                    <X size={12} /> Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Auto-Assign button */}
                                    <button
                                        onClick={() => handleAutoAssign(selectedRes.id)}
                                        disabled={loading === `auto-${selectedRes.id}` || selectedRes.status !== 'CONFIRMED'}
                                        className={cn(
                                            'w-full h-11 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all',
                                            selectedRes.status === 'CONFIRMED'
                                                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-100'
                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        )}
                                    >
                                        {loading === `auto-${selectedRes.id}`
                                            ? <><Loader2 size={15} className="animate-spin" /> Assigning…</>
                                            : <><Sparkles size={15} /> Auto-Assign Best Table</>
                                        }
                                    </button>

                                    {selectedRes.status !== 'CONFIRMED' && (
                                        <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-600 font-medium">
                                            <Info size={13} className="shrink-0 mt-0.5" />
                                            Confirm the reservation first to enable table assignment.
                                        </div>
                                    )}

                                    {/* Divider */}
                                    <div className="border-t border-slate-100 pt-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pick Table Manually</p>
                                            {selectedRes.tableId && (
                                                <button
                                                    onClick={() => handleAssignTable(selectedRes.id, null)}
                                                    className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-600 tracking-wider"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-0.5" style={{ scrollbarWidth: 'thin' }}>
                                            {tableAvailability.length === 0 ? (
                                                <p className="text-center py-6 text-xs text-slate-300">No tables configured</p>
                                            ) : tableAvailability.map(table => {
                                                const isAssigned = selectedRes.tableId === table.id
                                                return (
                                                    <div
                                                        key={table.id}
                                                        onClick={() => {
                                                            if (!table.isOccupied) handleAssignTable(selectedRes.id, table.id)
                                                            else toast.warning(`Table ${table.number} is taken by ${table.occupantName}`)
                                                        }}
                                                        className={cn(
                                                            'flex items-center justify-between p-3 rounded-xl border transition-all duration-150',
                                                            isAssigned
                                                                ? 'bg-blue-500 border-blue-500 text-white shadow-sm shadow-blue-400/20'
                                                                : table.isOccupied
                                                                    ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed'
                                                                    : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer hover:shadow-sm'
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <div className={cn(
                                                                'h-8 w-8 rounded-lg flex items-center justify-center font-black text-sm border',
                                                                isAssigned ? 'bg-white/20 border-white/20 text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
                                                            )}>
                                                                {table.number}
                                                            </div>
                                                            <div>
                                                                <p className={cn('font-bold text-sm', isAssigned ? 'text-white' : 'text-slate-900')}>
                                                                    Table {table.number}
                                                                </p>
                                                                {table.capacity && (
                                                                    <p className={cn('text-[10px] font-bold', isAssigned ? 'text-white/60' : 'text-slate-400')}>
                                                                        {table.capacity} seats
                                                                        {!table.capacityOk && <span className="ml-1 text-amber-500">· Too small</span>}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="shrink-0">
                                                            {isAssigned ? (
                                                                <div className="h-5 w-5 rounded-full bg-white/25 flex items-center justify-center">
                                                                    <Check size={11} className="text-white" />
                                                                </div>
                                                            ) : table.isOccupied ? (
                                                                <span className="text-[9px] font-black uppercase text-rose-500 bg-rose-100 px-2 py-0.5 rounded-full">Taken</span>
                                                            ) : !table.capacityOk ? (
                                                                <span className="text-[9px] font-black uppercase text-amber-500 bg-amber-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                                    <AlertTriangle size={8} /> Small
                                                                </span>
                                                            ) : (
                                                                <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Free</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Empty assigner state */
                            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center py-16 px-8 text-center">
                                <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                                    <UserCheck size={24} className="text-blue-400" />
                                </div>
                                <h4 className="font-black text-slate-800 text-sm">Table Assigner</h4>
                                <p className="text-xs text-slate-400 max-w-[170px] mx-auto mt-2 leading-relaxed">
                                    Click any booking in the timeline to assign or manage a table.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
