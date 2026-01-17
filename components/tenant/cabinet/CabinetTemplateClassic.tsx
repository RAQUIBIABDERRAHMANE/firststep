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
        <div className="min-h-screen bg-white font-sans selection:bg-slate-950 selection:text-white">
            {/* Hero Section - Premium Institutional */}
            <header
                className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-950"
            >
                {/* Decorative Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80'}
                        alt="Background"
                        className="w-full h-full object-cover opacity-40 transition-transform duration-[20s] hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=coverImage" label="Edit Hero Image" />}

                <div className="container relative z-10 px-6 py-32 text-center animate-in fade-in zoom-in-95 duration-1000">
                    <div className="flex flex-col items-center gap-12">
                        {logo ? (
                            <div className="relative group/edit">
                                <div className="p-1.5 bg-white rounded-[32px] shadow-3xl">
                                    <img
                                        src={logo}
                                        alt={siteName}
                                        className="h-24 w-24 md:h-32 md:w-32 rounded-[28px] object-cover"
                                    />
                                </div>
                                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=logo" label="Logo" />}
                            </div>
                        ) : (
                            <div className="h-24 w-24 bg-white text-slate-950 rounded-[28px] flex items-center justify-center font-serif font-black text-4xl shadow-2xl">
                                {siteName[0]}
                            </div>
                        )}

                        <div className="space-y-8 relative group/edit">
                            {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=siteName" label="Edit Title & Description" />}
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-px w-10 bg-white/20" />
                                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/50">Institutional Excellence</span>
                                <div className="h-px w-10 bg-white/20" />
                            </div>
                            <h1 className="text-6xl md:text-9xl font-serif font-black text-white leading-none tracking-tighter">
                                {siteName}
                            </h1>
                            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed italic font-serif">
                                "{description || 'Providing unparalleled professional consultation with a commitment to integrity, precision, and reliable growth.'}"
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 pt-10">
                            <Link href={`/${tenantSlug}/book`}>
                                <Button
                                    size="lg"
                                    className="h-20 px-12 rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-3xl transition-all hover:shadow-[0_40px_80px_-15px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:scale-95 flex items-center gap-4"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <Calendar className="h-5 w-5" />
                                    Book Consult
                                </Button>
                            </Link>
                            <div className="flex flex-col items-start gap-1 px-8 py-2 border-l-2 border-white/10">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-none">Global Operations</span>
                                <span className="text-sm font-bold text-white uppercase tracking-widest">{businessHours}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Bar - Decorative */}
                <div className="absolute bottom-0 inset-x-0 h-24 bg-white/5 backdrop-blur-3xl border-t border-white/5 flex items-center justify-center gap-20 px-6 overflow-hidden hidden lg:flex">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-white/50 tracking-widest">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                        Real-time Capacity: High
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-white/50 tracking-widest">
                        <Star size={14} className="text-amber-500" />
                        ISO 9001 Certified
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-white/50 tracking-widest">
                        Digital Records: AES-256
                    </div>
                </div>
            </header>

            {/* Contact Info Grid - Balanced & Minimal */}
            <section className="py-24 bg-white border-b border-slate-100 relative z-20">
                {isOwner && (
                    <div className="absolute top-2 left-4 z-50 flex gap-2">
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=phone" label="Edit Info" />
                    </div>
                )}
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-24 items-start">
                        <div className="flex gap-8 group">
                            <div className="h-16 w-16 shrink-0 rounded-[24px] bg-slate-50 flex items-center justify-center transition-all group-hover:bg-slate-950 group-hover:text-white group-hover:-translate-y-2">
                                <MapPin className="h-7 w-7" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Corporate HQ</h3>
                                <p className="text-xl font-bold text-slate-950 leading-tight">{address}</p>
                            </div>
                        </div>
                        <div className="flex gap-8 group">
                            <div className="h-16 w-16 shrink-0 rounded-[24px] bg-slate-50 flex items-center justify-center transition-all group-hover:bg-slate-950 group-hover:text-white group-hover:-translate-y-2">
                                <Phone className="h-7 w-7" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Concierge Direct</h3>
                                <p className="text-xl font-bold text-slate-950 leading-tight">{phone || '+212 522 00 00 00'}</p>
                                <p className="text-sm font-medium text-slate-500 leading-none">{email || 'contact@concierge.com'}</p>
                            </div>
                        </div>
                        <div className="flex gap-8 group">
                            <div className="h-16 w-16 shrink-0 rounded-[24px] bg-slate-50 flex items-center justify-center transition-all group-hover:bg-slate-950 group-hover:text-white group-hover:-translate-y-2">
                                <Clock className="h-7 w-7" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Business Period</h3>
                                <p className="text-xl font-bold text-slate-950 leading-tight uppercase tracking-tight">{businessHours}</p>
                                <p className="text-sm font-medium text-slate-400 uppercase text-[9px] tracking-widest leading-none">Appointments Priority</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section - Institutional Portfolio */}
            <section className="py-32 px-6 relative bg-[#fafafa]">
                {isOwner && <AdminEditButton href="/dashboard/cabinet/services" label="Manage Services" />}
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-0.5 w-8 bg-slate-950" />
                                <span className="font-black uppercase tracking-[0.5em] text-[10px] text-slate-400">Service Catalog</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-serif font-black text-slate-900 tracking-tighter leading-none">Professional Solutions</h2>
                        </div>
                        <p className="text-slate-500 font-medium max-w-sm text-lg leading-relaxed italic font-serif">
                            "Strategically designed frameworks to deliver absolute precision and measurable results for our clients."
                        </p>
                    </div>

                    {services.length === 0 ? (
                        <Card className="max-w-md mx-auto border-dashed border-2 border-slate-200 rounded-[40px] bg-white">
                            <CardContent className="text-center py-24">
                                <Briefcase className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Portfolio Empty</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                            {services.map((service, idx) => (
                                <div
                                    key={service.id}
                                    className="group bg-white rounded-[48px] border border-transparent hover:border-slate-100 p-10 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 flex flex-col relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[var(--primary)]/5 transition-colors duration-700" />

                                    <div className="relative z-10 space-y-8 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <div className="text-4xl font-serif font-black text-slate-100 group-hover:text-slate-200 transition-colors select-none">
                                                0{idx + 1}
                                            </div>
                                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                                                Operational
                                            </Badge>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-2xl md:text-3xl font-serif font-black text-slate-950 leading-tight group-hover:text-[var(--primary)] transition-colors">
                                                {service.name}
                                            </h3>
                                            <p className="text-slate-400 font-medium text-sm leading-relaxed line-clamp-3">
                                                {service.description || 'Our specialized consultation frameworks are designed to deliver visible improvements and lasting value for every client.'}
                                            </p>
                                        </div>

                                        <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <Clock className="h-4 w-4" />
                                                {service.duration} Min Session
                                            </div>
                                            <div className="text-2xl font-serif font-black text-slate-950">
                                                {service.price} <span className="text-xs font-bold text-slate-300 ml-1 uppercase">DH</span>
                                            </div>
                                        </div>

                                        <Link href={`/${tenantSlug}/book?service=${service.id}`}>
                                            <Button
                                                className="w-full h-16 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] transition-all bg-slate-950 text-white hover:bg-slate-800 active:scale-95 shadow-2xl"
                                            >
                                                Initiate Booking
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section - Bold Interaction */}
            <section className="py-40 px-6 relative overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--primary)]/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-[var(--primary)]/5 to-transparent blur-3xl" />
                </div>

                <div className="max-w-4xl mx-auto relative z-10 text-center space-y-12">
                    <div className="space-y-6">
                        <Badge className="bg-white/5 text-white/40 border-white/10 text-[10px] font-black uppercase tracking-[0.4em] px-6 py-2 rounded-full">
                            Next Steps
                        </Badge>
                        <h2 className="text-5xl md:text-8xl font-serif font-black text-white tracking-tighter leading-[0.9]">
                            Scale Your <br /> Potential Today
                        </h2>
                    </div>
                    <p className="text-slate-400 text-xl font-medium max-w-xl mx-auto italic font-serif leading-relaxed">
                        "Excellence is not an act, but a habit. Begin your journey with the industry's most trusted practitioners."
                    </p>
                    <Link href={`/${tenantSlug}/book`}>
                        <Button
                            size="lg"
                            className="h-24 px-16 rounded-[40px] bg-white text-slate-950 hover:bg-slate-50 font-black text-sm uppercase tracking-[0.4em] shadow-[0_50px_100px_-20px_rgba(255,255,255,0.15)] transition-all hover:-translate-y-2 active:scale-95 border-b-8 border-slate-200"
                        >
                            Schedule Session
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer - Professional Finish */}
            <footer className="py-24 px-6 bg-white text-slate-400 relative overflow-hidden">
                <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-[14px] bg-slate-950 flex items-center justify-center font-black text-white text-xs tracking-tighter">FS</div>
                            <div className="space-y-0.5">
                                <span className="text-slate-950 font-serif font-black text-xl uppercase tracking-tighter leading-none block">{siteName}</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">Professional Services Group</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">
                            © {new Date().getFullYear()} {siteName} / LIMITED LIABILITY PARTNERSHIP
                        </p>
                        <nav className="flex gap-10 text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">
                            <a href="#" className="hover:text-slate-950 transition-colors">Philosophy</a>
                            <a href="#" className="hover:text-slate-950 transition-colors">Compliance</a>
                            <a href="#" className="hover:text-slate-950 transition-colors">Inquiry</a>
                        </nav>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: primaryColor }} />
            </footer>
        </div>
    )
}
