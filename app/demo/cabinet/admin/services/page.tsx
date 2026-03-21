import CabinetServicesClient from '@/app/dashboard/cabinet/[tenantSlug]/services/CabinetServicesClient'

export const metadata = { title: 'FirstStep - Admin Cabinet Prestations' }

export default function CabinetServicesDemoPage() {
    const mockServices = [
        { id: 's1', name: 'Consultation Générale', description: 'Visite de routine', price: 300, duration: 30, isActive: true },
        { id: 's2', name: 'Suivi Pédiatrique', description: 'Examen enfant', price: 350, duration: 30, isActive: true },
        { id: 's3', name: 'Contrôle Annuel', description: 'Bilan complet', price: 500, duration: 45, isActive: false }
    ]

    return (
        <CabinetServicesClient services={mockServices as any} tenantId="demo" tenantSlug="demo-cabinet" />
    )
}
