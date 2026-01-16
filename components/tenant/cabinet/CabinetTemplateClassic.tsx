'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Briefcase, Clock, DollarSign, Calendar, Phone, Mail, MapPin, Star, Pencil } from 'lucide-react'
import Link from 'next/link'
import AdminEditButton from './AdminEditButton'

export interface CabinetTemplateProps {
    siteName: string
    description?: string | null
    coverImage?: string | null
    logo?: string | null
    config: any
    services: any[]
    isOwner?: boolean
    primaryColor?: string
    tenantSlug: string
}

export default function CabinetTemplateClassic({
    siteName,
    description,
    coverImage,
    logo,
    config,
    services,
    isOwner,
    primaryColor = '#3B82F6',
    tenantSlug,
}: CabinetTemplateProps) {
    const businessHours = config.businessHours || 'Mon-Fri: 9:00 AM - 5:00 PM'
    const phone = config.phone || ''
    const email = config.email || ''
    const address = config.address || ''

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
            {/* Hero Section */}
            <header
                className="relative h-[400px] bg-cover bg-center"
                style={{
                    backgroundImage: coverImage
                        ? `url(${coverImage})`
                        : `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}40 100%)`,
                }}
            >
                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=coverImage" label="Edit Hero Image" />}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
                    {logo && (
                        <div className="relative group/edit mb-6">
                            <div className="p-1 bg-white rounded-full shadow-2xl">
                                <img
                                    src={logo}
                                    alt={siteName}
                                    className="h-24 w-24 rounded-full object-cover"
                                />
                            </div>
                            {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=logo" label="Logo" />}
                        </div>
                    )}
                    <div className="relative group/edit">
                        {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=siteName" label="Edit Title & Description" />}
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md">
                            {siteName}
                        </h1>
                        {description && (
                            <p className="text-lg text-white/90 max-w-2xl font-medium drop-shadow-sm">
                                {description}
                            </p>
                        )}
                    </div>
                    <Link href={`/${tenantSlug}/book`}>
                        <Button
                            size="lg"
                            className="mt-8 gap-2 font-bold text-lg px-8 shadow-xl transition-transform hover:scale-105 active:scale-95"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Calendar className="h-5 w-5" />
                            Book an Appointment
                        </Button>
                    </Link>
                </div>

                {isOwner && (
                    <div className="absolute top-4 right-4">
                        <Badge variant="success" className="text-xs font-black uppercase tracking-widest">Owner Mode</Badge>
                    </div>
                )}
            </header>

            {isOwner && (
                <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
                    <Link href="/dashboard/cabinet/settings?edit=template">
                        <Button className="rounded-full shadow-2xl bg-slate-900 text-white hover:bg-slate-800 gap-2 font-black uppercase tracking-widest text-[10px]">
                            <Pencil className="h-3 w-3" />
                            Switch Template
                        </Button>
                    </Link>
                    <Link href="/dashboard/cabinet/settings?edit=primaryColor">
                        <Button variant="outline" className="rounded-full shadow-2xl bg-white gap-2 font-black uppercase tracking-widest text-[10px]">
                            <Pencil className="h-3 w-3" />
                            Change Colors
                        </Button>
                    </Link>
                    <Badge className="bg-emerald-500 text-white border-none shadow-2xl px-4 py-2 rounded-full font-black animate-pulse">Owner View</Badge>
                </div>
            )}

            {/* Contact Info Bar */}
            <div
                className="py-6 px-6 flex flex-wrap justify-center gap-8 text-white shadow-lg relative z-10"
                style={{ backgroundColor: primaryColor }}
            >
                {isOwner && (
                    <div className="absolute top-2 left-4 z-50 flex gap-2">
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=phone" label="Edit Contact" />
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=businessHours" label="Edit Hours" />
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=address" label="Edit Address" />
                    </div>
                )}
                {phone && (
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Phone className="h-4 w-4 opacity-80" />
                        <span>{phone}</span>
                    </div>
                )}
                {email && (
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <Mail className="h-4 w-4 opacity-80" />
                        <span>{email}</span>
                    </div>
                )}
                {address && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-center">
                        <MapPin className="h-4 w-4 opacity-80" />
                        <span>{address}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Clock className="h-4 w-4 opacity-80" />
                    <span>{businessHours}</span>
                </div>
            </div>

            {/* Services Section */}
            <section className="py-20 px-6 relative">
                {isOwner && <AdminEditButton href="/dashboard/cabinet/services" label="Manage Services" />}
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center mb-16">
                        <Badge
                            variant="outline"
                            className="mb-4 font-black uppercase tracking-[0.2em] px-4 py-1.5 text-[10px]"
                            style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                        >
                            Professional Services
                        </Badge>
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Our Services</h2>
                        <div className="h-1.5 w-24 rounded-full mb-6" style={{ backgroundColor: primaryColor }} />
                        <p className="text-slate-500 max-w-lg">Choose from our specialized offerings and book your preferred time slot online.</p>
                    </div>

                    {services.length === 0 ? (
                        <Card className="max-w-md mx-auto border-dashed">
                            <CardContent className="text-center py-12">
                                <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium tracking-tight">No services available yet</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <Card
                                    key={service.id}
                                    className="group hover:shadow-2xl transition-all duration-500 border-none bg-white rounded-3xl"
                                >
                                    <div className="p-8 pb-4">
                                        <div className="flex items-start justify-between mb-6">
                                            <div
                                                className="p-4 rounded-2xl transition-transform group-hover:rotate-12 duration-500"
                                                style={{ backgroundColor: `${primaryColor}15` }}
                                            >
                                                <Briefcase
                                                    className="h-8 w-8"
                                                    style={{ color: primaryColor }}
                                                />
                                            </div>
                                            <Badge variant="success" className="text-[10px] font-black uppercase tracking-wider">
                                                Available
                                            </Badge>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{service.name}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                            {service.description || 'Professional and dedicated medical service designed for your well-being.'}
                                        </p>
                                    </div>
                                    <CardContent className="px-8 pb-8 pt-0 space-y-6">
                                        <div className="flex items-center justify-between border-t border-b border-slate-50 py-4">
                                            <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs">
                                                <Clock className="h-4 w-4 opacity-60" />
                                                <span>{service.duration} MIN</span>
                                            </div>
                                            <div className="text-2xl font-black text-slate-900">
                                                {service.price} <span className="text-xs font-bold text-slate-400">DH</span>
                                            </div>
                                        </div>
                                        <Link href={`/${tenantSlug}/book?service=${service.id}`}>
                                            <Button
                                                className="w-full h-12 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:shadow-lg active:scale-95"
                                                style={{ backgroundColor: primaryColor }}
                                            >
                                                Book Now
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 relative overflow-hidden bg-slate-900">
                <div
                    className="absolute top-0 right-0 w-1/3 h-full opacity-10"
                    style={{
                        background: `radial-gradient(circle at 100% 0%, ${primaryColor}, transparent 70%)`
                    }}
                />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to Get Started?</h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                        Experience top-tier professional care at your convenience. Book your next session today.
                    </p>
                    <Link href={`/${tenantSlug}/book`}>
                        <Button
                            size="lg"
                            className="h-16 px-12 rounded-2xl bg-white text-slate-900 hover:bg-slate-50 font-black text-lg uppercase tracking-widest shadow-2xl transition-all hover:-translate-y-1"
                        >
                            Schedule Now
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-slate-950 text-slate-500 border-t border-slate-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center font-black text-primary text-xs tracking-tighter">FS</div>
                        <span className="text-white font-black text-sm uppercase tracking-tighter">FirstStep</span>
                    </div>
                    <p className="text-xs font-semibold tracking-wide">
                        © {new Date().getFullYear()} {siteName}. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                    </div>
                </div>
            </footer>
        </div>
    )
}
