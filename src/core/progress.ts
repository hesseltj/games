// Phase 4 progression: levels, streaks, daily quests, badges, creature evolution and the
// rewards they unlock. Everything is derived from round logs and other synced records, and
// every reward has an id built from the kid id, so two tablets can never grant it twice.

import type { InventoryItem, Kid, LedgerEntry, Room, RoundLog, SkillProgress, Subject, Currency, ThemeId } from './types';
import { dayKey } from './random';
import { SKILLS, gradeIndex } from './skills';
import { GAMES } from './games';
import { SUBJECTS } from './subjects';
import { GRADE_LABEL } from './types';
import { ITEMS, ITEM_BY_ID, type CatalogItem } from '../shop/catalog';

// ---------- XP and levels ----------

/** Same XP per round at every grade, so younger siblings level up just as fast. */
export const XP_PER_ROUND = 10;
export const XP_PERFECT_BONUS = 5;

export function roundXp(r: RoundLog): number {
  return XP_PER_ROUND + (r.total > 0 && r.correctFirstTry === r.total ? XP_PERFECT_BONUS : 0);
}

export function totalXp(rounds: RoundLog[]): number {
  return rounds.reduce((s, r) => s + roundXp(r), 0);
}

/** XP needed to reach level L: 0, 50, 150, 300, 500, … (a little more each level). */
export function xpForLevel(level: number): number {
  return (50 * (level - 1) * level) / 2;
}

export function levelInfo(xp: number) {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  const start = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return { level, xp, into: xp - start, needed: next - start, progress: (xp - start) / (next - start) };
}

// ---------- Streaks ----------

export const STREAK_MILESTONES = [3, 7, 14, 30];

function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n, 12).getTime());
}

/**
 * Consecutive play days. Missing a single day doesn't break the streak if no other day was
 * missed in the 7 days before it (a weekly "freeze"). Not having played yet today never breaks it.
 */
export function streakInfo(days: Set<string>, today: string) {
  const playedToday = days.has(today);
  let cur = playedToday ? today : addDays(today, -1);
  let current = 0;
  let lastFreeze: string | null = null;
  for (let guard = 0; guard < 4000; guard++) {
    if (days.has(cur)) { current++; cur = addDays(cur, -1); continue; }
    // A missed day: use the freeze if the previous one was more than a week ago and play resumes before it.
    const freezeOk = current > 0 && (!lastFreeze || daysBetween(cur, lastFreeze) >= 7) && days.has(addDays(cur, -1));
    if (!freezeOk) break;
    lastFreeze = cur;
    cur = addDays(cur, -1);
  }
  return { current, playedToday, best: bestStreak(days) };
}

function daysBetween(a: string, b: string) {
  const t = (s: string) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round(Math.abs(t(a) - t(b)) / 86400000);
}

export function bestStreak(days: Set<string>): number {
  // Longest run, applying the same freeze rule, by checking the streak "as of" each played day.
  let best = 0;
  for (const d of days) best = Math.max(best, streakAt(days, d));
  return best;
}

function streakAt(days: Set<string>, day: string): number {
  let cur = day, n = 0, lastFreeze: string | null = null;
  for (let guard = 0; guard < 4000; guard++) {
    if (days.has(cur)) { n++; cur = addDays(cur, -1); continue; }
    const ok = n > 0 && (!lastFreeze || daysBetween(cur, lastFreeze) >= 7) && days.has(addDays(cur, -1));
    if (!ok) break;
    lastFreeze = cur;
    cur = addDays(cur, -1);
  }
  return n;
}

export function playedDays(rounds: RoundLog[]): Set<string> {
  return new Set(rounds.map((r) => dayKey(r.createdAt)));
}

// ---------- Daily quest ----------

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export interface Quest {
  id: string;
  text: string;
  say: string;
  goal: number;
  progress: number;
  done: boolean;
}

type QuestKind = 'twoSubjects' | 'threeRounds' | 'firstTries' | 'perfect' | 'subject';
const QUEST_KINDS: QuestKind[] = ['twoSubjects', 'threeRounds', 'firstTries', 'perfect', 'subject'];

