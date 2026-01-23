import { pool } from './db';
import { readFileSync } from 'fs';
import { join } from 'path';

async function setup() {
  try {
    const sqlPath = join(process.cwd(), '../demo.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log('Running setup...');
    await pool.query(sql);
    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

setup();
