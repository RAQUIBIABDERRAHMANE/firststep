'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    User,
    FileText,
    CheckCircle2,
    XCircle,
    MoreVertical
} from 'lucide-react'
import { updateCabinetAppointmentStatus } from '@/app/actions/cabinet'
import { cn } from '@/lib/utils'

type Appointment = {
    id: string
    appointmentDate: Date
    status: string
    notes: string | null
    service: {
        name: string
        duration: number
    }
    client: {
        name: string
        email: string | null
        phone: string | null
    }
}

const statusColors: Record<string, 'success' | 'comingSoon' | 'destructive'> = {
    SCHEDULED: 'comingSoon',
    CONFIRMED: 'success',
    COMPLETED: 'success',
    CANCELLED: 'destructive',
    NO_SHOW: 'destructive',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

export default function CabinetCalendarClient({
    appointments,
    tenantSlug,
}: {
    appointments: Appointment[]
    tenantSlug: string
}) {
    const router = useRouter()
    const [viewDate, setViewDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    // Polling for new appointments
    useEffect(() => {
        const timer = setInterval(() => {
            router.refresh()
        }, 10000)

        return () => clearInterval(timer)
    }, [router])

    const handleStatusChange = async (id: string, newStatus: string) => {
        const result = await updateCabinetAppointmentStatus(id, newStatus, tenantSlug)
        if (result.success) {
            router.refresh()
        }
    }

    const currentYear = viewDate.getFullYear()
    const currentMonth = viewDate.getMonth()

    const daysInMonth = useMemo(() => {
        const date = new Date(currentYear, currentMonth, 1)
        const days = []

        // Add leading empty slots for days before the first day of the month
        const firstDayIdx = date.getDay()
        for (let i = 0; i < firstDayIdx; i++) {
            days.push(null)
        }

        // Add days of the month
        while (date.getMonth() === currentMonth) {
            days.push(new Date(date))
            date.setDate(date.getDate() + 1)
        }

        return days
    }, [currentYear, currentMonth])

    const appointmentsByDay = useMemo(() => {
        const map: Record<string, Appointment[]> = {}
        appointments.forEach(appt => {
            const dateStr = new Date(appt.appointmentDate).toDateString()
            if (!map[dateStr]) map[dateStr] = []
            map[dateStr].push(appt)
        })
        return map
    }, [appointments])

    const selectedDayAppointments = useMemo(() => {
        const dateStr = selectedDate.toDateString()
        return (appointmentsByDay[dateStr] || []).sort(
            (a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
        )
    }, [selectedDate, appointmentsByDay])

    const navigateMonth = (direction: number) => {
        const newDate = new Date(currentYear, currentMonth + direction, 1)
        setViewDate(newDate)
    }

    const setToday = () => {
        const today = new Date()
        setViewDate(today)
        setSelectedDate(today)
    }

    const isToday = (date: Date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    const isSelected = (date: Date) => {
        return date.toDateString() === selectedDate.toDateString()
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Calendar Grid */}
            <div className="lg:col-span-8 space-y-6">
                <Card className="overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-8 bg-primary/5">
                        <div>
                            <CardTitle className="text-2xl font-black text-foreground">
                                {MONTHS[currentMonth]} {currentYear}
                            </CardTitle>
                            <CardDescription>
                                Manage and view your professionnal schedule
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={setToday}>Today</Button>
                            <div className="flex items-center bg-background rounded-md border p-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateMonth(-1)}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateMonth(1)}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
                            {DAYS.map(day => (
                                <div key={day} className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-7 auto-rows-fr bg-border/20 gap-[1px]">
                            {daysInMonth.map((day, idx) => {
                                if (!day) return <div key={`empty-${idx}`} className="bg-card/30" />

                                const dayAppts = appointmentsByDay[day.toDateString()] || []
                                const hasAppts = dayAppts.length > 0

                                return (
                                    <button
                                        key={day.toISOString()}
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            "min-h-[100px] p-2 bg-card transition-all hover:bg-accent group flex flex-col items-center justify-start relative",
                                            isSelected(day) && "bg-primary/5 ring-2 ring-primary ring-inset z-10"
                                        )}
                                    >
                                        <span className={cn(
                                            "h-8 w-8 flex items-center justify-center rounded-full text-sm font-semibold mb-1 transition-colors",
                                            isToday(day) ? "bg-primary text-primary-foreground" : "text-foreground group-hover:text-primary",
                                            isSelected(day) && !isToday(day) && "bg-primary/20 text-primary font-bold"
                                        )}>
                                            {day.getDate()}
                                        </span>

                                        {hasAppts && (
                                            <div className="mt-auto pb-1 flex flex-wrap justify-center gap-1 w-full">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                                {dayAppts.length > 1 && (
                                                    <span className="text-[10px] text-muted-foreground font-medium">
                                                        +{dayAppts.length - 1} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Status Indicators */}
                                        <div className="flex gap-0.5 mt-1">
                                            {dayAppts.slice(0, 3).map((appt, i) => (
                                                <div
                                                    key={appt.id}
                                                    className={cn(
                                                        "h-1 w-3 rounded-full",
                                                        appt.status === 'COMPLETED' ? "bg-green-500" :
                                                            appt.status === 'CANCELLED' ? "bg-red-500" : "bg-primary"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Side Agenda */}
            <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-8">
                    <Card className="border-none shadow-xl bg-card/80 backdrop-blur-md">
                        <CardHeader className="border-b bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex flex-col items-center justify-center border border-primary/20">
                                    <span className="text-primary font-bold text-lg leading-none">{selectedDate.getDate()}</span>
                                    <span className="text-[10px] text-primary/70 uppercase font-black">{MONTHS[selectedDate.getMonth()].slice(0, 3)}</span>
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Agenda</CardTitle>
                                    <CardDescription>{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                            {selectedDayAppointments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <Clock className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-bold text-foreground">No appointments</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Enjoy your free time or schedule something new.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/50">
                                    {selectedDayAppointments.map((appt) => (
                                        <div key={appt.id} className="p-4 hover:bg-accent/50 transition-colors group">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-wider uppercase">
                                                            {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                        <Badge variant={statusColors[appt.status]} className="text-[9px] h-4 px-1">
                                                            {appt.status}
                                                        </Badge>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                            {appt.service.name}
                                                        </h4>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                                            <User className="h-3 w-3" />
                                                            <span className="font-medium">{appt.client.name}</span>
                                                        </div>
                                                    </div>

                                                    {appt.notes && (
                                                        <div className="flex gap-1.5 p-2 rounded-lg bg-muted/50 text-[11px] text-muted-foreground italic">
                                                            <FileText className="h-3 w-3 shrink-0" />
                                                            <span>{appt.notes}</span>
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex flex-wrap gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {appt.status === 'SCHEDULED' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-[10px] font-bold border-green-500/20 text-green-600 hover:bg-green-500 hover:text-white"
                                                                onClick={() => handleStatusChange(appt.id, 'CONFIRMED')}
                                                            >
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                Confirm
                                                            </Button>
                                                        )}
                                                        {(appt.status === 'SCHEDULED' || appt.status === 'CONFIRMED') && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-[10px] font-bold border-blue-500/20 text-blue-600 hover:bg-blue-500 hover:text-white"
                                                                onClick={() => handleStatusChange(appt.id, 'COMPLETED')}
                                                            >
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                Complete
                                                            </Button>
                                                        )}
                                                        {(appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED') && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-[10px] font-bold border-red-500/20 text-red-600 hover:bg-red-500 hover:text-white"
                                                                onClick={() => handleStatusChange(appt.id, 'CANCELLED')}
                                                            >
                                                                <XCircle className="h-3 w-3 mr-1" />
                                                                Cancel
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
