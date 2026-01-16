'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Check, ChevronRight, ChevronLeft, Calendar, Clock, User, Briefcase, Phone, Mail } from 'lucide-react'
import { createCabinetAppointment } from '@/app/actions/cabinet'

interface Service {
    id: string
    name: string
    description: string | null
    price: number
    duration: number
}

interface BookingFlowProps {
    tenantId: string
    services: Service[]
    initialServiceId?: string
    primaryColor?: string
}

export default function BookingFlow({
    tenantId,
    services,
    initialServiceId,
    primaryColor = '#3B82F6',
}: BookingFlowProps) {
    const [step, setStep] = useState(1)
    const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId || '')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [clientName, setClientName] = useState('')
    const [clientEmail, setClientEmail] = useState('')
    const [clientPhone, setClientPhone] = useState('')
    const [notes, setNotes] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const selectedService = services.find(s => s.id === selectedServiceId)

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            // Combine date and time
            const appointmentDate = new Date(`${selectedDate}T${selectedTime}`)

            const result = await createCabinetAppointment({
                tenantId,
                serviceId: selectedServiceId,
                clientName,
                clientEmail,
                clientPhone,
                appointmentDate,
                notes,
            })

            if (result.success) {
                setIsSuccess(true)
            } else {
                alert('Failed to book appointment: ' + (result as any).error)
            }
        } catch (error) {
            console.error('Booking error:', error)
            alert('An error occurred during booking.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <Card className="max-w-md mx-auto text-center py-12">
                <CardContent className="space-y-6">
                    <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Appointment Requested!</CardTitle>
                    <CardDescription className="text-lg">
                        We have received your booking request for <strong>{selectedService?.name}</strong>.
                    </CardDescription>
                    <div className="bg-slate-50 p-4 rounded-xl text-left border space-y-2">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Date:</span>
                            <span className="font-semibold">{selectedDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Time:</span>
                            <span className="font-semibold">{selectedTime}</span>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">
                        You will receive a confirmation shortly.
                    </p>
                    <Button
                        className="w-full mt-6"
                        onClick={() => window.location.href = `/${window.location.pathname.split('/')[1]}`}
                        style={{ backgroundColor: primaryColor }}
                    >
                        Back to Home
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-xl border-t-4" style={{ borderTopColor: primaryColor }}>
            <CardHeader>
                <div className="flex justify-between items-center mb-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'text-white' : 'bg-slate-200 text-slate-400'
                                    }`}
                                style={{ backgroundColor: step >= s ? primaryColor : undefined }}
                            >
                                {step > s ? <Check className="h-4 w-4" /> : s}
                            </div>
                            {s < 3 && <div className={`w-12 h-1 mx-2 rounded ${step > s ? 'bg-slate-300' : 'bg-slate-100'}`} />}
                        </div>
                    ))}
                </div>
                <CardTitle className="text-2xl">
                    {step === 1 && 'Select a Service'}
                    {step === 2 && 'Choose Date & Time'}
                    {step === 3 && 'Your Details'}
                </CardTitle>
                <CardDescription>
                    {step === 1 && 'What can we help you with today?'}
                    {step === 2 && 'When would you like to visit us?'}
                    {step === 3 && 'Just a few more details to confirm your booking.'}
                </CardDescription>
            </CardHeader>

            <CardContent className="py-6">
                {/* Step 1: Select Service */}
                {step === 1 && (
                    <div className="grid gap-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => setSelectedServiceId(service.id)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedServiceId === service.id
                                        ? 'bg-slate-50 border-primary'
                                        : 'hover:border-slate-300'
                                    }`}
                                style={{ borderColor: selectedServiceId === service.id ? primaryColor : undefined }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-lg shadow-sm">
                                        <Briefcase className="h-5 w-5" style={{ color: primaryColor }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{service.name}</h3>
                                        <p className="text-sm text-slate-500">{service.duration} mins • {service.price} DH</p>
                                    </div>
                                </div>
                                {selectedServiceId === service.id && (
                                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                                        <Check className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 2: Date & Time */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Calendar className="h-4 w-4" style={{ color: primaryColor }} />
                                Select Date
                            </label>
                            <input
                                type="date"
                                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
                                min={new Date().toISOString().split('T')[0]}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Clock className="h-4 w-4" style={{ color: primaryColor }} />
                                Select Time Slot
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                                    <Button
                                        key={time}
                                        variant={selectedTime === time ? 'default' : 'outline'}
                                        onClick={() => setSelectedTime(time)}
                                        className="font-semibold"
                                        style={selectedTime === time ? { backgroundColor: primaryColor } : undefined}
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Client Details */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-500" />
                                Full Name
                            </label>
                            <Input
                                placeholder="John Doe"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={clientEmail}
                                    onChange={(e) => setClientEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-slate-500" />
                                    Phone Number
                                </label>
                                <Input
                                    type="tel"
                                    placeholder="+212 6..."
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500">
                                Notes (Optional)
                            </label>
                            <textarea
                                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
                                rows={3}
                                placeholder="Any special requests or details..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        {/* Summary */}
                        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">Booking Summary</h4>
                            <div className="text-sm space-y-1">
                                <p><strong>Service:</strong> {selectedService?.name}</p>
                                <p><strong>Date:</strong> {selectedDate} at {selectedTime}</p>
                                <p><strong>Duration:</strong> {selectedService?.duration} minutes</p>
                                <p><strong>Price:</strong> {selectedService?.price} DH</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between border-t py-6">
                {step > 1 ? (
                    <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                ) : (
                    <div />
                )}

                {step < 3 ? (
                    <Button
                        onClick={handleNext}
                        style={{ backgroundColor: primaryColor }}
                        disabled={
                            (step === 1 && !selectedServiceId) ||
                            (step === 2 && (!selectedDate || !selectedTime))
                        }
                    >
                        Next Step
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        style={{ backgroundColor: primaryColor }}
                        disabled={isSubmitting || !clientName}
                    >
                        {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                        <Check className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
