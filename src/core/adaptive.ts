import type { Grade, SkillProgress } from './types';
import { gradeIndex, type Skill } from './skills';
import { pick, type Rng } from './random';

export const UP_AFTER = 3; // first-try correct in a row → next step
export const DOWN_AFTER = 2; // misses in a row → previous step
export const RECENT_WINDOW = 20;
export const MASTERY_ACCURACY = 0.8;
export const MASTERY_DAYS = 2;
export const REVIEW_SHARE = 0.2;

export function newProgress(kidId: string, skillId: string): SkillProgress {
  return { kidId, skillId, step: 1, rightStreak: 0, missStreak: 0, recent: [], days: [], mastered: false, updatedAt: 0 };
}

/** Apply one answered question (firstTry = correct on first attempt) to a skill's progress. */
export function recordAnswer(
  p: SkillProgress,
  skill: Skill,
  firstTry: boolean,
  today: string,
  now: number = Date.now(),
): SkillProgress {
  const recent = [...p.recent, firstTry].slice(-RECENT_WINDOW);
  const days = p.days.includes(today) ? p.days : [...p.days, today].slice(-10);
  let { step, rightStreak, missStreak } = p;
  if (firstTry) {
    rightStreak += 1;
    missStreak = 0;
    if (rightStreak >= UP_AFTER && step < skill.steps) {
      step += 1;
      rightStreak = 0;
    }
  } else {
    missStreak += 1;
    rightStreak = 0;
    if (missStreak >= DOWN_AFTER && step > 1) {
      step -= 1;
      missStreak = 0;
    }
  }
  const accuracy = recent.filter(Boolean).length / recent.length;
  const mastered =
    p.mastered || (recent.length >= RECENT_WINDOW && accuracy >= MASTERY_ACCURACY && days.length >= MASTERY_DAYS);
  return { ...p, step, rightStreak, missStreak, recent, days, mastered, updatedAt: now };
}

export function accuracy(p: SkillProgress | undefined): number | null {
  if (!p || p.recent.length === 0) return null;
  return p.recent.filter(Boolean).length / p.recent.length;
}

/**
 * Which skills a kid is working on: their grade's skills, plus the next grade's once
 * every skill at their grade is mastered (repeats upward).
 */
export function activeGrade(skills: Skill[], grade: Grade, progress: Record<string, SkillProgress>): Grade {
  const order: Grade[] = ['PK', 'K', '1', '2', '3', '4', '5'];
  let gi = gradeIndex(grade);
  while (gi < order.length - 1) {
    const atGrade = skills.filter((s) => s.grade === order[gi]);
    if (atGrade.length === 0 || !atGrade.every((s) => progress[s.id]?.mastered)) break;
    const next = skills.filter((s) => s.grade === order[gi + 1]);
    if (next.length === 0) break;
    gi += 1;
  }
  return order[gi];
}

/**
 * Pick the skill for the next question. Mostly unmastered skills at the active grade,
 * ~20% review from mastered or easier skills.
 */
export function pickSkill(
  skills: Skill[],
  grade: Grade,
  progress: Record<string, SkillProgress>,
  rng: Rng,
): Skill {
  const g = activeGrade(skills, grade, progress);
  const gi = gradeIndex(g);
  const atGrade = skills.filter((s) => s.grade === g);
  if (atGrade.length === 0) {
    // Kid's grade has no playable skills in this game yet: use the closest grade below.
    const lower = skills.filter((s) => gradeIndex(s.grade) < gi).sort((a, b) => gradeIndex(b.grade) - gradeIndex(a.grade));
    if (lower.length > 0) return pickSkill(skills, lower[0].grade, progress, rng);
    return pick(rng, skills);
  }
  const learning = atGrade.filter((s) => !progress[s.id]?.mastered);
  const review = skills.filter((s) => gradeIndex(s.grade) <= gi && (progress[s.id]?.mastered || gradeIndex(s.grade) < gi));
  if (review.length > 0 && (learning.length === 0 || rng() < REVIEW_SHARE)) return pick(rng, review);
  if (learning.length > 0) return pick(rng, learning);
  return pick(rng, atGrade);
}
