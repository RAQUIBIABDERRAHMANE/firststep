-- CreateTable
CREATE TABLE "BillSplit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parts" INTEGER NOT NULL DEFAULT 1,
    "itemsPaid" TEXT NOT NULL DEFAULT '[]',
    "paidTotal" REAL NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BillSplit_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "RestaurantOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TableCartSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tableId" TEXT NOT NULL,
    "cartData" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TableCartSession_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "RestaurantTable" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WaiterShift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "waiterId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "tableIds" TEXT NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "WaiterShift_waiterId_fkey" FOREIGN KEY ("waiterId") REFERENCES "RestaurantWaiter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stock" REAL NOT NULL DEFAULT 0.0,
    "unit" TEXT NOT NULL,
    "minStock" REAL NOT NULL DEFAULT 0.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ingredient_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecipeItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dishId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    CONSTRAINT "RecipeItem_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "RestaurantDish" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecipeItem_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "prepStation" TEXT NOT NULL DEFAULT 'KITCHEN',
    CONSTRAINT "RestaurantDish_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RestaurantCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RestaurantDish" ("addons", "categoryId", "description", "id", "image", "isActive", "name", "options", "order", "price", "tags") SELECT "addons", "categoryId", "description", "id", "image", "isActive", "name", "options", "order", "price", "tags" FROM "RestaurantDish";
DROP TABLE "RestaurantDish";
ALTER TABLE "new_RestaurantDish" RENAME TO "RestaurantDish";
CREATE INDEX "RestaurantDish_categoryId_idx" ON "RestaurantDish"("categoryId");
CREATE TABLE "new_RestaurantTable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "capacity" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "waiterId" TEXT,
    "xPos" REAL NOT NULL DEFAULT 0.0,
    "yPos" REAL NOT NULL DEFAULT 0.0,
    "rotation" REAL NOT NULL DEFAULT 0.0,
    "shape" TEXT NOT NULL DEFAULT 'SQUARE',
    CONSTRAINT "RestaurantTable_waiterId_fkey" FOREIGN KEY ("waiterId") REFERENCES "RestaurantWaiter" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RestaurantTable_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantWebsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RestaurantTable" ("capacity", "id", "isActive", "number", "tenantId", "waiterId") SELECT "capacity", "id", "isActive", "number", "tenantId", "waiterId" FROM "RestaurantTable";
DROP TABLE "RestaurantTable";
ALTER TABLE "new_RestaurantTable" RENAME TO "RestaurantTable";
CREATE INDEX "RestaurantTable_tenantId_idx" ON "RestaurantTable"("tenantId");
CREATE INDEX "RestaurantTable_waiterId_idx" ON "RestaurantTable"("waiterId");
CREATE UNIQUE INDEX "RestaurantTable_tenantId_number_key" ON "RestaurantTable"("tenantId", "number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "BillSplit_orderId_idx" ON "BillSplit"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "TableCartSession_tableId_key" ON "TableCartSession"("tableId");

-- CreateIndex
CREATE INDEX "WaiterShift_waiterId_idx" ON "WaiterShift"("waiterId");

-- CreateIndex
CREATE INDEX "WaiterShift_tenantId_idx" ON "WaiterShift"("tenantId");

-- CreateIndex
CREATE INDEX "Ingredient_tenantId_idx" ON "Ingredient"("tenantId");

-- CreateIndex
CREATE INDEX "RecipeItem_dishId_idx" ON "RecipeItem"("dishId");

-- CreateIndex
CREATE INDEX "RecipeItem_ingredientId_idx" ON "RecipeItem"("ingredientId");
