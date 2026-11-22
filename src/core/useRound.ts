import { useCallback, useEffect, useRef, useState } from 'react';
import type { Grade, Kid, Subject } from './types';
import { newProgress, pickSkill, recordAnswer } from './adaptive';
import { SKILL_BY_ID, skillsFor, type Skill } from './skills';
import { dayKey, defaultRng, uid, type Rng } from './random';
import { payoutTotal, roundPayout, type PayoutLine } from './economy';
import { SUBJECT_BY_ID } from './subjects';
import { addLedger, addRound, getState, saveSkill } from '../data/store';
import type { Currency, SkillProgress } from './types';

export interface RoundSummary {
  gameId: string;
  subject: Subject;
  currency: Currency;
  lines: PayoutLine[];
  earned: number;
  correctFirstTry: number;
  total: number;
}

export function questionsPerRound(grade: Grade): number {
  if (grade === 'PK') return 5;
  if (grade === 'K' || grade === '1') return 8;
  return 10;
}

export function kidGrade(kid: Kid, subject: Subject): Grade {
  return kid.gradeBySubject[subject] ?? kid.grade;
}

/**
 * Shared round runner every mini-game uses: picks a skill + difficulty step for each question,
 * records answers into adaptive progress, and pays out at the end.
 */
export function useRound<Q>(opts: {
  kid: Kid;
  subject: Subject;
  gameId: string;
  generate: (skill: Skill, step: number, rng: Rng) => Q;
  onFinish: (s: RoundSummary) => void;
  /** Override the number of questions (e.g. Memory Flip counts pairs). */
  total?: number;
  /** Always use this skill instead of picking one per question. */
  fixedSkillId?: string;
}) {
  const { kid, subject, gameId } = opts;
  const grade = kidGrade(kid, subject);
  const total = opts.total ?? questionsPerRound(grade);
  const skills = useRef(skillsFor(subject, gameId)).current;
  const progress = useRef<Record<string, SkillProgress>>({ ...(getState().skills[kid.id] ?? {}) });
  const results = useRef<boolean[]>([]);
  const usedSkills = useRef<Set<string>>(new Set());
  const startedAt = useRef(Date.now());
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const makeQuestion = useCallback(() => {
    const fixed = optsRef.current.fixedSkillId;
    const skill = fixed ? SKILL_BY_ID[fixed] : pickSkill(skills, grade, progress.current, defaultRng);
    const step = progress.current[skill.id]?.step ?? 1;
    usedSkills.current.add(skill.id);
    return { skill, q: optsRef.current.generate(skill, step, defaultRng) };
  }, [skills, grade]);

  const [current, setCurrent] = useState(makeQuestion);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const submit = useCallback(async (firstTry: boolean) => {
    if (done) return;
    const today = dayKey();
    const prev = progress.current[current.skill.id] ?? newProgress(kid.id, current.skill.id);
    const next = recordAnswer(prev, current.skill, firstTry, today);
    progress.current[current.skill.id] = next;
    results.current.push(firstTry);
    saveSkill(next);

    if (results.current.length < total) {
      setCurrent(makeQuestion());
      setIndex((i) => i + 1);
      return;
    }

    setDone(true);
    const correct = results.current.filter(Boolean).length;
    const firstToday = !getState().rounds.some((r) => r.kidId === kid.id && r.subject === subject && dayKey(r.createdAt) === today);
    const lines = roundPayout(correct, total, firstToday);
    const earned = payoutTotal(lines);
    const currency = SUBJECT_BY_ID[subject].currency;
    const roundId = uid();
    const now = Date.now();
    await addLedger([{ id: uid(), kidId: kid.id, currency, amount: earned, reason: `round:${gameId}`, refId: roundId, createdAt: now }]);
    await addRound({
      id: roundId, kidId: kid.id, gameId, subject, skills: [...usedSkills.current], correctFirstTry: correct, total,
      durationSec: Math.round((now - startedAt.current) / 1000), earned, createdAt: now,
    });
    optsRef.current.onFinish({ gameId, subject, currency, lines, earned, correctFirstTry: correct, total });
  }, [current, done, gameId, kid.id, makeQuestion, subject, total]);

  return { question: current.q, skill: current.skill, index, total, results: results.current, submit, grade };
}