/** One quest per kid per day, the same on every device. */
export function dailyQuest(kidId: string, day: string, roundsToday: RoundLog[]): Quest {
  const kind = QUEST_KINDS[hash(`${kidId}|quest|${day}`) % QUEST_KINDS.length];
  const subjects = new Set(roundsToday.map((r) => r.subject));
  switch (kind) {
    case 'twoSubjects':
      return q(kind, 'Play 2 different subjects', 'Today’s quest: play two different subjects!', 2, subjects.size);
    case 'threeRounds':
      return q(kind, 'Finish 3 rounds', 'Today’s quest: finish three rounds!', 3, roundsToday.length);
    case 'firstTries': {
      const n = roundsToday.reduce((s, r) => s + r.correctFirstTry, 0);
      return q(kind, 'Get 15 right on the first try', 'Today’s quest: get fifteen answers right on the first try!', 15, n);
    }
    case 'perfect': {
      const n = roundsToday.filter((r) => r.total > 0 && r.correctFirstTry === r.total).length;
      return q(kind, 'Get a perfect round', 'Today’s quest: get a perfect round, with every answer right the first time!', 1, n);
    }
    case 'subject': {
      const s = SUBJECTS[hash(`${kidId}|subj|${day}`) % SUBJECTS.length];
      const n = roundsToday.filter((r) => r.subject === s.id).length;
      return q(`subject-${s.id}`, `Play a round of ${s.name} ${s.emoji}`, `Today’s quest: play a round of ${s.name}!`, 1, n);
    }
  }
  function q(id: string, text: string, say: string, goal: number, progress: number): Quest {
    return { id, text, say, goal, progress: Math.min(goal, progress), done: progress >= goal };
  }
}

// ---------- Creatures ----------

export const EVOLVE_AT = [15, 40];

export function creatureStage(roundsAsBuddy: number): { stage: 1 | 2 | 3; toNext: number | null; progress: number } {
  if (roundsAsBuddy >= EVOLVE_AT[1]) return { stage: 3, toNext: null, progress: 1 };
  if (roundsAsBuddy >= EVOLVE_AT[0]) {
    return { stage: 2, toNext: EVOLVE_AT[1] - roundsAsBuddy, progress: (roundsAsBuddy - EVOLVE_AT[0]) / (EVOLVE_AT[1] - EVOLVE_AT[0]) };
  }
  return { stage: 1, toNext: EVOLVE_AT[0] - roundsAsBuddy, progress: roundsAsBuddy / EVOLVE_AT[0] };
}

export function roundsWithBuddy(rounds: RoundLog[], invId: string): number {
  return rounds.filter((r) => r.buddy === invId).length;
}

// ---------- Badges ----------

export interface Badge {
  id: string;
  emoji: string;
  name: string;
  how: string;
  earned: boolean;
}

export interface KidSnapshot {
  kid: Kid;
  rounds: RoundLog[];
  skills: Record<string, SkillProgress>;
  inventory: InventoryItem[];
  rooms: Room[];
}

