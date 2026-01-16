-- CreateTable
CREATE TABLE "CabinetService" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CabinetService_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CabinetClient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CabinetClient_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CabinetAppointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "appointmentDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CabinetAppointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "CabinetService" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CabinetAppointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "CabinetClient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CabinetAppointment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CabinetService_tenantId_idx" ON "CabinetService"("tenantId");

-- CreateIndex
CREATE INDEX "CabinetClient_tenantId_idx" ON "CabinetClient"("tenantId");

-- CreateIndex
CREATE INDEX "CabinetClient_email_idx" ON "CabinetClient"("email");

-- CreateIndex
CREATE INDEX "CabinetAppointment_tenantId_idx" ON "CabinetAppointment"("tenantId");

-- CreateIndex
CREATE INDEX "CabinetAppointment_serviceId_idx" ON "CabinetAppointment"("serviceId");

-- CreateIndex
CREATE INDEX "CabinetAppointment_clientId_idx" ON "CabinetAppointment"("clientId");

-- CreateIndex
CREATE INDEX "CabinetAppointment_appointmentDate_idx" ON "CabinetAppointment"("appointmentDate");
