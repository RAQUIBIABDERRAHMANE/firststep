-- CreateTable
CREATE TABLE "TablePrintRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "tableIds" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TablePrintRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FactureTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateX" REAL NOT NULL DEFAULT 400,
    "dateY" REAL NOT NULL DEFAULT 700,
    "clientNameX" REAL NOT NULL DEFAULT 80,
    "clientNameY" REAL NOT NULL DEFAULT 620,
    "clientEmailX" REAL NOT NULL DEFAULT 80,
    "clientEmailY" REAL NOT NULL DEFAULT 600,
    "clientCompanyX" REAL NOT NULL DEFAULT 80,
    "clientCompanyY" REAL NOT NULL DEFAULT 640,
    "serviceNameX" REAL NOT NULL DEFAULT 80,
    "serviceNameY" REAL NOT NULL DEFAULT 480,
    "subtotalX" REAL NOT NULL DEFAULT 450,
    "subtotalY" REAL NOT NULL DEFAULT 200,
    "totalX" REAL NOT NULL DEFAULT 450,
    "totalY" REAL NOT NULL DEFAULT 170,
    "factureNumberX" REAL NOT NULL DEFAULT 400,
    "factureNumberY" REAL NOT NULL DEFAULT 730,
    "fontSize" REAL NOT NULL DEFAULT 12,
    "fontColor" TEXT NOT NULL DEFAULT '#000000',
    "factureNumberFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',
    "dateFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',
    "clientCompanyFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',
    "clientNameFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',
    "clientEmailFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',
    "serviceNameFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',
    "servicePriceFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',
    "subtotalFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',
    "totalFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',
    "servicePriceX" REAL NOT NULL DEFAULT 450,
    "servicePriceY" REAL NOT NULL DEFAULT 480,
    "factureNumberFontSize" REAL NOT NULL DEFAULT 12,
    "factureNumberFontColor" TEXT NOT NULL DEFAULT '#000000',
    "factureNumberIsBold" BOOLEAN NOT NULL DEFAULT true,
    "factureNumberIsItalic" BOOLEAN NOT NULL DEFAULT false,
    "dateFontSize" REAL NOT NULL DEFAULT 12,
    "dateFontColor" TEXT NOT NULL DEFAULT '#000000',
    "dateIsBold" BOOLEAN NOT NULL DEFAULT false,
    "dateIsItalic" BOOLEAN NOT NULL DEFAULT false,
    "clientCompanyFontSize" REAL NOT NULL DEFAULT 12,
    "clientCompanyFontColor" TEXT NOT NULL DEFAULT '#000000',
    "clientCompanyIsBold" BOOLEAN NOT NULL DEFAULT true,
    "clientCompanyIsItalic" BOOLEAN NOT NULL DEFAULT false,
    "clientNameFontSize" REAL NOT NULL DEFAULT 12,
    "clientNameFontColor" TEXT NOT NULL DEFAULT '#000000',
    "clientNameIsBold" BOOLEAN NOT NULL DEFAULT false,
    "clientNameIsItalic" BOOLEAN NOT NULL DEFAULT false,
    "clientEmailFontSize" REAL NOT NULL DEFAULT 12,
    "clientEmailFontColor" TEXT NOT NULL DEFAULT '#000000',
    "clientEmailIsBold" BOOLEAN NOT NULL DEFAULT false,
    "clientEmailIsItalic" BOOLEAN NOT NULL DEFAULT false,
    "serviceNameFontSize" REAL NOT NULL DEFAULT 12,
    "serviceNameFontColor" TEXT NOT NULL DEFAULT '#000000',
    "serviceNameIsBold" BOOLEAN NOT NULL DEFAULT false,
    "serviceNameIsItalic" BOOLEAN NOT NULL DEFAULT false,
    "servicePriceFontSize" REAL NOT NULL DEFAULT 12,
    "servicePriceFontColor" TEXT NOT NULL DEFAULT '#000000',
    "servicePriceIsBold" BOOLEAN NOT NULL DEFAULT false,
    "servicePriceIsItalic" BOOLEAN NOT NULL DEFAULT false,
    "subtotalFontSize" REAL NOT NULL DEFAULT 12,
    "subtotalFontColor" TEXT NOT NULL DEFAULT '#000000',
    "subtotalIsBold" BOOLEAN NOT NULL DEFAULT false,
    "subtotalIsItalic" BOOLEAN NOT NULL DEFAULT false,
    "totalFontSize" REAL NOT NULL DEFAULT 14,
    "totalFontColor" TEXT NOT NULL DEFAULT '#000000',
    "totalIsBold" BOOLEAN NOT NULL DEFAULT true,
    "totalIsItalic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FactureRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "pdfUrl" TEXT,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FactureCounter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "nextNumber" INTEGER NOT NULL DEFAULT 1
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RestaurantDish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "options" TEXT NOT NULL DEFAULT '[]',
    "addons" TEXT NOT NULL DEFAULT '[]',
    "tags" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "RestaurantDish_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RestaurantCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RestaurantDish" ("categoryId", "description", "id", "image", "isActive", "name", "order", "price") SELECT "categoryId", "description", "id", "image", "isActive", "name", "order", "price" FROM "RestaurantDish";
