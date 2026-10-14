import { Injectable } from '@angular/core';

const DB_NAME = 'pokemean';
const STORE = 'kv';

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

/**
 * Key-value storage backed by IndexedDB. Everything is loaded into memory once at
 * startup (`load()`), so reads are synchronous; writes go to IndexedDB and return a
 * promise that settles when they are durable.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private db?: IDBDatabase;
  private readonly cache = new Map<string, unknown>();

  /** Opens the database and reads it into memory. Falls back to memory-only if unavailable. */
  async load(): Promise<void> {
    try {
      const opening = indexedDB.open(DB_NAME, 1);
      opening.onupgradeneeded = () => opening.result.createObjectStore(STORE);
      this.db = await promisify(opening);

      const store = this.db.transaction(STORE).objectStore(STORE);
      const [keys, values] = await Promise.all([promisify(store.getAllKeys()), promisify(store.getAll())]);
      keys.forEach((key, i) => this.cache.set(String(key), values[i]));
    } catch (err) {
      console.error('IndexedDB is unavailable; progress will not be saved', err);
      this.db = undefined;
    }
  }

  /** A copy of the stored value, so callers can mutate it freely. */
  get<T>(key: string): T | undefined {
    return this.cache.has(key) ? structuredClone(this.cache.get(key) as T) : undefined;
  }

  /** Rejects if the write fails (e.g. the storage quota is exceeded). */
  async set(key: string, value: unknown): Promise<void> {
    const copy = structuredClone(value);
    await this.write((store) => store.put(copy, key));
    this.cache.set(key, copy);
  }

  async remove(key: string): Promise<void> {
    await this.write((store) => store.delete(key));
    this.cache.delete(key);
  }

  /** Keys that start with `prefix`. */
  keys(prefix: string): string[] {
    return [...this.cache.keys()].filter((key) => key.startsWith(prefix));
  }

  private async write(action: (store: IDBObjectStore) => IDBRequest): Promise<void> {
    if (!this.db) return;
    const tx = this.db.transaction(STORE, 'readwrite');
    action(tx.objectStore(STORE));
    await transactionDone(tx);
  }
}
