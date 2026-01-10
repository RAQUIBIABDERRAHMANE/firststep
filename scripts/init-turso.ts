// Script to initialize Turso database with all migrations
import 'dotenv/config'
import { createClient } from '@libsql/client'

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function initDatabase() {
    console.log('🚀 Initializing Turso database...')
    console.log('📍 URL:', process.env.TURSO_DATABASE_URL)

    try {
        // Migration 1: Init
        console.log('\n📦 Applying migration: init...')
        await client.executeMultiple(`
            CREATE TABLE IF NOT EXISTS "User" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "email" TEXT NOT NULL,
                "password" TEXT NOT NULL,
                "companyName" TEXT NOT NULL DEFAULT '',
                "role" TEXT NOT NULL DEFAULT 'CLIENT',
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS "Service" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "name" TEXT NOT NULL,
                "slug" TEXT NOT NULL,
                "description" TEXT,
                "status" TEXT NOT NULL DEFAULT 'COMING_SOON',
                "category" TEXT,
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS "UserService" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "userId" TEXT NOT NULL,
                "serviceId" TEXT NOT NULL,
                "notify" INTEGER NOT NULL DEFAULT 0,
                "selectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
                FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE
            );

            CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
            CREATE UNIQUE INDEX IF NOT EXISTS "Service_slug_key" ON "Service"("slug");
            CREATE UNIQUE INDEX IF NOT EXISTS "UserService_userId_serviceId_key" ON "UserService"("userId", "serviceId");
        `)
        console.log('✅ Init migration applied')

        // Migration 2: Notifications
        console.log('\n📦 Applying migration: notifications...')
        await client.executeMultiple(`
            CREATE TABLE IF NOT EXISTS "Notification" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "userId" TEXT NOT NULL,
                "title" TEXT NOT NULL,
                "message" TEXT NOT NULL,
                "read" INTEGER NOT NULL DEFAULT 0,
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
            );
        `)
        console.log('✅ Notifications migration applied')

        // Migration 3: Password Reset
        console.log('\n📦 Applying migration: password_reset...')
        await client.executeMultiple(`
            CREATE TABLE IF NOT EXISTS "PasswordReset" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "email" TEXT NOT NULL,
                "code" TEXT NOT NULL,
                "expiresAt" DATETIME NOT NULL,
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS "PasswordReset_email_idx" ON "PasswordReset"("email");
        `)
        console.log('✅ Password Reset migration applied')

        // Verify tables
        console.log('\n📋 Verifying tables...')
        const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'")
        console.log('Tables created:', tables.rows.map(r => r.name))

        console.log('\n🎉 Database initialized successfully!')
        
    } catch (error) {
        console.error('❌ Error:', error)
        throw error
    }
}

initDatabase()
