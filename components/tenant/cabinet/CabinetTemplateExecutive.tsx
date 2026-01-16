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

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Top Bar for trust info */}
            <div className="bg-slate-900 py-2 px-6 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] relative">
                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=phone" label="Edit Phone" />}
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Certified Excellence</span>
                        <span className="hidden md:flex items-center gap-1.5"><Users className="h-3 w-3" /> Dedicated Patient Care</span>
                    </div>
                    <div className="flex gap-4">
                        {phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {phone}</span>}
                    </div>
                </div>
            </div>

            {/* Structured Navigation */}
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 relative group/edit">
                        {logo ? (
                            <img src={logo} alt={siteName} className="h-12 w-12 object-contain" />
                        ) : (
                            <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center font-black text-slate-800 border">FS</div>
                        )}
                        <span className="text-xl font-bold tracking-tight text-slate-900">{siteName}</span>
                        {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=logo" label="Logo" />}
                    </div>
                    <div className="hidden lg:flex gap-10 text-sm font-semibold text-slate-500 uppercase tracking-widest">
                        <a href="#services" className="hover:text-slate-900 transition-colors">Services</a>
                        <a href="#about" className="hover:text-slate-900 transition-colors">Practice</a>
                        <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
                    </div>
                    <Link href={`/${tenantSlug}/book`}>
                        <Button
                            className="rounded-none px-8 font-bold uppercase tracking-widest text-xs h-12"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Request Appointment
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Executive Hero */}
            <header className="relative bg-white overflow-hidden py-24 md:py-32 border-b">
                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=coverImage" label="Edit Hero image" />}
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="space-y-4 relative group/edit">
                            {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=siteName" label="Edit Title & Description" />}
                            <Badge
                                variant="outline"
                                className="px-3 py-1 text-xs border-2 font-bold uppercase tracking-widest rounded-none"
                                style={{ borderColor: `${primaryColor}20`, color: primaryColor }}
                            >
                                Established 2018
                            </Badge>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                                Professional Care <br />
                                <span style={{ color: primaryColor }}>Tailored for You.</span>
                            </h1>
                            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
                                {description || 'We provide specialized medical consultations and therapeutic treatments with a focus on precision, clinical excellence, and long-term results.'}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Link href={`/${tenantSlug}/book`}>
                                <Button
                                    className="h-14 px-10 rounded-none font-bold text-sm uppercase tracking-[0.2em] shadow-lg transition-transform hover:-translate-y-1"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Book Initial Consultation
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-8 border-t">
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-slate-900">15+</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Years Experience</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-slate-900">2.4k</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Successful Cases</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/5] overflow-hidden border-[16px] border-slate-50 bg-slate-100 shadow-2xl">
                            <img
                                src={coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'}
                                alt="Executive Cabinet"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 bg-white p-10 shadow-3xl hidden md:block border">
                            <Award className="h-12 w-12 mb-4" style={{ color: primaryColor }} />
                            <p className="font-bold text-slate-900">Highly Recommended</p>
                            <p className="text-sm text-slate-400">Top-rated practice in the region</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Core Values / Features */}
            <section id="about" className="py-24 bg-slate-50 relative">
                {isOwner && (
                    <div className="absolute top-4 left-4 z-50 flex gap-2">
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=address" label="Edit Practice Info" />
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=businessHours" label="Edit Hours" />
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=email" label="Edit Email" />
                    </div>
                )}
                <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
                    {[
                        { title: 'Clinical Precision', desc: 'Detailed diagnostics using the latest medical standards and equipment.' },
                        { title: 'Personalized Approach', desc: 'Every treatment plan is crafted based on individual patient requirements.' },
                        { title: 'Trusted Expertise', desc: 'Decades of combined experience in specialized professional care.' },
                    ].map((item, i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-1 w-12" style={{ backgroundColor: primaryColor }} />
                            <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Structured Service List */}
            <section id="services" className="py-32 bg-white relative">
                {isOwner && <AdminEditButton href="/dashboard/cabinet/services" label="Manage Services" />}
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="mb-20 space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Our Catalog</span>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Professional Specialties</h2>
                    </div>

                    <div className="border-t">
                        {services.map((service) => (
                            <div key={service.id} className="py-12 border-b flex flex-col md:flex-row md:items-center justify-between gap-8 group">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-2xl font-bold text-slate-900 group-hover:pl-2 transition-all duration-300">{service.name}</h3>
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase py-0 px-2 rounded-none opacity-50">Service</Badge>
                                    </div>
                                    <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
                                        {service.description || 'Dedicated specialized consultation involving comprehensive analysis and customized therapeutic planning.'}
                                    </p>
                                </div>
                                <div className="flex flex-col md:items-end gap-2 shrink-0">
                                    <div className="text-2xl font-black text-slate-900">{service.price} DH</div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{service.duration} Minute Session</p>
                                    <Link href={`/${tenantSlug}/book?service=${service.id}`} className="mt-4">
                                        <Button
                                            variant="outline"
                                            className="rounded-none h-10 px-6 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-colors"
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

            {/* Contact Footer Area */}
            <footer id="contact" className="bg-slate-900 text-white py-24">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 border-b border-white/10 pb-16">
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold uppercase tracking-widest">{siteName}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Providing high-end professional healthcare with a commitment to clinical excellence and patient safety since our founding.</p>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Practice Details</h3>
                            <div className="space-y-4 text-sm font-medium">
                                {address && <p className="flex items-start gap-3"><MapPin className="h-4 w-4 shrink-0 text-slate-500" /> {address}</p>}
                                {phone && <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-slate-500" /> {phone}</p>}
                                {email && <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-slate-500" /> {email}</p>}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Administration</h3>
                            <div className="space-y-4 text-sm font-medium">
                                <p className="flex items-center gap-3"><Calendar className="h-4 w-4 text-slate-500" /> {businessHours}</p>
                                <p className="text-slate-500 italic">Appointments required for all visits.</p>
                            </div>
                        </div>
                        <div className="space-y-6 text-right">
                            <Link href={`/${tenantSlug}/book`}>
                                <Button className="bg-white text-slate-900 rounded-none w-full h-14 font-black uppercase tracking-widest text-xs hover:bg-slate-200">
                                    Schedule Visit
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                        <p>© {new Date().getFullYear()} {siteName}. Official Registry.</p>
                        <p>Powered by FirstStep Professional</p>
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
