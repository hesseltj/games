import type { Currency, InventoryItem, Kid, LedgerEntry, ThemeId } from '../core/types';
import { canAfford, type Wallet } from '../core/economy';
import { BACKDROP_BY_ID, FREE_BACKDROPS, ITEMS, ITEM_BY_ID, STARTER_ITEMS, STARTER_THEME_ITEM, type Price } from './catalog';

export const DEAL_DISCOUNT = 0.3;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** One item from the kid's favorite theme, 30% off, the same all day on every device. */
export function dailyDealItemId(kidId: string, theme: ThemeId, day: string): string {
  const pool = ITEMS.filter((i) => i.theme === theme && Object.keys(i.price).length > 0);
  return pool[hash(`${kidId}|${day}`) % pool.length].id;
}

export function discounted(price: Price): Price {
  const out: Price = {};
  for (const [c, v] of Object.entries(price) as [Currency, number][]) out[c] = Math.max(1, Math.round(v * (1 - DEAL_DISCOUNT)));
  return out;
}

export function priceOf(itemId: string): Price {
  return ITEM_BY_ID[itemId]?.price ?? BACKDROP_BY_ID[itemId]?.price ?? {};
}

/** What the kid still needs for a price: only the currencies they're short on. */
export function shortfall(wallet: Wallet, price: Price): Price {
  const out: Price = {};
  for (const [c, v] of Object.entries(price) as [Currency, number][]) if (wallet[c] < v) out[c] = v - wallet[c];
  return out;
}

/** 0..1 progress toward a price, counting each currency only up to what's needed. */
export function goalProgress(wallet: Wallet, price: Price): number {
  let need = 0, have = 0;
  for (const [c, v] of Object.entries(price) as [Currency, number][]) { need += v; have += Math.min(v, Math.max(0, wallet[c])); }
  return need === 0 ? 1 : have / need;
}

export function ownsUnique(inventory: InventoryItem[], kidId: string, itemId: string): boolean {
  return inventory.some((i) => i.kidId === kidId && i.itemId === itemId);
}

export function isUnique(itemId: string): boolean {
  // Backdrops and clothes/pets are owned once; furniture, toys and outdoor items can be bought again.
  return !!BACKDROP_BY_ID[itemId] || !!ITEM_BY_ID[itemId]?.unique;
}

export type BuyResult =
  | { ok: true; inventory: InventoryItem; ledger: LedgerEntry[] }
  | { ok: false; reason: 'cant-afford' | 'already-owned' | 'unknown-item' };

export function planPurchase(
  kidId: string, itemId: string, price: Price, wallet: Wallet, inventory: InventoryItem[], newId: string, now: number,
): BuyResult {
  if (!ITEM_BY_ID[itemId] && !BACKDROP_BY_ID[itemId]) return { ok: false, reason: 'unknown-item' };
  if (isUnique(itemId) && ownsUnique(inventory, kidId, itemId)) return { ok: false, reason: 'already-owned' };
  if (!canAfford(wallet, price)) return { ok: false, reason: 'cant-afford' };
  const ledger: LedgerEntry[] = (Object.entries(price) as [Currency, number][])
    .filter(([, v]) => v > 0)
    .map(([currency, v]) => ({ id: `${newId}:${currency}`, kidId, currency, amount: -v, reason: `buy:${itemId}`, refId: newId, createdAt: now }));
  return { ok: true, inventory: { id: newId, kidId, itemId, source: 'shop', acquiredAt: now, updatedAt: now }, ledger };
}

/** Starter items with ids derived from the kid id, so two devices granting them never duplicate. */
export function starterInventory(kid: Kid, now: number): InventoryItem[] {
  const ids = [...STARTER_ITEMS, STARTER_THEME_ITEM[kid.favoriteTheme], ...FREE_BACKDROPS];
  return ids.map((itemId) => ({ id: `${kid.id}:starter:${itemId}`, kidId: kid.id, itemId, source: 'starter', acquiredAt: now, updatedAt: now }));
}
