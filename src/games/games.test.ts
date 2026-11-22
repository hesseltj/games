import { describe, expect, it } from 'vitest';
import { seeded } from '../core/random';
import { SKILLS } from '../core/skills';
import { GAMES } from '../core/games';
import type { ChoiceGen } from './shared/types';
import { GENERATORS as NUMBER_POP } from './numberPop/questions';
import { LETTER_LAGOON } from './reading/letterLagoon';
import { PICTURE_WORDS } from './spelling/pictureWords';
import { SCIENCE_SAFARI, SORT_IT } from './science/scienceGames';
import { PATTERN_TRAIN } from './logic/patternTrain';
import { makeStoryGenerator } from './reading/storySpot';
import { STORIES } from './content/stories';
import { tileQuestion } from './spelling/tiles';
import { CHUNK_WORDS } from './content/words';
import { makeBoard, isSlip } from './logic/memory';
import { makePuzzle, runProgram, shortestPath, key, DIRS, type Dir } from './logic/robot';

const CHOICE: Record<string, Record<string, ChoiceGen>> = {
  numberPop: NUMBER_POP, letterLagoon: LETTER_LAGOON, pictureWords: PICTURE_WORDS,
  scienceSafari: SCIENCE_SAFARI, sortIt: SORT_IT, patternTrain: PATTERN_TRAIN,
};
const OTHER_GAMES = new Set(['storySpot', 'wordBuilder', 'spellingBee', 'memoryFlip', 'robotPath']);
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
    for (const w of CHUNK_WORDS) expect(w.chunks.join(''), w.word).toBe(w.word);
  });
  for (const skill of ['r.k.cvc', 's.k.spellcvc', 's.2.spell', 'r.2.digraphs', 'r.2.vowels']) {
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
    for (const skill of ['l.pk.match', 'l.k.memory', 'l.2.memory']) {
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
    for (const skill of ['l.pk.maze', 'l.k.maze', 'l.2.robot']) {
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
