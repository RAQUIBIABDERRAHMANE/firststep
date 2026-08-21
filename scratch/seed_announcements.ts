import prisma from '../lib/prisma'

async function main() {
    const count = await prisma.announcement.count()
    if (count === 0) {
        await prisma.announcement.createMany({
            data: [
                {
                    title: 'Nouveau Module Restaurant & Menus QR Connectés',
                    content: 'Gérez vos tables, commandes en direct, réservations et impressions de chevalets QR haute résolution sans aucun matériel complexe.',
                    badge: 'Nouveau',
                    badgeColor: 'emerald',
                    linkUrl: '#services',
                    linkLabel: 'Découvrir le module',
                    isPublished: true,
                    isPinned: true,
                    publishedAt: new Date()
                },
                {
                    title: 'Assistant IA Marketing Intégré pour vos Campagnes',
                    content: 'Générez des visuels publicitaires et des textes promotionnels adaptés au marché marocain en quelques secondes directement depuis votre console.',
                    badge: 'Mise à jour',
                    badgeColor: 'blue',
                    linkUrl: '#services',
                    linkLabel: 'En savoir plus',
                    isPublished: true,
                    isPinned: false,
                    publishedAt: new Date(Date.now() - 86400000)
                }
            ]
        })
        console.log('Sample announcements created successfully!')
    } else {
        console.log(`Announcements already exist (${count}). Skipping seed.`)
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
