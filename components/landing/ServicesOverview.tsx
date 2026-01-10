import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Utensils, Store, Package, Car, Hotel, Hospital, Briefcase, Sparkles, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Service = {
    id: string
    name: string
    description: string | null
    status: string
    category: string | null
}

interface ServicesOverviewProps {
    services: Service[]
}

const getServiceIcon = (category: string | null) => {
    const iconClass = "h-8 w-8"
    switch (category) {
        case 'restaurant':
            return <Utensils className={iconClass} />
        case 'inventory':
            return <Package className={iconClass} />
        case 'rental':
            return <Car className={iconClass} />
        case 'hospitality':
            return <Hotel className={iconClass} />
        case 'healthcare':
            return <Hospital className={iconClass} />
        case 'professional-services':
            return <Briefcase className={iconClass} />
        default:
            return <Store className={iconClass} />
    }
}

export default function ServicesOverview({ services }: ServicesOverviewProps) {
    return (
        <section id="services" className="relative py-32 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,92,246,0.08),transparent_50%)]" />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20 animate-fade-in">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-bold text-primary border-2 border-primary/30 shadow-lg shadow-primary/20 backdrop-blur-sm mb-6">
                        <Sparkles className="h-4 w-4" />
                        Our Solutions
                    </div>
                    <h2 className="text-5xl font-black tracking-tight text-foreground mb-6">
                        Core <span className="gradient-text">Systems</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
                        Modular capabilities designed for immediate impact. Activate what you need, when you need it.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const isAvailable = service.status === 'AVAILABLE';

                        return (
                            <Card
                                key={service.id}
                                className={`
                                    group relative overflow-hidden flex flex-col
                                    bg-card/80 backdrop-blur-sm border border-border/50
                                    hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10
                                    transition-all duration-300 animate-fade-in
                                `}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Subtle Gradient Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <CardHeader className="relative pb-8 space-y-5 flex-1">
                                    {/* Icon Container - Clean & Professional */}
                                    <div className="flex items-start justify-between">
                                        <div className={`
                                            relative p-3.5 rounded-2xl transition-all duration-300
                                            ${isAvailable 
                                                ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' 
                                                : 'bg-muted/80 text-muted-foreground group-hover:bg-muted'
                                            }
                                        `}>
                                            {getServiceIcon(service.category)}
                                        </div>
                                        
                                        {/* Status Badge */}
                                        <Badge 
                                            variant={isAvailable ? 'success' : 'comingSoon'}
                                            className="text-[10px] font-bold tracking-wide px-2.5 py-1"
                                        >
                                            {isAvailable ? (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                                                    LIVE
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="h-3 w-3 mr-1.5" />
                                                    SOON
                                                </>
                                            )}
                                        </Badge>
                                    </div>

                                    {/* Title */}
                                    <div className="space-y-3">
                                        <CardTitle className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                                            {service.name}
                                        </CardTitle>
                                        
                                        {/* Description */}
                                        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                                            {service.description || 'Comprehensive business management solution.'}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                
                                {/* Price Section for Available Services */}
                                {isAvailable && (
                                    <div className="px-6 pb-6 space-y-4">
                                        {/* Price Display */}
                                        <div className="flex items-baseline justify-between p-5 rounded-xl bg-muted/40 border border-border/50">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Starting at</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-bold text-foreground">2,500</span>
                                                    <span className="text-lg font-semibold text-muted-foreground">DH</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    {service.slug === 'restaurant-website' ? 'lifetime' : 'per month'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Special Offer for Restaurant Website */}
                                        {service.slug === 'restaurant-website' && (
                                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-1.5 rounded-lg bg-emerald-500/20">
                                                        <Sparkles className="h-4 w-4 text-emerald-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-emerald-600 mb-1">
                                                            Special Launch Offer
                                                        </p>
                                                        <p className="text-xs text-foreground leading-relaxed">
                                                            Get <span className="font-bold text-emerald-600">20% off</span> on Restaurant POS when it launches
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Bottom Accent Border */}
                                <div className={`
                                    h-1 w-full mt-auto transition-all duration-300
                                    ${isAvailable 
                                        ? 'bg-gradient-to-r from-primary/80 via-primary to-primary/80' 
                                        : 'bg-border group-hover:bg-primary/40'
                                    }
                                `} />
                            </Card>
                        )
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-16 animate-fade-in">
                    <Link href="/services">
                        <Button size="lg" variant="outline" className="px-10 text-base font-bold gap-3 group">
                            View All Services
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
