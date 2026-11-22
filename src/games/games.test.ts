import { describe, expect, it } from 'vitest';
import { seeded } from '../core/random';
import { SKILLS } from '../core/skills';
import { GAMES } from '../core/games';
import type { ChoiceGen } from './shared/types';
import { BAKE_SHOP } from './math/bakeShop';
import { CHOICE_GAMES } from './choiceGens';
import { makeSudoku, countSolutions, isValid } from './logic/sudoku';
import { makeStoryGenerator } from './reading/storySpot';
import { STORIES } from './content/stories';
import { tileQuestion } from './spelling/tiles';
import { CHUNK_WORDS } from './content/words';
import { BLEND_WORDS, MORPH5_WORDS, MORPH_WORDS, SYLLABLE_WORDS } from './content/wordsUpper';
import { makeBoard, isSlip } from './logic/memory';
import { makePuzzle, runProgram, shortestPath, key, DIRS, type Dir } from './logic/robot';

const CHOICE: Record<string, Record<string, ChoiceGen>> = Object.fromEntries(Object.entries(CHOICE_GAMES).map(([id, g]) => [id, g.gens]));
const skillsIn = (game: string) => SKILLS.filter((s) => s.games.includes(game)).map((s) => s.id);
const OTHER_GAMES = new Set(['storySpot', 'wordBuilder', 'spellingBee', 'memoryFlip', 'robotPath', 'pictureSudoku']);
const objects = ['🐶', '🐱', '🐰', '🐻', '🐸', '🐥'];

describe('every playable skill has content', () => {
  for (const s of SKILLS) {
    for (const g of s.games) {
      it(`${s.id} in ${g}`, () => {
        if (OTHER_GAMES.has(g)) return;
        expect(CHOICE[g]?.[s.id], `${g} has no generator for ${s.id}`).toBeTypeOf('function');
      });
    }
  }
  it('every skill can be played in at least one game', () => {
    for (const s of SKILLS) expect(s.games.length, s.id).toBeGreaterThan(0);
  });
  it('no game is left "coming soon"', () => {
    expect(GAMES.filter((g) => !g.ready).map((g) => g.id)).toEqual([]);
  });
  it('every ready game has at least one skill', () => {
    for (const g of GAMES.filter((g) => g.ready)) expect(SKILLS.some((s) => s.games.includes(g.id)), g.id).toBe(true);
  });
});

describe('choice questions are well-formed', () => {
  for (const [game, gens] of Object.entries(CHOICE)) {
    if (game === 'numberPop') continue; // covered in its own test file
    for (const [skillId, gen] of Object.entries(gens)) {
      const steps = SKILLS.find((s) => s.id === skillId)?.steps ?? 3;
      for (let step = 1; step <= steps; step++) {
        it(`${game} ${skillId} step ${step}`, () => {
          const rng = seeded(skillId.length * 31 + step);
          for (let i = 0; i < 200; i++) {
            const q = gen({ rng, step, objects, kidName: i % 2 ? 'Reagan' : 'Al' });
            expect(q.options.length, q.prompt).toBeGreaterThanOrEqual(2);
            expect(q.options.filter((o) => o.correct), q.prompt).toHaveLength(1);
            const keys = q.options.map((o) => JSON.stringify(o.content));
            expect(new Set(keys).size, `${q.prompt}: ${keys}`).toBe(keys.length);
            expect(q.say.trim().length).toBeGreaterThan(0);
          }
        });
      }
    }
  }
});

describe('Story Spot', () => {
  it('every story has three questions with 4 distinct answers', () => {
    for (const s of STORIES) {
      expect(s.questions, s.title).toHaveLength(3);
      for (const q of s.questions) expect(new Set(q.answers).size, q.q).toBe(4);
    }
  });
  it('reads the story aloud on the first question of each story only', () => {
    const gen = makeStoryGenerator(seeded(1));
    const qs = Array.from({ length: 9 }, () => gen(3));
    expect(qs[0].say.length).toBeGreaterThan(qs[1].say.length);
    expect(qs[3].say.length).toBeGreaterThan(qs[4].say.length);
    for (const q of qs) expect(q.options).toHaveLength(4);
  });
});

describe('tile spelling', () => {
  it('chunks spell their word', () => {
    for (const w of [...CHUNK_WORDS, ...BLEND_WORDS, ...SYLLABLE_WORDS, ...MORPH_WORDS, ...MORPH5_WORDS]) expect(w.chunks.join(''), w.word).toBe(w.word);
  });
  for (const skill of [...skillsIn('wordBuilder'), ...skillsIn('spellingBee')]) {
    it(`${skill}: tiles always contain the answer`, () => {
      const rng = seeded(9);
      for (let step = 1; step <= 3; step++) {
        for (let i = 0; i < 200; i++) {
          const q = tileQuestion(skill, step, rng);
          const pool = [...q.tiles];
          q.slots.forEach((s, idx) => {
            if (q.given.includes(idx)) return;
            const at = pool.indexOf(s);
            expect(at, `${q.word} needs ${s} in ${q.tiles}`).toBeGreaterThanOrEqual(0);
            pool.splice(at, 1);
          });
          // Distractors are never part of the answer, so there's no ambiguity.
          for (const t of pool) expect(q.slots.includes(t), `${q.word}: ${t}`).toBe(false);
        }
      }
    });
  }
});

