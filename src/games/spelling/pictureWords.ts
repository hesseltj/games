import { pick, shuffle } from '../../core/random';
import { choiceCount, emo, others, pickOne, question, txt } from '../shared/build';
import type { ChoiceGen } from '../shared/types';
import { ANTONYMS, CATEGORIES, CONTRACTIONS, OPPOSITES, PLURALS, SYNONYMS, VOCAB, VOCAB_K, type PicWord } from '../content/words';

function vocab(skillId: string, pool: PicWord[]): ChoiceGen {
  return ({ rng, step }) => {
    const w = pick(rng, pool);
    return question(skillId, step, `Which one is the ${w.word}?`, `Find the ${w.word}!`, { kind: 'none' },
      pickOne(w, others(rng, pool, choiceCount(step) - 1, (x) => x.word === w.word), (x) => emo(x.emoji)), rng);
  };
}

function opposites(skillId: string, withWords: boolean): ChoiceGen {
  return ({ rng, step }) => {
    const pair = pick(rng, OPPOSITES);
    const [a, b] = shuffle(rng, pair);
    const wrong = others(rng, OPPOSITES.flat(), choiceCount(step) - 1, (x) => x === a || x === b);
    return question(skillId, step, `What is the opposite of ${a.word}?`, `Opposite of "${a.word}"?`, { kind: 'emoji', emoji: a.emoji, label: a.word },
      pickOne(b, wrong, (x) => emo(x.emoji, withWords ? x.word : undefined)), rng);
  };
}

export const PICTURE_WORDS: Record<string, ChoiceGen> = {
  's.pk.picwords': vocab('s.pk.picwords', VOCAB),
  's.k.picwords': vocab('s.k.picwords', VOCAB_K),
  's.pk.opposites': opposites('s.pk.opposites', false),
  's.k.opposites': opposites('s.k.opposites', true),

  's.pk.categories': ({ rng, step }) => {
    const cat = pick(rng, CATEGORIES);
    const right = pick(rng, cat.items);
    const wrong = shuffle(rng, CATEGORIES.filter((c) => c !== cat)).slice(0, choiceCount(step) - 1).map((c) => pick(rng, c.items));
    return question('s.pk.categories', step, `Which one is a ${cat.name}?`, `Find the ${cat.name}!`, { kind: 'none' },
      pickOne(right, wrong, (e) => emo(e)), rng);
  },

  's.2.synonyms': ({ rng, step }) => {
    const [a, b] = shuffle(rng, pick(rng, SYNONYMS));
    const wrong = others(rng, ANTONYMS.flat(), choiceCount(step) - 1, (x) => x === a || x === b);
    return question('s.2.synonyms', step, `Which word means the same as ${a}?`, `Same as "${a}"?`, { kind: 'text', text: a },
      pickOne(b, wrong, txt), rng);
  },

  's.2.antonyms': ({ rng, step }) => {
    const pair = pick(rng, ANTONYMS);
    const [a, b] = shuffle(rng, pair);
    const syn = SYNONYMS.find((s) => s.includes(a));
    const wrong = shuffle(rng, [...(syn ? [syn.find((x) => x !== a)!] : []), ...others(rng, ANTONYMS.flat(), 3, (x) => pair.includes(x))]).slice(0, choiceCount(step) - 1);
    return question('s.2.antonyms', step, `Which word means the opposite of ${a}?`, `Opposite of "${a}"?`, { kind: 'text', text: a },
      pickOne(b, wrong, txt), rng);
  },

  's.2.plurals': ({ rng, step }) => {
    const p = pick(rng, PLURALS);
    return question('s.2.plurals', step, `One ${p.one}. Two... which is right?`, `One ${p.one}, two ___`, { kind: 'text', text: `one ${p.one} → two ___` },
      pickOne(p.many, p.wrong.slice(0, choiceCount(step) - 1), txt), rng);
  },

  's.2.contractions': ({ rng, step }) => {
    const c = pick(rng, CONTRACTIONS);
    return question('s.2.contractions', step, `What is the short way to say ${c.long}?`, `"${c.long}" = ?`, { kind: 'text', text: c.long },
      pickOne(c.short, c.wrong.slice(0, choiceCount(step) - 1), txt), rng);
  },
};
