import prisma from '../lib/prisma'

async function migrate() {
    console.log('Adding roleType column to EmploymentApplication if not exists...')
    try {
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "EmploymentApplication" ADD COLUMN "roleType" TEXT DEFAULT 'DEVELOPER';
        `)
        console.log('Column roleType added successfully!')
    } catch (e: any) {
        console.log('Note on ALTER TABLE (likely column already exists or handled):', e?.message)
    } finally {
        await prisma.$disconnect()
    }
}

migrate()
