import { pick, shuffle, type Rng } from '../../core/random';
import { choiceCount, others, pickOne, question, txt } from '../shared/build';
import type { ChoiceGen } from '../shared/types';
import { CONTEXT3, CONTEXT5, ENDINGS, FIGURATIVE4, FIGURATIVE5, HOMOPHONES, ROOTS, SIGHT_1, SUFFIXES } from '../content/wordsUpper';

const some = <T,>(rng: Rng, xs: T[], n: number) => shuffle(rng, xs).slice(0, n);

export const LETTER_LAGOON_MORE: Record<string, ChoiceGen> = {
  'r.1.sight': ({ rng, step }) => {
    const w = pick(rng, SIGHT_1);
    return question('r.1.sight', step, `Catch the word "${w}".`, 'Listen! 🔊', { kind: 'none' },
      pickOne(w, others(rng, SIGHT_1, choiceCount(step) - 1, (x) => x === w || (step < 3 && x[0] === w[0])), txt), rng);
  },
  'r.1.endings': ({ rng, step }) => {
    const e = pick(rng, ENDINGS);
    return question('r.1.endings', step, `${e.base} plus ${e.ending === 's' ? 'e s' : e.ending}. Which spelling is right?`, `${e.base} + ${e.ending === 's' ? 'es' : e.ending} = ?`,
      { kind: 'text', text: `${e.base} + ${e.ending === 's' ? 'es' : e.ending}` }, pickOne(e.right, some(rng, e.wrong, choiceCount(step) - 1), txt), rng);
  },
  'r.3.suffix': ({ rng, step }) => {
    const s = pick(rng, SUFFIXES);
    return question('r.3.suffix', step, `What does ${s.word} mean?`, `What does "${s.word}" mean?`, { kind: 'text', text: s.word },
      pickOne(s.right, some(rng, s.wrong, choiceCount(step) - 1), txt), rng);
  },
  'r.3.homophones': ({ rng, step }) => {
    const h = pick(rng, HOMOPHONES);
    // Homophones sound the same, so the voice reads the sentence with a pause instead of the word.
    return question('r.3.homophones', step, `Which word fits? ${h.sentence.replace('___', 'blank')}`, 'Which word fits?', { kind: 'text', text: h.sentence },
      pickOne(h.right, h.wrong, txt), rng);
  },
  'r.3.context': ({ rng, step }) => {
    const c = pick(rng, CONTEXT3);
    return question('r.3.context', step, `${c.sentence} What does ${c.word} mean?`, `What does "${c.word}" mean?`, { kind: 'text', text: c.sentence },
      pickOne(c.right, some(rng, c.wrong, choiceCount(step) - 1), txt), rng);
  },
  'r.4.figurative': ({ rng, step }) => {
    const f = pick(rng, FIGURATIVE4);
    return question('r.4.figurative', step, `"${f.phrase}" What does that really mean?`, 'What does it really mean?', { kind: 'text', text: f.phrase },
      pickOne(f.right, some(rng, f.wrong, choiceCount(step) - 1), txt), rng);
  },
  'r.4.roots': ({ rng, step }) => {
    const r = pick(rng, ROOTS);
    return question('r.4.roots', step, `The root ${r.root}, like in ${r.example}. What does ${r.root} mean?`, `"${r.root}" means…`, { kind: 'text', text: `${r.root} (${r.example})` },
      pickOne(r.meaning, others(rng, ROOTS, choiceCount(step) - 1, (x) => x === r).map((x) => x.meaning), txt), rng);
  },
  'r.4.context': ({ rng, step }) => {
    const c = pick(rng, [...CONTEXT3, ...CONTEXT5.slice(0, 4)]);
    return question('r.4.context', step, `${c.sentence} What does ${c.word} mean?`, `What does "${c.word}" mean?`, { kind: 'text', text: c.sentence },
      pickOne(c.right, some(rng, c.wrong, choiceCount(step) - 1), txt), rng);
  },
  'r.5.figurative': ({ rng, step }) => {
    const f = pick(rng, FIGURATIVE5);
    const types = ['simile', 'metaphor', 'personification', 'hyperbole'];
    return question('r.5.figurative', step, `${f.sentence} What kind of figurative language is this?`, 'What kind of language is this?', { kind: 'text', text: f.sentence },
      pickOne(f.type, some(rng, types.filter((t) => t !== f.type), choiceCount(step) - 1), txt), rng);
  },
  'r.5.context': ({ rng, step }) => {
    const c = pick(rng, CONTEXT5);
    return question('r.5.context', step, `${c.sentence} What does ${c.word} mean?`, `What does "${c.word}" mean?`, { kind: 'text', text: c.sentence },
      pickOne(c.right, some(rng, c.wrong, choiceCount(step) - 1), txt), rng);
  },
};
