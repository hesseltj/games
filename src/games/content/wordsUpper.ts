// Word lists for grades 1, 3, 4 and 5.
import type { PicWord } from './words';

export interface Chunked extends PicWord { chunks: string[]; meaning?: string }

/** Grade 1 consonant blends for Word Builder. */
export const BLEND_WORDS: Chunked[] = [
  { word: 'frog', emoji: '🐸', chunks: ['fr', 'o', 'g'] }, { word: 'crab', emoji: '🦀', chunks: ['cr', 'a', 'b'] },
  { word: 'drum', emoji: '🥁', chunks: ['dr', 'u', 'm'] }, { word: 'flag', emoji: '🚩', chunks: ['fl', 'a', 'g'] },
  { word: 'plant', emoji: '🪴', chunks: ['pl', 'a', 'n', 't'] }, { word: 'sled', emoji: '🛷', chunks: ['sl', 'e', 'd'] },
  { word: 'clock', emoji: '🕐', chunks: ['cl', 'o', 'ck'] }, { word: 'truck', emoji: '🚚', chunks: ['tr', 'u', 'ck'] },
  { word: 'brush', emoji: '🖌️', chunks: ['br', 'u', 'sh'] }, { word: 'skunk', emoji: '🦨', chunks: ['sk', 'u', 'n', 'k'] },
  { word: 'spoon', emoji: '🥄', chunks: ['sp', 'oo', 'n'] }, { word: 'smile', emoji: '😊', chunks: ['sm', 'i', 'l', 'e'] },
  { word: 'grapes', emoji: '🍇', chunks: ['gr', 'a', 'p', 'e', 's'] }, { word: 'snack', emoji: '🍿', chunks: ['sn', 'a', 'ck'] },
];
export const BLEND_DISTRACTORS = ['bl', 'cl', 'fl', 'gr', 'tr', 'st', 'sn', 'sp', 'dr', 'cr', 'br', 'sw', 'pl', 'sl', 'fr', 'sk', 'sm', 'gl'];

/** Grade 3 multi-syllable words for Word Builder. */
export const SYLLABLE_WORDS: Chunked[] = [
  { word: 'rainbow', emoji: '🌈', chunks: ['rain', 'bow'] }, { word: 'pumpkin', emoji: '🎃', chunks: ['pump', 'kin'] },
  { word: 'butterfly', emoji: '🦋', chunks: ['but', 'ter', 'fly'] }, { word: 'dinosaur', emoji: '🦕', chunks: ['di', 'no', 'saur'] },
  { word: 'basket', emoji: '🧺', chunks: ['bas', 'ket'] }, { word: 'candle', emoji: '🕯️', chunks: ['can', 'dle'] },
  { word: 'rocket', emoji: '🚀', chunks: ['rock', 'et'] }, { word: 'penguin', emoji: '🐧', chunks: ['pen', 'guin'] },
  { word: 'popcorn', emoji: '🍿', chunks: ['pop', 'corn'] }, { word: 'sandwich', emoji: '🥪', chunks: ['sand', 'wich'] },
  { word: 'tomato', emoji: '🍅', chunks: ['to', 'ma', 'to'] }, { word: 'umbrella', emoji: '☂️', chunks: ['um', 'brel', 'la'] },
  { word: 'elephant', emoji: '🐘', chunks: ['el', 'e', 'phant'] }, { word: 'kangaroo', emoji: '🦘', chunks: ['kan', 'ga', 'roo'] },
  { word: 'pencil', emoji: '✏️', chunks: ['pen', 'cil'] }, { word: 'computer', emoji: '💻', chunks: ['com', 'pu', 'ter'] },
];

