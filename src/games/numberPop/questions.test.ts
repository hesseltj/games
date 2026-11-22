import { describe, expect, it } from 'vitest';
import { GENERATORS, generateQuestion, numberChoices } from './questions';
import { SKILLS } from '../../core/skills';
import { seeded } from '../../core/random';

const objects = ['🐶', '🐱'];

describe('Number Pop generators', () => {
  it('has a generator for every skill that lists numberPop', () => {
    for (const s of SKILLS.filter((s) => s.games.includes('numberPop'))) {
      expect(GENERATORS[s.id], s.id).toBeTypeOf('function');
    }
  });

  for (const skill of SKILLS.filter((s) => s.games.includes('numberPop'))) {
    for (let step = 1; step <= skill.steps; step++) {
      it(`${skill.id} step ${step}: always exactly one correct, distinct options`, () => {
        const rng = seeded(skill.id.length * 100 + step);
        for (let i = 0; i < 300; i++) {
          const q = generateQuestion(skill.id, { rng, step, objects, kidName: 'Sam' });
          expect(q.options.length).toBeGreaterThanOrEqual(2);
          expect(q.options.filter((o) => o.correct)).toHaveLength(1);
          const keys = q.options.map((o) => JSON.stringify(o.content));
          expect(new Set(keys).size, `${q.prompt} ${keys}`).toBe(keys.length);
          for (const o of q.options) {
            if (o.content.kind === 'number') expect(o.content.n).toBeGreaterThanOrEqual(0);
          }
          expect(q.say.length).toBeGreaterThan(0);
        }
      });
    }
  }

  it('math answers are actually right', () => {
    const rng = seeded(7);
    for (let i = 0; i < 300; i++) {
      for (const id of ['m.k.add5', 'm.2.add20', 'm.2.add100', 'm.3.times']) {
        const q = generateQuestion(id, { rng, step: 3, objects, kidName: 'Sam' });
        const m = q.prompt.match(/^(\d+) ([+−×]) (\d+)/);
        expect(m, q.prompt).not.toBeNull();
        const [a, op, b] = [Number(m![1]), m![2], Number(m![3])];
        const expected = op === '+' ? a + b : op === '−' ? a - b : a * b;
        const right = q.options.find((o) => o.correct)!.content;
        expect(right.kind === 'number' && right.n).toBe(expected);
      }
    }
  });

  it('numberChoices returns distinct values in range', () => {
    const rng = seeded(1);
    for (let i = 0; i < 200; i++) {
      const c = numberChoices(rng, 3, 4, 1, 5);
      expect(new Set(c).size).toBe(4);
      expect(c).toContain(3);
      c.forEach((n) => expect(n >= 1 && n <= 5).toBe(true));
    }
  });
});
