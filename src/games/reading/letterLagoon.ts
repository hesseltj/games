import { pick, randInt, shuffle } from '../../core/random';
import { choiceCount, emo, numberChoices, others, pickOne, question, txt } from '../shared/build';
import type { ChoiceGen } from '../shared/types';
import { ALPHABET, COMPOUNDS, CVC, LETTER_WORDS, PREFIXES, RHYMES, SIGHT_2, SIGHT_K, SOUND_SKIP, SYLLABLES } from '../content/words';

const upper = (l: string) => l.toUpperCase();
// Letters that look alike make step 3 harder.
const LOOKALIKE: Record<string, string[]> = { b: ['d', 'p'], d: ['b', 'q'], p: ['q', 'b'], q: ['p', 'g'], m: ['n', 'w'], n: ['m', 'h'], u: ['n', 'v'], w: ['m', 'v'], e: ['c', 'o'], o: ['c', 'a'], i: ['l', 'j'], l: ['i', 't'] };

function letterDistractors(rng: () => number, letter: string, n: number, step: number): string[] {
  const near = step >= 3 ? (LOOKALIKE[letter] ?? []) : [];
  const rest = others(rng, ALPHABET, n, (l) => l === letter || near.includes(l));
  return [...near, ...rest].slice(0, n);
}

