import { Database } from 'bun:sqlite';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/bun-sqlite';

const sqlite = new Database('./sqlite.db');
export const db = drizzle(sqlite, { schema });
