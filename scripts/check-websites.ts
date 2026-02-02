import prisma from '../lib/prisma'

async function checkWebsites() {
    console.log('🔍 Checking websites in database...\n')

    const sites = await prisma.tenantWebsite.findMany({
        include: {
            service: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            },
            user: {
                select: {
                    email: true,
                    companyName: true
                }
            }
        }
    })

    if (sites.length === 0) {
        console.log('❌ No websites found in database')
    } else {
        console.log(`✅ Found ${sites.length} website(s):\n`)
        sites.forEach(site => {
            console.log(`📍 Website: ${site.siteName} (${site.slug})`)
            console.log(`   Service: ${site.service.name} (${site.service.slug})`)
            console.log(`   Owner: ${site.user.companyName} (${site.user.email})`)
            console.log(`   Active: ${site.isActive}`)
            console.log(`   URL: /dashboard/${site.service.slug}/${site.slug}`)
            console.log('')
        })
    }
}

checkWebsites()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Error:', err)
        process.exit(1)
    })