export const LETTER_LAGOON: Record<string, ChoiceGen> = {
  'r.pk.letters': ({ rng, step }) => {
    const pool = step === 1 ? 'abcdefghijklm'.split('') : ALPHABET;
    const l = pick(rng, pool);
    return question('r.pk.letters', step, `Catch the letter ${upper(l)}!`, `Catch the letter ${upper(l)}!`, { kind: 'none' },
      pickOne(l, letterDistractors(rng, l, choiceCount(step) - 1, step), (x) => txt(upper(x))), rng);
  },

  'r.pk.name': ({ rng, step, kidName }) => {
    const letters = [...new Set(kidName.toLowerCase().replace(/[^a-z]/g, '').split(''))];
    if (letters.length === 0) return LETTER_LAGOON['r.pk.letters']({ rng, step, objects: [], kidName });
    const first = step === 1 || letters.length === 1;
    const l = first ? letters[0] : pick(rng, letters.slice(1));
    const say = first ? `${kidName} starts with the letter ${upper(l)}. Catch the ${upper(l)}!` : `Find a letter that is in your name, ${kidName}!`;
    const wrong = others(rng, ALPHABET, choiceCount(step) - 1, (x) => letters.includes(x));
    return question('r.pk.name', step, say, first ? `Catch the ${upper(l)}!` : `Find a letter in ${kidName}`, { kind: 'text', text: kidName },
      pickOne(l, wrong, (x) => txt(upper(x))), rng);
  },

  'r.pk.rhyme': ({ rng, step }) => {
    const group = pick(rng, RHYMES);
    const [target, match] = shuffle(rng, group);
    const wrong = others(rng, RHYMES.filter((g) => g !== group).flat(), choiceCount(step) - 1, () => false);
    return question('r.pk.rhyme', step, `Which one rhymes with ${target.word}?`, `What rhymes with ${target.word}?`, { kind: 'emoji', emoji: target.emoji, label: target.word },
      pickOne(match, wrong, (w) => emo(w.emoji, step >= 2 ? undefined : w.word)), rng, `Which one rhymes with ${target.word}? ${[match, ...wrong].map((w) => w.word).join(', ')}?`);
  },

  'r.pk.firstsound': ({ rng, step }) => {
    const letters = ALPHABET.filter((l) => !SOUND_SKIP.has(l) && l !== 'c' && l !== 'k');
    const l = pick(rng, letters);
    const target = LETTER_WORDS[l];
    // Another word with the same first sound, from the CVC list or other letter words.
    const same = CVC.find((w) => w.word[0] === l && w.word !== target.word);
    const wrong = others(rng, letters, choiceCount(step) - 1, (x) => x === l).map((x) => LETTER_WORDS[x]);
    if (same) {
      return question('r.pk.firstsound', step, `Which one starts like ${target.word}? ${target.word}...`, `Starts like ${target.word}?`, { kind: 'emoji', emoji: target.emoji, label: target.word },
        pickOne(same, wrong, (w) => emo(w.emoji, w.word)), rng);
    }
    return question('r.pk.firstsound', step, `Which picture starts with the letter ${upper(l)}?`, `Starts with ${upper(l)}?`, { kind: 'text', text: upper(l) },
      pickOne(target, wrong, (w) => emo(w.emoji, step === 1 ? w.word : undefined)), rng);
  },

  'r.k.lower': ({ rng, step }) => {
    const l = pick(rng, ALPHABET);
    return question('r.k.lower', step, `Find the little letter that matches big ${upper(l)}.`, `Little letter for ${upper(l)}`, { kind: 'text', text: upper(l) },
      pickOne(l, letterDistractors(rng, l, choiceCount(step) - 1, step), txt), rng);
  },

  'r.k.sounds': ({ rng, step }) => {
    const l = pick(rng, ALPHABET.filter((x) => !SOUND_SKIP.has(x)));
    const w = LETTER_WORDS[l];
    return question('r.k.sounds', step, `${w.word}. What letter makes the first sound in ${w.word}?`, `First sound in ${w.word}?`, { kind: 'emoji', emoji: w.emoji, label: step === 1 ? w.word : undefined },
      pickOne(l, letterDistractors(rng, l, choiceCount(step) - 1, step), txt), rng);
  },

  'r.k.cvc': ({ rng, step }) => {
    // Read the word, catch the matching picture.
    const w = pick(rng, CVC);
    const wrongPool = step === 3 ? CVC.filter((x) => x.word[1] === w.word[1] || x.word[0] === w.word[0]) : CVC;
    const wrong = others(rng, wrongPool.length > 4 ? wrongPool : CVC, choiceCount(step) - 1, (x) => x.word === w.word);
    return question('r.k.cvc', step, 'Read the word. Catch the picture that matches!', 'Read it!', { kind: 'text', text: w.word },
      pickOne(w, wrong, (x) => emo(x.emoji)), rng, `Sound it out: ${w.word.split('').join('... ')}. Which picture matches?`);
  },

  'r.k.sight1': ({ rng, step }) => {
    const w = pick(rng, SIGHT_K);
    return question('r.k.sight1', step, `Catch the word "${w}".`, 'Listen! 🔊', { kind: 'none' },
      pickOne(w, others(rng, SIGHT_K, choiceCount(step) - 1, (x) => x === w), txt), rng);
  },

  'r.k.syllables': ({ rng, step }) => {
    const pool = step === 1 ? SYLLABLES.filter((s) => s.n <= 2) : SYLLABLES;
    const s = pick(rng, pool);
    const nums = numberChoices(rng, s.n, step === 1 ? 2 : 3, 1, 4, 1);
    return question('r.k.syllables', step, `${s.word}. Clap it out! How many claps in ${s.word}?`, `Claps in "${s.word}"?`, { kind: 'emoji', emoji: s.emoji, label: s.word },
      nums.map((n) => ({ content: { kind: 'group', emoji: '👏', count: n }, correct: n === s.n })), rng);
  },

  'r.2.sight2': ({ rng, step }) => {
    const w = pick(rng, SIGHT_2);
    return question('r.2.sight2', step, `Catch the word "${w}".`, 'Listen! 🔊', { kind: 'none' },
      pickOne(w, others(rng, SIGHT_2, choiceCount(step) - 1, (x) => x === w || (step < 3 && x[0] === w[0])), txt), rng);
  },

  'r.2.compound': ({ rng, step }) => {
    const c = pick(rng, COMPOUNDS);
    const wrong = shuffle(rng, [...new Set([
      `${c.b}${c.a}`,
      ...COMPOUNDS.filter((x) => x !== c && (x.a === c.a || x.b === c.b)).map((x) => x.word),
      ...others(rng, COMPOUNDS, 3, (x) => x === c).map((x) => `${c.a}${x.b}`),
    ])].filter((x) => x !== c.word)).slice(0, choiceCount(step) - 1);
    return question('r.2.compound', step, `${c.a} plus ${c.b} makes what word?`, `${c.a} + ${c.b} = ?`, { kind: 'text', text: `${c.a} + ${c.b}` },
      pickOne(c.word, wrong, txt), rng);
  },

  'r.2.prefix': ({ rng, step }) => {
    const p = pick(rng, PREFIXES);
    const right = p.prefix === 'un' ? `not ${p.base}` : `${p.base} again`;
    const wrong = [p.prefix === 'un' ? `${p.base} again` : `not ${p.base}`, `very ${p.base}`, `${p.base} before`].slice(0, choiceCount(step) - 1);
    return question('r.2.prefix', step, `What does ${p.word} mean?`, `What does "${p.word}" mean?`, { kind: 'text', text: p.word },
      pickOne(right, wrong, txt), rng);
  },
};

export function randomLetter(rng: () => number) {
  return ALPHABET[randInt(rng, 0, 25)];
}
