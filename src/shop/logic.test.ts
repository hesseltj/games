import { describe, expect, it } from 'vitest';
import { dailyDealItemId, discounted, goalProgress, planPurchase, shortfall, starterInventory } from './logic';
import { BACKDROPS, ITEMS, ITEM_BY_ID, ROOMS } from './catalog';
import { balances, emptyWallet } from '../core/economy';
import { THEMES } from '../core/themes';
import type { Kid } from '../core/types';

const kid: Kid = {
  id: 'kid1', name: 'A', grade: 'K', gradeBySubject: {}, favoriteTheme: 'sports',
  avatar: { skin: '#fff', hairStyle: 0, hairColor: '#000', shirt: '#00f' }, createdAt: 0, updatedAt: 0,
};

describe('catalog', () => {
  it('has unique ids across items and backdrops', () => {
    const ids = [...ITEMS.map((i) => i.id), ...BACKDROPS.map((b) => b.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('has 10 items in every theme', () => {
    for (const t of THEMES) expect(ITEMS.filter((i) => i.theme === t.id), t.id).toHaveLength(10);
  });
  it('every item has something to draw', () => {
    for (const i of ITEMS) expect(i.emoji || i.creature || i.rug, i.id).toBeTruthy();
  });
  it('clothes have wear data and are not placeable', () => {
    for (const i of ITEMS.filter((i) => i.category === 'clothes')) {
      expect(i.wear, i.id).toBeTruthy();
      expect(i.layer, i.id).toBeUndefined();
    }
  });
  it('the trophy case costs two currencies', () => {
    expect(ITEM_BY_ID.sp_toy_trophy.price).toEqual({ coins: 300, pieces: 150 });
  });
  it('bedroom and yard are free; other rooms cost two currencies', () => {
    for (const r of ROOMS) {
      const n = Object.keys(r.price).length;
      expect(n, r.type).toBe(r.type === 'bedroom' || r.type === 'yard' ? 0 : 2);
    }
  });
});

describe('purchases', () => {
  const wallet = { ...emptyWallet(), coins: 100, pieces: 40 };

  it('creates negative ledger entries per currency', () => {
    const r = planPurchase('kid1', 'basic_chair', { coins: 20 }, wallet, [], 'inv1', 5);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.ledger).toEqual([expect.objectContaining({ currency: 'coins', amount: -20, refId: 'inv1' })]);
    expect(balances(r.ledger).coins).toBe(-20);
  });

  it('refuses when short on any currency of a mixed price', () => {
    const r = planPurchase('kid1', 'sp_toy_trophy', { coins: 300, pieces: 150 }, { ...wallet, coins: 999 }, [], 'x', 0);
    expect(r).toEqual({ ok: false, reason: 'cant-afford' });
  });

  it('clothes, pets and backdrops can only be owned once', () => {
    const inv = [{ id: 'a', kidId: 'kid1', itemId: 'sp_hat_cap', source: 'shop' as const, acquiredAt: 0, updatedAt: 0 }];
    expect(planPurchase('kid1', 'sp_hat_cap', { stars: 0 }, wallet, inv, 'b', 0)).toEqual({ ok: false, reason: 'already-owned' });
  });

  it('furniture can be bought twice', () => {
    const inv = [{ id: 'a', kidId: 'kid1', itemId: 'basic_chair', source: 'shop' as const, acquiredAt: 0, updatedAt: 0 }];
    expect(planPurchase('kid1', 'basic_chair', { coins: 20 }, wallet, inv, 'b', 0).ok).toBe(true);
  });

  it('shortfall lists only what is missing', () => {
    expect(shortfall({ ...emptyWallet(), coins: 250, pieces: 10 }, { coins: 300, pieces: 5 })).toEqual({ coins: 50 });
  });

  it('goal progress caps each currency at what is needed', () => {
    expect(goalProgress({ ...emptyWallet(), coins: 999 }, { coins: 300, pieces: 100 })).toBeCloseTo(0.75);
  });
});

describe('daily deal', () => {
  it('is stable for a kid and day, from their theme, and discounted', () => {
    const a = dailyDealItemId('kid1', 'dolls', '2026-11-21');
    expect(dailyDealItemId('kid1', 'dolls', '2026-11-21')).toBe(a);
    expect(ITEM_BY_ID[a].theme).toBe('dolls');
    expect(discounted({ coins: 100 })).toEqual({ coins: 70 });
  });
});

describe('starter set', () => {
  it('uses deterministic ids so devices never duplicate it', () => {
    const a = starterInventory(kid, 1).map((i) => i.id);
    const b = starterInventory(kid, 2).map((i) => i.id);
    expect(a).toEqual(b);
    expect(a).toContain('kid1:starter:sp_hat_cap');
  });
});
