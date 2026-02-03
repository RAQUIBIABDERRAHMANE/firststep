import prisma from '@/lib/prisma'

async function debugServices() {
    console.log('🔍 Debugging services state...')
    
    // 1. Vérifier les UserService
    const userServices = await prisma.userService.findMany({
        include: {
            user: { select: { companyName: true } },
            service: { select: { name: true } }
        }
    })
    
    console.log('\n📋 UserServices:')
    userServices.forEach(us => {
        console.log(`  ${us.user.companyName} -> ${us.service.name}: isActive=${us.isActive}`)
    })
    
    // 2. Vérifier les TenantWebsite
    const websites = await prisma.tenantWebsite.findMany({
        include: {
            user: { select: { companyName: true } },
            service: { select: { name: true } }
        }
    })
    
    console.log('\n🌐 TenantWebsites:')
    websites.forEach(tw => {
        console.log(`  ${tw.user.companyName} -> ${tw.service.name}: slug=${tw.slug}, isActive=${tw.isActive}`)
    })
    
    // 3. Vérifier la requête admin
    const adminResult = await prisma.user.findMany({
        where: { role: 'CLIENT' },
        include: {
            services: {
                where: { isActive: true },
                include: { service: true }
            }
        }
    })
    
    console.log('\n👨‍💼 Admin query result:')
    adminResult.forEach(user => {
        console.log(`  ${user.companyName}: ${user.services.length} active services`)
        user.services.forEach(s => {
            console.log(`    - ${s.service.name}`)
        })
    })
}

debugServices()
    .then(() => {
        console.log('\n✅ Debug complete')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Debug error:', error)
        process.exit(1)
    })