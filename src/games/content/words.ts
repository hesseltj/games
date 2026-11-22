// Word lists for the reading and spelling games. Every picture word has an emoji that
// renders on Android 11+ (Emoji 13 or older).

export interface PicWord { word: string; emoji: string }

/** Short-vowel consonant-vowel-consonant words (Kindergarten). */
export const CVC: PicWord[] = [
  { word: 'cat', emoji: '🐱' }, { word: 'dog', emoji: '🐶' }, { word: 'sun', emoji: '☀️' }, { word: 'hat', emoji: '🎩' },
  { word: 'bed', emoji: '🛏️' }, { word: 'pig', emoji: '🐷' }, { word: 'bus', emoji: '🚌' }, { word: 'cup', emoji: '🥤' },
  { word: 'box', emoji: '📦' }, { word: 'fox', emoji: '🦊' }, { word: 'bug', emoji: '🐛' }, { word: 'hen', emoji: '🐔' },
  { word: 'net', emoji: '🥅' }, { word: 'pen', emoji: '🖊️' }, { word: 'map', emoji: '🗺️' }, { word: 'bat', emoji: '🦇' },
  { word: 'rat', emoji: '🐀' }, { word: 'log', emoji: '🪵' }, { word: 'web', emoji: '🕸️' }, { word: 'van', emoji: '🚐' },
  { word: 'cap', emoji: '🧢' }, { word: 'pot', emoji: '🍲' }, { word: 'leg', emoji: '🦵' }, { word: 'bag', emoji: '👜' },
  { word: 'mug', emoji: '☕' }, { word: 'kid', emoji: '🧒' }, { word: 'six', emoji: '6️⃣' }, { word: 'ten', emoji: '🔟' },
];

/** Grade 2 words split into sound chunks (digraphs, blends, vowel teams, silent e). */
export interface ChunkWord extends PicWord { chunks: string[]; pattern: 'digraph' | 'vowel' }
export const CHUNK_WORDS: ChunkWord[] = [
  { word: 'ship', emoji: '🚢', chunks: ['sh', 'i', 'p'], pattern: 'digraph' },
  { word: 'fish', emoji: '🐟', chunks: ['f', 'i', 'sh'], pattern: 'digraph' },
  { word: 'shell', emoji: '🐚', chunks: ['sh', 'e', 'll'], pattern: 'digraph' },
  { word: 'chick', emoji: '🐥', chunks: ['ch', 'i', 'ck'], pattern: 'digraph' },
  { word: 'cheese', emoji: '🧀', chunks: ['ch', 'ee', 's', 'e'], pattern: 'digraph' },
  { word: 'thumb', emoji: '👍', chunks: ['th', 'u', 'mb'], pattern: 'digraph' },
  { word: 'whale', emoji: '🐋', chunks: ['wh', 'a', 'l', 'e'], pattern: 'digraph' },
  { word: 'duck', emoji: '🦆', chunks: ['d', 'u', 'ck'], pattern: 'digraph' },
  { word: 'sock', emoji: '🧦', chunks: ['s', 'o', 'ck'], pattern: 'digraph' },
  { word: 'bench', emoji: '🪑', chunks: ['b', 'e', 'n', 'ch'], pattern: 'digraph' },
  { word: 'train', emoji: '🚂', chunks: ['t', 'r', 'ai', 'n'], pattern: 'vowel' },
  { word: 'rain', emoji: '🌧️', chunks: ['r', 'ai', 'n'], pattern: 'vowel' },
  { word: 'snail', emoji: '🐌', chunks: ['s', 'n', 'ai', 'l'], pattern: 'vowel' },
  { word: 'boat', emoji: '⛵', chunks: ['b', 'oa', 't'], pattern: 'vowel' },
  { word: 'goat', emoji: '🐐', chunks: ['g', 'oa', 't'], pattern: 'vowel' },
  { word: 'tree', emoji: '🌳', chunks: ['t', 'r', 'ee'], pattern: 'vowel' },
  { word: 'bee', emoji: '🐝', chunks: ['b', 'ee'], pattern: 'vowel' },
  { word: 'sheep', emoji: '🐑', chunks: ['sh', 'ee', 'p'], pattern: 'vowel' },
  { word: 'leaf', emoji: '🍃', chunks: ['l', 'ea', 'f'], pattern: 'vowel' },
  { word: 'moon', emoji: '🌙', chunks: ['m', 'oo', 'n'], pattern: 'vowel' },
  { word: 'kite', emoji: '🪁', chunks: ['k', 'i', 't', 'e'], pattern: 'vowel' },
  { word: 'bike', emoji: '🚲', chunks: ['b', 'i', 'k', 'e'], pattern: 'vowel' },
  { word: 'cake', emoji: '🎂', chunks: ['c', 'a', 'k', 'e'], pattern: 'vowel' },
  { word: 'snake', emoji: '🐍', chunks: ['s', 'n', 'a', 'k', 'e'], pattern: 'vowel' },
  { word: 'bone', emoji: '🦴', chunks: ['b', 'o', 'n', 'e'], pattern: 'vowel' },
  { word: 'nose', emoji: '👃', chunks: ['n', 'o', 's', 'e'], pattern: 'vowel' },
];
export const CHUNK_DISTRACTORS = ['sh', 'ch', 'th', 'wh', 'ck', 'ai', 'ee', 'oa', 'ea', 'oo', 'ay', 'ow'];

