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
        `CREATE TABLE IF NOT EXISTS "PaymentRequest" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "serviceId" TEXT NOT NULL,
            "amount" REAL NOT NULL,
            "status" TEXT NOT NULL DEFAULT 'PENDING',
            "transferReference" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            "expiresAt" DATETIME NOT NULL,
            "confirmedAt" DATETIME,
            "confirmedBy" TEXT,
            CONSTRAINT "PaymentRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "PaymentRequest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS "BankAccount" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "accountName" TEXT NOT NULL,
            "iban" TEXT NOT NULL,
            "bic" TEXT,
            "bankName" TEXT NOT NULL,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE INDEX IF NOT EXISTS "PaymentRequest_userId_idx" ON "PaymentRequest"("userId")`,
        `CREATE INDEX IF NOT EXISTS "PaymentRequest_serviceId_idx" ON "PaymentRequest"("serviceId")`,
        `CREATE INDEX IF NOT EXISTS "PaymentRequest_status_idx" ON "PaymentRequest"("status")`,
        `INSERT INTO "BankAccount" ("id", "accountName", "iban", "bic", "bankName", "isActive", "createdAt")
         SELECT 'default-bank-001', 'FirstStep Solutions SARL', 'FR76 1234 5678 9012 3456 7890 123', 'BNPAFRPP', 'BNP Paribas', true, CURRENT_TIMESTAMP
         WHERE NOT EXISTS (SELECT 1 FROM "BankAccount" WHERE "id" = 'default-bank-001')`
    ];

    console.log(`⚡ Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
        try {
            await client.execute(statements[i]);
            console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
        } catch (error: unknown) {
            console.error(`❌ Error executing statement ${i + 1}:`, error instanceof Error ? error.message : error)
        }
    }

    console.log("🎉 Migration completed!");
    process.exit(0);
}

migrate();
