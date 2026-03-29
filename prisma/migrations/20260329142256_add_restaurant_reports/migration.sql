-- AlterTable
ALTER TABLE "CabinetClient" ADD COLUMN "age" INTEGER;
ALTER TABLE "CabinetClient" ADD COLUMN "cni" TEXT;

-- CreateTable
CREATE TABLE "RestaurantReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'GENERATED',
    "language" TEXT NOT NULL DEFAULT 'fr',
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RestaurantReport_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RestaurantReport_tenantId_idx" ON "RestaurantReport"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantReport_tenantId_month_year_key" ON "RestaurantReport"("tenantId", "month", "year");
