import { createClient } from "@libsql/client";
import "dotenv/config";

async function addIsActiveColumn() {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        console.error("❌ TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing");
        process.exit(1);
    }

    console.log("🚀 Connecting to Turso...");
    const client = createClient({ url, authToken });

    try {
        // Ajouter la colonne isActive à UserService
        console.log("➕ Adding isActive column to UserService...");
        await client.execute(`
            ALTER TABLE UserService ADD COLUMN isActive INTEGER NOT NULL DEFAULT 1;
        `);
        
        console.log("✅ Column isActive added successfully");
        
        // Vérifier que tous les enregistrements existants ont isActive = 1
        const result = await client.execute(`
            SELECT COUNT(*) as count FROM UserService WHERE isActive = 1;
        `);
        
        console.log(`✅ ${result.rows[0].count} UserService records with isActive = true`);
        
    } catch (error: any) {
        if (error.message.includes("duplicate column name")) {
            console.log("⚠️  Column isActive already exists");
        } else {
            console.error("❌ Error:", error.message);
            process.exit(1);
        }
    }
    
    console.log("🎉 Migration complete!");
}

addIsActiveColumn();
