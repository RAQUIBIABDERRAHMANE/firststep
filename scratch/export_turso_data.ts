import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

function toUuid(str: string): string {
  if (!str) return '00000000-0000-0000-0000-000000000000';
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) return str;

  const hash = crypto.createHash('md5').update(str).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

function formatVal(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'string') {
    return `'${val.replace(/'/g, "''")}'`;
  }
  if (typeof val === 'boolean') {
    return val ? 'TRUE' : 'FALSE';
  }
  return val.toString();
}

async function run() {
  console.log('🔄 Fetching data from Turso cloud database...');

  try {
    // 1. Fetch Users
    const usersRes = await client.execute('SELECT * FROM User;');
    let identitySql = 'TRUNCATE TABLE users CASCADE;\n';
    for (const row of usersRes.rows) {
      const id = toUuid(row.id as string);
      const name = row.name || 'User';
      const email = row.email;
      const passwordHash = row.password; // bcrypt hash from V1
      const role = row.role || 'CLIENT';
      const isActive = row.isActive !== 0;
      const createdAt = new Date(Number(row.createdAt) || Date.now()).toISOString();
      const updatedAt = new Date(Number(row.updatedAt) || Date.now()).toISOString();

      identitySql += `INSERT INTO users (id, name, email, password_hash, role, is_active, created_at, updated_at) VALUES (${formatVal(id)}, ${formatVal(name)}, ${formatVal(email)}, ${formatVal(passwordHash)}, ${formatVal(role)}, ${formatVal(isActive)}, ${formatVal(createdAt)}, ${formatVal(updatedAt)});\n`;
    }
    fs.writeFileSync(path.join(__dirname, 'identity_dump.sql'), identitySql);
    console.log(`✅ Dumped ${usersRes.rows.length} users to identity_dump.sql`);

    // 2. Fetch Tenant Websites and generate structures
    const websitesRes = await client.execute('SELECT * FROM TenantWebsite;');
    let tenantSql = 'TRUNCATE TABLE organizations CASCADE;\n';
    
    // Default organization & company
    const orgId = '019f09a1-66c5-703d-89a0-76181d77ac4a';
    const companyId = '019f09a1-66c5-703d-89a0-76181d77ac49';
    tenantSql += `INSERT INTO organizations (id, name, created_at, updated_at) VALUES ('${orgId}', 'Default Organization', NOW(), NOW());\n`;
    tenantSql += `INSERT INTO companies (id, organization_id, name, created_at, updated_at) VALUES ('${companyId}', '${orgId}', 'Default Company', NOW(), NOW());\n`;

    for (const row of websitesRes.rows) {
      const id = toUuid(row.id as string); // Tenant Website UUID
      const slug = row.slug;
      const primaryColor = row.primaryColor || '#3B82F6';
      const config = row.config || '{}';
      const designTemplate = row.designTemplate || 'classic';
      const isActive = row.isActive !== 0;
      const createdAt = new Date(Number(row.createdAt) || Date.now()).toISOString();
      const updatedAt = new Date(Number(row.updatedAt) || Date.now()).toISOString();

      // We map TenantWebsite directly to a dynamic location
      const locationId = id; // use the same UUID to map easily
      const locationName = `${String(slug || '').toUpperCase()} Location`;

      tenantSql += `INSERT INTO locations (id, company_id, name, city, currency, created_at, updated_at) VALUES (${formatVal(locationId)}, '${companyId}', ${formatVal(locationName)}, 'Casablanca', 'MAD', ${formatVal(createdAt)}, ${formatVal(updatedAt)});\n`;
      tenantSql += `INSERT INTO tenant_websites (id, location_id, slug, primary_color, config, design_template, is_active, created_at, updated_at) VALUES (${formatVal(id)}, ${formatVal(locationId)}, ${formatVal(slug)}, ${formatVal(primaryColor)}, ${formatVal(config)}, ${formatVal(designTemplate)}, ${formatVal(isActive)}, ${formatVal(createdAt)}, ${formatVal(updatedAt)});\n`;
    }
    fs.writeFileSync(path.join(__dirname, 'tenant_dump.sql'), tenantSql);
    console.log(`✅ Dumped ${websitesRes.rows.length} tenant websites to tenant_dump.sql`);

    // 3. Fetch Restaurant categories & dishes
    const categoriesRes = await client.execute('SELECT * FROM RestaurantCategory;');
    const dishesRes = await client.execute('SELECT * FROM RestaurantDish;');
    const tablesRes = await client.execute('SELECT * FROM RestaurantTable;');
    const waitersRes = await client.execute('SELECT * FROM RestaurantWaiter;');

    let restaurantSql = 'TRUNCATE TABLE restaurant_categories, restaurant_tables, restaurant_waiters CASCADE;\n';

    for (const row of categoriesRes.rows) {
      const id = toUuid(row.id as string);
      const tenantId = toUuid(row.tenantId as string); // references TenantWebsite.id
      const name = row.name;
      const sortOrder = row.order || 0;
      const isActive = row.isActive !== 0;
      const createdAt = new Date(Number(row.createdAt) || Date.now()).toISOString();
      const updatedAt = new Date(Number(row.updatedAt) || Date.now()).toISOString();

      restaurantSql += `INSERT INTO restaurant_categories (id, tenant_id, name, sort_order, is_active, created_at, updated_at) VALUES (${formatVal(id)}, ${formatVal(tenantId)}, ${formatVal(name)}, ${formatVal(sortOrder)}, ${formatVal(isActive)}, ${formatVal(createdAt)}, ${formatVal(updatedAt)});\n`;
    }

    for (const row of dishesRes.rows) {
      const id = toUuid(row.id as string);
      const categoryId = toUuid(row.categoryId as string);
      const name = row.name;
      const description = row.description || '';
      const price = row.price || 0.00;
      const imageUrl = row.image || '';
      const isActive = row.isActive !== 0;
      const sortOrder = row.order || 0;
      const createdAt = new Date(Number(row.createdAt) || Date.now()).toISOString();
      const updatedAt = new Date(Number(row.updatedAt) || Date.now()).toISOString();

      restaurantSql += `INSERT INTO restaurant_dishes (id, category_id, name, description, price, image_url, is_active, sort_order, created_at, updated_at) VALUES (${formatVal(id)}, ${formatVal(categoryId)}, ${formatVal(name)}, ${formatVal(description)}, ${formatVal(price)}, ${formatVal(imageUrl)}, ${formatVal(isActive)}, ${formatVal(sortOrder)}, ${formatVal(createdAt)}, ${formatVal(updatedAt)});\n`;
    }

    for (const row of tablesRes.rows) {
      const id = toUuid(row.id as string);
      const tenantId = toUuid(row.tenantId as string);
      const number = row.number;
      const capacity = row.capacity || 4;
      const isActive = row.isActive !== 0;
      const createdAt = new Date(Number(row.createdAt) || Date.now()).toISOString();
      const updatedAt = new Date(Number(row.updatedAt) || Date.now()).toISOString();

      restaurantSql += `INSERT INTO restaurant_tables (id, tenant_id, number, capacity, is_active, created_at, updated_at) VALUES (${formatVal(id)}, ${formatVal(tenantId)}, ${formatVal(number)}, ${formatVal(capacity)}, ${formatVal(isActive)}, ${formatVal(createdAt)}, ${formatVal(updatedAt)});\n`;
    }

    for (const row of waitersRes.rows) {
      const id = toUuid(row.id as string);
      const tenantId = toUuid(row.tenantId as string);
      const name = row.name;
      const pinHash = String(row.pin || '1234'); // bcrypt pin
      const isActive = row.isActive !== 0;
      const createdAt = new Date(Number(row.createdAt) || Date.now()).toISOString();
      const updatedAt = new Date(Number(row.updatedAt) || Date.now()).toISOString();

      const bcryptHash = pinHash.startsWith('$2') ? pinHash : '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

      restaurantSql += `INSERT INTO restaurant_waiters (id, tenant_id, name, pin_hash, is_active, created_at, updated_at) VALUES (${formatVal(id)}, ${formatVal(tenantId)}, ${formatVal(name)}, ${formatVal(bcryptHash)}, ${formatVal(isActive)}, ${formatVal(createdAt)}, ${formatVal(updatedAt)});\n`;
    }

    fs.writeFileSync(path.join(__dirname, 'restaurant_dump.sql'), restaurantSql);
    console.log(`✅ Dumped restaurant categories, dishes, tables, and waiters to restaurant_dump.sql`);
    
    console.log('🎉 Data export complete!');
  } catch (error) {
    console.error('❌ Data export failed:', error);
  }
}

run();
