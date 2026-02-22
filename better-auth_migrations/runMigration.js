import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');

envLines.forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    const cleanKey = key.trim();
    const cleanValue = valueParts.join('=').split('#')[0].trim();
    if (!process.env[cleanKey]) {
      process.env[cleanKey] = cleanValue;
    }
  }
});

const client = new pg.Client(process.env.DATABASE_URL);

async function runMigration() {
  try {
    await client.connect();
    console.log('✓ Connected to database...');
    
    const sqlFile = fs.readFileSync(
      path.join(__dirname, '2026-01-26T00-00-00.000Z.sql'),
      'utf-8'
    );
    
    await client.query(sqlFile);
    console.log('✓ Migration completed successfully!');
    console.log('✓ Product table created with indexes');
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
