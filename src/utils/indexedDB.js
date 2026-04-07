/**
 * Lightweight IndexedDB wrapper with a localStorage-like API.
 *
 * Every value is stored inside a single object-store ("keyval") within a
 * database called "AppStorage".  The three public helpers — getItem,
 * setItem, removeItem — all return Promises so they can be awaited.
 *
 * A synchronous `getItemSync` helper is intentionally omitted because
 * IndexedDB is asynchronous by design.  For initial state in React
 * components (like `useState(() => …)`), the contexts use a default first
 * and then hydrate from IndexedDB inside a `useEffect`.
 */

const DB_NAME = 'AppStorage';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';

/** Open (or create) the database and return a Promise<IDBDatabase>. */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieve a value by key.
 * Returns `null` when the key does not exist (matching localStorage behaviour).
 */
export async function getItem(key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () =>
        resolve(request.result !== undefined ? request.result : null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] getItem failed, falling back to null', err);
    return null;
  }
}

/**
 * Store a value under the given key.
 * Unlike localStorage, the value does NOT need to be a string — IndexedDB
 * can persist structured-cloneable objects natively.  However, we continue
 * to store plain strings / JSON strings so the migration is transparent.
 */
export async function setItem(key, value) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] setItem failed', err);
  }
}

/**
 * Delete a key from the store.
 */
export async function removeItem(key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] removeItem failed', err);
  }
}

/**
 * Clear all keys from the store (useful for logout / reset).
 */
export async function clear() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] clear failed', err);
  }
}
