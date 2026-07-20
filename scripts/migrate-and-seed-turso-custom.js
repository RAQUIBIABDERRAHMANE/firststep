const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");

dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required in .env");
  process.exit(1);
}

const client = createClient({ url, authToken });

function generateCuid() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

async function main() {
  console.log("🌐 Connecting to Turso database...");
  
  // 1. Create table CustomWebsiteRequest
  console.log("🛠 Creating CustomWebsiteRequest table on Turso...");
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS "CustomWebsiteRequest" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT,
      "clientName" TEXT NOT NULL,
      "companyName" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "phone" TEXT,
      "websiteType" TEXT NOT NULL,
      "stylePreferences" TEXT NOT NULL,
      "pages" TEXT NOT NULL,
      "specialFeatures" TEXT NOT NULL,
      "competitors" TEXT,
      "additionalNotes" TEXT,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "adminNotes" TEXT NOT NULL DEFAULT '[]',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    );
  `;
  await client.execute(createTableSql);

  const createIndexSql = `
    CREATE INDEX IF NOT EXISTS "CustomWebsiteRequest_userId_idx" ON "CustomWebsiteRequest" ("userId");
  `;
  await client.execute(createIndexSql);
  console.log("✅ CustomWebsiteRequest table & index created successfully!");

  // 2. Seed custom-website service
  console.log("🌱 Seeding Custom Website service on Turso...");
  const serviceId = generateCuid();
  await client.execute({
    sql: `
      INSERT INTO "Service" ("id", "name", "slug", "description", "status", "category", "price")
      SELECT ?, ?, ?, ?, ?, ?, ?
      WHERE NOT EXISTS (SELECT 1 FROM "Service" WHERE "slug" = 'custom-website')
    `,
    args: [
      serviceId,
      "Site Web Sur Mesure",
      "custom-website",
      "Site web complet personnalisé de A à Z (code, design et logique) pour votre entreprise.",
      "AVAILABLE",
      "professional-services",
      15000
    ]
  });
  console.log("✅ Custom Website service seeded successfully!");

  // Verification
  const servicesResult = await client.execute("SELECT name, slug, status FROM Service WHERE slug = 'custom-website'");
  console.log("📋 Custom Website service in Turso database:", servicesResult.rows);

  client.close();
}

main().catch((err) => {
  console.error("❌ Migration/Seeding failed:", err);
  process.exit(1);
});
