import { describe, expect, it } from 'vitest';
import { balances, canAfford, payoutTotal, roundPayout } from './economy';
import type { LedgerEntry } from './types';

describe('roundPayout', () => {
  it('pays base + first tries', () => {
    expect(payoutTotal(roundPayout(6, 10, false))).toBe(16);
  });
  it('adds perfect and welcome-back bonuses', () => {
    expect(payoutTotal(roundPayout(10, 10, true))).toBe(10 + 10 + 5 + 5);
  });
  it('a Pre-K perfect round pays the same bonuses as an older kid', () => {
    expect(payoutTotal(roundPayout(5, 5, false))).toBe(20);
  });
  it('never pays less than the base', () => {
    expect(payoutTotal(roundPayout(0, 10, false))).toBe(10);
  });
});

describe('balances', () => {
  const e = (id: string, currency: LedgerEntry['currency'], amount: number): LedgerEntry => ({ id, kidId: 'k', currency, amount, reason: 'test', createdAt: 0 });
  it('sums per currency', () => {
    const w = balances([e('1', 'coins', 20), e('2', 'coins', -5), e('3', 'stars', 7)]);
    expect(w.coins).toBe(15);
    expect(w.stars).toBe(7);
    expect(w.gems).toBe(0);
  });
  it('counts duplicate ids once (sync safety)', () => {
    expect(balances([e('1', 'coins', 20), e('1', 'coins', 20)]).coins).toBe(20);
  });
  it('canAfford checks every currency in a mixed price', () => {
    const w = balances([e('1', 'coins', 300), e('2', 'pieces', 100)]);
    expect(canAfford(w, { coins: 300, pieces: 150 })).toBe(false);
    expect(canAfford(w, { coins: 300, pieces: 100 })).toBe(true);
  });
});
