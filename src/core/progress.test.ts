import { describe, expect, it } from 'vitest';
import {
  badges, creatureStage, dailyQuest, levelInfo, pendingRewards, planReward, streakInfo, totalXp, xpForLevel, type KidSnapshot,
} from './progress';
import type { Kid, RoundLog } from './types';
import { ITEM_BY_ID } from '../shop/catalog';

const kid: Kid = {
  id: 'k1', name: 'Ava', grade: 'K', gradeBySubject: {}, favoriteTheme: 'creatures',
  avatar: { skin: '#fff', hairStyle: 0, hairColor: '#000', shirt: '#00f' }, createdAt: 0, updatedAt: 0,
};
const at = (day: string, hour = 12) => new Date(`${day}T${String(hour).padStart(2, '0')}:00:00`).getTime();
let n = 0;
const round = (day: string, extra: Partial<RoundLog> = {}): RoundLog => ({
  id: `r${n++}`, kidId: 'k1', gameId: 'numberPop', subject: 'math', skills: [], correctFirstTry: 6, total: 8, durationSec: 60, earned: 20, createdAt: at(day), ...extra,
});
const days = (...d: string[]) => new Set(d);

describe('levels', () => {
  it('curve gets a little longer each level', () => {
    expect([1, 2, 3, 4, 5].map(xpForLevel)).toEqual([0, 50, 150, 300, 500]);
  });
  it('a preschool round and a 2nd-grade round are worth the same XP', () => {
    expect(totalXp([round('2026-11-01', { total: 5, correctFirstTry: 3 })])).toBe(totalXp([round('2026-11-01', { total: 10, correctFirstTry: 3 })]));
  });
  it('perfect rounds give bonus XP', () => {
    expect(totalXp([round('2026-11-01', { total: 5, correctFirstTry: 5 })])).toBe(15);
  });
  it('reports progress within a level', () => {
    expect(levelInfo(100)).toMatchObject({ level: 2, into: 50, needed: 100 });
  });
});

describe('streaks', () => {
  it('counts consecutive days through today', () => {
    expect(streakInfo(days('2026-11-20', '2026-11-21', '2026-11-22'), '2026-11-22')).toMatchObject({ current: 3, playedToday: true });
  });
  it('not playing yet today keeps yesterday’s streak', () => {
    expect(streakInfo(days('2026-11-20', '2026-11-21'), '2026-11-22')).toMatchObject({ current: 2, playedToday: false });
  });
  it('one missed day is forgiven', () => {
    expect(streakInfo(days('2026-11-18', '2026-11-19', '2026-11-21', '2026-11-22'), '2026-11-22').current).toBe(4);
  });
  it('two missed days in a row break it', () => {
    expect(streakInfo(days('2026-11-18', '2026-11-19', '2026-11-22'), '2026-11-22').current).toBe(1);
  });
  it('only one forgiven day per week', () => {
    expect(streakInfo(days('2026-11-16', '2026-11-18', '2026-11-20', '2026-11-21'), '2026-11-21').current).toBe(3);
  });
  it('works across month boundaries', () => {
    expect(streakInfo(days('2026-10-30', '2026-10-31', '2026-11-01'), '2026-11-01').current).toBe(3);
  });
  it('tracks the best streak ever', () => {
    expect(streakInfo(days('2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-11-22'), '2026-11-22')).toMatchObject({ current: 1, best: 4 });
  });
});

describe('daily quest', () => {
  it('is the same all day and progresses with rounds', () => {
    const q0 = dailyQuest('k1', '2026-11-22', []);
    expect(q0.done).toBe(false);
    expect(dailyQuest('k1', '2026-11-22', []).id).toBe(q0.id);
    const many = Array.from({ length: 6 }, (_, i) => round('2026-11-22', { subject: (['math', 'reading', 'spelling', 'science', 'logic', 'math'] as const)[i], correctFirstTry: 10, total: 10 }));
    expect(dailyQuest('k1', '2026-11-22', many).done).toBe(true);
  });
  it('varies from day to day', () => {
    const ids = new Set(Array.from({ length: 30 }, (_, i) => dailyQuest('k1', `2026-11-${String(i + 1).padStart(2, '0')}`, []).id));
    expect(ids.size).toBeGreaterThan(3);
  });
});

describe('creatures', () => {
  it('evolve at 15 and 40 rounds as a buddy', () => {
    expect(creatureStage(0).stage).toBe(1);
    expect(creatureStage(14)).toMatchObject({ stage: 1, toNext: 1 });
    expect(creatureStage(15).stage).toBe(2);
    expect(creatureStage(40)).toMatchObject({ stage: 3, toNext: null });
  });
});

