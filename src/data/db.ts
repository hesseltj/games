import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Kid, LedgerEntry, RoundLog, SkillProgress } from '../core/types';

interface BrainyDB extends DBSchema {
  kids: { key: string; value: Kid };
  ledger: { key: string; value: LedgerEntry; indexes: { byKid: string } };
  skills: { key: [string, string]; value: SkillProgress; indexes: { byKid: string } };
  rounds: { key: string; value: RoundLog; indexes: { byKid: string } };
}

let dbPromise: Promise<IDBPDatabase<BrainyDB>> | null = null;

export function db() {
  if (!dbPromise) {
    dbPromise = openDB<BrainyDB>('brainy-town', 1, {
      upgrade(d) {
        d.createObjectStore('kids', { keyPath: 'id' });
        d.createObjectStore('ledger', { keyPath: 'id' }).createIndex('byKid', 'kidId');
        d.createObjectStore('skills', { keyPath: ['kidId', 'skillId'] }).createIndex('byKid', 'kidId');
        d.createObjectStore('rounds', { keyPath: 'id' }).createIndex('byKid', 'kidId');
      },
    });
    // Ask the browser not to evict our data when storage is low.
    navigator.storage?.persist?.().catch(() => {});
  }
  return dbPromise;
}