describe('Memory Flip', () => {
  it('boards are pairs', () => {
    const rng = seeded(2);
    for (const skill of skillsIn('memoryFlip')) {
      for (let step = 1; step <= 3; step++) {
        const b = makeBoard(skill, step, ['🐶', '🐱'], rng);
        const counts = new Map<string, number>();
        b.cards.forEach((c) => counts.set(c, (counts.get(c) ?? 0) + 1));
        for (const n of counts.values()) expect(n).toBe(2);
      }
    }
  });
  it('a slip is only counted when the partner was already seen', () => {
    const cards = ['A', 'B', 'A', 'B'];
    expect(isSlip(new Set(), cards, 0, 1)).toBe(false);
    expect(isSlip(new Set([2]), cards, 0, 1)).toBe(true);
    expect(isSlip(new Set([2]), cards, 0, 2)).toBe(false);
  });
});

describe('Robot Path', () => {
  it('every puzzle is solvable, and its shortest path works as a program', () => {
    const rng = seeded(4);
    for (const skill of skillsIn('robotPath')) {
      for (let step = 1; step <= 3; step++) {
        for (let i = 0; i < 100; i++) {
          const p = makePuzzle(skill, step, rng);
          expect(shortestPath(p.size, p.walls, p.start, p.goal)).not.toBeNull();
          expect(p.walls.has(key(p.start)) || p.walls.has(key(p.goal))).toBe(false);
          const moves = p.path.slice(1).map((c, j) => {
            const prev = p.path[j];
            return (Object.entries(DIRS).find(([, [dx, dy]]) => prev.x + dx === c.x && prev.y + dy === c.y)![0]) as Dir;
          });
          expect(runProgram(p, moves).reached).toBe(true);
        }
      }
    }
  });
  it('bumping a wall stops the robot', () => {
    const p = { ...makePuzzle('l.2.robot', 1, seeded(1)), size: 3, walls: new Set(['1,0']), start: { x: 0, y: 0 }, goal: { x: 2, y: 0 } };
    expect(runProgram(p, ['right', 'right'])).toMatchObject({ bumped: true, reached: false });
  });
});

describe('Picture Sudoku', () => {
  it('puzzles have exactly one solution and the right number of blanks', () => {
    const rng = seeded(11);
    for (const skill of skillsIn('pictureSudoku')) {
      for (let step = 1; step <= 3; step++) {
        for (let i = 0; i < 60; i++) {
          const p = makeSudoku(skill, step, rng);
          expect(isValid(p.size, p.solution)).toBe(true);
          const grid = p.solution.map((v, j) => (p.givens[j] ? v : null));
          expect(countSolutions(p.size, grid)).toBe(1);
          expect(p.givens.filter((g) => !g).length).toBeGreaterThan(0);
          expect(new Set(p.symbols).size).toBe(p.size);
        }
      }
    }
  });
});

describe('Bake Shop answers are right', () => {
  it('money totals match the coins shown', () => {
    const rng = seeded(5);
    for (let step = 1; step <= 3; step++) for (let i = 0; i < 200; i++) {
      const q = BAKE_SHOP['m.2.money']({ rng, step, objects, kidName: 'A' });
      const coins = (q.display as { coins: number[] }).coins;
      const right = q.options.find((o) => o.correct)!.content as { text: string };
      expect(right.text).toBe(`${coins.reduce((a, b) => a + b, 0)}¢`);
    }
  });
  it('clock answers match the hands', () => {
    const rng = seeded(6);
    for (let step = 1; step <= 3; step++) for (let i = 0; i < 200; i++) {
      const q = BAKE_SHOP['m.2.time']({ rng, step, objects, kidName: 'A' });
      const { h, m } = q.display as { h: number; m: number };
      const right = q.options.find((o) => o.correct)!.content as { text: string };
      expect(right.text).toBe(`${h}:${String(m).padStart(2, '0')}`);
    }
  });
  it('ruler answers are the length, not where it ends', () => {
    const rng = seeded(7);
    for (let step = 1; step <= 2; step++) for (let i = 0; i < 200; i++) {
      const q = BAKE_SHOP['m.2.measure']({ rng, step, objects, kidName: 'A' });
      const { start, length } = q.display as { start: number; length: number };
      expect(start + length).toBeLessThanOrEqual(10);
      const right = q.options.find((o) => o.correct)!.content as { n: number };
      expect(right.n).toBe(length);
    }
  });
});

describe('grade coverage', () => {
  const subjects = ['math', 'reading', 'spelling', 'science', 'logic', 'social'] as const;
  for (const subject of subjects) {
    for (const grade of ['PK', 'K', '1', '2', '3', '4', '5'] as const) {
      it(`${subject} has playable skills at ${grade}`, () => {
        expect(SKILLS.filter((s) => s.subject === subject && s.grade === grade && s.games.length > 0).length).toBeGreaterThan(0);
      });
    }
  }
  it('every story grade has enough stories for a round', () => {
    for (const g of ['1', '2', '3', '4', '5']) expect(STORIES.filter((s) => (s.grade ?? '2') === g).length, g).toBeGreaterThanOrEqual(3);
  });
  it('Story Spot for each grade only tells that grade’s stories', () => {
    for (const g of ['1', '3', '4', '5']) {
      const gen = makeStoryGenerator(seeded(3), `r.${g}.comprehend`);
      for (let i = 0; i < 9; i++) {
        const q = gen(3);
        const title = (q.display as { title: string }).title;
        expect(STORIES.find((s) => s.title === title)?.grade).toBe(g);
      }
    }
  });
});
