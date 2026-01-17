'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Briefcase, Clock, Calendar, Phone, Mail, MapPin, ArrowRight, CheckCircle2, Pencil, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { CabinetTemplateProps } from './CabinetTemplateClassic'
import AdminEditButton from './AdminEditButton'

export default function CabinetTemplateModern({
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
    const CURRENCY = config.currency || 'DH'

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-slate-900 selection:text-white">
            {/* Split Hero Section - More Premium */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-0 skew-x-12 translate-x-1/4 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-50/50 to-transparent -z-0 pointer-events-none" />

                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=coverImage" label="Edit Hero Image" />}
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center relative z-10 py-32">
                    <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-1000">
                        <div className="flex flex-col gap-10">
                            <div className="relative group/edit inline-block w-fit">
                                {logo ? (
                                    <img
                                        src={logo}
                                        alt={siteName}
                                        className="h-24 w-24 rounded-3xl object-cover shadow-2xl transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-20 w-20 bg-slate-950 text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-2xl">
                                        {siteName[0]}
                                    </div>
                                )}
                                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=logo" label="Logo" />}
                            </div>

                            <div className="space-y-10 relative group/edit">
                                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=siteName" label="Edit Title & Description" />}
                                <div className="flex items-center gap-4">
                                    <div className="h-px w-10 bg-slate-200" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                                        Next-Gen Healthcare
                                    </span>
                                </div>
                                <h1 className="text-7xl md:text-9xl font-black text-slate-950 leading-[0.85] tracking-tighter">
                                    {siteName}
                                </h1>
                                <p className="text-2xl text-slate-500 font-medium max-w-xl leading-relaxed">
                                    {description || 'Redefining clinical excellence through personalized care, advanced diagnostics, and a patient-first philosophy.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                            <Link href={`/${tenantSlug}/book`}>
                                <Button
                                    size="lg"
                                    className="h-20 px-12 rounded-[32px] font-black text-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all hover:shadow-[0_35px_60px_-12px_rgba(0,0,0,0.25)] hover:-translate-y-1 active:scale-95 group"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Book Consult
                                    <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                                </Button>
                            </Link>
                            <div className="flex flex-col gap-1 px-8 border-l-2 border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Operating Status</span>
                                <span className="text-sm font-bold text-slate-950">{businessHours}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-10 pt-10 border-t border-slate-100 max-w-lg">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="User" />
                                    </div>
                                ))}
                                <div className="h-12 w-12 rounded-full border-4 border-white bg-slate-950 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                                    +5k
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-400 leading-tight">
                                Trusted by <span className="text-slate-950">5000+</span> individuals <br />for premium medical support.
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="aspect-[4/5] rounded-[80px] overflow-hidden bg-slate-100 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)] border-[20px] border-white transition-all duration-1000 group-hover:scale-[1.02]">
                            <img
                                src={coverImage || 'https://images.unsplash.com/photo-1576091160550-217359f51f8c?auto=format&fit=crop&w=800&q=80'}
                                alt="Modern Cabinet"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        </div>
                        {/* Status Card Overlay */}
                        <div className="absolute -bottom-10 -left-10 p-10 bg-white rounded-[40px] shadow-3xl border border-slate-50 animate-float">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-950 leading-none">99.8%</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Patient Satisfaction</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Structured Info Bar - More Breathing Room */}
            <section className="py-24 bg-white border-y border-slate-100">
                {isOwner && (
                    <div className="absolute top-4 left-4 z-50 flex gap-2">
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=address" label="Edit Info" />
                    </div>
                )}
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-20">
                        <div className="flex gap-8 group">
                            <div className="h-16 w-16 shrink-0 rounded-[24px] bg-slate-50 flex items-center justify-center transition-all group-hover:bg-slate-950 group-hover:text-white group-hover:-translate-y-2">
                                <MapPin className="h-7 w-7" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Our Clinic</h3>
                                <p className="text-xl font-bold text-slate-950 leading-tight">{address}</p>
                            </div>
                        </div>
                        <div className="flex gap-8 group">
                            <div className="h-16 w-16 shrink-0 rounded-[24px] bg-slate-50 flex items-center justify-center transition-all group-hover:bg-slate-950 group-hover:text-white group-hover:-translate-y-2">
                                <Phone className="h-7 w-7" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Contact Direct</h3>
                                <p className="text-xl font-bold text-slate-950 leading-tight">{phone || '+212 522 00 00 00'}</p>
                                <p className="text-sm font-medium text-slate-500">{email || 'concierge@cabinet.com'}</p>
                            </div>
                        </div>
                        <div className="flex gap-8 group">
                            <div className="h-16 w-16 shrink-0 rounded-[24px] bg-slate-50 flex items-center justify-center transition-all group-hover:bg-slate-950 group-hover:text-white group-hover:-translate-y-2">
                                <Clock className="h-7 w-7" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Availability</h3>
                                <p className="text-xl font-bold text-slate-950 leading-tight">{businessHours}</p>
                                <p className="text-sm font-medium text-slate-500">Appointments Mandatory</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Grid - More Premium Horizontal Cards */}
            <section className="py-32 px-6 relative bg-[#fafafa]">
                {isOwner && <AdminEditButton href="/dashboard/cabinet/services" label="Manage Services" />}
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-0.5 w-8 bg-slate-950" />
                                <span className="font-black uppercase tracking-[0.5em] text-[10px] text-slate-400">Clinical Portfolio</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter leading-none">Our Specializations</h2>
                        </div>
                        <p className="text-slate-500 font-medium max-w-sm text-lg leading-relaxed">
                            Implementing the most stringent diagnostic frameworks to ensure absolute precision in patient outcomes.
                        </p>
                    </div>

                    <div className="grid gap-10">
                        {services.map((service, idx) => (
                            <div
                                key={service.id}
                                className="group relative bg-white border border-slate-100 rounded-[48px] p-10 md:p-14 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 flex flex-col md:flex-row items-center gap-16 overflow-hidden"
                            >
                                <div
                                    className="absolute top-0 left-0 w-2 h-full transition-all duration-700 group-hover:w-4"
                                    style={{ backgroundColor: primaryColor }}
                                />
                                <div className="text-8xl font-black text-slate-50/50 transition-colors group-hover:text-slate-100 shrink-0 select-none">
                                    0{idx + 1}
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-3xl md:text-4xl font-black text-slate-950 group-hover:text-[var(--primary)] transition-colors tracking-tight">
                                                {service.name}
                                            </h3>
                                            <div className="px-3 py-1 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 rounded-lg">Primary Service</div>
                                        </div>
                                        <p className="text-slate-500 font-medium max-w-2xl leading-relaxed text-lg">
                                            {service.description || 'Our specialized therapy and consultation sessions are designed to deliver visible improvements and lasting health benefits for every patient.'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-10">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <Clock className="h-4 w-4" />
                                            {service.duration} Minute Protocol
                                        </div>
                                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                                        <div className="text-3xl font-black text-slate-950">
                                            {service.price} <span className="text-xs font-bold text-slate-400 uppercase ml-1">{CURRENCY}</span>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/${tenantSlug}/book?service=${service.id}`} className="shrink-0 w-full md:w-auto">
                                    <Button
                                        size="lg"
                                        className="h-20 px-12 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] transition-all group-hover:bg-slate-950 group-hover:text-white border-2 border-transparent hover:border-slate-950"
                                        style={{ backgroundColor: primaryColor, color: 'white' }}
                                    >
                                        Reserve Spot
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Minimal Footer - Premium Finish */}
            <footer className="py-24 bg-white border-t border-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="container mx-auto px-6 flex flex-col items-center text-center gap-16 relative z-10">
                    <div className="space-y-6">
                        <div className="h-20 w-20 rounded-[28px] bg-slate-950 flex items-center justify-center mx-auto shadow-2xl transition-transform hover:rotate-6">
                            <Briefcase className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-950 tracking-tighter">{siteName}</h2>
                        <p className="text-slate-400 font-medium max-w-md mx-auto">Providing high-end professional healthcare with a commitment to clinical excellence and patient safety.</p>
                    </div>

                    <nav className="flex flex-wrap justify-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                        <a href="#" className="hover:text-slate-950 transition-colors">Philosophy</a>
                        <a href="#" className="hover:text-slate-950 transition-colors">Services</a>
                        <a href="#" className="hover:text-slate-950 transition-colors">Inquiry</a>
                        <Link href={`/${tenantSlug}/book`} className="hover:text-slate-950 transition-colors">Schedule</Link>
                    </nav>

                    <div className="pt-16 border-t border-slate-50 w-full flex flex-col md:flex-row items-center justify-between gap-10 text-[10px] font-black uppercase text-slate-400 tracking-[0.5em]">
                        <p>© {new Date().getFullYear()} {siteName} / LIMITED LIABILITY PARTNERSHIP</p>
                        <p className="flex items-center gap-3">
                            <ShieldCheck size={14} className="text-slate-300" />
                            Data Protections Active
                        </p>
                    </div>
                </div>
            </footer>

            {isOwner && (
                <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 items-end animate-in fade-in slide-in-from-right-10 duration-500">
                    <Link href="/dashboard/cabinet/settings?edit=template">
                        <Button className="rounded-full h-12 px-8 shadow-2xl bg-slate-950 text-white hover:bg-slate-800 gap-3 font-black uppercase tracking-widest text-[10px] border border-white/10">
                            <Pencil className="h-3.5 w-3.5" />
                            Switch Experience
                        </Button>
                    </Link>
                    <Link href="/dashboard/cabinet/settings?edit=primaryColor">
                        <Button variant="outline" className="rounded-full h-12 px-8 shadow-2xl bg-white gap-3 font-black uppercase tracking-widest text-[10px] border-slate-100 hover:bg-slate-50">
                            <Pencil className="h-3.5 w-3.5" />
                            Refine Aesthetics
                        </Button>
                    </Link>
                    <Badge className="bg-emerald-500 text-white border-none shadow-2xl px-6 py-2.5 rounded-full font-black text-[10px] tracking-widest uppercase">Owner Privilege</Badge>
                </div>
            )}
        </div>
    )
}