/** Grades 4–5: build words from prefixes, roots and suffixes. */
export const MORPH_WORDS: Chunked[] = [
  { word: 'unbreakable', emoji: '🛡️', chunks: ['un', 'break', 'able'], meaning: 'not able to be broken' },
  { word: 'replaying', emoji: '🔁', chunks: ['re', 'play', 'ing'], meaning: 'playing again' },
  { word: 'helpless', emoji: '🆘', chunks: ['help', 'less'], meaning: 'without help' },
  { word: 'careful', emoji: '⚠️', chunks: ['care', 'ful'], meaning: 'full of care' },
  { word: 'disagree', emoji: '🙅', chunks: ['dis', 'agree'], meaning: 'to not agree' },
  { word: 'preview', emoji: '👀', chunks: ['pre', 'view'], meaning: 'to see before' },
  { word: 'misspell', emoji: '✏️', chunks: ['mis', 'spell'], meaning: 'to spell wrong' },
  { word: 'teacher', emoji: '🧑‍🏫', chunks: ['teach', 'er'], meaning: 'a person who teaches' },
  { word: 'kindness', emoji: '💗', chunks: ['kind', 'ness'], meaning: 'being kind' },
  { word: 'quickly', emoji: '⚡', chunks: ['quick', 'ly'], meaning: 'in a quick way' },
  { word: 'enjoyment', emoji: '😄', chunks: ['enjoy', 'ment'], meaning: 'the feeling of enjoying' },
  { word: 'unhappiness', emoji: '😢', chunks: ['un', 'happi', 'ness'], meaning: 'the feeling of not being happy' },
];
export const MORPH5_WORDS: Chunked[] = [
  { word: 'telephone', emoji: '☎️', chunks: ['tele', 'phone'], meaning: 'a tool that carries sound far away' },
  { word: 'telescope', emoji: '🔭', chunks: ['tele', 'scope'], meaning: 'a tool for seeing far away' },
  { word: 'microscope', emoji: '🔬', chunks: ['micro', 'scope'], meaning: 'a tool for seeing very small things' },
  { word: 'biology', emoji: '🧬', chunks: ['bio', 'logy'], meaning: 'the study of life' },
  { word: 'geography', emoji: '🗺️', chunks: ['geo', 'graphy'], meaning: 'writing about and mapping the earth' },
  { word: 'autograph', emoji: '✍️', chunks: ['auto', 'graph'], meaning: 'writing your own name' },
  { word: 'transport', emoji: '🚚', chunks: ['trans', 'port'], meaning: 'to carry across' },
  { word: 'thermometer', emoji: '🌡️', chunks: ['thermo', 'meter'], meaning: 'a tool that measures heat' },
  { word: 'aquarium', emoji: '🐠', chunks: ['aqua', 'rium'], meaning: 'a place with water for fish' },
  { word: 'photograph', emoji: '📷', chunks: ['photo', 'graph'], meaning: 'a picture made with light' },
  { word: 'inspector', emoji: '🕵️', chunks: ['in', 'spect', 'or'], meaning: 'a person who looks closely' },
  { word: 'unbelievable', emoji: '😲', chunks: ['un', 'believ', 'able'], meaning: 'not able to be believed' },
];
export const MORPH_DISTRACTORS = ['un', 're', 'dis', 'pre', 'mis', 'ful', 'less', 'ness', 'able', 'er', 'ly', 'ment', 'ing', 'tele', 'micro', 'bio', 'geo', 'graph', 'scope', 'port', 'auto', 'aqua'];

export interface SpellWord { word: string; emoji: string; sentence: string }
const sw = (word: string, emoji: string, sentence: string): SpellWord => ({ word, emoji, sentence });

