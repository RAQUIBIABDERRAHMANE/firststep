import prisma from '../lib/prisma'

async function test() {
    try {
        console.log('Testing Prisma via lib/prisma...')
        const count = await prisma.user.count()
        console.log('Successfully queried User count:', count)

        console.log('Testing ChatSession access...')
        const sessions = await prisma.chatSession.findMany({ take: 1 })
        console.log('Successfully queried ChatSession!')

        process.exit(0)
    } catch (error) {
        console.error('Failed to query Prisma:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

test()
