'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import Groq from 'groq-sdk'

/**
 * Fetch all announcements (Admin view, includes unpublished and drafts)
 */
export async function getAnnouncements() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Non autorisé' }
    }

    try {
        if (!prisma.announcement) {
            console.warn('[Announcements] prisma.announcement is not ready yet')
            return { success: true, announcements: [] }
        }

        const announcements = await prisma.announcement.findMany({
            orderBy: [
                { isPinned: 'desc' },
                { publishedAt: 'desc' }
            ]
        })
        return { success: true, announcements }
    } catch (error: any) {
        console.error('Error fetching announcements:', error)
        return { error: error?.message || 'Erreur lors de la récupération des annonces' }
    }
}

/**
 * Fetch published announcements for the public home page
 */
export async function getPublishedAnnouncements() {
    try {
        if (!prisma.announcement) {
            console.warn('[Announcements] prisma.announcement is not ready yet')
            return []
        }

        const announcements = await prisma.announcement.findMany({
            where: { isPublished: true },
            orderBy: [
                { isPinned: 'desc' },
                { publishedAt: 'desc' }
            ],
            take: 6
        })
        return announcements
    } catch (error) {
        console.error('Failed to fetch published announcements:', error)
        return []
    }
}

/**
 * Generate announcement title, copy, badge, and CTA using AI (Admin only)
 */
export async function generateAnnouncementWithAI(userIdea: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Non autorisé' }
    }

    if (!userIdea || userIdea.trim().length === 0) {
        return { error: 'Veuillez préciser une idée ou un sujet pour l\'annonce' }
    }

    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
        const systemPrompt = `Tu es un expert copywriter et responsable marketing pour FirstStep (firststepco.com), une plateforme SaaS B2B au Maroc (restaurants, cliniques, commerces, entreprises).
Ta mission est de générer une annonce percutante, concise et attractive pour la barre d'annonce e-commerce et la landing page.

Réponds UNIQUEMENT avec un objet JSON valide ayant la structure suivante :
{
  "title": "Titre court et impactant (max 50 caractères)",
  "content": "Description vendeuse et concise en français (1 ou 2 phrases max, max 130 caractères)",
  "badge": "Un mot ou deux (ex: Nouveau, Promo -30%, Offre Flash, Mise à jour, Exclusivité)",
  "badgeColor": "Une couleur parmi : blue, emerald, amber, purple, rose, cyan",
  "linkUrl": "Lien de redirection (ex: #signup, /services, #services, /services/restaurant)",
  "linkLabel": "Texte du bouton d'action (ex: Découvrir, Profiter de l'offre, En savoir plus)"
}`

        const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b']
        let raw: string | null = null

        for (const model of models) {
            try {
                const completion = await groq.chat.completions.create({
                    model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `Génère les données d'annonce pour cette idée : "${userIdea}"` }
                    ],
                    response_format: { type: 'json_object' }
                })
                raw = completion.choices[0]?.message?.content || null
                if (raw) break
            } catch (err: any) {
                console.warn(`[AI Announcement] Model ${model} failed, trying next...`, err?.message)
            }
        }
        if (!raw) return { error: 'Aucune réponse générée par l\'IA' }

        const parsed = JSON.parse(raw)
        const validColors = ['blue', 'emerald', 'amber', 'purple', 'rose', 'cyan']

        return {
            success: true,
            data: {
                title: parsed.title || '',
                content: parsed.content || '',
                badge: parsed.badge || 'Nouveau',
                badgeColor: validColors.includes(parsed.badgeColor) ? parsed.badgeColor : 'blue',
                linkUrl: parsed.linkUrl || '#signup',
                linkLabel: parsed.linkLabel || 'Découvrir'
            }
        }
    } catch (err: any) {
        console.error('AI Announcement generation failed:', err)
        return { error: err.message || 'Erreur lors de la génération avec l\'IA' }
    }
}

/**
 * Create a new announcement (Admin only)
 */