export const SPELL1: SpellWord[] = [
  sw('frog', '🐸', 'The frog can hop.'), sw('crab', '🦀', 'A crab walks sideways.'), sw('drum', '🥁', 'I can play the drum.'),
  sw('flag', '🚩', 'The flag is red.'), sw('duck', '🦆', 'The duck swims in the pond.'), sw('ship', '🚢', 'The ship sails on the sea.'),
  sw('fish', '🐟', 'A fish lives in water.'), sw('milk', '🥛', 'I drink milk.'), sw('hand', '✋', 'Raise your hand.'),
  sw('tent', '⛺', 'We sleep in a tent.'), sw('bell', '🔔', 'Ring the bell.'), sw('sock', '🧦', 'I lost a sock.'),
  sw('cake', '🎂', 'We ate birthday cake.'), sw('bike', '🚲', 'I ride my bike.'), sw('kite', '🪁', 'Fly the kite.'),
  sw('moon', '🌙', 'The moon is bright.'), sw('book', '📖', 'Read a book.'), sw('rain', '🌧️', 'The rain is wet.'),
  sw('chin', '🧔', 'Point to your chin.'), sw('swim', '🏊', 'I like to swim.'),
];
export const SPELL3: SpellWord[] = [
  sw('because', '📝', 'I smiled because I was happy.'), sw('friend', '🤝', 'My friend likes to play tag.'),
  sw('school', '🏫', 'We learn at school.'), sw('animal', '🐾', 'A dog is an animal.'),
  sw('people', '👪', 'Many people came to the party.'), sw('enough', '📝', 'Do we have enough snacks?'),
  sw('favorite', '⭐', 'Blue is my favorite color.'), sw('different', '📝', 'These two shells are different.'),
  sw('answer', '💬', 'Raise your hand to answer.'), sw('listen', '👂', 'Please listen to the story.'),
  sw('kitchen', '🍳', 'Dad is cooking in the kitchen.'), sw('giraffe', '🦒', 'A giraffe has a long neck.'),
  sw('penguin', '🐧', 'A penguin cannot fly.'), sw('pumpkin', '🎃', 'We carved a pumpkin.'),
  sw('turtle', '🐢', 'The turtle is slow.'), sw('basket', '🧺', 'Put the apples in the basket.'),
  sw('rocket', '🚀', 'The rocket flew to space.'), sw('thought', '💭', 'I thought about my dream.'),
];
export const SPELL4: SpellWord[] = [
  sw('adventure', '🗺️', 'We went on an adventure in the woods.'), sw('library', '📚', 'I borrowed a book from the library.'),
  sw('question', '❓', 'Can I ask a question?'), sw('surprise', '🎉', 'The party was a surprise.'),
  sw('vacation', '🏖️', 'We went to the beach on vacation.'), sw('science', '🔬', 'Science is my favorite subject.'),
  sw('island', '🏝️', 'The island is in the ocean.'), sw('thousand', '📝', 'A thousand stars filled the sky.'),
  sw('weather', '⛅', 'The weather is sunny today.'), sw('journey', '🧭', 'The journey took three days.'),
  sw('important', '❗', 'It is important to be kind.'), sw('experiment', '🧪', 'We did an experiment with magnets.'),
  sw('calendar', '📅', 'Mark the date on the calendar.'), sw('scissors', '✂️', 'Cut the paper with scissors.'),
  sw('guitar', '🎸', 'She plays the guitar.'), sw('volcano', '🌋', 'The volcano erupted.'),
];
export const SPELL5: SpellWord[] = [
  sw('necessary', '📝', 'Water is necessary for life.'), sw('environment', '🌳', 'We protect the environment.'),
  sw('temperature', '🌡️', 'The temperature dropped at night.'), sw('government', '🏛️', 'The government makes laws.'),
  sw('definitely', '✅', 'I will definitely come to your game.'), sw('restaurant', '🍽️', 'We ate dinner at a restaurant.'),
  sw('rhythm', '🥁', 'Clap to the rhythm of the song.'), sw('knowledge', '🧠', 'Reading builds knowledge.'),
  sw('separate', '↔️', 'Separate the red blocks from the blue ones.'), sw('occasion', '🎉', 'A birthday is a special occasion.'),
  sw('beginning', '▶️', 'Start at the beginning.'), sw('believe', '💭', 'I believe you can do it.'),
  sw('achieve', '🏆', 'You can achieve your goals.'), sw('microscope', '🔬', 'Look at the leaf under the microscope.'),
  sw('telescope', '🔭', 'We saw Saturn through a telescope.'), sw('exercise', '🏃', 'Exercise keeps you healthy.'),
];

export const SIGHT_1 = ['after', 'again', 'any', 'ask', 'by', 'could', 'every', 'fly', 'from', 'give', 'going', 'had', 'has', 'her', 'him', 'his', 'how', 'just', 'know', 'let', 'live', 'may', 'of', 'old', 'once', 'open', 'over', 'put', 'round', 'some', 'stop', 'take', 'thank', 'them', 'then', 'think', 'walk', 'were', 'when'];