export function badges(s: KidSnapshot, today = dayKey()): Badge[] {
  const n = s.rounds.length;
  const perfect = s.rounds.filter((r) => r.total > 0 && r.correctFirstTry === r.total).length;
  const subjects = new Set(s.rounds.map((r) => r.subject));
  const games = new Set(s.rounds.map((r) => r.gameId));
  const best = streakInfo(playedDays(s.rounds), today).best;
  const owned = s.inventory.filter((i) => ITEM_BY_ID[i.itemId] && i.source !== 'starter').length;
  const unlockedRooms = s.rooms.filter((r) => !['bedroom', 'yard'].includes(r.type)).length;
  const evolved = s.inventory.some((i) => ITEM_BY_ID[i.itemId]?.creature && creatureStage(roundsWithBuddy(s.rounds, i.id)).stage > 1);
  const playable = GAMES.filter((g) => g.ready).map((g) => g.id);

  const list: Badge[] = [
    b('first-round', '🎉', 'First Round', 'Finish your first round', n >= 1),
    b('rounds-10', '🔟', 'Ten Rounds', 'Finish 10 rounds', n >= 10),
    b('rounds-50', '🏃', 'Fifty Rounds', 'Finish 50 rounds', n >= 50),
    b('rounds-100', '💯', 'One Hundred!', 'Finish 100 rounds', n >= 100),
    b('perfect-1', '⭐', 'Perfect!', 'Get every answer right on the first try', perfect >= 1),
    b('perfect-10', '🌟', 'Superstar', 'Get 10 perfect rounds', perfect >= 10),
    b('explorer', '🧭', 'Explorer', 'Play all 5 subjects', SUBJECTS.every((x) => subjects.has(x.id))),
    b('all-games', '🎮', 'Game Taster', 'Try every game', playable.every((g) => games.has(g) || !gameFitsKid(g, s.kid))),
    b('streak-3', '🔥', 'On Fire', 'Play 3 days in a row', best >= 3),
    b('streak-7', '📅', 'Week Streak', 'Play 7 days in a row', best >= 7),
    b('streak-30', '🏆', 'Month Streak', 'Play 30 days in a row', best >= 30),
    b('collector-10', '🛍️', 'Collector', 'Get 10 things from the shop or gifts', owned >= 10),
    b('collector-25', '👑', 'Super Collector', 'Get 25 things', owned >= 25),
    b('new-room', '🏠', 'Home Builder', 'Unlock a new room', unlockedRooms >= 1),
    b('evolved', '✨', 'Evolution!', 'Help a creature buddy evolve', evolved),
  ];

  // Mastery badges for the kid's grade and the next one, per subject.
  const gi = gradeIndex(s.kid.grade);
  for (const subj of SUBJECTS) {
    for (const g of (['PK', 'K', '1', '2', '3', '4', '5'] as const).filter((g) => gradeIndex(g) <= gi + 1)) {
      const skills = SKILLS.filter((k) => k.subject === subj.id && k.grade === g && k.games.length > 0);
      if (skills.length === 0) continue;
      const done = skills.every((k) => s.skills[k.id]?.mastered);
      if (gradeIndex(g) < gi && !done) continue; // don't show old-grade badges they skipped
      list.push(b(`master-${subj.id}-${g}`, subj.emoji, `${subj.name} Master: ${GRADE_LABEL[g]}`, `Master every ${subj.name.toLowerCase()} skill for ${GRADE_LABEL[g]}`, done));
    }
  }
  return list;

  function b(id: string, emoji: string, name: string, how: string, earned: boolean): Badge {
    return { id, emoji, name, how, earned };
  }
}

function gameFitsKid(gameId: string, kid: Kid) {
  return SKILLS.some((s) => s.games.includes(gameId) && gradeIndex(s.grade) <= gradeIndex(kid.grade));
}

// ---------- Rewards (gift boxes) ----------

export type PendingReward =
  | { kind: 'level'; id: string; level: number }
  | { kind: 'streak'; id: string; days: number }
  | { kind: 'quest'; id: string; day: string };

export const rewardId = (kidId: string, kind: string, n: string | number) => `${kidId}:${kind}:${n}`;

export function pendingRewards(s: KidSnapshot, ledger: LedgerEntry[], today = dayKey()): PendingReward[] {
  const claimed = new Set([...s.inventory.map((i) => i.id), ...ledger.map((e) => e.refId ?? '')]);
  const out: PendingReward[] = [];
  const { level } = levelInfo(totalXp(s.rounds));
  for (let L = 2; L <= level; L++) {
    const id = rewardId(s.kid.id, 'level', L);
    if (!claimed.has(id)) out.push({ kind: 'level', id, level: L });
  }
  const best = streakInfo(playedDays(s.rounds), today).best;
  for (const m of STREAK_MILESTONES) {
    const id = rewardId(s.kid.id, 'streak', m);
    if (best >= m && !claimed.has(id)) out.push({ kind: 'streak', id, days: m });
  }
  const todays = s.rounds.filter((r) => dayKey(r.createdAt) === today);
  const quest = dailyQuest(s.kid.id, today, todays);
  const qid = rewardId(s.kid.id, 'quest', today);
  if (quest.done && !claimed.has(qid)) out.push({ kind: 'quest', id: qid, day: today });
  return out;
}

