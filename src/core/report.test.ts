import { describe, expect, it } from 'vitest';
import { dailyMinutes, minutesLeft, needsHelp, subjectReport, weeklyStats } from './report';
import { newProgress } from './adaptive';
import type { Kid, RoundLog, SkillProgress } from './types';
import { SKILLS } from './skills';
import { dayKey } from './random';

const kid: Kid = {
  id: 'k', name: 'A', grade: 'K', gradeBySubject: {}, favoriteTheme: 'animals',
  avatar: { skin: '#fff', hairStyle: 0, hairColor: '#000', shirt: '#00f' }, createdAt: 0, updatedAt: 0,
};
const prog = (id: string, recent: boolean[], mastered = false): SkillProgress => ({ ...newProgress('k', id), recent, mastered });
const NOW = new Date('2026-11-25T15:00:00').getTime(); // a Wednesday
const round = (t: number, extra: Partial<RoundLog> = {}): RoundLog => ({
  id: String(t) + Math.random(), kidId: 'k', gameId: 'numberPop', subject: 'math', skills: [], correctFirstTry: 6, total: 8, durationSec: 120, earned: 20, createdAt: t, ...extra,
});

describe('subject report', () => {
  it('lists the kid’s grade and the next one, with status', () => {
    const r = subjectReport(kid, 'math', { 'm.k.add5': prog('m.k.add5', [true, false, true]), 'm.k.count20': prog('m.k.count20', [true], true) });
    const grades = new Set(r.rows.map((x) => x.skill.grade));
    expect(grades.has('K')).toBe(true);
    expect(grades.has('1')).toBe(true);
    expect(grades.has('2')).toBe(false);
    expect(r.rows.find((x) => x.skill.id === 'm.k.add5')).toMatchObject({ status: 'practicing', answered: 3 });
    expect(r.rows.find((x) => x.skill.id === 'm.k.count20')?.status).toBe('mastered');
    expect(r.rows.find((x) => x.skill.id === 'm.k.numrec')?.status).toBe('not-started');
    expect(r.masteredAtGrade).toBe(1);
  });
  it('a per-subject grade overrides the kid’s grade', () => {
    const r = subjectReport({ ...kid, gradeBySubject: { math: '2' } }, 'math', {});
    expect(r.grade).toBe('2');
    expect(r.rows.every((x) => ['2', '3'].includes(x.skill.grade))).toBe(true);
  });
  it('every skill row has a playable game', () => {
    for (const s of ['math', 'reading', 'spelling', 'science', 'logic'] as const) {
      for (const row of subjectReport({ ...kid, grade: '2' }, s, {}).rows) expect(row.skill.games.length).toBeGreaterThan(0);
    }
  });
});

describe('needs help', () => {
  it('flags skills under 60% with enough answers, hardest first', () => {
    const list = needsHelp({
      a: prog('m.k.add5', [true, false, false, false, true, false, false, false]),
      b: prog('m.k.sub5', [true, true, true, false, false, false, true, false]),
      c: prog('m.k.make10', [false, false, false]), // too few answers
    });
    // keys don't matter; lookups go by skill id
    expect(list).toHaveLength(0);
    const byId: Record<string, SkillProgress> = {
      'm.k.add5': prog('m.k.add5', [true, false, false, false, true, false, false, false]),
      'm.k.sub5': prog('m.k.sub5', [true, true, true, false, false, false, true, false]),
      'm.k.make10': prog('m.k.make10', [false, false, false]),
      'm.k.numrec': prog('m.k.numrec', Array(10).fill(true)),
    };
    expect(needsHelp(byId).map((r) => r.skill.id)).toEqual(['m.k.add5', 'm.k.sub5']);
    expect(SKILLS.length).toBeGreaterThan(0);
  });
});

describe('charts data', () => {
  it('weekly stats bucket by Monday-start weeks', () => {
    const w = weeklyStats([round(NOW), round(NOW - 2 * 86400000), round(NOW - 8 * 86400000, { correctFirstTry: 8 })], 3, NOW);
    expect(w.map((x) => x.rounds)).toEqual([0, 1, 2]);
    expect(w[1].accuracy).toBe(1);
    expect(w[2].minutes).toBe(4);
  });
  it('daily minutes covers the last 7 days ending today', () => {
    const d = dailyMinutes([round(NOW), round(NOW)], 7, NOW);
    expect(d).toHaveLength(7);
    expect(d[6]).toMatchObject({ label: 'Today', minutes: 4, rounds: 2 });
  });
});

describe('time limit', () => {
  const today = dayKey(NOW);
  it('no limit means null', () => expect(minutesLeft(kid, [], today)).toBeNull());
  it('counts down from the limit and never goes negative', () => {
    const k = { ...kid, dailyLimitMin: 5 };
    expect(minutesLeft(k, [round(NOW)], today)).toBe(3);
    expect(minutesLeft(k, [round(NOW), round(NOW), round(NOW)], today)).toBe(0);
  });
  it('a grown-up bonus only counts on its day', () => {
    const k = { ...kid, dailyLimitMin: 5, limitBonus: { day: today, minutes: 10 } };
    expect(minutesLeft(k, [round(NOW), round(NOW), round(NOW)], today)).toBe(9);
    expect(minutesLeft({ ...k, limitBonus: { day: '2000-01-01', minutes: 10 } }, [], today)).toBe(5);
  });
});
