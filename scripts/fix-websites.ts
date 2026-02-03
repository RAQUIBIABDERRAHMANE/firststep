import prisma from '@/lib/prisma'

async function fixWebsites() {
    console.log('🔧 Fixing websites state...')
    
    // Réactiver tous les TenantWebsite désactivés
    // Le contrôle d'accès se fait maintenant via userService.isActive uniquement
    const result = await prisma.tenantWebsite.updateMany({
        where: {
            isActive: false
        },
        data: {
            isActive: true
        }
    })
    
    console.log(`✅ Réactivé ${result.count} sites web`)
    
    // Vérifier l'état après correction
    const websites = await prisma.tenantWebsite.findMany({
        include: {
            user: { select: { companyName: true } },
            service: { select: { name: true } }
        }
    })
    
    console.log('\n🌐 État après correction:')
    websites.forEach(tw => {
        console.log(`  ${tw.user.companyName} -> ${tw.service.name}: slug=${tw.slug}, isActive=${tw.isActive}`)
    })
}

fixWebsites()
    .then(() => {
        console.log('\n🎉 Fix complete!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Fix error:', error)
        process.exit(1)
    })