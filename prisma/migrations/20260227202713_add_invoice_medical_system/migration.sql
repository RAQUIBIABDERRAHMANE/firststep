-- CreateTable
CREATE TABLE "Campaign" (
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
);

-- CreateTable
CREATE TABLE "EmailList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EmailListMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "EmailListMember_listId_fkey" FOREIGN KEY ("listId") REFERENCES "EmailList" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmailListMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvoiceSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
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
    CONSTRAINT "InvoiceSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invoice" (
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
    CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "CabinetClient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" REAL NOT NULL DEFAULT 1,
    "unitPrice" REAL NOT NULL,
    "total" REAL NOT NULL,
    CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
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
    CONSTRAINT "MedicalRecord_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "CabinetClient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medicalRecordId" TEXT NOT NULL,
    "medication" TEXT NOT NULL,
    "dosage" TEXT,
    "frequency" TEXT,
    "duration" TEXT,
    "instructions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Prescription_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MedicalHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "since" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MedicalHistory_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "CabinetClient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("companyName", "createdAt", "email", "id", "password", "role") SELECT "companyName", "createdAt", "email", "id", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "EmailListMember_listId_userId_key" ON "EmailListMember"("listId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailListMember_listId_email_key" ON "EmailListMember"("listId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceSettings_tenantId_key" ON "InvoiceSettings"("tenantId");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_idx" ON "Invoice"("tenantId");

-- CreateIndex
CREATE INDEX "Invoice_clientId_idx" ON "Invoice"("clientId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_tenantId_number_key" ON "Invoice"("tenantId", "number");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");

-- CreateIndex
CREATE INDEX "MedicalRecord_tenantId_idx" ON "MedicalRecord"("tenantId");

-- CreateIndex
CREATE INDEX "MedicalRecord_clientId_idx" ON "MedicalRecord"("clientId");

-- CreateIndex
CREATE INDEX "MedicalRecord_visitDate_idx" ON "MedicalRecord"("visitDate");

-- CreateIndex
CREATE INDEX "Prescription_medicalRecordId_idx" ON "Prescription"("medicalRecordId");

-- CreateIndex
CREATE INDEX "MedicalHistory_clientId_idx" ON "MedicalHistory"("clientId");
