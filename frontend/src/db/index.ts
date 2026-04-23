import initSqlJs from 'sql.js';
import sqlWasm from 'sql.js/dist/sql-wasm.wasm?url';
import { drizzle } from 'drizzle-orm/sql-js';
import type { SQLJsDatabase } from 'drizzle-orm/sql-js';
import * as schema from './schema';

type LocalDb = SQLJsDatabase<typeof schema>;
type SqlJsClient = InstanceType<Awaited<ReturnType<typeof initSqlJs>>['Database']>;

const IDB_NAME = 'alphabet-game';
const IDB_STORE = 'sqlite';
const IDB_KEY = 'db';

let _db: LocalDb | null = null;
let _client: SqlJsClient | null = null;

function openIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(IDB_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadBinary(SQL: Awaited<ReturnType<typeof initSqlJs>>): Promise<SqlJsClient> {
  const idb = await openIdb();
  const binary = await new Promise<Uint8Array | undefined>((resolve, reject) => {
    const tx = idb.transaction(IDB_STORE, 'readonly');
    const request = tx.objectStore(IDB_STORE).get(IDB_KEY);
    request.onsuccess = () => resolve(request.result as Uint8Array | undefined);
    request.onerror = () => reject(request.error);
  });
  idb.close();
  return binary ? new SQL.Database(binary) : new SQL.Database();
}

function initSchema(client: SqlJsClient) {
  client.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS game_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quiz_id INTEGER NOT NULL,
      current_question_id INTEGER,
      score INTEGER DEFAULT 0,
      started_at INTEGER,
      completed_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS game_session_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_session_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      is_answered INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER,
      updated_at INTEGER
    );
  `);
}

export async function persistDb(): Promise<void> {
  if (!_client) return;
  const binary = _client.export();
  const idb = await openIdb();
  await new Promise<void>((resolve, reject) => {
    const tx = idb.transaction(IDB_STORE, 'readwrite');
    const request = tx.objectStore(IDB_STORE).put(binary, IDB_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  idb.close();
}

export async function getDb(): Promise<LocalDb> {
  if (_db) return _db;

  const SQL = await initSqlJs({ locateFile: () => sqlWasm });
  _client = await loadBinary(SQL);
  initSchema(_client);
  _db = drizzle(_client, { schema });

  return _db;
}
