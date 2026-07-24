const { createClient } = require("@libsql/client");
const { PrismaClient } = require("../src/generated/client");
const dotenv = require("dotenv");

dotenv.config();

// 1. Update Turso
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

async function main() {
  if (url && authToken) {
    console.log("🌐 Connecting to Turso database to update price...");
    const client = createClient({ url, authToken });
    await client.execute({
      sql: `UPDATE "Service" SET "price" = 1500 WHERE "slug" = 'custom-website'`,
      args: []
    });
    console.log("✅ Turso database updated: Custom Website price set to 1500 MAD.");
    client.close();
  } else {
    console.warn("⚠️ Turso environment credentials missing.");
  }

  // 2. Update Local SQLite (dev.db)
  console.log("📁 Connecting to local SQLite database to update price...");
  const prisma = new PrismaClient();
  await prisma.service.updateMany({
    where: { slug: 'custom-website' },
    data: { price: 1500 }
  });
  console.log("✅ Local SQLite database updated: Custom Website price set to 1500 MAD.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ Failed to update price:", err);
  process.exit(1);
});
