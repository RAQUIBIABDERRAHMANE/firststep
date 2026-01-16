'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ============= CABINET SERVICES =============

export async function getCabinetServices(tenantId: string) {
    try {
        const services = await prisma.cabinetService.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        })
        return { success: true, services }
    } catch (error) {
        console.error('Error fetching cabinet services:', error)
        return { success: false, error: 'Failed to fetch services' }
    }
}

export async function saveCabinetService(data: {
    id?: string
    tenantId: string
    name: string
    description?: string
    price: number
    duration: number
    isActive?: boolean
}) {
    try {
        if (data.id) {
            // Update existing service
            const service = await prisma.cabinetService.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    duration: data.duration,
                    isActive: data.isActive ?? true,
                },
            })
            revalidatePath('/dashboard/cabinet')
            return { success: true, service }
        } else {
            // Create new service
            const service = await prisma.cabinetService.create({
                data: {
                    tenantId: data.tenantId,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    duration: data.duration,
                    isActive: data.isActive ?? true,
                },
            })
            revalidatePath('/dashboard/cabinet')
            return { success: true, service }
        }
    } catch (error) {
        console.error('Error saving cabinet service:', error)
        return { success: false, error: 'Failed to save service' }
    }
}

export async function deleteCabinetService(id: string) {
    try {
        await prisma.cabinetService.delete({
            where: { id },
        })
        revalidatePath('/dashboard/cabinet')
        return { success: true }
    } catch (error) {
        console.error('Error deleting cabinet service:', error)
        return { success: false, error: 'Failed to delete service' }
    }
}

// ============= CABINET CLIENTS =============

export async function getCabinetClients(tenantId: string) {
    try {
        const clients = await prisma.cabinetClient.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            include: {
                appointments: {
                    orderBy: { appointmentDate: 'desc' },
                    take: 5,
                },
            },
        })
        return { success: true, clients }
    } catch (error) {
        console.error('Error fetching cabinet clients:', error)
        return { success: false, error: 'Failed to fetch clients' }
    }
}

export async function saveCabinetClient(data: {
    id?: string
    tenantId: string
    name: string
    email?: string
    phone?: string
    notes?: string
}) {
    try {
        if (data.id) {
            // Update existing client
            const client = await prisma.cabinetClient.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    notes: data.notes,
                },
            })
            revalidatePath('/dashboard/cabinet')
            return { success: true, client }
        } else {
            // Create new client
            const client = await prisma.cabinetClient.create({
                data: {
                    tenantId: data.tenantId,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    notes: data.notes,
                },
            })
            revalidatePath('/dashboard/cabinet')
            return { success: true, client }
        }
    } catch (error) {
        console.error('Error saving cabinet client:', error)
        return { success: false, error: 'Failed to save client' }
    }
}

// ============= CABINET APPOINTMENTS =============

export async function getCabinetAppointments(
    tenantId: string,
    filters?: {
        startDate?: Date
        endDate?: Date
        status?: string
    }
) {
    try {
        const where: any = { tenantId }

        if (filters?.startDate || filters?.endDate) {
            where.appointmentDate = {}
            if (filters.startDate) {
                where.appointmentDate.gte = filters.startDate
            }
            if (filters.endDate) {
                where.appointmentDate.lte = filters.endDate
            }
        }

        if (filters?.status) {
            where.status = filters.status
        }

        const appointments = await prisma.cabinetAppointment.findMany({
            where,
            include: {
                service: true,
                client: true,
            },
            orderBy: { appointmentDate: 'asc' },
        })
        return { success: true, appointments }
    } catch (error) {
        console.error('Error fetching cabinet appointments:', error)
        return { success: false, error: 'Failed to fetch appointments' }
    }
}

export async function createCabinetAppointment(data: {
    tenantId: string
    serviceId: string
    clientId?: string
    clientName: string
    clientEmail?: string
    clientPhone?: string
    appointmentDate: Date
    notes?: string
}) {
    try {
        let clientId = data.clientId

        // If no clientId provided, create or find client
        if (!clientId) {
            // Try to find existing client by email or phone
            let existingClient = null
            if (data.clientEmail) {
                existingClient = await prisma.cabinetClient.findFirst({
                    where: {
                        tenantId: data.tenantId,
                        email: data.clientEmail,
                    },
                })
            }

            if (existingClient) {
                clientId = existingClient.id
            } else {
                // Create new client
                const newClient = await prisma.cabinetClient.create({
                    data: {
                        tenantId: data.tenantId,
                        name: data.clientName,
                        email: data.clientEmail,
                        phone: data.clientPhone,
                    },
                })
                clientId = newClient.id
            }
        }

        const appointment = await prisma.cabinetAppointment.create({
            data: {
                tenantId: data.tenantId,
                serviceId: data.serviceId,
                clientId: clientId,
                appointmentDate: data.appointmentDate,
                notes: data.notes,
                status: 'SCHEDULED',
            },
            include: {
                service: true,
                client: true,
            },
        })

        revalidatePath('/dashboard/cabinet')
        return { success: true, appointment }
    } catch (error) {
        console.error('Error creating cabinet appointment:', error)
        return { success: false, error: 'Failed to create appointment' }
    }
}

export async function updateCabinetAppointmentStatus(
    id: string,
    status: string
) {
    try {
        const appointment = await prisma.cabinetAppointment.update({
            where: { id },
            data: { status },
            include: {
                service: true,
                client: true,
            },
        })
        revalidatePath('/dashboard/cabinet')
        return { success: true, appointment }
    } catch (error) {
        console.error('Error updating appointment status:', error)
        return { success: false, error: 'Failed to update appointment status' }
    }
}