export const ENDINGS: { base: string; ending: 'ing' | 'ed' | 's'; right: string; wrong: string[] }[] = [
  { base: 'jump', ending: 'ing', right: 'jumping', wrong: ['jumpping', 'jumped', 'jumps'] },
  { base: 'run', ending: 'ing', right: 'running', wrong: ['runing', 'runned', 'runs'] },
  { base: 'play', ending: 'ed', right: 'played', wrong: ['playd', 'plaied', 'playing'] },
  { base: 'hop', ending: 'ed', right: 'hopped', wrong: ['hoped', 'hopping', 'hops'] },
  { base: 'bake', ending: 'ing', right: 'baking', wrong: ['bakeing', 'baked', 'bakking'] },
  { base: 'swim', ending: 'ing', right: 'swimming', wrong: ['swiming', 'swimed', 'swims'] },
  { base: 'look', ending: 'ed', right: 'looked', wrong: ['lookt', 'looking', 'lookked'] },
  { base: 'wish', ending: 's', right: 'wishes', wrong: ['wishs', 'wished', 'wishing'] },
  { base: 'help', ending: 'ed', right: 'helped', wrong: ['helpt', 'helpping', 'helps'] },
  { base: 'smile', ending: 'ed', right: 'smiled', wrong: ['smileed', 'smilled', 'smiling'] },
];

export const SUFFIXES: { word: string; right: string; wrong: string[] }[] = [
  { word: 'helpful', right: 'full of help', wrong: ['without help', 'help again', 'not help'] },
  { word: 'fearless', right: 'without fear', wrong: ['full of fear', 'fear again', 'very afraid'] },
  { word: 'painter', right: 'a person who paints', wrong: ['painting again', 'not painting', 'full of paint'] },
  { word: 'slowly', right: 'in a slow way', wrong: ['not slow', 'a person who is slow', 'slow again'] },
  { word: 'washable', right: 'can be washed', wrong: ['washed before', 'not washed', 'a person who washes'] },
  { word: 'colorful', right: 'full of color', wrong: ['without color', 'color again', 'one color'] },
  { word: 'careless', right: 'without care', wrong: ['full of care', 'care again', 'very careful'] },
  { word: 'farmer', right: 'a person who farms', wrong: ['a big farm', 'farming again', 'without a farm'] },
  { word: 'softly', right: 'in a soft way', wrong: ['very hard', 'soft again', 'full of soft'] },
  { word: 'breakable', right: 'can be broken', wrong: ['already broken', 'never broken', 'a person who breaks'] },
];

export const HOMOPHONES: { sentence: string; right: string; wrong: string[] }[] = [
  { sentence: 'I have ___ dogs.', right: 'two', wrong: ['to', 'too'] },
  { sentence: 'I want to come ___!', right: 'too', wrong: ['two', 'to'] },
  { sentence: 'The ___ is shining.', right: 'sun', wrong: ['son'] },
  { sentence: 'Please ___ your name.', right: 'write', wrong: ['right'] },
  { sentence: 'Put your bag over ___.', right: 'there', wrong: ['their', 'they’re'] },
  { sentence: 'The kids lost ___ ball.', right: 'their', wrong: ['there', 'they’re'] },
  { sentence: 'The sky is ___.', right: 'blue', wrong: ['blew'] },
  { sentence: 'Can you ___ the music?', right: 'hear', wrong: ['here'] },
  { sentence: 'She ___ the race!', right: 'won', wrong: ['one'] },
  { sentence: 'I ate a juicy ___.', right: 'pear', wrong: ['pair', 'pare'] },
  { sentence: 'We waited for an ___.', right: 'hour', wrong: ['our'] },
  { sentence: 'Mix the ___ and eggs to bake bread.', right: 'flour', wrong: ['flower'] },
  { sentence: 'I ___ you would win.', right: 'knew', wrong: ['new'] },
  { sentence: 'The ___ ran into the forest.', right: 'deer', wrong: ['dear'] },
];

