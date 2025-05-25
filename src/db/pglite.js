// src/db/pglite.js

import { PGlite } from '@electric-sql/pglite'

let db

/**
 * Initializes and provides a singleton PGlite database instance.
 * This function handles database setup and schema creation, ensuring
 * our patient data is persistent.
 *
 * @returns {Promise<PGlite>} The ready-to-use PGlite database instance.
 */
export async function getDb() {
  // If the database hasn't been set up yet, let's do it.
  if (!db) {
    db = new PGlite({
      // We're using IndexedDB for persistence. 'idb://patients' tells PGlite
      // to store our database files in an IndexedDB database named 'patients'
      // in the browser, making data survive refreshes and closures.
      dataDir: 'idb://patients',
    })

    await db.waitReady

    // Create our 'patients' table if it doesn't already exist.
    // This defines the structure for our core patient data.
    await db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        name TEXT,
        age INTEGER,
        gender TEXT,
        address TEXT
      );
    `)
  }
  return db
}
