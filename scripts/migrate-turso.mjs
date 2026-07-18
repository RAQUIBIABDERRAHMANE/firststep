import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required in .env");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  const sqlFile = path.join(
    process.cwd(),
    "prisma/migrations/20260706171311_add_restaurant_features_v2/migration.sql"
  );
  
  if (!fs.existsSync(sqlFile)) {
    console.error(`Migration SQL file not found at: ${sqlFile}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlFile, "utf-8");

  console.log("🌐 Connecting to Turso...");
  
  // Clean comments and divide the SQL file by semicolons
  const cleanedSql = sql
    .replace(/--.*$/gm, '') // Remove single line comments
    .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments

  const statements = cleanedSql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`🚀 Found ${statements.length} SQL statements to execute.`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    console.log(`[${i + 1}/${statements.length}] Executing statement:`);
    console.log(`   ${stmt.slice(0, 80)}${stmt.length > 80 ? '...' : ''}`);
    
    try {
      await client.execute(stmt);
    } catch (err) {
      // If error is duplicate table/column, log it as warning since it might already exist
      const errMsg = String(err);
      if (errMsg.includes("already exists") || errMsg.includes("duplicate column")) {
        console.warn(`⚠️ Warning (ignored): ${errMsg}`);
      } else {
        throw err;
      }
    }
  }

  console.log("🎉 Turso database migrated successfully!");
  client.close();
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
