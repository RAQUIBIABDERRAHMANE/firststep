// Script to seed Turso database
import 'dotenv/config'
import { createClient } from '@libsql/client'
import * as bcrypt from 'bcryptjs'

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
})

function generateCuid(): string {
    return 'c' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

async function seedDatabase() {
    console.log('🌱 Seeding Turso database...')

    try {
        const password = await bcrypt.hash('@@12raquibi', 10)

        // Create Admin User
        console.log('\n👤 Creating admin user...')
        const adminId = generateCuid()
        await client.execute({
            sql: `INSERT OR IGNORE INTO "User" ("id", "email", "password", "companyName", "role") 
                  VALUES (?, ?, ?, ?, ?)`,
            args: [adminId, 'admin@firststepco.com', password, 'FirstStep Admin', 'ADMIN']
        })
        console.log('✅ Admin user created: admin@firststepco.com')

        // Create Services
        console.log('\n📦 Creating services...')
        
        const services = [
            { name: 'Restaurant Website & Online Ordering', slug: 'restaurant-website', description: 'Public website with online menu, ordering system, and AI analytics.', status: 'AVAILABLE', category: 'restaurant' },
            { name: 'Restaurant POS System', slug: 'restaurant-pos', description: 'Complete point of sale system with inventory management.', status: 'COMING_SOON', category: 'restaurant' },
            { name: 'Stock Management System', slug: 'stock-management', description: 'Comprehensive inventory tracking and stock control.', status: 'COMING_SOON', category: 'inventory' },
            { name: 'Car Rental Management', slug: 'car-rental', description: 'Fleet management, reservations, and rental tracking.', status: 'COMING_SOON', category: 'rental' },
            { name: 'Hotel Management System', slug: 'hotel-management', description: 'Room booking, guest management, and hospitality operations.', status: 'COMING_SOON', category: 'hospitality' },
            { name: 'Hospital Management System', slug: 'hospital-management', description: 'Patient records, appointments, and healthcare administration.', status: 'COMING_SOON', category: 'healthcare' },
            { name: 'Cabinet Management System', slug: 'cabinet-management', description: 'Professional practice management for offices and cabinets.', status: 'COMING_SOON', category: 'professional-services' },
        ]

        for (const service of services) {
            const serviceId = generateCuid()
            await client.execute({
                sql: `INSERT OR IGNORE INTO "Service" ("id", "name", "slug", "description", "status", "category") 
                      VALUES (?, ?, ?, ?, ?, ?)`,
                args: [serviceId, service.name, service.slug, service.description, service.status, service.category]
            })
            console.log(`  ✅ ${service.name} (${service.status})`)
        }

        // Verify
        console.log('\n📋 Verifying data...')
        const users = await client.execute("SELECT email, role FROM User")
        console.log('Users:', users.rows)
        
        const servicesResult = await client.execute("SELECT name, status FROM Service")
        console.log('Services:', servicesResult.rows.length, 'created')

        console.log('\n🎉 Database seeded successfully!')
        
    } catch (error) {
        console.error('❌ Error:', error)
        throw error
    }
}

seedDatabase()
