// src/db/pglite.js
import { PGlite } from '@electric-sql/pglite'

// Initialize with persistent storage (uses IndexedDB under the hood)
const db = new PGlite('patient-db')

// Create patient table if it doesn't exist
await db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL
  );
`)

export default db
