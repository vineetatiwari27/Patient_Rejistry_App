# 🩺 PGlite Patient Manager (aka Tab-Sync Superpowers)

A sleek little app to manage patient registrations—built with **React**, powered by **PGlite**, and sprinkled with just the right amount of Web Worker and BroadcastChannel wizardry.

It’s frontend-only. It’s SQL-native. It persists data. And yes, it talks across tabs.

---

## ✨ Features

- **Patient Registration**  
  Add patients with name, age, gender, and address.

- **SQL-based Data Queries**  
  Records are fetched and manipulated using raw SQL — no ORMs, no filters, just pure SQL love.

- **Patient Deletion**  
  Delete any patient record instantly — with a confirm prompt, because we're not monsters.

- **Data Persistence**  
  Thanks to `PGlite + IndexedDB`, your patient data survives page refreshes like a champ.

- **Multi-Tab Sync**  
  Add a patient in one tab, see it show up live in another. Works like magic. (Technically BroadcastChannel + Web Worker coordination.)

- **Dark Mode Toggle**  
  Because staring at white screens at 2AM is so 2022.

---

## 🛠️ Tech Stack

- **React** – UI foundation
- **PGlite** – Browser-based PostgreSQL
- **PGliteWorker** – Ensures safe, single-leader DB access across tabs
- **BroadcastChannel API** – Tab-to-tab communication
- **Vite** – Dev server and build tool

---

## 🚀 Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/pglite-patient-manager.git
   cd pglite-patient-manager
2. **Install the dependencies** 
   npm install
   or
   yarn
3. **Start development server**
   npm run dev
   or
   yarn dev.
   The app will be available at your local host


# How It Works (Under the Hood)
Here’s how each requirement was tackled:

## Patient Registration:
A React form pushes inserts into the PGlite DB using parameterized SQL.

## Query with Raw SQL:
We use plain SQL queries (SELECT, INSERT, DELETE) via db.query().

## Persist Across Refreshes:
Set dataDir: 'idb://patients' so PGlite stores everything in IndexedDB.

## Sync Across Tabs:

One tab becomes the DB leader via PGliteWorker.
All writes send a BroadcastChannel update event.
All tabs listen for this event and re-query the database to sync the UI.
The current tab also updates immediately (since it doesn’t hear its own broadcast).


# Challenges Faced
Building this wasn’t just clicking around in React. A few things tripped me up:

1. Figuring out how PGlite actually works
PGlite is "single-user only" — trying to open multiple connections corrupts the DB. The solution? Use their PGliteWorker, which serializes all queries through a single leader. Clean and safe.

2. Transient “Leader changed” errors
Startup race conditions caused errors during dev (especially with React Strict Mode). Solved using a retry-with-backoff mechanism in initSchema.

3. BroadcastChannel errors
During hot reload, BroadcastChannel would close and throw InvalidStateError. Refactored to create the channel outside React’s lifecycle, keeping it stable.

4. UI not updating in the tab that made the change
Turns out, a tab doesn’t hear its own BroadcastChannel message. Added a local fetchPatients() call after each insert/delete to ensure immediate UI sync.

5. 💡 IndexedDB persistence oversight
Initially, data wasn’t persisting across reloads. Realized I needed to explicitly set dataDir: 'idb://patients'. Fixed.

# Feedback
Have thoughts, suggestions, or bugs to report? Hit me up or open an issue!

## Thanks for reading — and yes, this README is longer than the code. 😅

