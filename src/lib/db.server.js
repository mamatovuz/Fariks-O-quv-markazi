import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

// SQLite is stored on the Railway persistent volume. Mount the volume at /data
// and set DATA_DIR=/data (or point SQLITE_DB_PATH straight at the file).
const dataDir = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const dbPath = process.env.SQLITE_DB_PATH || path.join(dataDir, "fariks.db");

let db;

function getDb() {
  if (db) return db;

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");

  db.exec(`
    CREATE TABLE IF NOT EXISTS site_content (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      auth_username TEXT NOT NULL,
      auth_password_hash TEXT NOT NULL,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS uploads (
      filename TEXT PRIMARY KEY,
      content_type TEXT,
      data BLOB NOT NULL,
      size INTEGER,
      created_at TEXT,
      updated_at TEXT
    );
  `);

  return db;
}

export { getDb, dbPath };
