import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
    Utensils, MapPin, ClipboardList, ExternalLink, 
    ChevronRight, TrendingUp, Users, LayoutDashboard, Paintbrush, UserCheck 
} from 'lucide-react'

export const metadata = { title: 'FirstStep - Admin Resto Démo' }

export default async function RestoAdminDemo() {
    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <LayoutDashboard className="text-blue-600" /> Restaurant Admin (Démo)
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gérez votre menu digital, votre plan de salle et vos commandes en cours.
                    </p>
                </div>
                <Link href={`/demo/restaurent`} target="_blank">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        Voir le Site Client <ExternalLink size={14} />
                    </Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="glass-card shadow-none border-slate-200/60 overflow-hidden group bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Tables Actives</CardTitle>
                        <MapPin size={18} className="text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">12</div>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp size={12} className="text-emerald-500" /> Points physiques gérés
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card shadow-none border-slate-200/60 overflow-hidden group bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Plats au Menu</CardTitle>
                        <Utensils size={18} className="text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">45</div>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp size={12} className="text-emerald-500" /> Produits en ligne
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card shadow-none border-slate-200/60 overflow-hidden group bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Commandes Totales</CardTitle>
                        <ClipboardList size={18} className="text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">128</div>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp size={12} className="text-emerald-500" /> Transactions traitées
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card shadow-none border-slate-200/60 overflow-hidden group bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Serveurs</CardTitle>
                        <UserCheck size={18} className="text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">4</div>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-bold">
                            <TrendingUp size={12} className="text-emerald-500" /> Membres du staff
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Management Portal */}
            <div className="grid gap-6 md:grid-cols-2">
                <Link href="/demo/restaurent/admin/menu">
                    <Card className="glass-card bg-white shadow-none border-slate-200/60 hover:border-blue-500/50 hover:bg-blue-50/10 transition-all group p-6 h-full">
                        <div className="flex gap-6 items-start">
                            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-transform duration-500 group-hover:scale-110">
                                <Utensils size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    Gestion du Menu <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Modifiez vos plats, catégories et prix en temps réel. Les changements se reflètent instantanément sur votre site.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="/demo/restaurent/admin/tables">
                    <Card className="glass-card bg-white shadow-none border-slate-200/60 hover:border-indigo-500/50 hover:bg-blue-50/10 transition-all group p-6 h-full">
                        <div className="flex gap-6 items-start">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm transition-transform duration-500 group-hover:scale-110">
                                <MapPin size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    Gestion des Tables <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Associez des QR codes à vos tables physiques pour que les clients puissent scanner et commander.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="#" className="pointer-events-none opacity-60">
                    <Card className="glass-card bg-white shadow-none border-slate-200/60 hover:border-purple-500/50 hover:bg-blue-50/10 transition-all group p-6 h-full">
                        <div className="flex gap-6 items-start">
                            <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm transition-transform duration-500 group-hover:scale-110">
                                <Paintbrush size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    Studio de Design <ChevronRight size={18} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Personnalisez l'apparence de votre restaurant (Module exclusif, non disponible en démo).
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="/demo/restaurent/admin/waiters">
                    <Card className="glass-card bg-white shadow-none border-slate-200/60 hover:border-indigo-500/50 hover:bg-indigo-50/10 transition-all group p-6 h-full">
                        <div className="flex gap-6 items-start">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm transition-transform duration-500 group-hover:scale-110">
                                <Users size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    Équipe (Serveurs) <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Créez des comptes pour votre personnel afin qu'ils gèrent les alertes et commandes en salle.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="/demo/restaurent/admin/orders" className="md:col-span-2">
                    <Card className="glass-card bg-white shadow-none border-slate-200/60 hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all group p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="h-20 w-20 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0 transition-transform duration-500 group-hover:scale-110">
                                <ClipboardList size={40} />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-black mb-3 flex items-center justify-center md:justify-start gap-3">
                                    Moniteur des Commandes (KDS) <ChevronRight size={24} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                </h3>
                                <p className="text-slate-500 text-lg">
                                    Suivez les commandes de toutes vos tables. Mettez à jour les statuts en temps réel pour la cuisine.
                                </p>
                            </div>
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 h-16 px-10 rounded-2xl text-xl font-black shadow-xl shadow-emerald-500/20 active:scale-95 pointer-events-none">
                                Ouvrir (Module)
                            </Button>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
