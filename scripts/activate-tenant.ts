import 'dotenv/config'
import prisma from '../lib/prisma'

async function main() {
    const tenantSlug = 'firststep'
    await prisma.tenantWebsite.update({
        where: { slug: tenantSlug },
        data: { isActive: true }
    })
    console.log(`Tenant ${tenantSlug} activated!`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
