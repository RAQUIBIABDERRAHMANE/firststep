'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Briefcase, Clock, Calendar, Phone, Mail, MapPin, ArrowRight, CheckCircle2, Pencil } from 'lucide-react'
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

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-white">
            {/* Split Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-slate-50">
                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=coverImage" label="Edit Hero Image" />}
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="relative group/edit inline-block">
                            {logo && (
                                <img
                                    src={logo}
                                    alt={siteName}
                                    className="h-20 w-20 rounded-2xl object-cover shadow-2xl rotate-3"
                                />
                            )}
                            {isOwner && (
                                <AdminEditButton
                                    href="/dashboard/cabinet/settings?edit=logo"
                                    label="Logo"
                                />
                            )}
                        </div>
                        <div className="space-y-4 relative group/edit">
                            {isOwner && (
                                <AdminEditButton
                                    href="/dashboard/cabinet/settings?edit=siteName"
                                    label="Edit Title & Description"
                                />
                            )}
                            <Badge
                                variant="outline"
                                className="px-4 py-1.5 rounded-full font-black text-[10px] tracking-[0.3em] uppercase"
                                style={{ color: primaryColor, borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}
                            >
                                Premium Healthcare
                            </Badge>
                            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                                {siteName}
                            </h1>
                            <p className="text-xl text-slate-600 font-medium max-w-lg leading-relaxed">
                                {description || 'Delivering excellence in professional care with a focus on your long-term health and well-being.'}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href={`/${tenantSlug}/book`}>
                                <Button
                                    size="lg"
                                    className="h-16 px-10 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95 group"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Book Now
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-4 px-6 border-l-4" style={{ borderColor: primaryColor }}>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Available Now</p>
                                    <p className="text-sm font-bold text-slate-900">{businessHours}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 pt-8">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-bold text-slate-500">
                                Joined by <span className="text-slate-900">500+</span> happy clients
                            </p>
                        </div>
                    </div>

                    <div className="relative h-[600px] hidden lg:block group">
                        <div
                            className="absolute inset-0 rounded-[4rem] bg-slate-100 overflow-hidden transform group-hover:scale-[0.98] transition-all duration-700 shadow-3xl"
                        >
                            <img
                                src={coverImage || 'https://images.unsplash.com/photo-1576091160550-217359f51f8c?auto=format&fit=crop&w=800&q=80'}
                                alt="Modern Cabinet"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>
                        {/* Floating Stats */}
                        <div className="absolute -bottom-6 -left-6 p-8 bg-white rounded-3xl shadow-2xl border border-slate-50 animate-bounce-slow">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900">99%</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Success Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 skew-x-12 translate-x-1/4" />
            </section>

            {/* Info Section */}
            <section className="py-20 bg-slate-50/50 relative">
                {isOwner && (
                    <div className="absolute top-4 left-4 z-50 flex gap-2">
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=address" label="Edit Address" />
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=phone" label="Edit Contact" />
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=businessHours" label="Edit Hours" />
                    </div>
                )}
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                                <MapPin className="h-6 w-6" style={{ color: primaryColor }} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Location</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{address || 'Professional Business Center, 5th Floor, Casablanca'}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                                <Phone className="h-6 w-6" style={{ color: primaryColor }} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Contact</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{phone || '+212 522 00 00 00'}<br />{email || 'contact@cabinet.com'}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                                <Clock className="h-6 w-6" style={{ color: primaryColor }} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Working Hours</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{businessHours}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Grid - Sleek Horizontal Cards */}
            <section className="py-32 px-6 relative">
                {isOwner && <AdminEditButton href="/dashboard/cabinet/services" label="Manage Services" />}
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                        <div className="space-y-4">
                            <Badge className="font-black uppercase tracking-widest text-[9px] px-3">Catalog</Badge>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Our Expertise</h2>
                        </div>
                        <p className="text-slate-500 font-medium max-w-sm">
                            We provide a wide range of specialized services tailored to your specific needs and requirements.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {services.map((service, idx) => (
                            <div
                                key={service.id}
                                className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 hover:shadow-3xl transition-all duration-500 flex flex-col md:flex-row items-center gap-12 overflow-hidden"
                            >
                                <div
                                    className="absolute top-0 left-0 w-2 h-full transition-all duration-500 group-hover:w-4"
                                    style={{ backgroundColor: primaryColor }}
                                />
                                <div className="text-6xl font-black text-slate-100 transition-colors group-hover:text-slate-50 shrink-0">
                                    0{idx + 1}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors cursor-default">
                                        {service.name}
                                    </h3>
                                    <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
                                        {service.description || 'Our specialized therapy and consultation sessions are designed to deliver visible improvements and lasting health benefits for every patient.'}
                                    </p>
                                    <div className="flex items-center gap-6 pt-4">
                                        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                            <Clock className="h-4 w-4" />
                                            {service.duration} mins
                                        </div>
                                        <div className="text-xl font-black text-slate-900">
                                            {service.price} <span className="text-xs font-bold text-slate-400">DH</span>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/${tenantSlug}/book?service=${service.id}`} className="shrink-0 w-full md:w-auto">
                                    <Button
                                        size="lg"
                                        className="h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all group-hover:scale-105"
                                        style={{ backgroundColor: primaryColor, color: 'white' }}
                                    >
                                        Book Slot
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="py-20 bg-white border-t border-slate-50 mt-20">
                <div className="container mx-auto px-6 flex flex-col items-center text-center gap-10">
                    <div className="space-y-4">
                        <div className="h-14 w-14 rounded-[1.5rem] bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center mx-auto shadow-2xl">
                            <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">{siteName}</h2>
                    </div>
                    <nav className="flex flex-wrap justify-center gap-8 text-sm font-black text-slate-400 uppercase tracking-widest">
                        <a href="#" className="hover:text-primary transition-colors">About</a>
                        <a href="#" className="hover:text-primary transition-colors">Services</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact</a>
                        <Link href={`/${tenantSlug}/book`} className="hover:text-primary transition-colors">Book Now</Link>
                    </nav>
                    <div className="pt-10 border-t border-slate-50 w-full flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase text-slate-300 tracking-widest">
                        <p>© {new Date().getFullYear()} {siteName} / DIGITAL EXPERIENCE</p>
                        <p>Powered by FirstStep Technology</p>
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
                    <Badge className="bg-emerald-500 text-white border-none shadow-2xl px-4 py-2 rounded-full font-black animate-pulse">Owner View</Badge>
                </div>
            )}
        </div>
    )
}
