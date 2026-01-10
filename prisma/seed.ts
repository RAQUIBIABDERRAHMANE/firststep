import 'dotenv/config'
// Prisma Client Import
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import * as bcrypt from 'bcryptjs'

// Need to remove "file:" prefix for better-sqlite3
// Need to remove "file:" prefix for better-sqlite3? 
// If adapter expects url, maybe it handles "file:" prefix or stripping it.
// Lint suggests { url: string }.
const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!
})
const prisma = new PrismaClient({ adapter })

async function main() {
    const password = await bcrypt.hash('@@12raquibi', 10)

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@firststepco.com' },
        update: {},
        create: {
            email: 'admin@firststepco.com',
            password,
            companyName: 'FirstStep Admin',
            role: 'ADMIN',
        },
    })

    console.log({ admin })

    // Service: Restaurant Website & Online Ordering (AVAILABLE)
    const websiteService = await prisma.service.upsert({
        where: { slug: 'restaurant-website' },
        update: { status: 'AVAILABLE' },
        create: {
            name: 'Restaurant Website & Online Ordering',
            slug: 'restaurant-website',
            description: 'Public website with online menu, ordering system, and AI analytics.',
            status: 'AVAILABLE',
            category: 'restaurant',
        },
    })

    // Service: Restaurant POS System (COMING_SOON)
    const posService = await prisma.service.upsert({
        where: { slug: 'restaurant-pos' },
        update: { status: 'COMING_SOON' },
        create: {
            name: 'Restaurant POS System',
            slug: 'restaurant-pos',
            description: 'Full POS system with on-site orders, kitchen display, and table management.',
            status: 'COMING_SOON',
            category: 'restaurant',
        },
    })

    // Service: Stock Management (COMING_SOON)
    const stockService = await prisma.service.upsert({
        where: { slug: 'stock-management' },
        update: { status: 'COMING_SOON' },
        create: {
            name: 'Stock Management',
            slug: 'stock-management',
            description: 'Inventory tracking and control with alerts for low stock, product categorization, barcode integration, and analytics.',
            status: 'COMING_SOON',
            category: 'inventory',
        },
    })

    // Service: Car Rental System (COMING_SOON)
    const carRentalService = await prisma.service.upsert({
        where: { slug: 'car-rental-system' },
        update: { status: 'COMING_SOON' },
        create: {
            name: 'Car Rental System',
            slug: 'car-rental-system',
            description: 'Vehicle fleet management with rental reservations, flexible pricing rules, customer profiles, and availability calendar.',
            status: 'COMING_SOON',
            category: 'rental',
        },
    })

    // Service: Hotel Management System (COMING_SOON)
    const hotelService = await prisma.service.upsert({
        where: { slug: 'hotel-management' },
        update: { status: 'COMING_SOON' },
        create: {
            name: 'Hotel Management System',
            slug: 'hotel-management',
            description: 'Complete hotel solution with room inventory, booking engine, check-in/check-out workflows, billing, and guest management.',
            status: 'COMING_SOON',
            category: 'hospitality',
        },
    })

    // Service: Hospital Management System (COMING_SOON)
    const hospitalService = await prisma.service.upsert({
        where: { slug: 'hospital-management' },
        update: { status: 'COMING_SOON' },
        create: {
            name: 'Hospital Management System',
            slug: 'hospital-management',
            description: 'Patient registration, medical records, appointment scheduling, billing, insurance handling, and pharmacy inventory.',
            status: 'COMING_SOON',
            category: 'healthcare',
        },
    })

    // Service: Cabinet System (COMING_SOON)
    const cabinetService = await prisma.service.upsert({
        where: { slug: 'cabinet-system' },
        update: { status: 'COMING_SOON' },
        create: {
            name: 'Cabinet System',
            slug: 'cabinet-system',
            description: 'Professional office management with appointment calendar, client records, service catalog, billing, and automated reminders.',
            status: 'COMING_SOON',
            category: 'professional-services',
        },
    })

    console.log({ websiteService, posService, stockService, carRentalService, hotelService, hospitalService, cabinetService })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