/** Grade 2 spelling list (whole words, letter tiles). */
export const SPELL2: PicWord[] = [
  ...CHUNK_WORDS.map(({ word, emoji }) => ({ word, emoji })),
  { word: 'frog', emoji: '🐸' }, { word: 'drum', emoji: '🥁' }, { word: 'crab', emoji: '🦀' }, { word: 'plant', emoji: '🪴' },
  { word: 'truck', emoji: '🚚' }, { word: 'clock', emoji: '🕐' }, { word: 'star', emoji: '⭐' }, { word: 'bird', emoji: '🐦' },
  { word: 'horse', emoji: '🐴' }, { word: 'corn', emoji: '🌽' }, { word: 'book', emoji: '📖' }, { word: 'tooth', emoji: '🦷' },
  { word: 'shirt', emoji: '👕' }, { word: 'smile', emoji: '😊' }, { word: 'house', emoji: '🏠' }, { word: 'cloud', emoji: '☁️' },
];

export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
export const VOWELS = ['a', 'e', 'i', 'o', 'u'];

/** A picture word for each letter, used for letter sounds ("the first sound in ball"). */
export const LETTER_WORDS: Record<string, PicWord> = {
  a: { word: 'apple', emoji: '🍎' }, b: { word: 'ball', emoji: '⚽' }, c: { word: 'cat', emoji: '🐱' }, d: { word: 'dog', emoji: '🐶' },
  e: { word: 'egg', emoji: '🥚' }, f: { word: 'fish', emoji: '🐟' }, g: { word: 'goat', emoji: '🐐' }, h: { word: 'hat', emoji: '🎩' },
  i: { word: 'igloo', emoji: '🏠' }, j: { word: 'juice', emoji: '🧃' }, k: { word: 'kite', emoji: '🪁' }, l: { word: 'lion', emoji: '🦁' },
  m: { word: 'moon', emoji: '🌙' }, n: { word: 'nose', emoji: '👃' }, o: { word: 'octopus', emoji: '🐙' }, p: { word: 'pig', emoji: '🐷' },
  q: { word: 'queen', emoji: '👸' }, r: { word: 'rabbit', emoji: '🐰' }, s: { word: 'sun', emoji: '☀️' }, t: { word: 'turtle', emoji: '🐢' },
  u: { word: 'umbrella', emoji: '☂️' }, v: { word: 'violin', emoji: '🎻' }, w: { word: 'watermelon', emoji: '🍉' }, x: { word: 'fox', emoji: '🦊' },
  y: { word: 'yo-yo', emoji: '🪀' }, z: { word: 'zebra', emoji: '🦓' },
};
// Letters whose picture word doesn't start with that letter's usual sound.
export const SOUND_SKIP = new Set(['i', 'q', 'x']);

