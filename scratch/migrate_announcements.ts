import prisma from '../lib/prisma'

async function migrate() {
    console.log('Running CREATE TABLE for Announcement...')
    try {
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Announcement" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "title" TEXT NOT NULL,
                "content" TEXT NOT NULL,
                "badge" TEXT DEFAULT 'Nouveau',
                "badgeColor" TEXT DEFAULT 'blue',
                "linkUrl" TEXT,
                "linkLabel" TEXT,
                "isPublished" BOOLEAN NOT NULL DEFAULT true,
                "isPinned" BOOLEAN NOT NULL DEFAULT false,
                "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `)
        console.log('Table Announcement created successfully on Turso/DB!')

        // Seed 2 sample announcements
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
            console.log('Sample announcements created!')
        } else {
            console.log(`Found ${count} existing announcements.`)
        }
    } catch (err) {
        console.error('Migration failed:', err)
    } finally {
        await prisma.$disconnect()
    }
}

migrate()
