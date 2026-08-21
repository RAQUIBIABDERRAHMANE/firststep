import prisma from '../lib/prisma'

async function testVideoEditorApp() {
    console.log('Testing create video editor application...')
    try {
        const app = await prisma.employmentApplication.create({
            data: {
                roleType: 'VIDEO_EDITOR',
                fullName: 'Test Video Editor',
                email: 'testvideo@firststep.dev',
                phone: '+212600000000',
                cin: 'TEST1234',
                cvUrl: 'https://example.com/cv.pdf',
                photoUrl: 'https://example.com/photo.jpg',
                githubUrl: '',
                portfolioUrl: 'https://youtu.be/JGF95lf9Pj0',
                linkedinUrl: '',
                skills: JSON.stringify(['Premiere Pro', 'After Effects']),
                revenueShare: 20,
                status: 'PENDING'
            }
        })
        console.log('✅ Created successfully! ID:', app.id, 'Role:', (app as any).roleType)
        
        // Clean up test app
        await prisma.employmentApplication.delete({ where: { id: app.id } })
        console.log('Cleaned up test entry.')
    } catch (err: any) {
        console.error('❌ Failed:', err?.message || err)
    } finally {
        await prisma.$disconnect()
    }
}

testVideoEditorApp()
