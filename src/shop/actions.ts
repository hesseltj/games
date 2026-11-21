import { addInventory, addLedger, getState, putRecords, saveKid, saveRoom } from '../data/store';
import { balances, canAfford } from '../core/economy';
import { dayKey, uid } from '../core/random';
import type { Equipped, Kid, Room } from '../core/types';
import { ROOM_BY_TYPE, type RoomType } from './catalog';
import { dailyDealItemId, discounted, planPurchase, priceOf, starterInventory } from './logic';

export function walletFor(kidId: string) {
  return balances(getState().ledger.filter((e) => e.kidId === kidId));
}

export function inventoryFor(kidId: string) {
  return getState().inventory.filter((i) => i.kidId === kidId);
}

export function todaysDeal(kid: Kid) {
  const itemId = dailyDealItemId(kid.id, kid.favoriteTheme, dayKey());
  return { itemId, price: discounted(priceOf(itemId)) };
}

export function currentPrice(kid: Kid, itemId: string) {
  const deal = todaysDeal(kid);
  return deal.itemId === itemId ? deal.price : priceOf(itemId);
}

export async function buy(kid: Kid, itemId: string) {
  const now = Date.now();
  const plan = planPurchase(kid.id, itemId, currentPrice(kid, itemId), walletFor(kid.id), inventoryFor(kid.id), uid(), now);
  if (!plan.ok) return plan;
  // Inventory first: if the app closes in between, the kid keeps the item rather than losing currency.
  await addInventory([plan.inventory]);
  await addLedger(plan.ledger);
  if (kid.goalItemId === itemId) await saveKid({ ...kid, goalItemId: null, updatedAt: now });
  return plan;
}

export function roomId(kidId: string, type: RoomType) {
  return `${kidId}:${type}`;
}

export function defaultRoom(kidId: string, type: RoomType): Room {
  const outdoor = ROOM_BY_TYPE[type].outdoor;
  return {
    id: roomId(kidId, type), kidId, type,
    wallpaper: outdoor ? 'sky' : type === 'bedroom' ? 'wall_sky' : 'wall_cream',
    floor: outdoor ? 'grass' : 'floor_wood',
    placements: [], updatedAt: 0,
  };
}

export function isRoomUnlocked(kidId: string, type: RoomType) {
  return Object.keys(ROOM_BY_TYPE[type].price).length === 0 || getState().rooms.some((r) => r.id === roomId(kidId, type));
}

export async function unlockRoom(kid: Kid, type: RoomType) {
  const price = ROOM_BY_TYPE[type].price;
  if (isRoomUnlocked(kid.id, type)) return { ok: false as const, reason: 'already-owned' as const };
  if (!canAfford(walletFor(kid.id), price)) return { ok: false as const, reason: 'cant-afford' as const };
  const now = Date.now();
  await saveRoom({ ...defaultRoom(kid.id, type), updatedAt: now });
  await addLedger(Object.entries(price).map(([currency, v]) => ({
    id: `${roomId(kid.id, type)}:${currency}`, kidId: kid.id, currency: currency as never, amount: -(v as number), reason: `room:${type}`, refId: roomId(kid.id, type), createdAt: now,
  })));
  return { ok: true as const };
}

/** Give a kid their starter set and a furnished bedroom and yard (once, on any device). */
export async function ensureStarter(kid: Kid) {
  if (kid.starterGranted) return;
  const now = Date.now();
  const items = starterInventory(kid, now);
  const have = new Set(getState().inventory.map((i) => i.id));
  await addInventory(items.filter((i) => !have.has(i.id)));
  const inv = (itemId: string) => `${kid.id}:starter:${itemId}`;
  const rooms = getState().rooms;
  const newRooms: Room[] = [];
  if (!rooms.some((r) => r.id === roomId(kid.id, 'bedroom'))) {
    newRooms.push({
      ...defaultRoom(kid.id, 'bedroom'), updatedAt: now,
      placements: [
        { inv: inv('basic_rug_blue'), x: 50, y: 92 },
        { inv: inv('basic_bed'), x: 28, y: 88 },
        { inv: inv('basic_lamp'), x: 78, y: 86 },
      ],
    });
  }
  if (!rooms.some((r) => r.id === roomId(kid.id, 'yard'))) {
    newRooms.push({ ...defaultRoom(kid.id, 'yard'), updatedAt: now, placements: [{ inv: inv('basic_tree'), x: 80, y: 82 }] });
  }
  if (newRooms.length) await putRecords('rooms', newRooms);
  await saveKid({
    ...kid, starterGranted: true, updatedAt: now,
    equipped: { outfit: null, ...kid.equipped, hat: kid.equipped?.hat ?? null },
  });
}

export async function equip(kid: Kid, patch: Partial<Equipped>) {
  await saveKid({ ...kid, equipped: { ...kid.equipped, ...patch }, updatedAt: Date.now() });
}

export async function setGoal(kid: Kid, itemId: string | null) {
  await saveKid({ ...kid, goalItemId: itemId, updatedAt: Date.now() });
}
