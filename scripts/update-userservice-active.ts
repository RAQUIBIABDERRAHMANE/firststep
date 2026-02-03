import prisma from '@/lib/prisma'

async function updateExistingRecords() {
    console.log('Mise à jour des enregistrements existants avec isActive = true...')
    
    // Mettre à jour tous les UserService existants
    const result = await prisma.userService.updateMany({
        data: {
            isActive: true
        }
    })

    console.log(`✅ ${result.count} services utilisateur mis à jour`)
}

updateExistingRecords()
    .then(() => {
        console.log('Migration terminée avec succès')
        process.exit(0)
    })
    .catch((error) => {
        console.error('Erreur lors de la migration:', error)
        process.exit(1)
    })