/** Groups of rhyming picture words. */
export const RHYMES: PicWord[][] = [
  [{ word: 'cat', emoji: '🐱' }, { word: 'hat', emoji: '🎩' }, { word: 'bat', emoji: '🦇' }],
  [{ word: 'dog', emoji: '🐶' }, { word: 'log', emoji: '🪵' }, { word: 'frog', emoji: '🐸' }],
  [{ word: 'bee', emoji: '🐝' }, { word: 'tree', emoji: '🌳' }, { word: 'key', emoji: '🔑' }],
  [{ word: 'cake', emoji: '🎂' }, { word: 'snake', emoji: '🐍' }, { word: 'rake', emoji: '🧹' }],
  [{ word: 'star', emoji: '⭐' }, { word: 'car', emoji: '🚗' }, { word: 'jar', emoji: '🍯' }],
  [{ word: 'moon', emoji: '🌙' }, { word: 'spoon', emoji: '🥄' }, { word: 'balloon', emoji: '🎈' }],
  [{ word: 'boat', emoji: '⛵' }, { word: 'goat', emoji: '🐐' }, { word: 'coat', emoji: '🧥' }],
  [{ word: 'bear', emoji: '🐻' }, { word: 'chair', emoji: '🪑' }, { word: 'pear', emoji: '🍐' }],
  [{ word: 'mouse', emoji: '🐭' }, { word: 'house', emoji: '🏠' }],
  [{ word: 'fish', emoji: '🐟' }, { word: 'dish', emoji: '🍽️' }],
];

export const SIGHT_K = ['the', 'a', 'I', 'see', 'can', 'we', 'like', 'my', 'go', 'to', 'is', 'and', 'you', 'it', 'in', 'up', 'me', 'look', 'said', 'big'];
export const SIGHT_2 = ['because', 'does', 'write', 'would', 'very', 'which', 'their', 'around', 'always', 'been', 'before', 'both', 'buy', 'found', 'many', 'pull', 'these', 'those', 'upon', 'why', 'wish', 'work', 'could', 'were', 'there', 'where', 'every', 'again'];

export const SYLLABLES: { word: string; emoji: string; n: number }[] = [
  { word: 'cat', emoji: '🐱', n: 1 }, { word: 'sun', emoji: '☀️', n: 1 }, { word: 'dog', emoji: '🐶', n: 1 }, { word: 'tree', emoji: '🌳', n: 1 },
  { word: 'rabbit', emoji: '🐰', n: 2 }, { word: 'pencil', emoji: '✏️', n: 2 }, { word: 'monkey', emoji: '🐒', n: 2 }, { word: 'pizza', emoji: '🍕', n: 2 },
  { word: 'tiger', emoji: '🐯', n: 2 }, { word: 'robot', emoji: '🤖', n: 2 },
  { word: 'banana', emoji: '🍌', n: 3 }, { word: 'butterfly', emoji: '🦋', n: 3 }, { word: 'elephant', emoji: '🐘', n: 3 },
  { word: 'dinosaur', emoji: '🦕', n: 3 }, { word: 'kangaroo', emoji: '🦘', n: 3 },
  { word: 'watermelon', emoji: '🍉', n: 4 }, { word: 'helicopter', emoji: '🚁', n: 4 }, { word: 'caterpillar', emoji: '🐛', n: 4 },
];

export const COMPOUNDS: { a: string; b: string; word: string; emoji: string }[] = [
  { a: 'sun', b: 'flower', word: 'sunflower', emoji: '🌻' }, { a: 'rain', b: 'bow', word: 'rainbow', emoji: '🌈' },
  { a: 'snow', b: 'man', word: 'snowman', emoji: '⛄' }, { a: 'star', b: 'fish', word: 'starfish', emoji: '⭐' },
  { a: 'cup', b: 'cake', word: 'cupcake', emoji: '🧁' }, { a: 'foot', b: 'ball', word: 'football', emoji: '🏈' },
  { a: 'pop', b: 'corn', word: 'popcorn', emoji: '🍿' }, { a: 'tooth', b: 'brush', word: 'toothbrush', emoji: '🪥' },
  { a: 'butter', b: 'fly', word: 'butterfly', emoji: '🦋' }, { a: 'back', b: 'pack', word: 'backpack', emoji: '🎒' },
  { a: 'lady', b: 'bug', word: 'ladybug', emoji: '🐞' }, { a: 'water', b: 'melon', word: 'watermelon', emoji: '🍉' },
];

