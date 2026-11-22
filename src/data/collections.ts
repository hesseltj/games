import type { InventoryItem, Kid, LedgerEntry, Room, RoundLog, SkillProgress } from '../core/types';

export interface CollectionTypes {
  kids: Kid;
  ledger: LedgerEntry;
  skills: SkillProgress;
  rounds: RoundLog;
  inventory: InventoryItem;
  rooms: Room;
}
export type CollectionName = keyof CollectionTypes;
export const COLLECTIONS: CollectionName[] = ['kids', 'ledger', 'skills', 'rounds', 'inventory', 'rooms'];

/** Stable id used for syncing. */
export function recordId<C extends CollectionName>(c: C, v: CollectionTypes[C]): string {
  if (c === 'skills') {
    const s = v as SkillProgress;
    return `${s.kidId}|${s.skillId}`;
  }
  return (v as { id: string }).id;
}

/** Version timestamp used for last-write-wins. Ledger entries and round logs never change. */
export function recordVersion<C extends CollectionName>(c: C, v: CollectionTypes[C]): number {
  if (c === 'ledger' || c === 'rounds') return (v as LedgerEntry).createdAt;
  return (v as { updatedAt: number }).updatedAt ?? 0;
}
