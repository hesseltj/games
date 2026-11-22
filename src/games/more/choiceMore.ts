// Choice-style content for Missing Letter Monster (spelling) and Fact or Fib (science).
import { pick, shuffle, type Rng } from '../../core/random';
import { choiceCount, emo, pickOne, question, txt } from '../shared/build';
import type { ChoiceGen } from '../shared/types';
import { ALPHABET, CHUNK_WORDS, CVC, LETTER_WORDS, SOUND_SKIP, VOWELS } from '../content/words';
import { BLEND_DISTRACTORS, BLEND_WORDS, SPELL3, SPELL4, SPELL5 } from '../content/wordsUpper';

// ---------- Missing Letter Monster ----------
const CONFUSE: Record<string, string[]> = {
  a: ['e', 'o', 'u'], e: ['i', 'a', 'u'], i: ['e', 'a', 'y'], o: ['a', 'u', 'e'], u: ['o', 'a', 'i'],
  c: ['k', 's'], k: ['c', 'ck'], s: ['c', 'z'], ss: ['s', 'c'], ll: ['l', 'le'], ck: ['k', 'c'],
  ph: ['f', 'p'], f: ['ph', 'v'], gh: ['g', 'f'], ou: ['ow', 'oo'], ee: ['ea', 'ie'], ie: ['ei', 'ee'], ei: ['ie', 'ee'],
  y: ['i', 'e'], r: ['w', 'l'], m: ['n', 'mm'], n: ['m', 'nn'], t: ['d', 'tt'], d: ['t', 'b'], b: ['d', 'p'], p: ['b', 'q'], g: ['j', 'q'], h: ['n', 'w'], w: ['v', 'u'],
};
const REAL_WORDS = new Set([...CVC.map((w) => w.word), ...CHUNK_WORDS.map((w) => w.word), ...BLEND_WORDS.map((w) => w.word),
  'cot', 'cut', 'big', 'bag', 'bog', 'beg', 'hot', 'hit', 'hut', 'pin', 'pan', 'pun', 'fix', 'six', 'sat', 'set', 'sit', 'net', 'not', 'nut', 'pet', 'pit', 'pot', 'put',
  'bed', 'bad', 'bid', 'bud', 'mop', 'map', 'top', 'tip', 'tap', 'ten', 'tin', 'tan', 'bat', 'bet', 'bit', 'but', 'cap', 'cop', 'cup', 'hen', 'hem', 'him', 'ham', 'leg', 'log', 'lag', 'lug', 'mug', 'mag', 'rat', 'rot', 'rut', 'van', 'vat', 'web', 'wet', 'wit', 'fan', 'fun', 'fin', 'pig', 'peg', 'dig', 'dog', 'dug', 'bus', 'box', 'fox', 'bug', 'bun', 'sun', 'son', 'hat', 'cat']);

/** Wrong answers: same length as the blank, and never ones that spell a different real word. */
function confusers(rng: Rng, right: string, n: number, word?: string, at = 0): string[] {
  const makesWord = (x: string) => !!word && REAL_WORDS.has(word.slice(0, at) + x + word.slice(at + right.length));
  const base = (CONFUSE[right] ?? []).filter((x) => x.length === right.length);
  const rest = shuffle(rng, (right.length > 1 ? ['ai', 'ee', 'oa', 'ea', 'oo', 'ie', 'ou', 'ck', 'ss', 'll', 'sh', 'ch', 'th'] : ALPHABET))
    .filter((x) => x.length === right.length && x !== right && !base.includes(x));
  return [...base, ...rest].filter((x) => !makesWord(x)).slice(0, n);
}

function missing(skillId: string, word: string, at: number, len: number, emoji: string, step: number, rng: Rng, sentence?: string) {
  const right = word.slice(at, at + len);
  const shown = `${word.slice(0, at)}${'_'.repeat(len)}${word.slice(at + len)}`;
  const say = sentence ? `${word}. ${sentence} What is missing from ${word}?` : `${word}. What letter is missing from ${word}?`;
  return question(skillId, step, say, 'Feed the monster the missing letter!', { kind: 'emoji', emoji, label: shown.split('').join(' ') },
    pickOne(right, confusers(rng, right, choiceCount(step) - 1, word, at), txt), rng);
}

/** For longer words, the trickiest spot: a double letter, a vowel team, or a silent/odd letter. */
function trickySpot(w: string): [number, number] {
  const doubles = w.search(/(.)\1/);
  if (doubles >= 0) return [doubles, 2];
  const team = w.search(/ou|ee|ie|ei|ea|ai|oa|ph|gh/);
  if (team >= 0) return [team, 2];
  const v = [...w].findIndex((c, i) => i > 0 && VOWELS.includes(c));
  return [v >= 0 ? v : 1, 1];
}

