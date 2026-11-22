// Content for the "tap them in order" games: Sentence Scramble (reading) and Life Cycle Line-Up (science).
import { pick, shuffle, type Rng } from '../../core/random';

export interface SeqItem { text?: string; emoji?: string }
export interface SequenceQuestion {
  id: string;
  skillId: string;
  step: number;
  say: string;
  prompt: string;
  /** In the right order. */
  items: SeqItem[];
  /** Shuffled indexes into items, the order the pool shows them. */
  pool: number[];
  picture?: string;
}

let n = 0;
function make(skillId: string, step: number, rng: Rng, items: SeqItem[], say: string, prompt: string, picture?: string): SequenceQuestion {
  n += 1;
  let pool = shuffle(rng, items.map((_, i) => i));
  if (pool.every((v, i) => v === i) && items.length > 1) pool = [...pool.slice(1), pool[0]]; // never start solved
  return { id: `s${n}`, skillId, step, say, prompt, items, pool, picture };
}

// ---------- Sentences ----------
const SENT: Record<string, { s: string; e: string }[]> = {
  k: [
    { s: 'I see a cat.', e: '🐱' }, { s: 'The dog can run.', e: '🐶' }, { s: 'We like to play.', e: '🤸' }, { s: 'I am big.', e: '🐘' },
    { s: 'Look at me.', e: '👀' }, { s: 'The sun is hot.', e: '☀️' }, { s: 'I can hop.', e: '🐰' }, { s: 'My hat is red.', e: '🎩' },
  ],
  '1': [
    { s: 'The frog sat on a log.', e: '🐸' }, { s: 'We went to the park today.', e: '🌳' }, { s: 'My cat likes to nap.', e: '😺' },
    { s: 'The bus is big and yellow.', e: '🚌' }, { s: 'I will read a good book.', e: '📖' }, { s: 'The bird can fly so high.', e: '🐦' },
    { s: 'Mom made a cake for me.', e: '🎂' }, { s: 'Can you see the moon?', e: '🌙' },
  ],
  '2': [
    { s: 'The little puppy chased the red ball.', e: '🐶' }, { s: 'We planted seeds in the garden.', e: '🌱' },
    { s: 'My brother likes to play soccer.', e: '⚽' }, { s: 'The snow fell all night long.', e: '❄️' },
    { s: 'Grandma reads me a story at night.', e: '📚' }, { s: 'Where did you put my blue shoes?', e: '👟' },
    { s: 'The kite flew high in the sky.', e: '🪁' }, { s: 'We ate pizza for dinner tonight.', e: '🍕' },
  ],
  '3': [
    { s: 'After lunch, we went outside to play tag.', e: '🏃' }, { s: 'The scientist looked at the leaf under a microscope.', e: '🔬' },
    { s: 'My best friend lives next door to me.', e: '🏠' }, { s: 'Bees collect nectar from bright flowers.', e: '🐝' },
    { s: 'When it rains, we jump in the puddles.', e: '🌧️' }, { s: 'The library has thousands of amazing books.', e: '📚' },
  ],
  '4': [
    { s: 'Although it was raining, the team kept practicing.', e: '⚽' }, { s: 'The explorers crossed the desert on camels.', e: '🐪' },
    { s: 'My sister, who loves art, painted a beautiful mural.', e: '🎨' }, { s: 'Volcanoes can form new islands in the ocean.', e: '🌋' },
    { s: 'Before the race began, everyone stretched carefully.', e: '🏃' }, { s: 'The museum displayed fossils from long ago.', e: '🦕' },
  ],
  '5': [
    { s: 'Because the bridge was closed, we took the long way home.', e: '🌉' },
    { s: 'The astronauts trained for years before their mission to space.', e: '🚀' },
    { s: 'Although she was nervous, Maya gave an excellent speech.', e: '🎤' },
    { s: 'Scientists believe that the ocean floor holds many undiscovered creatures.', e: '🐙' },
    { s: 'When the storm finally passed, a brilliant rainbow appeared.', e: '🌈' },
  ],
};

const PICTURE_STORIES: SeqItem[][] = [
  [{ emoji: '😴', text: 'wake up' }, { emoji: '🪥', text: 'brush teeth' }, { emoji: '🥣', text: 'eat breakfast' }],
  [{ emoji: '🥚', text: 'crack eggs' }, { emoji: '🥣', text: 'mix' }, { emoji: '🎂', text: 'eat cake' }],
  [{ emoji: '🧦', text: 'socks' }, { emoji: '👟', text: 'shoes' }, { emoji: '🏃', text: 'run outside' }],
  [{ emoji: '🛁', text: 'bath' }, { emoji: '👕', text: 'pajamas' }, { emoji: '🛏️', text: 'bed' }],
  [{ emoji: '⛄', text: 'roll snow' }, { emoji: '🥕', text: 'add a nose' }, { emoji: '😊', text: 'snowman!' }],
  [{ emoji: '🎁', text: 'get a present' }, { emoji: '🎀', text: 'open it' }, { emoji: '🧸', text: 'play' }],
];

