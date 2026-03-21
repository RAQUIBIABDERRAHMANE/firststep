import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ExternalLink } from 'lucide-react'

export const metadata = { title: 'FirstStep - Admin Cabinet Démo' }

export default async function CabinetAdminDemo() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome to Cabinet Management (Démo)</h2>
                    <p className="text-muted-foreground mt-2">
                        Interface globale de gestion pour vos médecins, services, clients et vos rendez-vous.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/demo/cabinet`} target="_blank">
                        <Button variant="outline" className="gap-2 bg-white">
                            <ExternalLink className="h-4 w-4" />
                            Site Web Vitrine
                        </Button>
                    </Link>
                    <Link href="/demo/cabinet" target="_blank">
                        <Button className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Lien de Réservation
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Link
                    href="/demo/cabinet/admin/services"
                    className="group p-6 rounded-lg border border-border bg-white shadow-sm hover:shadow-lg transition-all"
                >
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        Gestion des Prestations
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Gérez vos actes médicaux virtuels, modifiez le temps imparti et les tarifs de facturation.
                    </p>
                </Link>
                <Link
                    href="/demo/cabinet/admin/clients"
                    className="group p-6 rounded-lg border border-border bg-white shadow-sm hover:shadow-lg transition-all"
                >
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        Dossiers Patients
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Centralisez l'historique de vos patients, les diagnostiques passés et l'information personnelle.
                    </p>
                </Link>
                <Link
                    href="/demo/cabinet/admin/calendar"
                    className="group p-6 rounded-lg border border-border bg-white shadow-sm hover:shadow-lg transition-all"
                >
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        Agenda Secrétariat
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Acceptez ou reportez les créneaux, synchronisation automatique de l'emploi du temps.
                    </p>
                </Link>
            </div>
        </div>
    )
}
