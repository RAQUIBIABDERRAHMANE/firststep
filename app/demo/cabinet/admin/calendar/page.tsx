import CabinetCalendarClient from '@/app/dashboard/cabinet/[tenantSlug]/calendar/CabinetCalendarClient'

export const metadata = { title: 'FirstStep - Admin Cabinet Agenda' }

export default function CabinetCalendarDemoPage() {
    const mockAppointments = [
        {
            id: 'apt1',
            startTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
            endTime: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
            status: 'CONFIRMED',
            client: { firstName: 'Amine', lastName: 'Bennani' },
            service: { name: 'Consultation Générale' }
        },
        {
            id: 'apt2',
            startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
            endTime: new Date(new Date().setHours(14, 45, 0, 0)).toISOString(),
            status: 'PENDING',
            client: { firstName: 'Nadia', lastName: 'El Fassi', phone: '06 87 65 43 21' },
            service: { name: 'Contrôle Annuel' }
        }
    ]
    
    return (
        <CabinetCalendarClient appointments={mockAppointments as any} tenantSlug="demo-cabinet" />
    )
}
