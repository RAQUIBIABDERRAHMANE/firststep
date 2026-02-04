import prisma from '../lib/prisma'

async function cleanupUsers() {
    console.log('🔄 Cleaning up users...\n')

    try {
        // Get all users except the admin
        const usersToDelete = await prisma.user.findMany({
            where: {
                role: 'CLIENT'
            },
            select: {
                id: true,
                companyName: true,
                email: true
            }
        })

        console.log(`Found ${usersToDelete.length} client(s) to delete:`)
        usersToDelete.forEach(user => {
            console.log(`  - ${user.companyName} (${user.email})`)
        })

        if (usersToDelete.length === 0) {
            console.log('\n✅ No clients to delete.')
            return
        }

        console.log('\n🗑️ Deleting clients...')

        // Delete related data first (due to foreign key constraints)
        for (const user of usersToDelete) {
            // Delete user services
            await prisma.userService.deleteMany({
                where: { userId: user.id }
            })

            // Delete tenant websites
            await prisma.tenantWebsite.deleteMany({
                where: { userId: user.id }
            })

            // Delete notifications
            await prisma.notification.deleteMany({
                where: { userId: user.id }
            })

            // Delete chat sessions and their messages
            const chatSessions = await prisma.chatSession.findMany({
                where: { userId: user.id },
                select: { id: true }
            })

            for (const session of chatSessions) {
                await prisma.chatMessage.deleteMany({
                    where: { sessionId: session.id }
                })
            }

            await prisma.chatSession.deleteMany({
                where: { userId: user.id }
            })

            // Delete payment requests
            await prisma.paymentRequest.deleteMany({
                where: { userId: user.id }
            })

            // Finally delete the user
            await prisma.user.delete({
                where: { id: user.id }
            })

            console.log(`  ✅ Deleted ${user.companyName} (${user.email})`)
        }

        console.log(`\n✅ Successfully deleted ${usersToDelete.length} client(s)!`)

        // Show remaining users
        const remainingUsers = await prisma.user.findMany({
            select: {
                companyName: true,
                email: true,
                role: true
            }
        })

        console.log('\n📋 Remaining users:')
        remainingUsers.forEach(user => {
            console.log(`  - ${user.companyName} (${user.email}) - ${user.role}`)
        })

    } catch (error) {
        console.error('❌ Error cleaning up users:', error)
        throw error
    }
}

cleanupUsers()
    .then(() => {
        console.log('\n✨ Done!')
        process.exit(0)
    })
    .catch((err) => {
        console.error('Fatal error:', err)
        process.exit(1)
    })
