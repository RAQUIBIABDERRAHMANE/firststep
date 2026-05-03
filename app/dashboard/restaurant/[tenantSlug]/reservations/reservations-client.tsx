'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CalendarCheck, Search, Check, X, Phone, Users, Clock, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { updateReservationStatus, deleteReservation } from '@/app/actions/reservations'
import { toast } from 'sonner'

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
}

export default function ReservationsClient({ tenantSlug, initialReservations }: { tenantSlug: string, initialReservations: Reservation[] }) {
    const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState<string | null>(null)

    const handleUpdateStatus = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
        setLoading(id)
        try {
            const res = await updateReservationStatus(id, status)
            if (res.error) {
                toast.error(res.error)
            } else {
                setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
                toast.success(`Reservation ${status.toLowerCase()}`)
            }
        } finally {
            setLoading(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this reservation?')) return
        setLoading(id)
        try {
            const res = await deleteReservation(id)
            if (res.error) {
                toast.error(res.error)
            } else {
                setReservations(prev => prev.filter(r => r.id !== id))
                toast.success('Reservation deleted')
            }
        } finally {
            setLoading(null)
        }
    }

    const filtered = reservations.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.phone.includes(searchTerm)
    )

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <CalendarCheck className="text-emerald-500" /> Table Reservations
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage incoming booking requests from your customers.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                            placeholder="Search name or phone..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-9 bg-white"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {filtered.length === 0 ? (
                    <Card className="glass-card shadow-none border-slate-200 py-12 text-center">
                        <div className="flex justify-center mb-4"><CalendarCheck size={48} className="text-slate-200" /></div>
                        <h3 className="text-xl font-bold">No reservations found</h3>
                        <p className="text-muted-foreground">You don't have any bookings matching your search.</p>
                    </Card>
                ) : (
                    filtered.map(res => (
                        <Card key={res.id} className="glass-card shadow-none border-slate-200/60 overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row items-center">
                                    <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 md:items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-slate-900">{res.name}</h3>
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                                                    res.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                                                    res.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {res.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                                                <span className="flex items-center gap-1"><Phone size={14} className="text-slate-400" /> {res.phone}</span>
                                                <span className="flex items-center gap-1"><Users size={14} className="text-slate-400" /> {res.partySize} guests</span>
                                                <span className="flex items-center gap-1"><CalendarCheck size={14} className="text-slate-400" /> {new Date(res.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><Clock size={14} className="text-slate-400" /> {res.time}</span>
                                            </div>
                                            {res.notes && (
                                                <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                                                    <strong>Notes:</strong> {res.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-slate-50 border-l border-slate-100 flex gap-2 md:flex-col justify-center min-w-[140px]">
                                        {res.status === 'PENDING' && (
                                            <>
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => handleUpdateStatus(res.id, 'CONFIRMED')}
                                                    disabled={loading === res.id}
                                                    className="bg-emerald-600 hover:bg-emerald-700 w-full"
                                                >
                                                    {loading === res.id ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} className="mr-2" />} Confirm
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    onClick={() => handleUpdateStatus(res.id, 'CANCELLED')}
                                                    disabled={loading === res.id}
                                                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                                                >
                                                    {loading === res.id ? <Loader2 className="animate-spin" size={16} /> : <X size={16} className="mr-2" />} Cancel
                                                </Button>
                                            </>
                                        )}
                                        {res.status !== 'PENDING' && (
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => handleDelete(res.id)}
                                                disabled={loading === res.id}
                                                className="w-full text-slate-400 hover:text-red-600 hover:bg-red-50"
                                            >
                                                {loading === res.id ? <Loader2 className="animate-spin" size={16} /> : 'Delete Record'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
