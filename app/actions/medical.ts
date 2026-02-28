'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ============= MEDICAL RECORDS =============

export async function getMedicalRecords(tenantId: string, clientId?: string) {
    try {
        const records = await prisma.medicalRecord.findMany({
            where: { tenantId, ...(clientId ? { clientId } : {}) },
            include: {
                prescriptions: true,
                client: { select: { id: true, name: true, email: true, phone: true } }
            },
            orderBy: { visitDate: 'desc' }
        })
        return { success: true, records }
    } catch {
        return { success: false, error: 'Failed to fetch medical records' }
    }
}

export async function getMedicalRecord(id: string) {
    try {
        const record = await prisma.medicalRecord.findUnique({
            where: { id },
            include: {
                prescriptions: true,
                client: true
            }
        })
        return { success: true, record }
    } catch {
        return { success: false, error: 'Failed to fetch record' }
    }
}

export async function saveMedicalRecord(data: {
    id?: string
    tenantId: string
    clientId: string
    visitDate?: Date
    chiefComplaint?: string
    diagnosis?: string
    treatment?: string
    notes?: string
    weight?: number
    bloodPressure?: string
    temperature?: number
    heartRate?: number
    prescriptions?: {
        id?: string
        medication: string
        dosage?: string
        frequency?: string
        duration?: string
        instructions?: string
    }[]
}, slug?: string) {
    try {
        if (data.id) {
            // Update existing record - handle prescriptions separately
            const record = await prisma.medicalRecord.update({
                where: { id: data.id },
                data: {
                    visitDate: data.visitDate,
                    chiefComplaint: data.chiefComplaint,
                    diagnosis: data.diagnosis,
                    treatment: data.treatment,
                    notes: data.notes,
                    weight: data.weight,
                    bloodPressure: data.bloodPressure,
                    temperature: data.temperature,
                    heartRate: data.heartRate,
                    ...(data.prescriptions !== undefined ? {
                        prescriptions: {
                            deleteMany: {},
                            create: data.prescriptions.map(p => ({
                                medication: p.medication,
                                dosage: p.dosage,
                                frequency: p.frequency,
                                duration: p.duration,
                                instructions: p.instructions,
                            }))
                        }
                    } : {})
                },
                include: { prescriptions: true }
            })
            if (slug) revalidatePath(`/dashboard/cabinet/${slug}/medical`)
            return { success: true, record }
        } else {
            const record = await prisma.medicalRecord.create({
                data: {
                    tenantId: data.tenantId,
                    clientId: data.clientId,
                    visitDate: data.visitDate ?? new Date(),
                    chiefComplaint: data.chiefComplaint,
                    diagnosis: data.diagnosis,
                    treatment: data.treatment,
                    notes: data.notes,
                    weight: data.weight,
                    bloodPressure: data.bloodPressure,
                    temperature: data.temperature,
                    heartRate: data.heartRate,
                    prescriptions: {
                        create: (data.prescriptions ?? []).map(p => ({
                            medication: p.medication,
                            dosage: p.dosage,
                            frequency: p.frequency,
                            duration: p.duration,
                            instructions: p.instructions,
                        }))
                    }
                },
                include: { prescriptions: true }
            })
            if (slug) revalidatePath(`/dashboard/cabinet/${slug}/medical`)
            return { success: true, record }
        }
    } catch (error) {
        console.error('[saveMedicalRecord]', error)
        return { success: false, error: 'Failed to save medical record' }
    }
}

export async function deleteMedicalRecord(id: string, slug?: string) {
    try {
        await prisma.medicalRecord.delete({ where: { id } })
        if (slug) revalidatePath(`/dashboard/cabinet/${slug}/medical`)
        return { success: true }
    } catch {
        return { success: false, error: 'Failed to delete record' }
    }
}

// ============= MEDICAL HISTORY =============

export async function getMedicalHistory(clientId: string) {
    try {
        const history = await prisma.medicalHistory.findMany({
            where: { clientId },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, history }
    } catch {
        return { success: false, error: 'Failed to fetch medical history' }
    }
}

export async function saveMedicalHistory(data: {
    id?: string
    clientId: string
    condition: string
    since?: string
    status?: string
    notes?: string
}, slug?: string) {
    try {
        if (data.id) {
            const item = await prisma.medicalHistory.update({
                where: { id: data.id },
                data: {
                    condition: data.condition,
                    since: data.since,
                    status: data.status || 'ACTIVE',
                    notes: data.notes,
                }
            })
            if (slug) revalidatePath(`/dashboard/cabinet/${slug}/medical`)
            return { success: true, item }
        } else {
            const item = await prisma.medicalHistory.create({
                data: {
                    clientId: data.clientId,
                    condition: data.condition,
                    since: data.since,
                    status: data.status || 'ACTIVE',
                    notes: data.notes,
                }
            })
            if (slug) revalidatePath(`/dashboard/cabinet/${slug}/medical`)
            return { success: true, item }
        }
    } catch {
        return { success: false, error: 'Failed to save medical history' }
    }
}

export async function deleteMedicalHistory(id: string, slug?: string) {
    try {
        await prisma.medicalHistory.delete({ where: { id } })
        if (slug) revalidatePath(`/dashboard/cabinet/${slug}/medical`)
        return { success: true }
    } catch {
        return { success: false, error: 'Failed to delete history' }
    }
}

// ============= CLIENT FULL PROFILE =============

export async function getClientMedicalProfile(clientId: string, tenantId: string) {
    try {
        const [records, history] = await Promise.all([
            prisma.medicalRecord.findMany({
                where: { clientId, tenantId },
                include: { prescriptions: true },
                orderBy: { visitDate: 'desc' }
            }),
            prisma.medicalHistory.findMany({
                where: { clientId },
                orderBy: { createdAt: 'desc' }
            })
        ])
        return { success: true, records, history }
    } catch {
        return { success: false, error: 'Failed to fetch profile' }
    }
}
