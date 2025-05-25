// src/db/pglite.js
import { PGliteWorker } from '@electric-sql/pglite/worker'

let pgWorkerInstance = null
let initializationPromise = null

export async function getDb() {
  if (pgWorkerInstance) {
    return pgWorkerInstance
  }

  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = new Promise(async (resolve, reject) => {
    try {
      const worker = new PGliteWorker(
        new Worker(new URL('./pglite-worker.js', import.meta.url), {
          type: 'module',
          name: 'patient-db-worker',
        })
      )

      await worker.waitReady
      console.log('PGliteWorker connection established from main thread.')
      pgWorkerInstance = worker
      resolve(pgWorkerInstance)
    } catch (error) {
      console.error('Failed to initialize PGLiteWorker:', error)
      reject(error)
    } finally {
      initializationPromise = null
    }
  })

  return initializationPromise
}

// Helper function to retry operations that might fail due to leader changes
async function retryWithLeaderStabilization(
  operationFn,
  retries = 3,
  delayMs = 200
) {
  for (let i = 0; i < retries; i++) {
    try {
      return await operationFn()
    } catch (error) {
      if (
        error.message &&
        error.message.includes('Leader changed') &&
        i < retries - 1
      ) {
        console.warn(
          `Attempt ${
            i + 1
          } failed due to leader change. Retrying in ${delayMs}ms...`
        )
        await new Promise((res) => setTimeout(res, delayMs))
        delayMs *= 1.5 // Exponential backoff
      } else {
        throw error // Re-throw other errors or the last leader changed error
      }
    }
  }
}

export async function initSchema() {
  await retryWithLeaderStabilization(async () => {
    const db = await getDb()
    await db.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('Patients table schema checked/created.')
  })
}

