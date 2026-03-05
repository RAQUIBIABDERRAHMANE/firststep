'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from './auth'

export async function getEmailLists() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        const lists = await prisma.emailList.findMany({
            include: {
                _count: {
                    select: { members: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, lists }
    } catch (error) {
        console.error('Error fetching email lists:', error)
        return { error: 'Failed to fetch email lists' }
    }
}

export async function getEmailList(id: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        const list = await prisma.emailList.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                companyName: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        })

        if (!list) {
            return { error: 'Email list not found' }
        }

        return { success: true, list }
    } catch (error) {
        console.error('Error fetching email list:', error)
        return { error: 'Failed to fetch email list' }
    }
}

export async function createEmailList(data: {
    name: string
    description?: string
    members: Array<{ userId?: string; email?: string; name?: string }>
}) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    if (!data.name) {
        return { error: 'Name is required' }
    }

    try {
        const list = await prisma.emailList.create({
            data: {
                name: data.name,
                description: data.description,
                members: {
                    create: data.members.map(member => ({
                        userId: member.userId,
                        email: member.email,
                        name: member.name
                    }))
                }
            },
            include: {
                _count: {
                    select: { members: true }
                }
            }
        })

        revalidatePath('/admin/email-lists')
        return { success: true, list }
    } catch (error) {
        console.error('Error creating email list:', error)
        return { error: 'Failed to create email list' }
    }
}

export async function updateEmailList(id: string, data: {
    name?: string
    description?: string
    members?: Array<{ userId?: string; email?: string; name?: string }>
}) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        // If members are provided, replace all members
        if (data.members !== undefined) {
            await prisma.emailListMember.deleteMany({
                where: { listId: id }
            })

            await prisma.emailListMember.createMany({
                data: data.members.map(member => ({
                    listId: id,
                    userId: member.userId,
                    email: member.email,
                    name: member.name
                }))
            })
        }

        const list = await prisma.emailList.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description
            },
            include: {
                _count: {
                    select: { members: true }
                }
            }
        })

        revalidatePath('/admin/email-lists')
        revalidatePath(`/admin/email-lists/${id}`)
        return { success: true, list }
    } catch (error) {
        console.error('Error updating email list:', error)
        return { error: 'Failed to update email list' }
    }
}

export async function deleteEmailList(id: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.emailList.delete({
            where: { id }
        })

        revalidatePath('/admin/email-lists')
        return { success: true }
    } catch (error) {
        console.error('Error deleting email list:', error)
        return { error: 'Failed to delete email list' }
    }
}

export async function addMembersToList(listId: string, members: Array<{ userId?: string; email?: string; name?: string }>) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        // 1. Fetch existing members for this list to filter duplicates
        // We need to check both userId and email collision
        const existingMembers = await prisma.emailListMember.findMany({
            where: {
                listId,
                OR: [
                    { userId: { in: members.map(m => m.userId).filter(Boolean) as string[] } },
                    { email: { in: members.map(m => m.email).filter(Boolean) as string[] } }
                ]
            },
            select: { userId: true, email: true }
        })

        const existingUserIds = new Set(existingMembers.map(m => m.userId).filter(Boolean))
        const existingEmails = new Set(existingMembers.map(m => m.email).filter(Boolean))

        // 2. Filter out duplicates
        const newMembers = members.filter(member => {
            if (member.userId && existingUserIds.has(member.userId)) return false
            if (member.email && existingEmails.has(member.email)) return false
            return true
        })

        if (newMembers.length === 0) {
            return { success: true, message: 'No new members to add' }
        }

        // 3. Create new members
        await prisma.emailListMember.createMany({
            data: newMembers.map(member => ({
                listId,
                userId: member.userId,
                email: member.email,
                name: member.name
            }))
        })

        revalidatePath(`/admin/email-lists/${listId}`)
        return { success: true }
    } catch (error) {
        console.error('Error adding members to list:', error)
        return { error: 'Failed to add members' }
    }
}

