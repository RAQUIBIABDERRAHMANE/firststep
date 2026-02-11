const Database = require('better-sqlite3');
const db = new Database('dev.db', { readonly: true });

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

const campaigns = tables.find(t => t.name === 'Campaign');
if (campaigns) {
    console.log('Campaign table exists!');
    const columns = db.prepare("PRAGMA table_info(Campaign)").all();
    console.log('Columns:', columns.map(c => c.name));
} else {
    console.log('Campaign table MISSING!');
}