DROP TABLE "RestaurantDish";
ALTER TABLE "new_RestaurantDish" RENAME TO "RestaurantDish";
CREATE INDEX "RestaurantDish_categoryId_idx" ON "RestaurantDish"("categoryId");
CREATE TABLE "new_RestaurantOrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "selectedOptions" TEXT NOT NULL DEFAULT '[]',
    "selectedAddons" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "RestaurantOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "RestaurantOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RestaurantOrderItem" ("dishId", "id", "name", "orderId", "price", "quantity") SELECT "dishId", "id", "name", "orderId", "price", "quantity" FROM "RestaurantOrderItem";
DROP TABLE "RestaurantOrderItem";
ALTER TABLE "new_RestaurantOrderItem" RENAME TO "RestaurantOrderItem";
CREATE INDEX "RestaurantOrderItem_orderId_idx" ON "RestaurantOrderItem"("orderId");
CREATE TABLE "new_RestaurantReservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "tableId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RestaurantReservation_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "RestaurantTable" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RestaurantReservation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RestaurantReservation" ("createdAt", "date", "email", "id", "name", "notes", "partySize", "phone", "status", "tenantId", "time") SELECT "createdAt", "date", "email", "id", "name", "notes", "partySize", "phone", "status", "tenantId", "time" FROM "RestaurantReservation";
DROP TABLE "RestaurantReservation";
ALTER TABLE "new_RestaurantReservation" RENAME TO "RestaurantReservation";
CREATE INDEX "RestaurantReservation_tenantId_idx" ON "RestaurantReservation"("tenantId");
CREATE INDEX "RestaurantReservation_date_idx" ON "RestaurantReservation"("date");
CREATE INDEX "RestaurantReservation_tableId_idx" ON "RestaurantReservation"("tableId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed" BOOLEAN NOT NULL DEFAULT false,
    "recoveryEmail" TEXT,
    "recoveryCodes" TEXT NOT NULL DEFAULT '[]'
);
INSERT INTO "new_User" ("companyName", "createdAt", "email", "id", "password", "role", "unsubscribed") SELECT "companyName", "createdAt", "email", "id", "password", "role", "unsubscribed" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "TablePrintRequest_tenantId_idx" ON "TablePrintRequest"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "FactureRecord_number_key" ON "FactureRecord"("number");

-- CreateIndex
CREATE UNIQUE INDEX "FactureRecord_paymentId_key" ON "FactureRecord"("paymentId");

-- CreateIndex
CREATE INDEX "FactureRecord_userId_idx" ON "FactureRecord"("userId");

-- CreateIndex
CREATE INDEX "FactureRecord_paymentId_idx" ON "FactureRecord"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "FactureCounter_year_key" ON "FactureCounter"("year");