export const CONTEXT3: { sentence: string; word: string; right: string; wrong: string[] }[] = [
  { sentence: 'The puppy was so ravenous that it gobbled up the whole bowl of food.', word: 'ravenous', right: 'very hungry', wrong: ['very sleepy', 'very small', 'very quiet'] },
  { sentence: 'The tiny ant carried a crumb that was enormous compared to its body.', word: 'enormous', right: 'very big', wrong: ['very tasty', 'very old', 'very light'] },
  { sentence: 'After running the race, Mia was so exhausted she fell asleep right away.', word: 'exhausted', right: 'very tired', wrong: ['very excited', 'very fast', 'very cold'] },
  { sentence: 'The baby was fragile, so we held him very gently.', word: 'fragile', right: 'easy to hurt or break', wrong: ['very loud', 'very strong', 'hungry'] },
  { sentence: 'Sam was reluctant to jump into the cold pool, so he stood at the edge for a long time.', word: 'reluctant', right: 'not wanting to', wrong: ['excited', 'in a hurry', 'proud'] },
  { sentence: 'The library was so silent you could hear a pin drop.', word: 'silent', right: 'very quiet', wrong: ['very busy', 'very bright', 'very crowded'] },
  { sentence: 'Grandma was delighted when we surprised her with flowers.', word: 'delighted', right: 'very happy', wrong: ['very angry', 'very confused', 'very bored'] },
  { sentence: 'The trail was so steep that we had to climb slowly up the hill.', word: 'steep', right: 'going up sharply', wrong: ['flat and smooth', 'wet and muddy', 'short'] },
];
export const CONTEXT5: { sentence: string; word: string; right: string; wrong: string[] }[] = [
  { sentence: 'The scientist was meticulous, checking every measurement three times.', word: 'meticulous', right: 'very careful about details', wrong: ['very messy', 'very quick', 'very funny'] },
  { sentence: 'The desert is arid; it gets almost no rain all year.', word: 'arid', right: 'very dry', wrong: ['very cold', 'very crowded', 'very green'] },
  { sentence: 'Even after losing twice, the team remained optimistic about the next game.', word: 'optimistic', right: 'hopeful', wrong: ['angry', 'tired', 'confused'] },
  { sentence: 'The instructions were ambiguous, so half the class did the wrong page.', word: 'ambiguous', right: 'unclear', wrong: ['very long', 'very easy', 'printed'] },
  { sentence: 'The diligent student finished every assignment early.', word: 'diligent', right: 'hard-working', wrong: ['lazy', 'forgetful', 'noisy'] },
  { sentence: 'The ancient castle had stood on the hill for over a thousand years.', word: 'ancient', right: 'very old', wrong: ['very tall', 'brand new', 'broken'] },
  { sentence: 'The cat was cautious, sniffing the box slowly before stepping inside.', word: 'cautious', right: 'careful', wrong: ['careless', 'sleepy', 'hungry'] },
  { sentence: 'The crowd was so jubilant after the win that they danced in the streets.', word: 'jubilant', right: 'full of joy', wrong: ['very upset', 'very quiet', 'confused'] },
];