const CREATURE_ORDER = ['cc_pet_sparkit', 'cc_pet_puddlepup', 'cc_yard_nest', 'cc_pet_embertail', 'cc_pet_pebblet', 'cc_pet_glimmerwing'];

function totalPrice(i: CatalogItem) {
  return Object.values(i.price).reduce<number>((a, v) => a + (v ?? 0), 0);
}

/** Pick a gift item: themed, not already owned (for one-of-a-kind items), within a price range. */
export function pickGiftItem(kidId: string, theme: ThemeId, salt: string, inventory: InventoryItem[], maxPrice: number): CatalogItem | null {
  const owned = new Set(inventory.map((i) => i.itemId));
  const pool = ITEMS.filter((i) => (i.theme === theme || i.theme === 'basic') && totalPrice(i) > 0 && totalPrice(i) <= maxPrice
    && !(i.unique && owned.has(i.id)) && !i.creature);
  const themed = pool.filter((i) => i.theme === theme && !owned.has(i.id));
  const from = themed.length ? themed : pool;
  return from.length ? from[hash(`${kidId}|${salt}`) % from.length] : null;
}

export interface RewardPlan {
  title: string;
  say: string;
  item: CatalogItem | null;
  inventory: InventoryItem[];
  ledger: LedgerEntry[];
}

/** What a pending reward gives. Ids are deterministic, so claiming twice (or on two tablets) is harmless. */
export function planReward(r: PendingReward, kid: Kid, inventory: InventoryItem[], ledger: LedgerEntry[], now: number): RewardPlan {
  const inv = (itemId: string): InventoryItem => ({ id: r.id, kidId: kid.id, itemId, source: 'gift', acquiredAt: now, updatedAt: now });
  const coins = (currency: Currency, amount: number, n = ''): LedgerEntry => ({ id: `${r.id}:${currency}${n}`, kidId: kid.id, currency, amount, reason: `reward:${r.kind}`, refId: r.id, createdAt: now });
  const owned = new Set(inventory.map((i) => i.itemId));

  if (r.kind === 'level') {
    const creatureLevel = r.level % 5 === 0;
    const creatureId = creatureLevel ? CREATURE_ORDER.find((id) => !owned.has(id) && ITEM_BY_ID[id]) : undefined;
    const item = creatureId ? ITEM_BY_ID[creatureId] : pickGiftItem(kid.id, kid.favoriteTheme, `level${r.level}`, inventory, 150 + r.level * 10);
    return {
      title: `Level ${r.level}!`,
      say: creatureId ? `Level ${r.level}! A wild ${item!.name} wants to be your friend!` : `You reached level ${r.level}! Here’s a present!`,
      item,
      inventory: item ? [inv(item.id)] : [],
      ledger: (['coins', 'stars', 'gems', 'leaves', 'pieces'] as Currency[]).map((c) => coins(c, 20)),
    };
  }
  if (r.kind === 'streak') {
    const item = pickGiftItem(kid.id, kid.favoriteTheme, `streak${r.days}`, inventory, 120 + r.days * 10);
    return {
      title: `${r.days}-day streak!`,
      say: `${r.days} days in a row! Amazing! Here’s a special present!`,
      item,
      inventory: item ? [inv(item.id)] : [],
      ledger: item ? [] : [coins('coins', 100)],
    };
  }
  // Daily quest: 25 of the currency they've earned least, plus a small gift.
  const earned: Record<Currency, number> = { coins: 0, stars: 0, gems: 0, leaves: 0, pieces: 0 };
  for (const e of ledger) if (e.kidId === kid.id && e.amount > 0) earned[e.currency] += e.amount;
  const least = (Object.keys(earned) as Currency[]).sort((a, b) => earned[a] - earned[b])[0];
  const item = pickGiftItem(kid.id, kid.favoriteTheme, `quest${r.day}`, inventory, 60);
  return {
    title: 'Quest complete!',
    say: 'You finished today’s quest! Open your present!',
    item,
    inventory: item ? [inv(item.id)] : [],
    ledger: [coins(least, 25)],
  };
}

export const SUBJECT_LIST: Subject[] = SUBJECTS.map((s) => s.id);
