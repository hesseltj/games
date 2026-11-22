// Numbers for the grown-ups' progress report. Pure functions over synced records.
import type { Grade, Kid, RoundLog, SkillProgress, Subject } from './types';
import { GRADES } from './types';
import { SKILLS, gradeIndex, type Skill } from './skills';
import { activeGrade, accuracy } from './adaptive';
import { dayKey } from './random';

export type SkillStatus = 'mastered' | 'practicing' | 'not-started';

export interface SkillRow {
  skill: Skill;
  status: SkillStatus;
  accuracy: number | null;
  answered: number;
  step: number;
}

export interface SubjectReport {
  subject: Subject;
  grade: Grade;
  /** Grade the games are actually working on (moves up once a grade is mastered). */
  workingGrade: Grade;
  rows: SkillRow[];
  masteredAtGrade: number;
  totalAtGrade: number;
}

export const NEEDS_HELP_ACCURACY = 0.6;
export const NEEDS_HELP_MIN_ANSWERS = 8;

export function subjectReport(kid: Kid, subject: Subject, progress: Record<string, SkillProgress>): SubjectReport {
  const grade = kid.gradeBySubject[subject] ?? kid.grade;
  const playable = SKILLS.filter((s) => s.subject === subject && s.games.length > 0);
  const working = activeGrade(playable, grade, progress);
  // Show their grade, anything easier they've practiced, and the next grade up.
  const top = Math.max(gradeIndex(grade), gradeIndex(working)) + 1;
  const rows = playable
    .filter((s) => gradeIndex(s.grade) <= top && (gradeIndex(s.grade) >= gradeIndex(grade) || progress[s.id]))
    .map((skill): SkillRow => {
      const p = progress[skill.id];
      return {
        skill,
        status: p?.mastered ? 'mastered' : p && p.recent.length > 0 ? 'practicing' : 'not-started',
        accuracy: accuracy(p),
        answered: p?.recent.length ?? 0,
        step: p?.step ?? 1,
      };
    })
    .sort((a, b) => gradeIndex(a.skill.grade) - gradeIndex(b.skill.grade));
  const atGrade = rows.filter((r) => r.skill.grade === working);
  return {
    subject, grade, workingGrade: working, rows,
    masteredAtGrade: atGrade.filter((r) => r.status === 'mastered').length,
    totalAtGrade: atGrade.length,
  };
}

/** Skills a kid is finding hard right now: enough recent answers, under 60% right the first time. */
export function needsHelp(progress: Record<string, SkillProgress>): SkillRow[] {
  return SKILLS.flatMap((skill) => {
    const p = progress[skill.id];
    const acc = accuracy(p);
    if (!p || p.mastered || p.recent.length < NEEDS_HELP_MIN_ANSWERS || acc === null || acc >= NEEDS_HELP_ACCURACY) return [];
    return [{ skill, status: 'practicing' as const, accuracy: acc, answered: p.recent.length, step: p.step }];
  }).sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0));
}

function startOfWeek(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // weeks start Monday
  return d.getTime();
}

export interface WeekStat { start: number; label: string; rounds: number; questions: number; accuracy: number | null; minutes: number }

export function weeklyStats(rounds: RoundLog[], weeks = 8, now = Date.now()): WeekStat[] {
  const thisWeek = startOfWeek(now);
  const out: WeekStat[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(thisWeek);
    d.setDate(d.getDate() - i * 7);
    const start = d.getTime();
    const endD = new Date(start);
    endD.setDate(endD.getDate() + 7);
    const rs = rounds.filter((r) => r.createdAt >= start && r.createdAt < endD.getTime());
    const q = rs.reduce((s, r) => s + r.total, 0);
    const right = rs.reduce((s, r) => s + r.correctFirstTry, 0);
    out.push({
      start,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      rounds: rs.length,
      questions: q,
      accuracy: q ? right / q : null,
      minutes: Math.round(rs.reduce((s, r) => s + r.durationSec, 0) / 60),
    });
  }
  return out;
}

export interface DayStat { day: string; label: string; minutes: number; rounds: number }

export function dailyMinutes(rounds: RoundLog[], days = 7, now = Date.now()): DayStat[] {
  const out: DayStat[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = dayKey(d.getTime());
    const rs = rounds.filter((r) => dayKey(r.createdAt) === key);
    out.push({
      day: key,
      label: i === 0 ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short' }),
      minutes: Math.round(rs.reduce((s, r) => s + r.durationSec, 0) / 60),
      rounds: rs.length,
    });
  }
  return out;
}

// ---------- Daily time limit ----------

export function secondsPlayedToday(rounds: RoundLog[], kidId: string, today = dayKey()): number {
  return rounds.filter((r) => r.kidId === kidId && dayKey(r.createdAt) === today).reduce((s, r) => s + r.durationSec, 0);
}

/** Minutes left today, or null when there's no limit. Never negative. */
export function minutesLeft(kid: Kid, rounds: RoundLog[], today = dayKey()): number | null {
  if (!kid.dailyLimitMin) return null;
  const bonus = kid.limitBonus?.day === today ? kid.limitBonus.minutes : 0;
  return Math.max(0, kid.dailyLimitMin + bonus - secondsPlayedToday(rounds, kid.id, today) / 60);
}

export const LIMIT_CHOICES = [null, 15, 20, 30, 45, 60, 90] as const;
export const ALL_GRADES = GRADES;
