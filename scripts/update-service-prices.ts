import prisma from '../lib/prisma'

const servicePrices: Record<string, { price: number; icon: string }> = {
    'Restaurant Website & Online Ordering': { price: 299, icon: '🍽️' },
    'Restaurant POS System': { price: 399, icon: '💳' },
    'Stock Management': { price: 149, icon: '📦' },
    'Car Rental System': { price: 249, icon: '🚗' },
    'Hotel Management System': { price: 399, icon: '🏨' },
    'Hospital Management System': { price: 449, icon: '⚕️' },
    'Cabinet System': { price: 199, icon: '💼' },
}

async function updateServicePrices() {
    console.log('🔄 Updating service prices...')

    try {
        const services = await prisma.service.findMany()

        for (const service of services) {
            const priceInfo = servicePrices[service.name]
            
            if (priceInfo) {
                await prisma.service.update({
                    where: { id: service.id },
                    data: {
                        price: priceInfo.price,
                        icon: priceInfo.icon
                    }
                })
                console.log(`✅ Updated ${service.name}: $${priceInfo.price}`)
            } else {
                console.log(`⚠️ No price found for ${service.name}`)
            }
        }

        console.log('🎉 All services updated!')
    } catch (error) {
        console.error('❌ Error updating services:', error)
    } finally {
        await prisma.$disconnect()
    }
}

updateServicePrices()
