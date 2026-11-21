import { useSyncExternalStore } from 'react';
import { db } from './db';
import type { Kid, LedgerEntry, RoundLog, SkillProgress } from '../core/types';

export interface AppState {
  loaded: boolean;
  kids: Kid[];
  ledger: LedgerEntry[];
  skills: Record<string, Record<string, SkillProgress>>; // kidId → skillId → progress
  rounds: RoundLog[];
}

let state: AppState = { loaded: false, kids: [], ledger: [], skills: {}, rounds: [] };
const listeners = new Set<() => void>();

function set(next: Partial<AppState>) {
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

export async function loadAll() {
  const d = await db();
  const [kids, ledger, skillRows, rounds] = await Promise.all([
    d.getAll('kids'), d.getAll('ledger'), d.getAll('skills'), d.getAll('rounds'),
  ]);
  const skills: AppState['skills'] = {};
  for (const r of skillRows) (skills[r.kidId] ??= {})[r.skillId] = r;
  kids.sort((a, b) => a.createdAt - b.createdAt);
  set({ loaded: true, kids, ledger, skills, rounds });
}

export async function saveKid(kid: Kid) {
  await (await db()).put('kids', kid);
  const others = state.kids.filter((k) => k.id !== kid.id);
  set({ kids: [...others, kid].sort((a, b) => a.createdAt - b.createdAt) });
}

export async function addLedger(entries: LedgerEntry[]) {
  const d = await db();
  const tx = d.transaction('ledger', 'readwrite');
  await Promise.all([...entries.map((e) => tx.store.put(e)), tx.done]);
  set({ ledger: [...state.ledger, ...entries] });
}

export async function saveSkill(p: SkillProgress) {
  await (await db()).put('skills', p);
  set({ skills: { ...state.skills, [p.kidId]: { ...state.skills[p.kidId], [p.skillId]: p } } });
}

export async function addRound(r: RoundLog) {
  await (await db()).put('rounds', r);
  set({ rounds: [...state.rounds, r] });
}