export const PREFIXES: { word: string; base: string; prefix: 'un' | 're' }[] = [
  { word: 'unhappy', base: 'happy', prefix: 'un' }, { word: 'unlock', base: 'lock', prefix: 'un' }, { word: 'unkind', base: 'kind', prefix: 'un' },
  { word: 'unsafe', base: 'safe', prefix: 'un' }, { word: 'untie', base: 'tie', prefix: 'un' }, { word: 'unfair', base: 'fair', prefix: 'un' },
  { word: 'redo', base: 'do', prefix: 're' }, { word: 'reread', base: 'read', prefix: 're' }, { word: 'refill', base: 'fill', prefix: 're' },
  { word: 'replay', base: 'play', prefix: 're' }, { word: 'rewrite', base: 'write', prefix: 're' }, { word: 'rebuild', base: 'build', prefix: 're' },
];

// ---- Vocabulary ----

/** Everyday picture words (Pre-K step 1–2, K step 3). */
export const VOCAB: PicWord[] = [
  { word: 'apple', emoji: '🍎' }, { word: 'banana', emoji: '🍌' }, { word: 'carrot', emoji: '🥕' }, { word: 'grapes', emoji: '🍇' },
  { word: 'car', emoji: '🚗' }, { word: 'train', emoji: '🚂' }, { word: 'airplane', emoji: '✈️' }, { word: 'boat', emoji: '⛵' },
  { word: 'dog', emoji: '🐶' }, { word: 'cat', emoji: '🐱' }, { word: 'cow', emoji: '🐮' }, { word: 'duck', emoji: '🦆' },
  { word: 'ball', emoji: '⚽' }, { word: 'book', emoji: '📖' }, { word: 'shoe', emoji: '👟' }, { word: 'hat', emoji: '🎩' },
  { word: 'flower', emoji: '🌸' }, { word: 'tree', emoji: '🌳' }, { word: 'house', emoji: '🏠' }, { word: 'moon', emoji: '🌙' },
  { word: 'cake', emoji: '🎂' }, { word: 'bed', emoji: '🛏️' }, { word: 'cup', emoji: '🥤' }, { word: 'clock', emoji: '🕐' },
];
export const VOCAB_K: PicWord[] = [
  { word: 'broccoli', emoji: '🥦' }, { word: 'pineapple', emoji: '🍍' }, { word: 'helicopter', emoji: '🚁' }, { word: 'rocket', emoji: '🚀' },
  { word: 'penguin', emoji: '🐧' }, { word: 'octopus', emoji: '🐙' }, { word: 'giraffe', emoji: '🦒' }, { word: 'kangaroo', emoji: '🦘' },
  { word: 'umbrella', emoji: '☂️' }, { word: 'scissors', emoji: '✂️' }, { word: 'glasses', emoji: '👓' }, { word: 'tent', emoji: '⛺' },
  { word: 'volcano', emoji: '🌋' }, { word: 'island', emoji: '🏝️' }, { word: 'castle', emoji: '🏰' }, { word: 'bridge', emoji: '🌉' },
  { word: 'magnet', emoji: '🧲' }, { word: 'compass', emoji: '🧭' }, { word: 'ladder', emoji: '🪜' }, { word: 'anchor', emoji: '⚓' },
];

export const OPPOSITES: [PicWord, PicWord][] = [
  [{ word: 'hot', emoji: '🔥' }, { word: 'cold', emoji: '🧊' }],
  [{ word: 'day', emoji: '☀️' }, { word: 'night', emoji: '🌙' }],
  [{ word: 'happy', emoji: '😀' }, { word: 'sad', emoji: '😢' }],
  [{ word: 'up', emoji: '⬆️' }, { word: 'down', emoji: '⬇️' }],
  [{ word: 'big', emoji: '🐘' }, { word: 'small', emoji: '🐭' }],
  [{ word: 'fast', emoji: '🚀' }, { word: 'slow', emoji: '🐢' }],
  [{ word: 'awake', emoji: '😃' }, { word: 'asleep', emoji: '😴' }],
  [{ word: 'loud', emoji: '📢' }, { word: 'quiet', emoji: '🤫' }],
  [{ word: 'wet', emoji: '💦' }, { word: 'dry', emoji: '🌵' }],
  [{ word: 'stop', emoji: '🛑' }, { word: 'go', emoji: '🟢' }],
];

