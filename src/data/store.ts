import { useSyncExternalStore } from 'react';
import { db } from './db';
import { COLLECTIONS, recordId, type CollectionName, type CollectionTypes } from './collections';
import type { InventoryItem, Kid, LedgerEntry, Room, RoundLog, SkillProgress } from '../core/types';

export interface SyncStatus {
  configured: boolean;
  email: string | null;
  state: 'off' | 'idle' | 'syncing' | 'error' | 'offline';
  lastSyncedAt: number | null;
  error?: string;
}

export interface AppState {
  loaded: boolean;
  kids: Kid[];
  ledger: LedgerEntry[];
  skills: Record<string, Record<string, SkillProgress>>; // kidId → skillId → progress
  rounds: RoundLog[];
  inventory: InventoryItem[];
  rooms: Room[];
  sync: SyncStatus;
}

let state: AppState = {
  loaded: false, kids: [], ledger: [], skills: {}, rounds: [], inventory: [], rooms: [],
  sync: { configured: false, email: null, state: 'off', lastSyncedAt: null },
};
const listeners = new Set<() => void>();

export function setState(next: Partial<AppState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export function useStore<T>(select: (s: AppState) => T): T {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => select(state),
  );
}

export function getState() {
  return state;
}

/** Called after any local change; the sync module plugs in here. */
let onLocalChange: () => void = () => {};
export function setLocalChangeHandler(fn: () => void) {
  onLocalChange = fn;
}

let loading: Promise<void> | null = null;
/** Load everything from the device once; later calls share the same load. */
export function loadAll(): Promise<void> {
  loading ??= doLoad();
  return loading;
}

/** Tests only. */
export function reloadAll(): Promise<void> {
  loading = doLoad();
  return loading;
}

async function doLoad() {
  const d = await db();
  const [kids, ledger, skillRows, rounds, inventory, rooms] = await Promise.all([
    d.getAll('kids'), d.getAll('ledger'), d.getAll('skills'), d.getAll('rounds'), d.getAll('inventory'), d.getAll('rooms'),
  ]);
  const skills: AppState['skills'] = {};
  for (const r of skillRows) (skills[r.kidId] ??= {})[r.skillId] = r;
  kids.sort((a, b) => a.createdAt - b.createdAt);
  setState({ loaded: true, kids, ledger, skills, rounds, inventory, rooms });
}

/**
 * Write records locally. `fromSync` writes (records pulled from the cloud) are not queued for upload.
 */
export async function putRecords<C extends CollectionName>(collection: C, values: CollectionTypes[C][], fromSync = false) {
  if (values.length === 0) return;
  const d = await db();
  const tx = d.transaction([collection, 'outbox'], 'readwrite');
  const store = tx.objectStore(collection);
  const outbox = tx.objectStore('outbox');
  const ops: Promise<unknown>[] = [];
  for (const v of values) {
    ops.push(store.put(v as never));
    if (!fromSync) {
      const id = recordId(collection, v);
      ops.push(outbox.put({ key: `${collection}/${id}`, collection, id }));
    }
  }
  await Promise.all([...ops, tx.done]);
  applyToState(collection, values);
  if (!fromSync) onLocalChange();
}

function upsertBy<T>(list: T[], values: T[], key: (v: T) => string): T[] {
  const map = new Map(list.map((v) => [key(v), v]));
  for (const v of values) map.set(key(v), v);
  return [...map.values()];
}

function applyToState<C extends CollectionName>(collection: C, values: CollectionTypes[C][]) {
  const s = state;
  switch (collection) {
    case 'kids':
      setState({ kids: upsertBy(s.kids, values as Kid[], (k) => k.id).sort((a, b) => a.createdAt - b.createdAt) });
      break;
    case 'ledger':
      setState({ ledger: upsertBy(s.ledger, values as LedgerEntry[], (e) => e.id) });
      break;
    case 'rounds':
      setState({ rounds: upsertBy(s.rounds, values as RoundLog[], (r) => r.id) });
      break;
    case 'inventory':
      setState({ inventory: upsertBy(s.inventory, values as InventoryItem[], (r) => r.id) });
      break;
    case 'rooms':
      setState({ rooms: upsertBy(s.rooms, values as Room[], (r) => r.id) });
      break;
    case 'skills': {
      const skills = { ...s.skills };
      for (const p of values as SkillProgress[]) skills[p.kidId] = { ...skills[p.kidId], [p.skillId]: p };
      setState({ skills });
      break;
    }
  }
}

// Convenience wrappers used by the app.
export const saveKid = (kid: Kid) => putRecords('kids', [kid]);
export const addLedger = (entries: LedgerEntry[]) => putRecords('ledger', entries);
export const saveSkill = (p: SkillProgress) => putRecords('skills', [p]);
export const addRound = (r: RoundLog) => putRecords('rounds', [r]);
export const addInventory = (items: InventoryItem[]) => putRecords('inventory', items);
export const saveRoom = (room: Room) => putRecords('rooms', [room]);

export { COLLECTIONS };
