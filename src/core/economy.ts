import type { Currency, LedgerEntry } from './types';

export const ROUND_BASE = 10;
export const PER_FIRST_TRY = 1;
export const PERFECT_BONUS = 5;
export const WELCOME_BACK_BONUS = 5;

export interface PayoutLine {
  label: string;
  amount: number;
}

export function roundPayout(correctFirstTry: number, total: number, firstRoundOfSubjectToday: boolean): PayoutLine[] {
  const lines: PayoutLine[] = [{ label: 'Round finished', amount: ROUND_BASE }];
  if (correctFirstTry > 0) lines.push({ label: `${correctFirstTry} right on the first try`, amount: correctFirstTry * PER_FIRST_TRY });
  if (total > 0 && correctFirstTry === total) lines.push({ label: 'Perfect round!', amount: PERFECT_BONUS });
  if (firstRoundOfSubjectToday) lines.push({ label: 'Welcome back bonus', amount: WELCOME_BACK_BONUS });
  return lines;
}

export function payoutTotal(lines: PayoutLine[]): number {
  return lines.reduce((s, l) => s + l.amount, 0);
}

export type Wallet = Record<Currency, number>;

export function emptyWallet(): Wallet {
  return { coins: 0, stars: 0, gems: 0, leaves: 0, pieces: 0, shards: 0 };
}

/** Wallet = sum of ledger entries. Duplicate entry ids (e.g. from sync) are counted once. */
export function balances(entries: LedgerEntry[]): Wallet {
  const w = emptyWallet();
  const seen = new Set<string>();
  for (const e of entries) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    w[e.currency] += e.amount;
  }
  return w;
}

export function canAfford(wallet: Wallet, price: Partial<Wallet>): boolean {
  return (Object.keys(price) as Currency[]).every((c) => wallet[c] >= (price[c] ?? 0));
}
