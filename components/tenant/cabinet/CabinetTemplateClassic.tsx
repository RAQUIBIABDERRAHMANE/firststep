'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Briefcase, Clock, DollarSign, Calendar, Phone, Mail, MapPin, Star, Pencil, Sparkles, ArrowRight, CheckCircle2, Users, Award } from 'lucide-react'
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
    const businessHours = config.businessHours || 'Lun-Ven: 9h00 - 18h00'
    const phone = config.phone || ''
    const email = config.email || ''
    const address = config.address || ''

    // Generate a lighter version of the primary color for gradients
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 59, g: 130, b: 246 }
    }
    const rgb = hexToRgb(primaryColor)

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans antialiased">
            {/* Floating Nav Bar */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center gap-6">
                <div className="flex items-center gap-3">
                    {logo ? (
                        <img src={logo} alt={siteName} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                        <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {siteName[0]}
                        </div>
                    )}
                    <span className="font-semibold text-slate-800 hidden sm:block">{siteName}</span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <Link href={`/${tenantSlug}/book`}>
                    <Button 
                        size="sm" 
                        className="rounded-full px-5 font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Calendar className="h-4 w-4 mr-2" />
                        Réserver
                    </Button>
                </Link>
            </nav>

            {/* Hero Section - Fresh & Welcoming */}
            <header className="relative min-h-[85vh] flex items-center overflow-hidden pt-20">
                {/* Animated Background Blobs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div 
                        className="absolute top-20 -right-20 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 animate-pulse"
                        style={{ backgroundColor: primaryColor }}
                    />
                    <div 
                        className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 animate-pulse"
                        style={{ backgroundColor: primaryColor, animationDelay: '1s' }}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-amber-100/30 to-rose-100/30 blur-3xl" />
                </div>

                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=coverImage" label="Modifier l'image" />}

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border border-slate-100">
                                <Sparkles className="h-4 w-4" style={{ color: primaryColor }} />
                                <span className="text-sm font-medium text-slate-600">Bienvenue chez nous</span>
                            </div>

                            <div className="space-y-6 relative">
                                {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=siteName" label="Modifier le titre" />}
                                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                                    {siteName}
                                </h1>
                                <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                                    {description || 'Votre partenaire de confiance pour des services professionnels de qualité. Expertise, écoute et résultats garantis.'}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link href={`/${tenantSlug}/book`}>
                                    <Button
                                        size="lg"
                                        className="h-14 px-8 rounded-2xl font-semibold text-base shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-3 group"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <Calendar className="h-5 w-5" />
                                        Prendre rendez-vous
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 px-8 rounded-2xl font-semibold text-base border-2 hover:bg-slate-50 transition-all"
                                >
                                    <Phone className="h-5 w-5 mr-2" />
                                    Nous appeler
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    <span className="text-sm font-medium">+500 clients satisfaits</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                    <span className="text-sm font-medium">4.9/5 avis</span>
                                </div>
                            </div>
                        </div>

                        {/* Right - Image/Logo */}
                        <div className="relative hidden lg:block">
                            {isOwner && <AdminEditButton href="/dashboard/cabinet/settings?edit=logo" label="Logo" />}
                            <div className="relative">
                                {/* Decorative circles */}
                                <div 
                                    className="absolute -top-8 -left-8 w-full h-full rounded-[40px] opacity-20"
                                    style={{ backgroundColor: primaryColor }}
                                />
                                <div className="relative bg-white rounded-[40px] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100">
                                    {coverImage ? (
                                        <img
                                            src={coverImage}
                                            alt={siteName}
                                            className="w-full h-[400px] object-cover rounded-[28px]"
                                        />
                                    ) : logo ? (
                                        <div className="w-full h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-[28px]">
                                            <img src={logo} alt={siteName} className="h-48 w-48 object-contain" />
                                        </div>
                                    ) : (
                                        <div 
                                            className="w-full h-[400px] flex items-center justify-center rounded-[28px]"
                                            style={{ background: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}40 100%)` }}
                                        >
                                            <div 
                                                className="h-32 w-32 rounded-full flex items-center justify-center text-white font-bold text-6xl shadow-2xl"
                                                style={{ backgroundColor: primaryColor }}
                                            >
                                                {siteName[0]}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Floating card - Hours */}
                                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3">
                                    <div 
                                        className="h-12 w-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${primaryColor}15` }}
                                    >
                                        <Clock className="h-6 w-6" style={{ color: primaryColor }} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Horaires</p>
                                        <p className="text-sm font-bold text-slate-800">{businessHours}</p>
                                    </div>
                                </div>

                                {/* Floating card - Rating */}
                                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Excellent service</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contact Info Strip */}
            <section className="py-8 bg-white border-y border-slate-100 relative z-20">
                {isOwner && (
                    <div className="absolute top-2 left-4 z-50 flex gap-2">
                        <AdminEditButton href="/dashboard/cabinet/settings?edit=phone" label="Modifier les infos" />
                    </div>
                )}
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                        <a href={`tel:${phone}`} className="flex items-center gap-3 group hover:text-slate-900 transition-colors text-slate-600">
                            <div 
                                className="h-10 w-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                                style={{ backgroundColor: `${primaryColor}15` }}
                            >
                                <Phone className="h-5 w-5" style={{ color: primaryColor }} />
                            </div>
                            <span className="font-medium">{phone || '+212 522 00 00 00'}</span>
                        </a>
                        <a href={`mailto:${email}`} className="flex items-center gap-3 group hover:text-slate-900 transition-colors text-slate-600">
                            <div 
                                className="h-10 w-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                                style={{ backgroundColor: `${primaryColor}15` }}
                            >
                                <Mail className="h-5 w-5" style={{ color: primaryColor }} />
                            </div>
                            <span className="font-medium">{email || 'contact@cabinet.com'}</span>
                        </a>
                        <div className="flex items-center gap-3 text-slate-600">
                            <div 
                                className="h-10 w-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${primaryColor}15` }}
                            >
                                <MapPin className="h-5 w-5" style={{ color: primaryColor }} />
                            </div>
                            <span className="font-medium">{address || 'Casablanca, Maroc'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section - Modern Cards */}
            <section className="py-24 px-6 relative">
                {isOwner && <AdminEditButton href="/dashboard/cabinet/services" label="Gérer les services" />}
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16 space-y-4">
                        <div 
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                        >
                            <Briefcase className="h-4 w-4" />
                            Nos prestations
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                            Services proposés
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Découvrez notre gamme complète de services professionnels adaptés à vos besoins
                        </p>
                    </div>

                    {services.length === 0 ? (
                        <Card className="max-w-md mx-auto border-dashed border-2 border-slate-200 rounded-3xl bg-white">
                            <CardContent className="text-center py-16">
                                <div 
                                    className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                                    style={{ backgroundColor: `${primaryColor}15` }}
                                >
                                    <Briefcase className="h-8 w-8" style={{ color: primaryColor }} />
                                </div>
                                <p className="text-slate-500 font-medium">Aucun service disponible pour le moment</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {services.map((service, idx) => (
                                <div
                                    key={service.id}
                                    className="group bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-transparent transition-all duration-500 flex flex-col relative overflow-hidden hover:-translate-y-2"
                                >
                                    {/* Gradient overlay on hover */}
                                    <div 
                                        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl"
                                        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, transparent 100%)` }}
                                    />

                                    <div className="relative z-10 space-y-5 flex-1 flex flex-col">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div 
                                                className="h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                                                style={{ backgroundColor: `${primaryColor}15` }}
                                            >
                                                <Briefcase className="h-7 w-7" style={{ color: primaryColor }} />
                                            </div>
                                            <Badge className="bg-emerald-50 text-emerald-600 border-0 text-xs font-semibold px-3 py-1 rounded-full">
                                                Disponible
                                            </Badge>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-3 flex-1">
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-slate-800 transition-colors">
                                                {service.name}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                                                {service.description || 'Service professionnel de qualité pour répondre à vos besoins spécifiques.'}
                                            </p>
                                        </div>

                                        {/* Meta Info */}
                                        <div className="flex items-center gap-4 py-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Clock className="h-4 w-4" />
                                                <span className="text-sm font-medium">{service.duration} min</span>
                                            </div>
                                            <div className="flex items-center gap-1 ml-auto">
                                                <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                                                    {service.price}
                                                </span>
                                                <span className="text-sm text-slate-400 font-medium">DH</span>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <Link href={`/${tenantSlug}/book?service=${service.id}`} className="block">
                                            <Button
                                                className="w-full h-12 rounded-xl font-semibold transition-all group-hover:shadow-lg flex items-center justify-center gap-2"
                                                style={{ backgroundColor: primaryColor }}
                                            >
                                                Réserver
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div 
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
                />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-30" />
                
                <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                            Prêt à commencer ?
                        </h2>
                        <p className="text-xl text-white/80 max-w-xl mx-auto">
                            Prenez rendez-vous dès maintenant et bénéficiez d'un accompagnement personnalisé
                        </p>
                    </div>
                    <Link href={`/${tenantSlug}/book`}>
                        <Button
                            size="lg"
                            className="h-16 px-10 rounded-2xl bg-white text-slate-900 hover:bg-slate-50 font-bold text-lg shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-3 mx-auto"
                        >
                            <Calendar className="h-5 w-5" />
                            Réserver maintenant
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 bg-slate-900 text-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-12 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                {logo ? (
                                    <img src={logo} alt={siteName} className="h-10 w-10 rounded-xl object-cover" />
                                ) : (
                                    <div 
                                        className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {siteName[0]}
                                    </div>
                                )}
                                <span className="text-xl font-bold">{siteName}</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Votre partenaire de confiance pour des services professionnels de qualité.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-white">Contact</h4>
                            <div className="space-y-3 text-sm text-slate-400">
                                <p className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    {phone || '+212 522 00 00 00'}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {email || 'contact@cabinet.com'}
                                </p>
                                <p className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {address || 'Casablanca, Maroc'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-white">Horaires</h4>
                            <div className="space-y-2 text-sm text-slate-400">
                                <p className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {businessHours}
                                </p>
                            </div>
                            <Link href={`/${tenantSlug}/book`}>
                                <Button 
                                    className="mt-4 rounded-xl font-medium"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Prendre RDV
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} {siteName}. Tous droits réservés.
                        </p>
                        <p className="text-slate-600 text-xs flex items-center gap-2">
                            Propulsé par <span className="font-semibold text-slate-400">FirstStep</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