export const MISSING_LETTER: Record<string, ChoiceGen> = {
  's.pk.firstletter': ({ rng, step }) => {
    const l = pick(rng, ALPHABET.filter((x) => !SOUND_SKIP.has(x)));
    const w = LETTER_WORDS[l];
    return question('s.pk.firstletter', step, `${w.word}. What letter does ${w.word} start with?`, `What does ${w.word} start with?`, { kind: 'emoji', emoji: w.emoji, label: `_${w.word.slice(1)}` },
      pickOne(l, shuffle(rng, ALPHABET.filter((x) => x !== l)).slice(0, choiceCount(step) - 1), (x) => txt(x)), rng);
  },
  's.k.missing': ({ rng, step }) => { const w = pick(rng, CVC); const at = step === 1 ? 1 : pick(rng, [0, 1, 2]); return missing('s.k.missing', w.word, at, 1, w.emoji, step, rng); },
  's.1.missing': ({ rng, step }) => {
    const w = pick(rng, BLEND_WORDS);
    const blend = w.chunks[0];
    return question('s.1.missing', step, `${w.word}. Which blend starts ${w.word}?`, 'Which blend is missing?', { kind: 'emoji', emoji: w.emoji, label: `_ _ ${w.word.slice(blend.length).split('').join(' ')}` },
      pickOne(blend, shuffle(rng, BLEND_DISTRACTORS.filter((b) => b !== blend)).slice(0, choiceCount(step) - 1), txt), rng);
  },
  's.2.missing': ({ rng, step }) => {
    const w = pick(rng, CHUNK_WORDS);
    const i = w.chunks.findIndex((c) => c.length === 2);
    const at = w.chunks.slice(0, Math.max(0, i)).join('').length;
    return missing('s.2.missing', w.word, at, i >= 0 ? w.chunks[i].length : 1, w.emoji, step, rng);
  },
  's.3.missing': ({ rng, step }) => { const w = pick(rng, SPELL3); const [at, len] = trickySpot(w.word); return missing('s.3.missing', w.word, at, len, w.emoji, step, rng, w.sentence); },
  's.4.missing': ({ rng, step }) => { const w = pick(rng, SPELL4); const [at, len] = trickySpot(w.word); return missing('s.4.missing', w.word, at, len, w.emoji, step, rng, w.sentence); },
  's.5.missing': ({ rng, step }) => { const w = pick(rng, SPELL5); const [at, len] = trickySpot(w.word); return missing('s.5.missing', w.word, at, len, w.emoji, step, rng, w.sentence); },
};

// ---------- Fact or Fib ----------
type F = [string, string, boolean];
const FACTS: Record<string, F[]> = {
  pk: [['🐟', 'Fish live in water.', true], ['🐄', 'Cows can fly.', false], ['☀️', 'The sun is hot.', true], ['🧊', 'Ice is warm.', false],
    ['🐦', 'Birds have feathers.', true], ['🍌', 'Bananas are blue.', false], ['👃', 'We smell with our nose.', true], ['🐶', 'Dogs say meow.', false]],
  k: [['🌱', 'Plants need water to grow.', true], ['🪨', 'Rocks are alive.', false], ['❄️', 'Snow is cold.', true], ['🌙', 'We see the Moon at night.', true],
    ['🐢', 'Turtles are very fast.', false], ['🍎', 'Apples grow on trees.', true], ['🐘', 'Elephants are tiny.', false], ['🧲', 'A push can make a ball roll.', true]],
  '1': [['🐛', 'A caterpillar turns into a butterfly.', true], ['🌞', 'The Sun is a star.', true], ['🐣', 'Chicks hatch from eggs.', true],
    ['🌳', 'Plant roots grow up into the sky.', false], ['🔦', 'A rock makes its own light.', false], ['🐸', 'Tadpoles grow into frogs.', true], ['🌙', 'The Moon makes its own light.', false]],
  '2': [['🧊', 'Ice is a solid.', true], ['💨', 'Air is a liquid.', false], ['🐝', 'Bees help flowers make seeds.', true], ['🐪', 'Camels live in the ocean.', false],
    ['🌋', 'A volcano is a kind of mountain.', true], ['🌊', 'Most of Earth is covered by water.', true], ['🐧', 'Penguins live in the desert.', false]],
  '3': [['🧲', 'Magnets pull on paper clips.', true], ['🪙', 'Magnets pull on pennies.', false], ['🦴', 'Fossils can show us animals from long ago.', true],
    ['🌡️', 'A thermometer measures how heavy something is.', false], ['👁️', 'Eye color is passed down from parents.', true], ['🚲', 'Kids are born knowing how to ride a bike.', false]],
  '4': [['🔊', 'Sound is made by vibrations.', true], ['💡', 'Light travels faster than sound.', true], ['🪵', 'Wood is a good conductor of electricity.', false],
    ['🏞️', 'Rivers can carve canyons over a long time.', true], ['🦆', 'Webbed feet help ducks fly.', false], ['🌎', 'Earth’s surface is always changing.', true]],
  '5': [['🌍', 'Day and night happen because Earth spins.', true], ['☀️', 'The Sun goes around Earth.', false], ['🍄', 'Mushrooms are decomposers.', true],
    ['🔥', 'Burning wood is a physical change.', false], ['♨️', 'Evaporation turns liquid water into vapor.', true], ['🪐', 'Mercury is the planet closest to the Sun.', true], ['🌿', 'Plants are consumers.', false]],
};

function factGen(skillId: string): ChoiceGen {
  return ({ rng, step }) => {
    const grade = skillId.split('.')[1];
    const [emoji, text, truth] = pick(rng, FACTS[grade]);
    return question(skillId, step, `True or false? ${text}`, 'Fact or fib?', { kind: 'emoji', emoji, label: text },
      [{ content: emo('✅', 'True'), correct: truth }, { content: emo('❌', 'False'), correct: !truth }], rng);
  };
}

export const FACT_OR_FIB: Record<string, ChoiceGen> = Object.fromEntries(
  ['pk', 'k', '1', '2', '3', '4', '5'].map((g) => [`sc.${g}.tf`, factGen(`sc.${g}.tf`)]),
);
