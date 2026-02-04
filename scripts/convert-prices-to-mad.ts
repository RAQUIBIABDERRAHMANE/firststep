import prisma from '../lib/prisma'

async function updatePricesToMAD() {
    console.log('🔄 Converting prices from $ to MAD...\n')

    try {
        // Get all services
        const services = await prisma.service.findMany({
            where: {
                price: {
                    not: null
                }
            }
        })

        console.log(`Found ${services.length} service(s) with prices:\n`)

        for (const service of services) {
            if (service.price) {
                // Convert: $299 -> 3000 MAD (approximately 10x)
                const oldPrice = service.price
                const newPrice = Math.round(oldPrice * 10)

                await prisma.service.update({
                    where: { id: service.id },
                    data: { price: newPrice }
                })

                console.log(`✅ ${service.name}:`)
                console.log(`   Old: $${oldPrice}`)
                console.log(`   New: ${newPrice} MAD\n`)
            }
        }

        console.log('✅ All prices converted successfully!')

    } catch (error) {
        console.error('❌ Error converting prices:', error)
        throw error
    }
}

updatePricesToMAD()
    .then(() => {
        console.log('\n✨ Done!')
        process.exit(0)
    })
    .catch((err) => {
        console.error('Fatal error:', err)
        process.exit(1)
    })
