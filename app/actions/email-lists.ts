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
        await prisma.emailListMember.createMany({
            data: members.map(member => ({
                listId,
                userId: member.userId,
                email: member.email,
                name: member.name
            })),
            skipDuplicates: true
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
