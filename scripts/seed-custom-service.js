const Database = require('better-sqlite3');
const db = new Database('dev.db');

try {
    // Insert/update custom website service
    const service = {
        id: 'custom-website-service-id', // fixed id or cuid
        name: 'Site Web Sur Mesure',
        slug: 'custom-website',
        description: 'Un site web unique conçu et développé de A à Z par nos professionnels spécialement pour votre activité (pas seulement un design, mais un site complet fonctionnel).',
        status: 'AVAILABLE',
        category: 'custom-website',
        price: 1999.00,
        createdAt: new Date().toISOString()
    };

    const stmtCheck = db.prepare("SELECT id FROM Service WHERE slug = ?");
    const existing = stmtCheck.get(service.slug);

    if (existing) {
        const stmtUpdate = db.prepare(`
            UPDATE Service 
            SET name = ?, description = ?, status = ?, category = ?, price = ?
            WHERE slug = ?
        `);
        stmtUpdate.run(service.name, service.description, service.status, service.category, service.price, service.slug);
        console.log('Successfully updated custom-website service in SQLite database!');
    } else {
        const stmtInsert = db.prepare(`
            INSERT INTO Service (id, name, slug, description, status, category, price, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmtInsert.run(service.id, service.name, service.slug, service.description, service.status, service.category, service.price, service.createdAt);
        console.log('Successfully inserted custom-website service into SQLite database!');
    }
} catch (error) {
    console.error('Failed to seed custom service:', error);
} finally {
    db.close();
}