describe('rewards', () => {
  const snap = (rounds: RoundLog[], inventory: KidSnapshot['inventory'] = []): KidSnapshot => ({ kid, rounds, skills: {}, inventory, rooms: [] });

  it('each level from 2 up has a reward, claimed only once', () => {
    const rounds = Array.from({ length: 16 }, () => round('2026-11-22')); // 160 XP = level 3
    const pend = pendingRewards(snap(rounds), [], '2026-11-22').filter((r) => r.kind === 'level');
    expect(pend.map((r) => r.kind === 'level' && r.level)).toEqual([2, 3]);
    const plan = planReward(pend[0], kid, [], [], 1);
    const after = pendingRewards(snap(rounds, plan.inventory), plan.ledger, '2026-11-22').filter((r) => r.kind === 'level');
    expect(after).toHaveLength(1);
  });

  it('level 5 brings a creature the kid doesn’t have yet', () => {
    const plan = planReward({ kind: 'level', id: 'k1:level:5', level: 5 }, kid, [], [], 1);
    expect(plan.item?.creature).toBeTruthy();
    const plan2 = planReward({ kind: 'level', id: 'k1:level:10', level: 10 }, kid, [{ id: 'x', kidId: 'k1', itemId: plan.item!.id, source: 'gift', acquiredAt: 0, updatedAt: 0 }], [], 1);
    expect(plan2.item?.creature).toBeTruthy();
    expect(plan2.item?.id).not.toBe(plan.item?.id);
  });

  it('reward ids are deterministic so two tablets can’t double-grant', () => {
    const a = planReward({ kind: 'quest', id: 'k1:quest:2026-11-22', day: '2026-11-22' }, kid, [], [], 1);
    const b = planReward({ kind: 'quest', id: 'k1:quest:2026-11-22', day: '2026-11-22' }, kid, [], [], 2);
    expect(a.ledger.map((e) => e.id)).toEqual(b.ledger.map((e) => e.id));
    expect(a.inventory.map((i) => i.id)).toEqual(b.inventory.map((i) => i.id));
  });

  it('quest rewards top up the currency earned least', () => {
    const ledger = [{ id: 'l', kidId: 'k1', currency: 'coins' as const, amount: 100, reason: 'r', createdAt: 0 },
      { id: 'm', kidId: 'k1', currency: 'stars' as const, amount: 50, reason: 'r', createdAt: 0 },
      { id: 'n', kidId: 'k1', currency: 'gems' as const, amount: 50, reason: 'r', createdAt: 0 },
      { id: 'o', kidId: 'k1', currency: 'pieces' as const, amount: 50, reason: 'r', createdAt: 0 }];
    const plan = planReward({ kind: 'quest', id: 'k1:quest:d', day: 'd' }, kid, [], ledger, 1);
    expect(plan.ledger[0]).toMatchObject({ currency: 'leaves', amount: 25 });
  });

  it('gift items are never one-of-a-kind things the kid already owns', () => {
    const owned = Object.values(ITEM_BY_ID).filter((i) => i.theme === 'creatures' && i.unique).map((i, j) => ({ id: `i${j}`, kidId: 'k1', itemId: i.id, source: 'shop' as const, acquiredAt: 0, updatedAt: 0 }));
    for (let L = 2; L < 30; L++) {
      const plan = planReward({ kind: 'level', id: `k1:level:${L}`, level: L }, kid, owned, [], 1);
      if (plan.item?.unique) expect(owned.some((o) => o.itemId === plan.item!.id)).toBe(false);
    }
  });
});

describe('badges', () => {
  it('first round and perfect badges', () => {
    const list = badges({ kid, rounds: [round('2026-11-22', { correctFirstTry: 8, total: 8 })], skills: {}, inventory: [], rooms: [] }, '2026-11-22');
    const earned = list.filter((b) => b.earned).map((b) => b.id);
    expect(earned).toContain('first-round');
    expect(earned).toContain('perfect-1');
    expect(earned).not.toContain('rounds-10');
  });
  it('shows mastery badges for the kid’s grade and the next one', () => {
    const ids = badges({ kid, rounds: [], skills: {}, inventory: [], rooms: [] }).map((b) => b.id);
    expect(ids).toContain('master-math-K');
    expect(ids).toContain('master-math-1');
    expect(ids).not.toContain('master-math-PK');
    expect(ids).not.toContain('master-math-2');
  });
});
