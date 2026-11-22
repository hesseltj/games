import { beforeEach, describe, expect, it } from 'vitest';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { resetDbForTests } from './db';
import { addLedger, getState, reloadAll, saveKid, saveSkill } from './store';
import { enqueueAll, pendingCount, syncOnce, type Remote, type SyncRecord } from './sync';
import { balances } from '../core/economy';
import type { Kid } from '../core/types';

/** In-memory stand-in for the Supabase table + push_records function. */
class FakeCloud implements Remote {
  rows = new Map<string, SyncRecord & { seq: number }>();
  seq = 0;
  async push(records: SyncRecord[]) {
    for (const r of records) {
      const key = `${r.collection}/${r.id}`;
      const cur = this.rows.get(key);
      if (!cur || cur.version <= r.version) this.rows.set(key, { ...structuredClone(r), seq: ++this.seq });
    }
  }
  async pull(cursor: number) {
    const all = [...this.rows.values()].filter((r) => r.seq > cursor).sort((a, b) => a.seq - b.seq);
    const page = all.slice(0, 2); // tiny pages to exercise paging
    return { records: page.map(({ seq: _s, ...r }) => structuredClone(r)), cursor: page.at(-1)?.seq ?? cursor, more: all.length > 2 };
  }
}

async function device() {
  // A fresh, empty IndexedDB = a brand-new tablet.
  globalThis.indexedDB = new IDBFactory();
  resetDbForTests();
  await reloadAll();
}

const kid = (id: string, name: string, updatedAt: number): Kid => ({
  id, name, grade: 'K', gradeBySubject: {}, favoriteTheme: 'animals',
  avatar: { skin: '#fff', hairStyle: 0, hairColor: '#000', shirt: '#00f' }, createdAt: 1, updatedAt,
});

describe('cloud sync', () => {
  let cloud: FakeCloud;
  beforeEach(() => { cloud = new FakeCloud(); });

  it('a new tablet gets everything from the cloud', async () => {
    await device();
    await saveKid(kid('k1', 'Ava', 10));
    await addLedger([{ id: 'l1', kidId: 'k1', currency: 'coins', amount: 25, reason: 'round', createdAt: 11 }]);
    await saveSkill({ kidId: 'k1', skillId: 'm.k.add5', step: 2, rightStreak: 0, missStreak: 0, recent: [true], days: ['d'], mastered: false, updatedAt: 12 });
    await syncOnce(cloud);
    expect(await pendingCount()).toBe(0);

    await device();
    expect(getState().kids).toHaveLength(0);
    await syncOnce(cloud, { full: true });
    expect(getState().kids.map((k) => k.name)).toEqual(['Ava']);
    expect(balances(getState().ledger).coins).toBe(25);
    expect(getState().skills.k1['m.k.add5'].step).toBe(2);
  });

  it('coins earned on two tablets offline both count', async () => {
    await device();
    await saveKid(kid('k1', 'Ava', 10));
    await addLedger([{ id: 'a', kidId: 'k1', currency: 'coins', amount: 20, reason: 'round', createdAt: 20 }]);
    await syncOnce(cloud);

    await device();
    await syncOnce(cloud, { full: true });
    await addLedger([{ id: 'b', kidId: 'k1', currency: 'coins', amount: 15, reason: 'round', createdAt: 30 }]);
    await syncOnce(cloud);
    expect(balances(getState().ledger).coins).toBe(35);
    expect(cloud.rows.size).toBe(3);
  });

  it('an older edit never overwrites a newer one', async () => {
    await device();
    await saveKid(kid('k1', 'New name', 100));
    await syncOnce(cloud);

    await device();
    await saveKid(kid('k1', 'Old name', 50));
    await syncOnce(cloud, { full: true });
    expect(cloud.rows.get('kids/k1')!.data).toMatchObject({ name: 'New name' });
    expect(getState().kids[0].name).toBe('New name');
  });

  it('first sign-in uploads data created before there was an account', async () => {
    await device();
    await saveKid(kid('k1', 'Ava', 10));
    await syncOnce(cloud);
    cloud = new FakeCloud(); // e.g. a different account
    await enqueueAll();
    expect(await pendingCount()).toBeGreaterThan(0);
    await syncOnce(cloud);
    expect(cloud.rows.has('kids/k1')).toBe(true);
  });
});