export const CATEGORIES: { name: string; plural: string; items: string[] }[] = [
  { name: 'fruit', plural: 'fruits', items: ['🍎', '🍌', '🍇', '🍓', '🍊', '🍐', '🍒', '🍉'] },
  { name: 'animal', plural: 'animals', items: ['🐶', '🐱', '🐮', '🐷', '🐵', '🦁', '🐰', '🐸'] },
  { name: 'vehicle', plural: 'things that go', items: ['🚗', '🚌', '🚂', '✈️', '🚲', '🚀', '🚁', '⛵'] },
  { name: 'piece of clothing', plural: 'clothes', items: ['👕', '👖', '👗', '🧦', '🧢', '🧥', '👟', '🧤'] },
  { name: 'toy', plural: 'toys', items: ['🧸', '🪀', '🪁', '🎈', '🧩', '🎲', '🪆', '🛹'] },
  { name: 'vegetable', plural: 'vegetables', items: ['🥕', '🥦', '🌽', '🥒', '🍆', '🥔', '🧅', '🥬'] },
];

export const SYNONYMS: [string, string][] = [
  ['big', 'large'], ['small', 'tiny'], ['happy', 'glad'], ['fast', 'quick'], ['start', 'begin'], ['shout', 'yell'],
  ['smart', 'clever'], ['scared', 'afraid'], ['close', 'shut'], ['jump', 'leap'], ['pretty', 'lovely'], ['sick', 'ill'],
  ['look', 'see'], ['funny', 'silly'], ['cold', 'chilly'], ['mad', 'angry'],
];
export const ANTONYMS: [string, string][] = [
  ['hot', 'cold'], ['up', 'down'], ['open', 'closed'], ['full', 'empty'], ['early', 'late'], ['heavy', 'light'],
  ['first', 'last'], ['give', 'take'], ['win', 'lose'], ['push', 'pull'], ['loud', 'quiet'], ['clean', 'dirty'],
  ['true', 'false'], ['inside', 'outside'], ['always', 'never'], ['remember', 'forget'],
];

export const PLURALS: { one: string; many: string; wrong: string[] }[] = [
  { one: 'fox', many: 'foxes', wrong: ['foxs', 'foxies'] }, { one: 'box', many: 'boxes', wrong: ['boxs', 'boxen'] },
  { one: 'bus', many: 'buses', wrong: ['buss', 'busies'] }, { one: 'dish', many: 'dishes', wrong: ['dishs', 'dishies'] },
  { one: 'lunch', many: 'lunches', wrong: ['lunchs', 'lunchies'] }, { one: 'baby', many: 'babies', wrong: ['babys', 'babyes'] },
  { one: 'puppy', many: 'puppies', wrong: ['puppys', 'puppyes'] }, { one: 'cat', many: 'cats', wrong: ['cates', 'caties'] },
  { one: 'mouse', many: 'mice', wrong: ['mouses', 'mousies'] }, { one: 'child', many: 'children', wrong: ['childs', 'childes'] },
  { one: 'foot', many: 'feet', wrong: ['foots', 'footes'] }, { one: 'tooth', many: 'teeth', wrong: ['tooths', 'toothes'] },
  { one: 'man', many: 'men', wrong: ['mans', 'manes'] }, { one: 'leaf', many: 'leaves', wrong: ['leafs', 'leafes'] },
];

export const CONTRACTIONS: { long: string; short: string; wrong: string[] }[] = [
  { long: 'do not', short: "don't", wrong: ["doesn't", "didn't"] }, { long: 'can not', short: "can't", wrong: ["won't", "couldn't"] },
  { long: 'I am', short: "I'm", wrong: ["I'll", "I've"] }, { long: 'it is', short: "it's", wrong: ["its'", "isn't"] },
  { long: 'we are', short: "we're", wrong: ["we'll", "were"] }, { long: 'they are', short: "they're", wrong: ["they'll", "there"] },
  { long: 'you will', short: "you'll", wrong: ["you're", "you've"] }, { long: 'is not', short: "isn't", wrong: ["it's", "aren't"] },
  { long: 'she is', short: "she's", wrong: ["she'll", "shes"] }, { long: 'let us', short: "let's", wrong: ["lets'", "let'll"] },
  { long: 'did not', short: "didn't", wrong: ["don't", "doesn't"] }, { long: 'I will', short: "I'll", wrong: ["I'm", "Ill"] },
];
