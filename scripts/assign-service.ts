import prisma from '../lib/prisma'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
    const adminEmail = 'admin@firststepco.com'
    const serviceSlug = 'restaurant-website'

    try {
        console.log(`Assigning ${serviceSlug} service to ${adminEmail}...`)

        // Get Admin User
        const user = await prisma.user.findUnique({
            where: { email: adminEmail }
        })

        if (!user) {
            console.error('Admin user not found in database')
            return
        }

        // Get Service
        const service = await prisma.service.findUnique({
            where: { slug: serviceSlug }
        })

        if (!service) {
            console.error(`Service with slug ${serviceSlug} not found. Running seed might be necessary.`)
            return
        }

        // Check if assigned
        const existingAssignment = await prisma.userService.findUnique({
            where: {
                userId_serviceId: {
                    userId: user.id,
                    serviceId: service.id
                }
            }
        })

        if (existingAssignment) {
            console.log('Service already assigned to admin.')
        } else {
            // Assign service
            await prisma.userService.create({
                data: {
                    userId: user.id,
                    serviceId: service.id,
                    notify: true,
                }
            })
            console.log('Successfully assigned service to admin!')
        }

    } catch (error) {
        console.error('Failed to assign service:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
