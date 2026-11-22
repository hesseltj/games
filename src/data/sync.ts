import { db } from './db';
import { COLLECTIONS, recordVersion, type CollectionName, type CollectionTypes } from './collections';
import { putRecords } from './store';

export interface SyncRecord {
  collection: CollectionName;
  id: string;
  data: unknown;
  version: number;
}

export interface PullPage {
  records: SyncRecord[];
  cursor: number;
  more: boolean;
}

export interface Remote {
  push(records: SyncRecord[]): Promise<void>;
  /** Records changed after `cursor` (0 = everything). */
  pull(cursor: number): Promise<PullPage>;
}

const PUSH_BATCH = 200;

async function getLocal(collection: CollectionName, id: string): Promise<unknown | undefined> {
  const d = await db();
  if (collection === 'skills') {
    const [kidId, skillId] = id.split('|');
    return d.get('skills', [kidId, skillId]);
  }
  return d.get(collection as Exclude<CollectionName, 'skills'>, id);
}

/** Queue every local record for upload (first sign-in on a device). */
export async function enqueueAll() {
  const d = await db();
  for (const c of COLLECTIONS) {
    const rows = (await d.getAll(c)) as CollectionTypes[typeof c][];
    if (rows.length) await putRecords(c, rows);
  }
}

export async function pendingCount(): Promise<number> {
  return (await db()).count('outbox');
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  return (await (await db()).get('meta', key)) as T | undefined;
}

export async function setMeta(key: string, value: unknown) {
  await (await db()).put('meta', value, key);
}

async function push(remote: Remote): Promise<number> {
  const d = await db();
  const entries = await d.getAll('outbox');
  let pushed = 0;
  for (let i = 0; i < entries.length; i += PUSH_BATCH) {
    const batch = entries.slice(i, i + PUSH_BATCH);
    const records: SyncRecord[] = [];
    for (const e of batch) {
      const data = await getLocal(e.collection, e.id);
      if (data === undefined) continue;
      records.push({ collection: e.collection, id: e.id, data, version: recordVersion(e.collection, data as never) });
    }
    if (records.length) await remote.push(records);
    // Clear the outbox, but keep entries whose record changed while we were uploading.
    const done: string[] = [];
    for (const e of batch) {
      const r = records.find((x) => x.collection === e.collection && x.id === e.id);
      if (!r) { done.push(e.key); continue; } // record no longer exists locally
      const now = await getLocal(r.collection, r.id);
      if (now !== undefined && recordVersion(r.collection, now as never) === r.version) done.push(e.key);
    }
    const tx = d.transaction('outbox', 'readwrite');
    await Promise.all([...done.map((k) => tx.store.delete(k)), tx.done]);
    pushed += records.length;
  }
  return pushed;
}

async function pull(remote: Remote, full: boolean): Promise<number> {
  let cursor = full ? 0 : ((await getMeta<number>('pullCursor')) ?? 0);
  let applied = 0;
  for (let guard = 0; guard < 1000; guard++) {
    const page = await remote.pull(cursor);
    const byCollection = new Map<CollectionName, unknown[]>();
    for (const r of page.records) {
      if (!COLLECTIONS.includes(r.collection)) continue;
      const local = await getLocal(r.collection, r.id);
      // Newest wins. Ties go to the cloud copy (same content in practice).
      if (local === undefined || r.version >= recordVersion(r.collection, local as never)) {
        if (!byCollection.has(r.collection)) byCollection.set(r.collection, []);
        byCollection.get(r.collection)!.push(r.data);
      }
    }
    for (const [c, values] of byCollection) {
      await putRecords(c, values as never[], true);
      applied += values.length;
    }
    cursor = Math.max(cursor, page.cursor);
    await setMeta('pullCursor', cursor);
    if (!page.more) break;
  }
  return applied;
}

/** One full sync: upload local changes, then download changes from other devices. */
export async function syncOnce(remote: Remote, opts: { full?: boolean } = {}) {
  const pushed = await push(remote);
  const pulled = await pull(remote, !!opts.full);
  return { pushed, pulled };
}
