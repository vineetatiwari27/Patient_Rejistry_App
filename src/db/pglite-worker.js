// src/db/pglite-worker.js
import { PGlite } from '@electric-sql/pglite'
import { worker } from '@electric-sql/pglite/worker'

// This function runs inside the Web Worker.
// It's responsible for creating and managing the single PGlite instance.
worker({
  async init(options) {
    const pg = new PGlite('idb://patients') // Re-added dataDir here!
    console.log('PGlite worker initialized and ready.')
    return pg
  },
})
