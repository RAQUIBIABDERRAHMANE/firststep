import CabinetClientsClient from '@/app/dashboard/cabinet/[tenantSlug]/clients/CabinetClientsClient'

export const metadata = { title: 'FirstStep - Admin Cabinet Patients' }

export default function CabinetClientsDemoPage() {
    const mockClients = [
        { 
            id: 'c1', 
            firstName: 'Amine', 
            lastName: 'Bennani', 
            email: 'amine@example.com', 
            phone: '06 12 34 56 78',
            appointments: [{}, {}], 
            createdAt: new Date().toISOString()
        },
        { 
            id: 'c2', 
            firstName: 'Nadia', 
            lastName: 'El Fassi', 
            email: 'nadia@example.com', 
            phone: '06 87 65 43 21',
            appointments: [{}],
            createdAt: new Date(Date.now() - 86400000).toISOString()
        }
    ]

    return (
        <CabinetClientsClient clients={mockClients as any} tenantId="demo" tenantSlug="demo-cabinet" />
    )
}