export function sentenceQuestion(skillId: string, step: number, rng: Rng): SequenceQuestion {
  if (skillId === 'r.pk.sequence') {
    const story = pick(rng, PICTURE_STORIES);
    return make(skillId, step, rng, story, `What happens first, next, and last? ${story.map((s) => s.text).join(', ')}. Tap them in order!`, 'First, next, last!');
  }
  const grade = skillId.split('.')[1];
  const { s, e } = pick(rng, SENT[grade] ?? SENT.k);
  const words = s.split(' ').map((w) => ({ text: w }));
  return make(skillId, step, rng, words, `Put the words in order to make the sentence: ${s}`, 'Build the sentence!', e);
}

// ---------- Life cycles and other science orders ----------
const it = (emoji: string, text: string): SeqItem => ({ emoji, text });
const ORDERS: Record<string, { title: string; items: SeqItem[] }[]> = {
  pk: [
    { title: 'a plant growing', items: [it('🌰', 'seed'), it('🌱', 'sprout'), it('🌻', 'flower')] },
    { title: 'growing up', items: [it('👶', 'baby'), it('🧒', 'kid'), it('🧑', 'grown-up')] },
    { title: 'ice getting warm', items: [it('🧊', 'ice'), it('💧', 'water'), it('♨️', 'steam')] },
  ],
  k: [
    { title: 'a chicken', items: [it('🥚', 'egg'), it('🐣', 'hatching'), it('🐔', 'hen')] },
    { title: 'a day', items: [it('🌅', 'morning'), it('☀️', 'afternoon'), it('🌙', 'night')] },
    { title: 'an apple', items: [it('🌸', 'blossom'), it('🍏', 'little apple'), it('🍎', 'ripe apple')] },
  ],
  '1': [
    { title: 'a butterfly', items: [it('🥚', 'egg'), it('🐛', 'caterpillar'), it('🟫', 'chrysalis'), it('🦋', 'butterfly')] },
    { title: 'the seasons, starting with spring', items: [it('🌷', 'spring'), it('☀️', 'summer'), it('🍂', 'fall'), it('❄️', 'winter')] },
    { title: 'a frog', items: [it('🥚', 'eggs'), it('〰️', 'tadpole'), it('🐸', 'frog')] },
  ],
  '2': [
    { title: 'a sunflower', items: [it('🌰', 'seed'), it('🌱', 'sprout'), it('🌿', 'young plant'), it('🌻', 'flower')] },
    { title: 'a chicken', items: [it('🥚', 'egg'), it('🐣', 'hatching'), it('🐥', 'chick'), it('🐔', 'hen')] },
    { title: 'a butterfly', items: [it('🥚', 'egg'), it('🐛', 'caterpillar'), it('🟫', 'chrysalis'), it('🦋', 'butterfly')] },
  ],
  '3': [
    { title: 'the water cycle', items: [it('♨️', 'evaporation'), it('☁️', 'condensation'), it('🌧️', 'precipitation'), it('🏞️', 'collection')] },
    { title: 'a food chain', items: [it('☀️', 'sun'), it('🌾', 'grass'), it('🐰', 'rabbit'), it('🦊', 'fox')] },
  ],
  '4': [
    { title: 'the phases of the Moon', items: [it('🌑', 'new moon'), it('🌒', 'crescent'), it('🌓', 'first quarter'), it('🌔', 'gibbous'), it('🌕', 'full moon')] },
    { title: 'an ocean food chain', items: [it('☀️', 'sun'), it('🌿', 'algae'), it('🦐', 'shrimp'), it('🐟', 'fish'), it('🦈', 'shark')] },
  ],
  '5': [
    { title: 'the planets, closest to the Sun first', items: [it('☿', 'Mercury'), it('🟡', 'Venus'), it('🌍', 'Earth'), it('🔴', 'Mars'), it('🟠', 'Jupiter')] },
    { title: 'the scientific method', items: [it('❓', 'ask a question'), it('💡', 'make a hypothesis'), it('🧪', 'experiment'), it('📊', 'look at results'), it('📝', 'conclusion')] },
    { title: 'water heating up', items: [it('🧊', 'solid ice'), it('💧', 'liquid water'), it('♨️', 'water vapor')] },
  ],
};

export function orderQuestion(skillId: string, step: number, rng: Rng): SequenceQuestion {
  const grade = skillId.split('.')[1];
  const o = pick(rng, ORDERS[grade] ?? ORDERS.k);
  return make(skillId, step, rng, o.items, `Put ${o.title} in order. Tap the first one, then the next.`, `Put ${o.title} in order!`);
}
