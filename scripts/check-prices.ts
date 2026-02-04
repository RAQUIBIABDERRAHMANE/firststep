import 'dotenv/config'
import prisma from '../lib/prisma'

async function checkPrices() {
    console.log('📋 Current prices in database:\n')
    
    try {
        const services = await prisma.service.findMany()
        
        services.forEach(service => {
            console.log(`${service.name}: ${service.price} MAD`)
        })
    } catch (error) {
        console.error('Error:', error)
    }
}

checkPrices()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Fatal error:', err)
        process.exit(1)
    })
