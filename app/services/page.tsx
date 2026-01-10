import { getServices } from '@/app/actions/services'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Utensils, Store, Package, Car, Hotel, Hospital, Briefcase, Sparkles, Clock, ArrowLeft, Check } from 'lucide-react'

const getServiceIcon = (category: string | null) => {
    const iconClass = "h-10 w-10"
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

const getServiceFeatures = (category: string | null) => {
    switch (category) {
        case 'restaurant':
            return [
                'Online menu management',
                'Order processing system',
                'Kitchen display integration',
                'Table management',
                'Analytics dashboard'
            ]
        case 'inventory':
            return [
                'Inventory tracking and control',
                'Alerts for low stock',
                'Product categorization',
                'Barcode integration',
                'Stock movement analytics'
            ]
        case 'rental':
            return [
                'Vehicle fleet management',
                'Rental reservation workflows',
                'Flexible pricing rules',
                'Customer and driver profiles',
                'Availability calendar'
            ]
        case 'hospitality':
            return [
                'Room inventory dashboard',
                'Booking engine & calendar',
                'Check-in/Check-out workflows',
                'Billing and invoicing',
                'Guest profile management'
            ]
        case 'healthcare':
            return [
                'Patient registration',
                'Medical records management',
                'Appointment scheduling',
                'Billing & insurance handling',
                'Pharmacy inventory'
            ]
        case 'professional-services':
            return [
                'Appointment calendar',
                'Client record management',
                'Service catalog & pricing',
                'Billing and receipts',
                'Automated reminders'
            ]
        default:
            return ['Feature 1', 'Feature 2', 'Feature 3']
    }
}

export default async function ServicesPage() {
    const services = await getServices()

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b border-border/50 bg-background/80 backdrop-blur-2xl sticky top-0 z-50">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 font-bold text-2xl tracking-tight text-foreground hover:opacity-80 transition-all duration-300 group">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center text-primary-foreground font-black shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-300">
                            F
                        </div>
                        <span className="gradient-text">FirstStep</span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center animate-fade-in">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-bold text-primary border-2 border-primary/30 shadow-lg shadow-primary/20 backdrop-blur-sm mb-8">
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            Complete Solution Suite
                        </div>
                        <h1 className="text-6xl font-black tracking-tight text-foreground mb-8">
                            All <span className="gradient-text">Services</span>
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                            Discover our comprehensive range of business management solutions designed to streamline your operations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 relative">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
                        {services.map((service, index) => {
                            const isAvailable = service.status === 'AVAILABLE'
                            const features = getServiceFeatures(service.category)

                            return (
                                <Card
                                    key={service.id}
                                    className={`
                                        group relative overflow-hidden
                                        bg-card/80 backdrop-blur-sm border border-border/50
                                        hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10
                                        transition-all duration-300
                                    `}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Subtle Gradient Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {/* Outer Glow */}
                                    <div className={`
                                        absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700
                                        ${isAvailable ? 'bg-gradient-to-r from-primary via-accent to-primary' : 'bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40'}
                                    `} style={{ zIndex: -1 }} />

                                    <CardHeader className="pb-8 relative">
                                        <div className="flex items-start gap-6">
                                            {/* Icon - Clean & Professional */}
                                            <div className={`
                                                relative p-4 rounded-2xl transition-all duration-300
                                                ${isAvailable 
                                                    ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' 
                                                    : 'bg-muted/80 text-muted-foreground group-hover:bg-muted'
                                                }
                                            `}>
                                                {getServiceIcon(service.category)}
                                            </div>
                                            
                                            {/* Title and Badge */}
                                            <div className="flex-1 space-y-4">
                                                <CardTitle className="text-3xl font-bold tracking-tight text-foreground group-hover:text-white transition-colors duration-300 leading-tight">
                                                    {service.name}
                                                </CardTitle>
                                                <Badge 
                                                    variant={isAvailable ? 'success' : 'comingSoon'}
                                                    className="text-xs font-bold tracking-wide px-3 py-1.5"
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
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent className="space-y-8 relative">
                                        {/* Description */}
                                        <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                                            {service.description || 'Comprehensive business management solution.'}
                                        </CardDescription>
                                        
                                        {/* Features List */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-0.5 w-8 bg-gradient-to-r from-primary to-accent rounded-full" />
                                                <h4 className="text-sm font-black text-foreground group-hover:text-white transition-colors duration-300 uppercase tracking-wider">Key Features</h4>
                                            </div>
                                            <ul className="space-y-3">
                                                {features.map((feature, idx) => (
                                                    <li 
                                                        key={idx} 
                                                        className="flex items-start gap-3 text-sm group/item hover:translate-x-1 transition-transform duration-300"
                                                        style={{ animationDelay: `${idx * 50}ms` }}
                                                    >
                                                        <div className="mt-0.5 p-1 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                                                            <Check className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <span className="font-medium text-muted-foreground group-hover:text-white/90 transition-colors duration-300 flex-1">
                                                            {feature}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* CTA Button */}
                                        {isAvailable ? (
                                            <>
                                                {/* Price Display */}
                                                <div className="flex items-baseline justify-between p-6 rounded-xl bg-muted/40 border border-border/50">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-semibold text-muted-foreground group-hover:text-white/70 transition-colors duration-300 uppercase tracking-widest">Starting at</p>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-4xl font-bold text-foreground group-hover:text-white transition-colors duration-300">2,500</span>
                                                            <span className="text-xl font-semibold text-muted-foreground group-hover:text-white/80 transition-colors duration-300">DH</span>
                                                        </div>
                                                        <p className="text-xs font-medium text-muted-foreground group-hover:text-white/70 transition-colors duration-300">
                                                            {service.slug === 'restaurant-website' ? 'one-time payment' : 'per month'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <Badge variant="success" className="text-xs font-bold">
                                                            <Sparkles className="h-3 w-3 mr-1" />
                                                            {service.slug === 'restaurant-website' ? 'Lifetime' : 'Best Value'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                
                                                {/* Special Offer for Restaurant Website */}
                                                {service.slug === 'restaurant-website' && (
                                                    <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-2 rounded-lg bg-emerald-500/20">
                                                                <Sparkles className="h-5 w-5 text-emerald-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-emerald-600 mb-2">
                                                                    🎁 Special Launch Offer
                                                                </p>
                                                                <p className="text-sm text-foreground leading-relaxed mb-2">
                                                                    Subscribe now and get <span className="font-bold text-emerald-600">20% OFF</span> on our upcoming Restaurant POS System when it becomes available!
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Exclusive offer for Website lifetime members - Save 20% on POS subscription.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <Link href="/#signup" className="block">
                                                    <Button className="w-full font-black text-base h-14 gap-3 relative overflow-hidden group/btn">
                                                        <span className="relative z-10 flex items-center gap-3">
                                                            <Sparkles className="h-5 w-5" />
                                                            Get Started with {service.name.split(' ')[0]}
                                                        </span>
                                                    </Button>
                                                </Link>
                                            </>
                                        ) : (
                                            <Button 
                                                disabled 
                                                variant="outline" 
                                                className="w-full font-bold text-base h-14 gap-3 cursor-not-allowed"
                                            >
                                                <Clock className="h-5 w-5" />
                                                Notify Me When Available
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl font-black text-foreground mb-6">
                            Ready to transform your business?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-10 font-medium">
                            Join hundreds of businesses already using FirstStep to streamline their operations.
                        </p>
                        <Link href="/#signup">
                            <Button size="lg" className="px-12 text-lg h-16 font-black gap-3">
                                <Sparkles className="h-5 w-5" />
                                Get Started Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
