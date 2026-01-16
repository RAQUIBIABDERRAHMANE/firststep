'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { CabinetTemplateProps } from './CabinetTemplateClassic'

export default function CabinetTemplateMinimal({
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
    const phone = config.phone || ''
    const email = config.email || ''
    const address = config.address || ''

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 border-t-8" style={{ borderColor: primaryColor }}>
            {/* Minimal Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {logo && <img src={logo} alt={siteName} className="h-10 w-10 rounded-full grayscale" />}
                        <span className="text-xl font-black tracking-tighter uppercase">{siteName}</span>
                    </div>
                    <Link href={`/${tenantSlug}/book`}>
                        <Button
                            variant="outline"
                            className="rounded-full border-2 font-black text-xs tracking-widest uppercase"
                            style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                            Booking ↗
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Simple Hero */}
            <header className="py-24 md:py-40 px-6 bg-slate-50/30">
                <div className="container mx-auto max-w-4xl text-center space-y-8">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85]">
                        PROFESSIONAL <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-500 to-slate-900 opacity-80">
                            PRACTICE.
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        {description || 'We offer specialized therapeutic care and clinical consultations centered around your recovery and personal growth.'}
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
                        <Link href={`/${tenantSlug}/book`}>
                            <Button
                                size="lg"
                                className="h-16 px-12 rounded-full font-black text-xl shadow-2xl transition-transform hover:scale-105"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Get Started
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 text-slate-400 font-black text-[10px] tracking-[0.3em] uppercase">
                            <div className="h-1 w-12 rounded-full" style={{ backgroundColor: primaryColor }} />
                            Quick Appointments
                        </div>
                    </div>
                </div>
            </header>

            {/* Grid of Services - High Contrast */}
            <section className="py-32 container mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-px bg-slate-100 border border-slate-100 overflow-hidden rounded-[3rem]">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white p-12 md:p-20 hover:bg-slate-50 transition-colors group flex flex-col justify-between min-h-[400px]"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="border-2 font-black text-[10px] tracking-widest uppercase px-4">
                                        Clinical
                                    </Badge>
                                    <div className="text-3xl font-black tracking-tighter" style={{ color: primaryColor }}>
                                        {service.price} DH
                                    </div>
                                </div>
                                <h2 className="text-4xl font-black tracking-tight leading-none group-hover:translate-x-2 transition-transform">
                                    {service.name}
                                </h2>
                                <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
                                    {service.description || 'Specialized consultation and data-driven approach to mental health and professional coaching.'}
                                </p>
                            </div>
                            <div className="pt-12 flex items-end justify-between">
                                <span className="font-black text-[10px] tracking-widest text-slate-300 uppercase">
                                    Duration / {service.duration} mins
                                </span>
                                <Link href={`/${tenantSlug}/book?service=${service.id}`}>
                                    <Button
                                        variant="ghost"
                                        className="h-14 w-14 rounded-full p-0 flex items-center justify-center hover:bg-primary hover:text-white transition-all border-2 border-slate-100"
                                        style={{ borderColor: `${primaryColor}20` }}
                                    >
                                        <ExternalLink className="h-6 w-6" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                    {services.length % 2 !== 0 && (
                        <div className="bg-slate-950 p-12 md:p-20 flex flex-col justify-center items-center text-center space-y-6">
                            <h3 className="text-white text-3xl font-black tracking-tighter">Need a custom plan?</h3>
                            <p className="text-slate-500 font-medium max-w-xs">We provide personalized solutions for specific requirements and group sessions.</p>
                            <Button variant="outline" className="text-white border-white/20 hover:bg-white hover:text-black font-black uppercase tracking-widest text-xs h-12 px-8 rounded-full">
                                Contact Us
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer with Big Typography */}
            <footer className="py-32 px-6 border-t border-slate-50 overflow-hidden relative">
                <div className="container mx-auto grid md:grid-cols-2 gap-20 items-end">
                    <div className="space-y-12">
                        <h2 className="text-7xl md:text-9xl font-black tracking-tighter opacity-[0.03] absolute -bottom-10 left-0 select-none">
                            {siteName}
                        </h2>
                        <div className="space-y-6 relative z-10">
                            <h3 className="text-2xl font-black italic tracking-tight">Stay in touch.</h3>
                            <div className="grid gap-4">
                                {phone && <a href={`tel:${phone}`} className="text-slate-500 font-bold hover:text-black transition-colors">{phone}</a>}
                                {email && <a href={`mailto:${email}`} className="text-slate-500 font-bold hover:text-black transition-colors">{email}</a>}
                                {address && <p className="text-slate-400 font-medium max-w-xs">{address}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-10">
                        <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                                <span className="font-black text-xs uppercase">In</span>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                                <span className="font-black text-xs uppercase">Tw</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-300">
                            © {new Date().getFullYear()} / Design by FirstStep
                        </p>
                    </div>
                </div>
            </footer>

            {isOwner && (
                <div className="fixed top-24 right-6 pointer-events-none">
                    <span className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-full">Owner</span>
                </div>
            )}
        </div>
    )
}
