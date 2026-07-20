import { getCurrentUser } from '@/app/actions/auth'
import Navbar from '@/components/landing/Navbar'
import CustomWebsitePublicForm from '@/components/dashboard/CustomWebsitePublicForm'
import { Sparkles, Laptop, Shield, Heart } from 'lucide-react'

export default async function CustomWebsiteRequestPage() {
    const user = await getCurrentUser()

    const C = '0, 102, 255' // primary blue RGB

    return (
        <div className="min-h-screen bg-[#030712] relative overflow-hidden pb-16">
            <style>{`
                @keyframes shimmer-sweep {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                .shimmer-cyan-text {
                    background: linear-gradient(105deg, #5E9FFF 0%, #0066FF 25%, #ffffff 48%, #0066FF 72%, #0044CC 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer-sweep 5s linear infinite;
                }
            `}</style>

            <Navbar user={user} />

            {/* Background elements */}
            <div className="absolute inset-0 bg-[#030712] z-0" />
            <div 
                className="absolute inset-0 opacity-[0.02] z-0"
                style={{
                    backgroundImage: `radial-gradient(rgba(${C},0.5) 1px, transparent 1px)`,
                    backgroundSize: '48px 48px',
                }}
            />
            
            {/* Ambient glows */}
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-10 pointer-events-none" style={{ backgroundColor: `rgba(${C},0.5)` }} />
            <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ backgroundColor: `rgba(${C},0.3)` }} />

            <div className="container mx-auto px-6 relative z-10 pt-36">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/5 border border-white/10 text-slate-300">
                        <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider font-syne">100% Sur Mesure</span>
                    </div>

                    <h1 className="font-syne text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                        Demander un site <br />
                        <span className="shimmer-cyan-text">web personnalisé</span>
                    </h1>

                    <p className="font-figtree text-slate-400 text-lg sm:text-xl leading-relaxed">
                        Présentez-nous votre projet en quelques étapes. Nos ingénieurs analyseront votre cahier des charges et concevront un site web de A à Z (code, design et fonctionnalités) adapté à vos besoins spécifiques.
                    </p>
                </div>

                {/* Form Wrapper */}
                <CustomWebsitePublicForm initialUser={user ? { companyName: user.companyName, email: user.email } : null} />
            </div>
        </div>
    )
}
