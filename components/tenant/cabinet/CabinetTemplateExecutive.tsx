'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Mail, Phone, MapPin, CheckCircle, Award, Users, ShieldCheck, ArrowRight, Pencil } from 'lucide-react'
import Link from 'next/link'
import { CabinetTemplateProps } from './CabinetTemplateClassic'
import AdminEditButton from './AdminEditButton'

export default function CabinetTemplateExecutive({
    siteName,
    description,
    coverImage,
    logo,
    config,
    services,
    isOwner,
    primaryColor = '#1e293b', // Default to a professional Navy
    tenantSlug,
}: CabinetTemplateProps) {
    const businessHours = config.businessHours || 'Monday - Friday: 09:00 - 18:00'
    const phone = config.phone || ''
    const email = config.email || ''
    const address = config.address || ''
    const CURRENCY = config.currency || 'DH'

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
            {/* Elegant Top Bar for trust info */}
            <div className="bg-slate-950 py-3 px-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=phone" label="Edit Phone" />}
                <div className="container mx-auto flex justify-between items-center relative z-10">
                    <div className="flex gap-8">
                        <span className="flex items-center gap-2 group cursor-default transition-colors hover:text-white">
                            <ShieldCheck className="h-3.5 w-3.5 text-slate-500 group-hover:text-[var(--primary)] transition-colors" />
                            ISO Certified Excellence
                        </span>
                        <span className="hidden md:flex items-center gap-2 group cursor-default transition-colors hover:text-white">
                            <Users className="h-3.5 w-3.5 text-slate-500 group-hover:text-[var(--primary)] transition-colors" />
                            Patient-First Philosophy
                        </span>
                    </div>
                    <div className="flex gap-6 items-center">
                        {phone && (
                            <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                                <Phone className="h-3 w-3" /> {phone}
                            </a>
                        )}
                        <div className="h-3 w-px bg-slate-800" />
                        <span className="hidden sm:inline">{address}</span>
                    </div>
                </div>
            </div>

            {/* Structured Navigation - Glassmorphism */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 transition-all duration-500">
                <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-6 relative group/edit cursor-pointer">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-14 w-14 object-contain transition-transform group-hover:scale-105" />
                        ) : (
                            <div className="h-12 w-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl shadow-slate-900/10">
                                {siteName[0]}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tighter text-slate-950 leading-none">{siteName}</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1.5">Elite Consulting</span>
                        </div>
                        {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=logo" label="Logo" />}
                    </div>

                    <div className="hidden lg:flex gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        <a href="#services" className="hover:text-slate-950 transition-all relative group py-2">
                            Services
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </a>
                        <a href="#about" className="hover:text-slate-950 transition-all relative group py-2">
                            Philosophy
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </a>
                        <a href="#contact" className="hover:text-slate-950 transition-all relative group py-2">
                            Contact
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </a>
                    </div>

                    <Link href={`/${tenantSlug}/book`}>
                        <Button
                            className="rounded-2xl px-10 font-black uppercase tracking-[0.2em] text-[10px] h-14 shadow-2xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all hover:-translate-y-1 active:scale-95"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Secure Appointment
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Executive Hero - More Breathing Room */}
            <header className="relative bg-white overflow-hidden py-32 lg:py-48 border-b border-slate-100">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 skew-x-12 translate-x-20 pointer-events-none" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-slate-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=coverImage" label="Edit Hero image" />}
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-24 lg:gap-32 items-center relative z-10">
                    <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-1000 fade-in">
                        <div className="space-y-8 relative group/edit">
                            {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=siteName" label="Edit Title & Description" />}
                            <div className="flex items-center gap-4">
                                <div className="h-px w-12 bg-slate-200" />
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
                                    Established MMXVIII
                                </span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-slate-950 leading-[0.9] tracking-tighter">
                                Excellence <br />
                                <span className="italic font-serif font-medium text-slate-400" style={{ color: `${primaryColor}CC` }}>by Design.</span>
                            </h1>
                            <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
                                {description || 'Directing multi-disciplinary expertise toward clinical precision and bespoke healthcare solutions tailored for the discerning individual.'}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link href={`/${tenantSlug}/book`}>
                                <Button
                                    className="h-16 px-12 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.25)] hover:-translate-y-1 active:scale-95"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Start Consultation
                                </Button>
                            </Link>
                            <Button variant="outline" className="h-16 px-12 rounded-2xl border-2 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-slate-50 transition-all border-slate-200">
                                View Credentials
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-12 pt-12 border-t border-slate-100">
                            <div className="space-y-2">
                                <p className="text-4xl font-black text-slate-950 tracking-tighter">25+</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Senior Consultants</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-4xl font-black text-slate-950 tracking-tighter">98%</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Success Coefficient</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="aspect-[4/5] overflow-hidden rounded-[60px] border-[24px] border-[#fafafa] bg-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] transition-transform duration-1000 group-hover:scale-[1.02]">
                            <img
                                src={coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'}
                                alt="Executive Cabinet"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        </div>
                        {/* Status Float - Floating with Animation */}
                        <div className="absolute -bottom-12 -right-12 bg-white p-12 shadow-3xl rounded-[40px] hidden md:block border border-slate-100 animate-float">
                            <div className="mb-6 h-14 w-14 rounded-2xl flex items-center justify-center bg-slate-50" style={{ color: primaryColor }}>
                                <Award className="h-8 w-8" />
                            </div>
                            <p className="font-black text-xl text-slate-950 leading-tight">Elite <br />Practitioner</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Regional Benchmark</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Core Values / Philosophy */}
            <section id="about" className="py-40 bg-[#fafafa] relative overflow-hidden">
                {isOwner && (
                    <div className="absolute top-4 left-4 z-50 flex gap-2">
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=address" label="Edit Practice Info" />
                    </div>
                )}
                <div className="container mx-auto px-6 grid md:grid-cols-3 gap-20 lg:gap-32">
                    {[
                        { title: 'Clinical Rigor', desc: 'Implementing the most stringent diagnostic frameworks to ensure absolute precision in patient outcomes.' },
                        { title: 'Bespoke Protocols', desc: 'Departure from generic care. We engineer treatment paths based on deep biological profiling.' },
                        { title: 'Global Standards', desc: 'Our practitioners operate at the intersection of international research and local clinical application.' },
                    ].map((item, i) => (
                        <div key={i} className="space-y-8 group">
                            <div className="h-1.5 w-16 bg-slate-200 group-hover:w-24 transition-all duration-500" style={{ backgroundColor: i === 1 ? primaryColor : undefined }} />
                            <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-tight">{item.title}</h3>
                            <p className="text-slate-500 text-base leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Structured Service List - Clean and High Contrast */}
            <section id="services" className="py-48 bg-white relative">
                {isOwner && <AdminEditButton href="/dashboard/cabinet/services" label="Manage Services" />}
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="mb-32 space-y-6 text-center lg:text-left">
                        <div className="flex items-center gap-4 justify-center lg:justify-start">
                            <div className="h-0.5 w-8 bg-slate-950" />
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Clinical Portfolio</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter leading-none">Specialized Consultations</h2>
                    </div>

                    <div className="space-y-8">
                        {services.map((service) => (
                            <div key={service.id} className="p-10 lg:p-14 border border-slate-100 hover:border-slate-300 rounded-[40px] flex flex-col md:flex-row md:items-center justify-between gap-12 group transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200">
                                <div className="space-y-6 flex-1">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-3xl font-black text-slate-950 group-hover:text-[var(--primary)] transition-colors tracking-tight">{service.name}</h3>
                                            <div className="px-3 py-1 bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500 rounded-lg">Verified</div>
                                        </div>
                                        <p className="text-slate-500 font-medium max-w-xl leading-relaxed text-lg">
                                            {service.description || 'A comprehensive multi-phase technical assessment involving rigorous data analysis and strategic roadmap development.'}
                                        </p>
                                    </div>
                                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span className="flex items-center gap-2"><CheckCircle className="h-3 w-3" /> Senior Review Included</span>
                                        <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Digital Records</span>
                                    </div>
                                </div>
                                <div className="flex flex-col md:items-end gap-6 shrink-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100">
                                    <div className="text-4xl font-black text-slate-950 tracking-tighter">{service.price} <span className="text-xs uppercase ml-1" style={{ color: primaryColor }}>{CURRENCY}</span></div>
                                    <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">{service.duration} Min Protocol</div>
                                    <Link href={`/${tenantSlug}/book?service=${service.id}`}>
                                        <Button
                                            variant="outline"
                                            className="rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[10px] border-2 border-slate-200 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all active:scale-95"
                                        >
                                            Inquire Slot
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Contact Footer */}
            <footer id="contact" className="bg-slate-950 text-white py-40">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-24 lg:gap-32 border-b border-white/5 pb-32">
                        <div className="space-y-12">
                            <h3 className="text-2xl font-black tracking-tighter">{siteName}</h3>
                            <p className="text-slate-500 text-base leading-relaxed font-medium">Redefining high-end professional healthcare with a core focus on clinical precision and executive patient experiences.</p>
                            <div className="flex gap-6">
                                <div className="h-12 w-12 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white hover:border-white transition-all cursor-pointer">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="h-12 w-12 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white hover:border-white transition-all cursor-pointer">
                                    <Phone size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Headquarters</h3>
                            <div className="space-y-6 text-base font-medium text-slate-400">
                                {address && <p className="flex items-start gap-4 hover:text-white transition-colors"><MapPin className="h-5 w-5 shrink-0 text-slate-600" /> {address}</p>}
                                {phone && <p className="flex items-center gap-4 hover:text-white transition-colors"><Phone className="h-5 w-5 text-slate-600" /> {phone}</p>}
                                {email && <p className="flex items-center gap-4 hover:text-white transition-colors"><Mail className="h-5 w-5 text-slate-600" /> {email}</p>}
                            </div>
                        </div>
                        <div className="space-y-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Operational Hours</h3>
                            <div className="space-y-6 text-base font-medium text-slate-400">
                                <p className="flex items-start gap-4"><Calendar className="h-5 w-5 text-slate-600" /> {businessHours}</p>
                                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                                    <p className="text-xs text-slate-500 italic leading-relaxed">Appointments are mandatory for all on-site consultations to maintain clinical privacy.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-10 flex flex-col justify-end">
                            <Link href={`/${tenantSlug}/book`}>
                                <Button className="bg-white text-slate-950 rounded-[40px] w-full h-20 font-black uppercase tracking-[0.3em] text-[11px] hover:bg-slate-200 shadow-2xl shadow-black transition-all hover:-translate-y-2">
                                    Request Access
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="pt-20 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
                        <p>© {new Date().getFullYear()} {siteName}. Limited Liability Partnership.</p>
                        <div className="flex gap-12">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Safety</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>

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
                    <div className="bg-slate-900 border border-white/20 text-white px-6 py-3 shadow-2xl flex items-center gap-3 animate-pulse">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Administrative Preview</span>
                    </div>
                </div>
            )}
        </div>
    )
}