export async function removeMemberFromList(listId: string, memberId: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.emailListMember.delete({
            where: { id: memberId }
        })

        revalidatePath(`/admin/email-lists/${listId}`)
        return { success: true }
    } catch (error) {
        console.error('Error removing member from list:', error)
        return { error: 'Failed to remove member' }
    }
}

// ─── Smart Lists ────────────────────────────────────────────────────────────

/**
 * Creates or refreshes auto-managed email lists:
 *  • [AUTO] Tous les clients   — all Users with role=CLIENT
 *  • [AUTO] Service: {name}    — users active on each service
 *  • [AUTO] Clients cabinet: {tenantName} — CabinetClients with email per tenant
 */
export async function syncSmartEmailLists() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    try {
        const results: string[] = []

        // ── Noms valides (calculés dynamiquement) ────────────────────────
        const services = await prisma.service.findMany({ select: { id: true, name: true } })
        const validAutoNames = [
            '[AUTO] Tous les clients',
            ...services.map(s => `[AUTO] Service: ${s.name}`)
        ]

        // ── Nettoyage : supprimer les listes AUTO non reconnues ───────────
        const stale = await prisma.emailList.findMany({
            where: { name: { startsWith: '[AUTO]', notIn: validAutoNames } },
            select: { id: true }
        })
        if (stale.length > 0) {
            const staleIds = stale.map(l => l.id)
            await prisma.emailListMember.deleteMany({ where: { listId: { in: staleIds } } })
            await prisma.emailList.deleteMany({ where: { id: { in: staleIds } } })
        }

        // ── Tous les clients de la plateforme ─────────────────────────────
        const allClients = await prisma.user.findMany({
            where: { role: 'CLIENT' },
            select: { id: true, email: true, companyName: true }
        })

        await upsertSmartList(
            '[AUTO] Tous les clients',
            `Tous les utilisateurs clients de la plateforme (${allClients.length} clients)`,
            allClients.map(u => ({ userId: u.id, name: u.companyName, email: u.email }))
        )
        results.push(`Tous les clients: ${allClients.length} membres`)

        // ── Une liste par service de la plateforme ────────────────────────
        for (const service of services) {
            const serviceUsers = await prisma.userService.findMany({
                where: { serviceId: service.id, isActive: true },
                include: {
                    user: { select: { id: true, email: true, companyName: true } }
                }
            })

            await upsertSmartList(
                `[AUTO] Service: ${service.name}`,
                `Clients abonnés au service "${service.name}" (${serviceUsers.length} clients)`,
                serviceUsers.map(us => ({
                    userId: us.user.id,
                    name: us.user.companyName,
                    email: us.user.email
                }))
            )
            results.push(`${service.name}: ${serviceUsers.length} membres`)
        }

        revalidatePath('/admin/email-lists')
        return { success: true, results }
    } catch (error) {
        console.error('Error syncing smart email lists:', error)
        return { error: 'Failed to sync smart email lists' }
    }
}

async function upsertSmartList(
    name: string,
    description: string,
    members: Array<{ userId?: string; email?: string; name?: string | null }>
) {
    // Find existing list with this name
    let list = await prisma.emailList.findFirst({ where: { name } })

    if (!list) {
        list = await prisma.emailList.create({
            data: { name, description }
        })
    } else {
        // Clear existing members to refresh
        await prisma.emailListMember.deleteMany({ where: { listId: list.id } })
        await prisma.emailList.update({
            where: { id: list.id },
            data: { description }
        })
    }

    // Re-create members with deduplication by userId and email
    const seen = new Set<string>()
    const dedupedMembers = members.filter(m => {
        const key = m.userId ?? m.email ?? ''
        if (!key || seen.has(key)) return false
        seen.add(key)
        return true
    })

    if (dedupedMembers.length > 0) {
        await prisma.emailListMember.createMany({
            data: dedupedMembers.map(m => ({
                listId: list!.id,
                userId: m.userId ?? null,
                email: m.email ?? null,
                name: m.name ?? null
            }))
        })
    }
}

