import { createClient } from "@libsql/client";
import "dotenv/config";

async function migrate() {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        console.error("❌ TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing in .env");
        process.exit(1);
    }

    console.log("🚀 Connecting to Turso...");
    const client = createClient({ url, authToken });

    const statements = [
        // Campaign table
        `CREATE TABLE IF NOT EXISTS "Campaign" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "subject" TEXT NOT NULL,
            "content" TEXT NOT NULL,
            "status" TEXT NOT NULL DEFAULT 'DRAFT',
            "sentAt" DATETIME,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            "recipientCount" INTEGER NOT NULL DEFAULT 0,
            "successCount" INTEGER NOT NULL DEFAULT 0,
            "failureCount" INTEGER NOT NULL DEFAULT 0,
            "selectedRecipients" TEXT NOT NULL DEFAULT '[]',
            "emailListIds" TEXT NOT NULL DEFAULT '[]',
            "scheduledAt" DATETIME,
            "attachments" TEXT DEFAULT '[]'
        )`,

        // EmailList table
        `CREATE TABLE IF NOT EXISTS "EmailList" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "description" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL
        )`,

        // EmailListMember table
        `CREATE TABLE IF NOT EXISTS "EmailListMember" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "listId" TEXT NOT NULL,
            "userId" TEXT,
            "email" TEXT,
            "name" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "unsubscribed" BOOLEAN NOT NULL DEFAULT false,
            FOREIGN KEY ("listId") REFERENCES "EmailList" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )`,

        // InvoiceSettings table
        `CREATE TABLE IF NOT EXISTS "InvoiceSettings" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "tenantId" TEXT NOT NULL UNIQUE,
            "companyName" TEXT,
            "companyAddress" TEXT,
            "companyPhone" TEXT,
            "companyEmail" TEXT,
            "companyLogo" TEXT,
            "taxRate" REAL NOT NULL DEFAULT 0,
            "currency" TEXT NOT NULL DEFAULT 'MAD',
            "prefix" TEXT NOT NULL DEFAULT 'FAC',
            "nextNumber" INTEGER NOT NULL DEFAULT 1,
            "footerNote" TEXT,
            "bankDetails" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )`,

        // Invoice table
        `CREATE TABLE IF NOT EXISTS "Invoice" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "tenantId" TEXT NOT NULL,
            "clientId" TEXT,
            "number" TEXT NOT NULL,
            "status" TEXT NOT NULL DEFAULT 'DRAFT',
            "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "dueDate" DATETIME,
            "subtotal" REAL NOT NULL DEFAULT 0,
            "taxRate" REAL NOT NULL DEFAULT 0,
            "taxAmount" REAL NOT NULL DEFAULT 0,
            "total" REAL NOT NULL DEFAULT 0,
            "notes" TEXT,
            "clientName" TEXT NOT NULL,
            "clientEmail" TEXT,
            "clientPhone" TEXT,
            "clientAddress" TEXT,
            "sentAt" DATETIME,
            "paidAt" DATETIME,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY ("clientId") REFERENCES "CabinetClient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
        )`,

        // InvoiceItem table
        `CREATE TABLE IF NOT EXISTS "InvoiceItem" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "invoiceId" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "quantity" REAL NOT NULL DEFAULT 1,
            "unitPrice" REAL NOT NULL,
            "total" REAL NOT NULL,
            FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )`,

        // MedicalRecord table
        `CREATE TABLE IF NOT EXISTS "MedicalRecord" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "tenantId" TEXT NOT NULL,
            "clientId" TEXT NOT NULL,
            "visitDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "chiefComplaint" TEXT,
            "diagnosis" TEXT,
            "treatment" TEXT,
            "notes" TEXT,
            "weight" REAL,
            "bloodPressure" TEXT,
            "temperature" REAL,
            "heartRate" INTEGER,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            FOREIGN KEY ("clientId") REFERENCES "CabinetClient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )`,

        // Prescription table
        `CREATE TABLE IF NOT EXISTS "Prescription" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "medicalRecordId" TEXT NOT NULL,
            "medication" TEXT NOT NULL,
            "dosage" TEXT,
            "frequency" TEXT,
            "duration" TEXT,
            "instructions" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )`,

        // MedicalHistory table
        `CREATE TABLE IF NOT EXISTS "MedicalHistory" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "clientId" TEXT NOT NULL,
            "condition" TEXT NOT NULL,
            "since" TEXT,
            "status" TEXT NOT NULL DEFAULT 'ACTIVE',
            "notes" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY ("clientId") REFERENCES "CabinetClient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )`,

        // Add unsubscribed column to User if missing
        `ALTER TABLE "User" ADD COLUMN "unsubscribed" BOOLEAN NOT NULL DEFAULT false`,

        // Indexes
        `CREATE UNIQUE INDEX IF NOT EXISTS "InvoiceSettings_tenantId_key" ON "InvoiceSettings"("tenantId")`,
        `CREATE INDEX IF NOT EXISTS "Invoice_tenantId_idx" ON "Invoice"("tenantId")`,
        `CREATE INDEX IF NOT EXISTS "Invoice_clientId_idx" ON "Invoice"("clientId")`,
        `CREATE INDEX IF NOT EXISTS "Invoice_status_idx" ON "Invoice"("status")`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_tenantId_number_key" ON "Invoice"("tenantId", "number")`,
        `CREATE INDEX IF NOT EXISTS "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId")`,
        `CREATE INDEX IF NOT EXISTS "MedicalRecord_tenantId_idx" ON "MedicalRecord"("tenantId")`,
        `CREATE INDEX IF NOT EXISTS "MedicalRecord_clientId_idx" ON "MedicalRecord"("clientId")`,
        `CREATE INDEX IF NOT EXISTS "MedicalRecord_visitDate_idx" ON "MedicalRecord"("visitDate")`,
        `CREATE INDEX IF NOT EXISTS "Prescription_medicalRecordId_idx" ON "Prescription"("medicalRecordId")`,
        `CREATE INDEX IF NOT EXISTS "MedicalHistory_clientId_idx" ON "MedicalHistory"("clientId")`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "EmailListMember_listId_userId_key" ON "EmailListMember"("listId", "userId")`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "EmailListMember_listId_email_key" ON "EmailListMember"("listId", "email")`,
    ];

    console.log(`⚡ Executing ${statements.length} SQL statements...`);

    let successCount = 0;
    for (let i = 0; i < statements.length; i++) {
        try {
            await client.execute(statements[i]);
            console.log(`✅ [${i + 1}/${statements.length}] OK`);
            successCount++;
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
            if (
                msg.includes('already exists') ||
                msg.includes('duplicate column') ||
                msg.includes('table already exists')
            ) {
                console.log(`⚠️  [${i + 1}/${statements.length}] Already exists, skipping`);
                successCount++;
            } else {
                console.error(`❌ [${i + 1}/${statements.length}] FAILED:`, msg);
            }
        }
    }

    console.log(`\n🎉 Migration completed! ${successCount}/${statements.length} statements succeeded.`);
    process.exit(0);
}

migrate();