export async function createAnnouncement(formData: FormData) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Non autorisé' }
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const badge = (formData.get('badge') as string) || 'Nouveau'
    const badgeColor = (formData.get('badgeColor') as string) || 'blue'
    const linkUrl = (formData.get('linkUrl') as string) || null
    const linkLabel = (formData.get('linkLabel') as string) || null
    const isPublished = formData.get('isPublished') === 'true' || formData.get('isPublished') === 'on'
    const isPinned = formData.get('isPinned') === 'true' || formData.get('isPinned') === 'on'

    if (!title || !content) {
        return { error: 'Le titre et le contenu sont obligatoires' }
    }

    try {
        if (!prisma.announcement) {
            throw new Error('prisma.announcement n\'est pas encore disponible')
        }

        const announcement = await prisma.announcement.create({
            data: {
                title: title.trim(),
                content: content.trim(),
                badge: badge.trim(),
                badgeColor,
                linkUrl: linkUrl ? linkUrl.trim() : null,
                linkLabel: linkLabel ? linkLabel.trim() : null,
                isPublished,
                isPinned,
                publishedAt: new Date()
            }
        })

        revalidatePath('/')
        revalidatePath('/admin/announcements')
        return { success: true, announcement }
    } catch (error: any) {
        console.error('Error creating announcement:', error)
        return { error: error.message || 'Impossible de créer l\'annonce' }
    }
}

/**
 * Update an existing announcement (Admin only)
 */
export async function updateAnnouncement(id: string, formData: FormData) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Non autorisé' }
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const badge = (formData.get('badge') as string) || 'Nouveau'
    const badgeColor = (formData.get('badgeColor') as string) || 'blue'
    const linkUrl = (formData.get('linkUrl') as string) || null
    const linkLabel = (formData.get('linkLabel') as string) || null
    const isPublished = formData.get('isPublished') === 'true' || formData.get('isPublished') === 'on'
    const isPinned = formData.get('isPinned') === 'true' || formData.get('isPinned') === 'on'

    if (!title || !content) {
        return { error: 'Le titre et le contenu sont obligatoires' }
    }

    try {
        if (!prisma.announcement) {
            throw new Error('prisma.announcement n\'est pas encore disponible')
        }

        const announcement = await prisma.announcement.update({
            where: { id },
            data: {
                title: title.trim(),
                content: content.trim(),
                badge: badge.trim(),
                badgeColor,
                linkUrl: linkUrl ? linkUrl.trim() : null,
                linkLabel: linkLabel ? linkLabel.trim() : null,
                isPublished,
                isPinned
            }
        })

        revalidatePath('/')
        revalidatePath('/admin/announcements')
        return { success: true, announcement }
    } catch (error: any) {
        console.error('Error updating announcement:', error)
        return { error: error.message || 'Impossible de mettre à jour l\'annonce' }
    }
}

/**
 * Delete an announcement (Admin only)
 */
export async function deleteAnnouncement(id: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Non autorisé' }
    }

    try {
        if (!prisma.announcement) {
            throw new Error('prisma.announcement n\'est pas encore disponible')
        }

        await prisma.announcement.delete({
            where: { id }
        })

        revalidatePath('/')
        revalidatePath('/admin/announcements')
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting announcement:', error)
        return { error: error.message || 'Impossible de supprimer l\'annonce' }
    }
}

/**
 * Toggle announcement publish status (Admin only)
 */
export async function toggleAnnouncementPublish(id: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Non autorisé' }
    }

    try {
        if (!prisma.announcement) {
            throw new Error('prisma.announcement n\'est pas encore disponible')
        }

        const current = await prisma.announcement.findUnique({
            where: { id },
            select: { isPublished: true }
        })

        if (!current) {
            return { error: 'Annonce introuvable' }
        }

        const updated = await prisma.announcement.update({
            where: { id },
            data: {
                isPublished: !current.isPublished,
                publishedAt: !current.isPublished ? new Date() : undefined
            }
        })

        revalidatePath('/')
        revalidatePath('/admin/announcements')
        return { success: true, isPublished: updated.isPublished }
    } catch (error: any) {
        console.error('Error toggling announcement publish status:', error)
        return { error: error.message || 'Impossible de modifier le statut' }
    }
}

/**
 * Toggle announcement pin status (Admin only)
 */
export async function toggleAnnouncementPin(id: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Non autorisé' }
    }

    try {
        if (!prisma.announcement) {
            throw new Error('prisma.announcement n\'est pas encore disponible')
        }

        const current = await prisma.announcement.findUnique({
            where: { id },
            select: { isPinned: true }
        })

        if (!current) {
            return { error: 'Annonce introuvable' }
        }

        const updated = await prisma.announcement.update({
            where: { id },
            data: {
                isPinned: !current.isPinned
            }
        })

        revalidatePath('/')
        revalidatePath('/admin/announcements')
        return { success: true, isPinned: updated.isPinned }
    } catch (error: any) {
        console.error('Error toggling announcement pin status:', error)
        return { error: error.message || 'Impossible d\'épingler l\'annonce' }
    }
}
