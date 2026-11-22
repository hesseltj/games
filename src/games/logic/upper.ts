import { pick, randInt, shuffle, type Rng } from '../../core/random';
import { choiceCount, emo, numberChoices, pickOne, question, txt } from '../shared/build';
import type { ChoiceGen, OptContent } from '../shared/types';
import { buildPattern } from './patternTrain';

const NAMES = ['Ava', 'Ben', 'Cara', 'Dev', 'Eli', 'Fay', 'Gus', 'Hana', 'Ivy', 'Jon', 'Kai', 'Lu', 'Max', 'Nia', 'Omar', 'Pia'];
const TRAITS = [
  { more: 'taller', most: 'tallest', least: 'shortest' },
  { more: 'older', most: 'oldest', least: 'youngest' },
  { more: 'faster', most: 'fastest', least: 'slowest' },
];

/** "A is taller than B. B is taller than C. Who is shortest?" */
function ordering(skillId: string, people: number, rng: Rng, step: number) {
  const names = shuffle(rng, NAMES).slice(0, people); // names[0] is the most
  const t = pick(rng, TRAITS);
  const clues = names.slice(0, -1).map((n, i) => `${n} is ${t.more} than ${names[i + 1]}.`);
  const askMost = rng() < 0.5;
  const right = askMost ? names[0] : names[people - 1];
  const q = `Who is the ${askMost ? t.most : t.least}?`;
  const shown = shuffle(rng, clues);
  return question(skillId, step, `${shown.join(' ')} ${q}`, q, { kind: 'story', title: 'Logic puzzle', emoji: '🕵️', lines: shown },
    pickOne(right, names.filter((n) => n !== right).slice(0, choiceCount(step) - 1), txt), rng);
}

const RULES: { text: string; say: string; facts: { given: string; ask: string; right: string; wrong: string[] }[] }[] = [
  { text: 'All zibbles are blue.', say: 'All zibbles are blue.', facts: [{ given: 'Pip is a zibble.', ask: 'What color is Pip?', right: 'Blue', wrong: ['Red', 'We can’t tell'] }] },
  { text: 'If it rains, the grass gets wet.', say: 'If it rains, the grass gets wet.', facts: [{ given: 'It rained today.', ask: 'Is the grass wet?', right: 'Yes', wrong: ['No', 'We can’t tell'] }, { given: 'The grass is wet.', ask: 'Did it rain?', right: 'We can’t tell', wrong: ['Yes', 'No'] }] },
  { text: 'Every bird in the cage is yellow.', say: 'Every bird in the cage is yellow.', facts: [{ given: 'Tweet is a red bird.', ask: 'Is Tweet in the cage?', right: 'No', wrong: ['Yes', 'We can’t tell'] }] },
  { text: 'Only cats live in the red house.', say: 'Only cats live in the red house.', facts: [{ given: 'Rex lives in the red house.', ask: 'What is Rex?', right: 'A cat', wrong: ['A dog', 'We can’t tell'] }] },
  { text: 'If a number ends in 0, it is even.', say: 'If a number ends in zero, it is even.', facts: [{ given: 'The number is 70.', ask: 'Is it even?', right: 'Yes', wrong: ['No', 'We can’t tell'] }, { given: 'The number is even.', ask: 'Does it end in 0?', right: 'We can’t tell', wrong: ['Yes', 'No'] }] },
  { text: 'No fish can climb trees.', say: 'No fish can climb trees.', facts: [{ given: 'Finn is a fish.', ask: 'Can Finn climb trees?', right: 'No', wrong: ['Yes', 'We can’t tell'] }] },
];

function seq(skillId: string, rules: (number | 'x2' | 'x3' | 'sq' | 'tri' | 'fib' | 'alt')[], step: number, rng: Rng) {
  const rule = pick(rng, rules);
  let s: number[];
  if (rule === 'sq') { const k = randInt(rng, 1, 4); s = [0, 1, 2, 3, 4].map((i) => (k + i) ** 2); }
  else if (rule === 'tri') { s = [1, 3, 6, 10, 15]; const k = randInt(rng, 0, 2); s = [0, 1, 2, 3, 4].map((i) => ((i + k + 1) * (i + k + 2)) / 2); }
  else if (rule === 'fib') { const a = randInt(rng, 1, 3), b = randInt(rng, a, 5); s = [a, b]; while (s.length < 5) s.push(s[s.length - 1] + s[s.length - 2]); }
  else if (rule === 'alt') { const a = randInt(rng, 1, 3), b = randInt(rng, 4, 6); let v = randInt(rng, 1, 10); s = [v]; for (let i = 0; i < 4; i++) { v += i % 2 === 0 ? a : b; s.push(v); } }
  else if (rule === 'x2' || rule === 'x3') { const m = rule === 'x2' ? 2 : 3; s = [randInt(rng, 1, 3)]; while (s.length < 5) s.push(s[s.length - 1] * m); }
  else { const start = rule < 0 ? randInt(rng, 60, 99) : randInt(rng, 1, 30); s = [0, 1, 2, 3, 4].map((i) => start + i * rule); }
  const ans = s.pop()!;
  const choices = numberChoices(rng, ans, choiceCount(step), Math.max(0, ans - 20), ans + 20, 6);
  return question(skillId, step, 'What number comes next?', 'What comes next?',
    { kind: 'pattern', items: s.map((n): OptContent => ({ kind: 'number', n })) },
    choices.map((n) => ({ content: { kind: 'number', n } as OptContent, correct: n === ans })), rng);
}

export const PATTERN_TRAIN_MORE: Record<string, ChoiceGen> = {
  'l.1.pattern': ({ rng, step, objects }) => {
    const p = buildPattern(rng, 3, rng() < 0.5 ? [...new Set(objects)] : ['🔴', '🔵', '🟡', '🟢', '🟣']);
    const wrong = shuffle(rng, [...new Set([...p.symbols, ...p.pool])].filter((x) => x !== p.answer)).slice(0, choiceCount(step) - 1);
    return question('l.1.pattern', step, 'What comes next on the pattern train?', 'What comes next?', { kind: 'pattern', items: p.shown.map((e) => emo(e)) },
      pickOne(p.answer, wrong, (e) => emo(e)), rng);
  },
  'l.3.sequence': ({ rng, step }) => seq('l.3.sequence', step === 1 ? [3, 4, 6, 'x2'] : step === 2 ? [7, 8, 9, -6, 'x2'] : [11, 12, 25, -9, 'x3', 'alt'], step, rng),
  'l.4.sequence': ({ rng, step }) => seq('l.4.sequence', step === 1 ? ['x2', 'alt', 15] : step === 2 ? ['fib', 'x3', 'sq'] : ['fib', 'sq', 'tri', 'alt'], step, rng),
  'l.5.sequence': ({ rng, step }) => seq('l.5.sequence', step === 1 ? ['sq', 'fib', 'x3'] : ['sq', 'tri', 'fib', 'alt', 'x3'], step, rng),
  'l.3.logic': ({ rng, step }) => ordering('l.3.logic', 3, rng, step),
  'l.4.logic': ({ rng, step }) => ordering('l.4.logic', 4, rng, step),
  'l.5.logic': ({ rng, step }) => {
    if (step === 1) return ordering('l.5.logic', 4, rng, step);
    const r = pick(rng, RULES);
    const f = pick(rng, r.facts);
    return question('l.5.logic', step, `${r.say} ${f.given} ${f.ask}`, f.ask, { kind: 'story', title: 'Logic puzzle', emoji: '🕵️', lines: [r.text, f.given] },
      pickOne(f.right, f.wrong, txt), rng);
  },
};