export const FIGURATIVE4: { phrase: string; right: string; wrong: string[] }[] = [
  { phrase: 'It’s raining cats and dogs.', right: 'It is raining very hard.', wrong: ['Pets are falling from the sky.', 'It is a little sprinkly.', 'Animals are playing outside.'] },
  { phrase: 'She was as busy as a bee.', right: 'She was very busy.', wrong: ['She was buzzing.', 'She made honey.', 'She was stung.'] },
  { phrase: 'Break a leg!', right: 'Good luck!', wrong: ['Be careful, you might fall!', 'Go to the doctor.', 'Run faster!'] },
  { phrase: 'He has a heart of gold.', right: 'He is very kind.', wrong: ['He is very rich.', 'He is sick.', 'He loves jewelry.'] },
  { phrase: 'That test was a piece of cake.', right: 'The test was easy.', wrong: ['The test was about baking.', 'The test was hard.', 'We ate cake during the test.'] },
  { phrase: 'Hold your horses!', right: 'Wait a moment.', wrong: ['Go ride a horse.', 'Hurry up!', 'Feed the animals.'] },
  { phrase: 'The classroom was as quiet as a mouse.', right: 'The classroom was very quiet.', wrong: ['There was a mouse in the room.', 'It was very loud.', 'The room was small.'] },
  { phrase: 'I’m all ears.', right: 'I am listening carefully.', wrong: ['My ears are big.', 'I can’t hear you.', 'I want earmuffs.'] },
];
export const ROOTS: { root: string; meaning: string; example: string }[] = [
  { root: 'tele', meaning: 'far', example: 'telescope' }, { root: 'bio', meaning: 'life', example: 'biology' },
  { root: 'graph', meaning: 'write', example: 'autograph' }, { root: 'micro', meaning: 'small', example: 'microscope' },
  { root: 'aqua', meaning: 'water', example: 'aquarium' }, { root: 'port', meaning: 'carry', example: 'transport' },
  { root: 'spect', meaning: 'look', example: 'inspect' }, { root: 'photo', meaning: 'light', example: 'photograph' },
  { root: 'geo', meaning: 'earth', example: 'geography' }, { root: 'auto', meaning: 'self', example: 'automatic' },
  { root: 'phon', meaning: 'sound', example: 'telephone' }, { root: 'therm', meaning: 'heat', example: 'thermometer' },
];
export const FIGURATIVE5: { sentence: string; type: 'simile' | 'metaphor' | 'personification' | 'hyperbole' }[] = [
  { sentence: 'The wind whispered through the trees.', type: 'personification' },
  { sentence: 'Her smile was as bright as the sun.', type: 'simile' },
  { sentence: 'My backpack weighs a ton!', type: 'hyperbole' },
  { sentence: 'The classroom was a zoo.', type: 'metaphor' },
  { sentence: 'He ran like the wind.', type: 'simile' },
  { sentence: 'The sun smiled down on us.', type: 'personification' },
  { sentence: 'I’ve told you a million times!', type: 'hyperbole' },
  { sentence: 'Time is a thief.', type: 'metaphor' },
  { sentence: 'The leaves danced in the breeze.', type: 'personification' },
  { sentence: 'The baby’s skin was as soft as silk.', type: 'simile' },
  { sentence: 'I’m so hungry I could eat a horse.', type: 'hyperbole' },
  { sentence: 'The stars were diamonds in the sky.', type: 'metaphor' },
];

