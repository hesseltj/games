import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { InventoryItem, Kid, LedgerEntry, Room, RoundLog, SkillProgress } from '../core/types';
import type { CollectionName } from './collections';

export interface OutboxEntry {
  key: string; // `${collection}/${id}`
  collection: CollectionName;
  id: string;
}

interface BrainyDB extends DBSchema {
  kids: { key: string; value: Kid };
  ledger: { key: string; value: LedgerEntry; indexes: { byKid: string } };
  skills: { key: [string, string]; value: SkillProgress; indexes: { byKid: string } };
  rounds: { key: string; value: RoundLog; indexes: { byKid: string } };
  inventory: { key: string; value: InventoryItem; indexes: { byKid: string } };
  rooms: { key: string; value: Room; indexes: { byKid: string } };
  outbox: { key: string; value: OutboxEntry };
  meta: { key: string; value: unknown };
}

export type DB = IDBPDatabase<BrainyDB>;

let dbPromise: Promise<DB> | null = null;

export function db(): Promise<DB> {
  if (!dbPromise) {
    dbPromise = openDB<BrainyDB>('brainy-town', 2, {
      upgrade(d, oldVersion) {
        if (oldVersion < 1) {
          d.createObjectStore('kids', { keyPath: 'id' });
          d.createObjectStore('ledger', { keyPath: 'id' }).createIndex('byKid', 'kidId');
          d.createObjectStore('skills', { keyPath: ['kidId', 'skillId'] }).createIndex('byKid', 'kidId');
          d.createObjectStore('rounds', { keyPath: 'id' }).createIndex('byKid', 'kidId');
        }
        if (oldVersion < 2) {
          d.createObjectStore('inventory', { keyPath: 'id' }).createIndex('byKid', 'kidId');
          d.createObjectStore('rooms', { keyPath: 'id' }).createIndex('byKid', 'kidId');
          d.createObjectStore('outbox', { keyPath: 'key' });
          d.createObjectStore('meta');
        }
      },
    });
    // Ask the browser not to evict our data when storage is low.
    globalThis.navigator?.storage?.persist?.().catch(() => {});
  }
  return dbPromise;
}

/** Tests only: forget the open connection. */
export function resetDbForTests() {
  dbPromise = null;
}
