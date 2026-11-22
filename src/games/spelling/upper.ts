import { pick, shuffle, type Rng } from '../../core/random';
import { choiceCount, pickOne, question, txt } from '../shared/build';
import type { ChoiceGen } from '../shared/types';
import { ABC_WORDS, ANALOGIES4, ANALOGIES5, CONFUSED, PREFIX4, SHADES, WORD_CATEGORIES } from '../content/wordsUpper';

const some = <T,>(rng: Rng, xs: T[], n: number) => shuffle(rng, xs).slice(0, n);

export const PICTURE_WORDS_MORE: Record<string, ChoiceGen> = {
  's.1.vocab': ({ rng, step }) => {
    const [cat, ...rest] = shuffle(rng, WORD_CATEGORIES);
    const right = pick(rng, cat.words);
    const wrong = some(rng, rest, choiceCount(step) - 1).map((c) => pick(rng, c.words));
    return question('s.1.vocab', step, `Which word is a ${cat.name}?`, `Which word is a ${cat.name}?`, { kind: 'none' }, pickOne(right, wrong, txt), rng);
  },
  's.3.shades': ({ rng, step }) => {
    const set = pick(rng, SHADES);
    const most = rng() < 0.5;
    const right = most ? set[set.length - 1] : set[0];
    const wrong = some(rng, set.filter((w) => w !== right), choiceCount(step) - 1);
    const word = most ? 'strongest' : 'gentlest';
    return question('s.3.shades', step, `Which word is the ${word}? ${[right, ...wrong].join(', ')}.`, `Which word is the ${word}?`, { kind: 'none' }, pickOne(right, wrong, txt), rng);
  },
  's.3.abc': ({ rng, step }) => {
    let words: string[];
    if (step === 3) {
      const letter = pick(rng, ['b', 'c', 's', 'r']);
      words = some(rng, ABC_WORDS.filter((w) => w[0] === letter), 3);
    } else {
      words = some(rng, ABC_WORDS.filter((w, i, a) => a.findIndex((x) => x[0] === w[0]) === i), choiceCount(step));
    }
    const right = [...words].sort()[0];
    return question('s.3.abc', step, 'Which word comes first in ABC order?', 'First in ABC order?', { kind: 'none' },
      pickOne(right, words.filter((w) => w !== right), txt), rng);
  },
  's.4.analogies': ({ rng, step }) => analogy('s.4.analogies', pick(rng, ANALOGIES4), step, rng),
  's.5.analogies': ({ rng, step }) => analogy('s.5.analogies', pick(rng, ANALOGIES5), step, rng),
  's.4.prefixes': ({ rng, step }) => {
    const p = pick(rng, PREFIX4);
    return question('s.4.prefixes', step, `Which prefix makes ${p.base} mean ${p.meaning}?`, `__ + ${p.base} = ${p.meaning}`, { kind: 'text', text: `___${p.base}` },
      pickOne(p.right, some(rng, p.wrong, choiceCount(step) - 1), (x) => txt(`${x}-`)), rng);
  },
  's.5.confused': ({ rng, step }) => {
    const c = pick(rng, CONFUSED);
    return question('s.5.confused', step, `Which word fits? ${c.sentence.replace('___', 'blank')}`, 'Which word fits?', { kind: 'text', text: c.sentence },
      pickOne(c.right, c.wrong, txt), rng);
  },
};

function analogy(skillId: string, a: { a: string; b: string; c: string; right: string; wrong: string[] }, step: number, rng: Rng) {
  return question(skillId, step, `${a.a} is to ${a.b} as ${a.c} is to what?`, `${a.a} : ${a.b} = ${a.c} : ?`, { kind: 'text', text: `${a.a} → ${a.b},  ${a.c} → ?` },
    pickOne(a.right, shuffle(rng, a.wrong).slice(0, choiceCount(step) - 1), txt), rng);
}