export const WORD_CATEGORIES: { name: string; words: string[] }[] = [
  { name: 'fruit', words: ['apple', 'banana', 'grape', 'peach', 'cherry', 'lemon'] },
  { name: 'animal', words: ['horse', 'tiger', 'rabbit', 'zebra', 'goat', 'monkey'] },
  { name: 'color', words: ['purple', 'orange', 'yellow', 'green', 'brown', 'pink'] },
  { name: 'body part', words: ['elbow', 'knee', 'finger', 'nose', 'ankle', 'shoulder'] },
  { name: 'thing that goes', words: ['truck', 'train', 'wagon', 'boat', 'plane', 'scooter'] },
];
export const SHADES: string[][] = [
  ['tiny', 'small', 'big', 'huge'], ['chilly', 'cold', 'freezing'], ['whisper', 'talk', 'shout'], ['walk', 'jog', 'sprint'],
  ['sip', 'drink', 'gulp'], ['glad', 'happy', 'overjoyed'], ['damp', 'wet', 'soaked'], ['warm', 'hot', 'boiling'], ['nibble', 'eat', 'devour'],
];
export const ABC_WORDS = ['apple', 'banana', 'cactus', 'dragon', 'eagle', 'forest', 'garden', 'helmet', 'igloo', 'jacket', 'kitten', 'lemon', 'magnet', 'nickel', 'ocean', 'pencil', 'quilt', 'rocket', 'salad', 'tiger', 'umbrella', 'violin', 'wagon', 'yellow', 'zipper', 'bridge', 'butter', 'button', 'basket', 'carrot', 'candle', 'castle', 'sunny', 'summer', 'sugar', 'river', 'robot', 'ruler'];
export const ANALOGIES4: { a: string; b: string; c: string; right: string; wrong: string[] }[] = [
  { a: 'bird', b: 'fly', c: 'fish', right: 'swim', wrong: ['walk', 'sing', 'climb'] },
  { a: 'hot', b: 'cold', c: 'up', right: 'down', wrong: ['high', 'over', 'top'] },
  { a: 'puppy', b: 'dog', c: 'kitten', right: 'cat', wrong: ['mouse', 'pet', 'yarn'] },
  { a: 'glove', b: 'hand', c: 'sock', right: 'foot', wrong: ['shoe', 'leg', 'arm'] },
  { a: 'day', b: 'sun', c: 'night', right: 'moon', wrong: ['dark', 'sleep', 'bed'] },
  { a: 'pen', b: 'write', c: 'scissors', right: 'cut', wrong: ['paper', 'draw', 'sharp'] },
  { a: 'cow', b: 'milk', c: 'hen', right: 'eggs', wrong: ['feathers', 'farm', 'corn'] },
  { a: 'eye', b: 'see', c: 'ear', right: 'hear', wrong: ['smell', 'loud', 'head'] },
];
export const ANALOGIES5: { a: string; b: string; c: string; right: string; wrong: string[] }[] = [
  { a: 'author', b: 'book', c: 'composer', right: 'song', wrong: ['piano', 'concert', 'paint'] },
  { a: 'chapter', b: 'book', c: 'verse', right: 'poem', wrong: ['word', 'letter', 'story'] },
  { a: 'thermometer', b: 'temperature', c: 'clock', right: 'time', wrong: ['hour', 'alarm', 'wall'] },
  { a: 'brave', b: 'cowardly', c: 'generous', right: 'selfish', wrong: ['kind', 'rich', 'giving'] },
  { a: 'pilot', b: 'airplane', c: 'captain', right: 'ship', wrong: ['team', 'ocean', 'army'] },
  { a: 'seed', b: 'tree', c: 'caterpillar', right: 'butterfly', wrong: ['leaf', 'cocoon', 'worm'] },
  { a: 'cold', b: 'freezing', c: 'warm', right: 'scorching', wrong: ['cool', 'mild', 'chilly'] },
  { a: 'library', b: 'books', c: 'museum', right: 'exhibits', wrong: ['tickets', 'guards', 'buses'] },
];
export const CONFUSED: { sentence: string; right: string; wrong: string[] }[] = [
  { sentence: 'The cold weather will ___ the plants.', right: 'affect', wrong: ['effect'] },
  { sentence: 'The medicine had a good ___.', right: 'effect', wrong: ['affect'] },
  { sentence: 'Everyone came ___ Sam.', right: 'except', wrong: ['accept'] },
  { sentence: 'Please ___ this gift.', right: 'accept', wrong: ['except'] },
  { sentence: 'My dog is bigger ___ yours.', right: 'than', wrong: ['then'] },
  { sentence: 'Don’t ___ your keys!', right: 'lose', wrong: ['loose'] },
  { sentence: 'My tooth is ___.', right: 'loose', wrong: ['lose'] },
  { sentence: '___ going to love this book.', right: 'You’re', wrong: ['Your'] },
  { sentence: 'Is this ___ jacket?', right: 'your', wrong: ['you’re'] },
  { sentence: 'The dog wagged ___ tail.', right: 'its', wrong: ['it’s'] },
  { sentence: '___ time to go home.', right: 'It’s', wrong: ['Its'] },
  { sentence: 'We walked ___ the park.', right: 'through', wrong: ['threw', 'thorough'] },
];
export const PREFIX4: { base: string; meaning: string; right: string; wrong: string[] }[] = [
  { base: 'happy', meaning: 'not happy', right: 'un', wrong: ['re', 'pre', 'mis'] },
  { base: 'build', meaning: 'build again', right: 're', wrong: ['un', 'dis', 'pre'] },
  { base: 'heat', meaning: 'heat before', right: 'pre', wrong: ['re', 'un', 'dis'] },
  { base: 'agree', meaning: 'not agree', right: 'dis', wrong: ['re', 'pre', 'mis'] },
  { base: 'spell', meaning: 'spell wrong', right: 'mis', wrong: ['re', 'un', 'pre'] },
  { base: 'tie', meaning: 'undo the tie', right: 'un', wrong: ['re', 'pre', 'dis'] },
  { base: 'view', meaning: 'see before', right: 'pre', wrong: ['re', 'un', 'mis'] },
  { base: 'obey', meaning: 'not obey', right: 'dis', wrong: ['re', 'pre', 'un'] },
];
