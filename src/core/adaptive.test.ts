import { describe, expect, it } from 'vitest';
import { activeGrade, newProgress, pickSkill, recordAnswer } from './adaptive';
import { SKILLS, SKILL_BY_ID, skillsFor } from './skills';
import { seeded } from './random';
import type { SkillProgress } from './types';

const skill = SKILL_BY_ID['m.k.add5'];

describe('recordAnswer', () => {
  it('moves up a step after 3 first-try correct in a row', () => {
    let p = newProgress('k', skill.id);
    p = recordAnswer(p, skill, true, 'd1');
    p = recordAnswer(p, skill, true, 'd1');
    expect(p.step).toBe(1);
    p = recordAnswer(p, skill, true, 'd1');
    expect(p.step).toBe(2);
  });

  it('moves down after 2 misses, never below 1', () => {
    let p = { ...newProgress('k', skill.id), step: 2 };
    p = recordAnswer(p, skill, false, 'd1');
    p = recordAnswer(p, skill, false, 'd1');
    expect(p.step).toBe(1);
    p = recordAnswer(p, skill, false, 'd1');
    p = recordAnswer(p, skill, false, 'd1');
    expect(p.step).toBe(1);
  });

  it('never goes above the max step', () => {
    let p = newProgress('k', skill.id);
    for (let i = 0; i < 30; i++) p = recordAnswer(p, skill, true, 'd1');
    expect(p.step).toBe(skill.steps);
  });

  it('needs 20 answers at 80% across 2 days to master', () => {
    let p = newProgress('k', skill.id);
    for (let i = 0; i < 25; i++) p = recordAnswer(p, skill, true, 'd1');
    expect(p.mastered).toBe(false); // only one day
    p = recordAnswer(p, skill, true, 'd2');
    expect(p.mastered).toBe(true);
  });

  it('does not master below 80%', () => {
    let p = newProgress('k', skill.id);
    for (let i = 0; i < 20; i++) p = recordAnswer(p, skill, i % 3 !== 0, i < 10 ? 'd1' : 'd2');
    expect(p.mastered).toBe(false);
  });
});

describe('pickSkill', () => {
  const math = skillsFor('math', 'numberPop');

  it('picks skills from the kid grade when nothing is mastered', () => {
    const rng = seeded(3);
    for (let i = 0; i < 100; i++) {
      const s = pickSkill(math, 'K', {}, rng);
      expect(['PK', 'K']).toContain(s.grade); // K plus review of easier grade
    }
  });

  it('Pre-K kid only gets Pre-K skills', () => {
    const rng = seeded(4);
    for (let i = 0; i < 100; i++) expect(pickSkill(math, 'PK', {}, rng).grade).toBe('PK');
  });

  it('unlocks the next grade once a grade is fully mastered', () => {
    const progress: Record<string, SkillProgress> = {};
    for (const s of math.filter((s) => s.grade === 'PK')) progress[s.id] = { ...newProgress('k', s.id), mastered: true };
    expect(activeGrade(math, 'PK', progress)).toBe('K');
  });

  it('falls back to a lower grade when the kid grade has no skills in a game', () => {
    const rng = seeded(5);
    const helpers = skillsFor('social', 'helpersAndMe'); // only goes up to grade 1
    const s = pickSkill(helpers, '5', {}, rng);
    expect(s.grade).toBe('1');
  });

  it('every skill id is unique', () => {
    expect(new Set(SKILLS.map((s) => s.id)).size).toBe(SKILLS.length);
  });
});
