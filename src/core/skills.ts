import type { Grade, Subject } from './types';

export interface Skill {
  id: string;
  subject: Subject;
  grade: Grade;
  name: string;
  /** Number of difficulty steps (1-based). */
  steps: number;
  /** Games that can generate questions for this skill. */
  games: string[];
}

const NP = ['numberPop'];
const LL = ['letterLagoon'];
const PW = ['pictureWords'];
const SS = ['scienceSafari'];
const SORT = ['sortIt'];
const PT = ['patternTrain'];
const RP = ['robotPath'];
const BS = ['bakeShop'];
const HM = ['helpersAndMe'];
const ME = ['mapExplorer'];
const TT = ['timeTravelers'];

/** Wave 1 skill map (see docs/DESIGN.md §4). Skills with no games yet are tracked but not playable. */
export const SKILLS: Skill[] = [
  // Math, Pre-K
  { id: 'm.pk.colors', subject: 'math', grade: 'PK', name: 'Colors', steps: 3, games: NP },
  { id: 'm.pk.shapes', subject: 'math', grade: 'PK', name: 'Shapes', steps: 3, games: NP },
  { id: 'm.pk.count5', subject: 'math', grade: 'PK', name: 'Count to 5', steps: 3, games: ['numberPop', 'bakeShop'] },
  { id: 'm.pk.count10', subject: 'math', grade: 'PK', name: 'Count to 10', steps: 3, games: NP },
  { id: 'm.pk.moreless', subject: 'math', grade: 'PK', name: 'More or less', steps: 3, games: NP },
  // Math, K
  { id: 'm.k.count20', subject: 'math', grade: 'K', name: 'Count to 20', steps: 3, games: NP },
  { id: 'm.k.numrec', subject: 'math', grade: 'K', name: 'Know numbers 0–20', steps: 3, games: NP },
  { id: 'm.k.compare', subject: 'math', grade: 'K', name: 'Bigger and smaller', steps: 3, games: NP },
  { id: 'm.k.add5', subject: 'math', grade: 'K', name: 'Add within 5', steps: 3, games: NP },
  { id: 'm.k.sub5', subject: 'math', grade: 'K', name: 'Subtract within 5', steps: 3, games: NP },
  { id: 'm.k.make10', subject: 'math', grade: 'K', name: 'Make 10', steps: 3, games: NP },
  { id: 'm.k.shapes3d', subject: 'math', grade: 'K', name: '3D shapes', steps: 2, games: NP },
  { id: 'm.k.coins', subject: 'math', grade: 'K', name: 'Know your coins', steps: 3, games: BS },
  // Math, 1 (placeholders so grade 1 kids have something until Wave 2)
  { id: 'm.1.add20', subject: 'math', grade: '1', name: 'Add & subtract within 20', steps: 3, games: NP },
  { id: 'm.1.place100', subject: 'math', grade: '1', name: 'Tens and ones', steps: 3, games: ['numberPop', 'bakeShop'] },
  { id: 'm.1.compare100', subject: 'math', grade: '1', name: 'Compare numbers to 100', steps: 3, games: NP },
  { id: 'm.1.add10s', subject: 'math', grade: '1', name: 'Add and subtract tens', steps: 3, games: NP },
  { id: 'm.1.missing', subject: 'math', grade: '1', name: 'Missing numbers (8 + ? = 13)', steps: 3, games: NP },
  { id: 'm.1.shapes', subject: 'math', grade: '1', name: 'Shape attributes', steps: 2, games: NP },
  { id: 'm.1.time', subject: 'math', grade: '1', name: 'Time to the hour and half hour', steps: 2, games: BS },
  { id: 'm.1.coins', subject: 'math', grade: '1', name: 'Counting dimes and pennies', steps: 2, games: BS },
  // Math, 2
  { id: 'm.2.add20', subject: 'math', grade: '2', name: 'Fast facts within 20', steps: 3, games: NP },
  { id: 'm.2.add100', subject: 'math', grade: '2', name: 'Add & subtract within 100', steps: 3, games: NP },
  { id: 'm.2.place1000', subject: 'math', grade: '2', name: 'Place value to 1000', steps: 3, games: NP },
  { id: 'm.2.skip', subject: 'math', grade: '2', name: 'Skip counting', steps: 3, games: NP },
  { id: 'm.2.evenodd', subject: 'math', grade: '2', name: 'Even and odd', steps: 2, games: NP },
  { id: 'm.2.time', subject: 'math', grade: '2', name: 'Telling time', steps: 3, games: BS },
  { id: 'm.2.money', subject: 'math', grade: '2', name: 'Counting money', steps: 3, games: BS },
  { id: 'm.2.measure', subject: 'math', grade: '2', name: 'Measuring length', steps: 2, games: BS },
  // Math, 3 (so the oldest has a next level to reach)
  { id: 'm.3.times', subject: 'math', grade: '3', name: 'Times tables', steps: 3, games: NP },
  { id: 'm.3.divide', subject: 'math', grade: '3', name: 'Division facts', steps: 3, games: NP },
  { id: 'm.3.fractions', subject: 'math', grade: '3', name: 'Fractions', steps: 3, games: NP },
  { id: 'm.3.round', subject: 'math', grade: '3', name: 'Rounding', steps: 3, games: NP },
  { id: 'm.3.area', subject: 'math', grade: '3', name: 'Area', steps: 2, games: NP },
  { id: 'm.3.add1000', subject: 'math', grade: '3', name: 'Add & subtract within 1000', steps: 3, games: NP },
  { id: 'm.3.time', subject: 'math', grade: '3', name: 'Time to the minute', steps: 2, games: BS },
  { id: 'm.3.elapsed', subject: 'math', grade: '3', name: 'Elapsed time', steps: 2, games: BS },
  // Math, 4
  { id: 'm.4.multiply', subject: 'math', grade: '4', name: 'Multi-digit multiplication', steps: 3, games: NP },
  { id: 'm.4.divrem', subject: 'math', grade: '4', name: 'Division with remainders', steps: 2, games: NP },
  { id: 'm.4.equivfrac', subject: 'math', grade: '4', name: 'Equivalent fractions', steps: 2, games: NP },
  { id: 'm.4.decimals', subject: 'math', grade: '4', name: 'Decimals', steps: 3, games: NP },
  { id: 'm.4.factors', subject: 'math', grade: '4', name: 'Factors', steps: 2, games: NP },
  { id: 'm.4.change', subject: 'math', grade: '4', name: 'Making change', steps: 3, games: BS },
  // Math, 5
  { id: 'm.5.fracadd', subject: 'math', grade: '5', name: 'Adding and subtracting fractions', steps: 3, games: NP },
  { id: 'm.5.decimalops', subject: 'math', grade: '5', name: 'Decimal operations', steps: 3, games: NP },
  { id: 'm.5.volume', subject: 'math', grade: '5', name: 'Volume', steps: 2, games: NP },
  { id: 'm.5.order', subject: 'math', grade: '5', name: 'Order of operations', steps: 3, games: NP },
  { id: 'm.5.fracof', subject: 'math', grade: '5', name: 'Fraction of a number', steps: 2, games: NP },
  { id: 'm.5.money', subject: 'math', grade: '5', name: 'Money with decimals', steps: 3, games: BS },

  // Reading, Pre-K
  { id: 'r.pk.letters', subject: 'reading', grade: 'PK', name: 'Uppercase letters', steps: 3, games: LL },
  { id: 'r.pk.name', subject: 'reading', grade: 'PK', name: 'Letters in my name', steps: 2, games: LL },
  { id: 'r.pk.rhyme', subject: 'reading', grade: 'PK', name: 'Rhymes', steps: 3, games: LL },
  { id: 'r.pk.firstsound', subject: 'reading', grade: 'PK', name: 'Beginning sounds', steps: 3, games: LL },
  // Reading, K
  { id: 'r.k.lower', subject: 'reading', grade: 'K', name: 'Lowercase letters', steps: 3, games: LL },
  { id: 'r.k.sounds', subject: 'reading', grade: 'K', name: 'Letter sounds', steps: 3, games: LL },
  { id: 'r.k.cvc', subject: 'reading', grade: 'K', name: 'Blend short words (c-a-t)', steps: 3, games: ['letterLagoon', 'wordBuilder'] },
  { id: 'r.k.sight1', subject: 'reading', grade: 'K', name: 'Sight words', steps: 3, games: LL },
  { id: 'r.k.syllables', subject: 'reading', grade: 'K', name: 'Syllables', steps: 2, games: LL },
  // Reading, 1
  { id: 'r.1.blends', subject: 'reading', grade: '1', name: 'Blends (fr, cl, st…)', steps: 3, games: ['wordBuilder'] },
  { id: 'r.1.sight', subject: 'reading', grade: '1', name: 'Grade 1 sight words', steps: 3, games: LL },
  { id: 'r.1.endings', subject: 'reading', grade: '1', name: 'Endings -ing, -ed, -es', steps: 2, games: LL },
  { id: 'r.1.comprehend', subject: 'reading', grade: '1', name: 'Reading short stories', steps: 3, games: ['storySpot'] },
  // Reading, 2
  { id: 'r.2.vowels', subject: 'reading', grade: '2', name: 'Vowel teams and silent e', steps: 3, games: ['wordBuilder'] },
  { id: 'r.2.digraphs', subject: 'reading', grade: '2', name: 'sh, ch, th, wh, ck', steps: 3, games: ['wordBuilder'] },
  { id: 'r.2.sight2', subject: 'reading', grade: '2', name: 'Grade 2 sight words', steps: 3, games: LL },
  { id: 'r.2.compound', subject: 'reading', grade: '2', name: 'Compound words', steps: 3, games: LL },
  { id: 'r.2.comprehend', subject: 'reading', grade: '2', name: 'Reading comprehension', steps: 3, games: ['storySpot'] },
  { id: 'r.2.prefix', subject: 'reading', grade: '2', name: 'Prefixes un- and re-', steps: 2, games: LL },
  // Reading, 3–5
  { id: 'r.3.syllables', subject: 'reading', grade: '3', name: 'Multi-syllable words', steps: 3, games: ['wordBuilder'] },
  { id: 'r.3.suffix', subject: 'reading', grade: '3', name: 'Suffixes -ful, -less, -er, -ly, -able', steps: 3, games: LL },
  { id: 'r.3.homophones', subject: 'reading', grade: '3', name: 'Homophones', steps: 2, games: LL },
  { id: 'r.3.context', subject: 'reading', grade: '3', name: 'Word meaning from context', steps: 3, games: LL },
  { id: 'r.3.comprehend', subject: 'reading', grade: '3', name: 'Grade 3 comprehension', steps: 3, games: ['storySpot'] },
  { id: 'r.4.morph', subject: 'reading', grade: '4', name: 'Prefixes, roots and suffixes', steps: 3, games: ['wordBuilder'] },
  { id: 'r.4.figurative', subject: 'reading', grade: '4', name: 'Idioms and similes', steps: 3, games: LL },
  { id: 'r.4.roots', subject: 'reading', grade: '4', name: 'Greek and Latin roots', steps: 3, games: LL },
  { id: 'r.4.context', subject: 'reading', grade: '4', name: 'Context clues', steps: 3, games: LL },
  { id: 'r.4.comprehend', subject: 'reading', grade: '4', name: 'Main idea and theme', steps: 3, games: ['storySpot'] },
  { id: 'r.5.morph', subject: 'reading', grade: '5', name: 'Greek and Latin word parts', steps: 3, games: ['wordBuilder'] },
  { id: 'r.5.figurative', subject: 'reading', grade: '5', name: 'Figurative language', steps: 3, games: LL },
  { id: 'r.5.context', subject: 'reading', grade: '5', name: 'Advanced vocabulary', steps: 3, games: LL },
  { id: 'r.5.comprehend', subject: 'reading', grade: '5', name: 'Inference and author’s purpose', steps: 3, games: ['storySpot'] },

  // Spelling & vocabulary
  { id: 's.pk.picwords', subject: 'spelling', grade: 'PK', name: 'Picture words', steps: 3, games: PW },
  { id: 's.pk.opposites', subject: 'spelling', grade: 'PK', name: 'Opposites', steps: 3, games: PW },
  { id: 's.pk.categories', subject: 'spelling', grade: 'PK', name: 'What goes together', steps: 3, games: PW },
  { id: 's.k.spellcvc', subject: 'spelling', grade: 'K', name: 'Spell short words', steps: 3, games: ['spellingBee'] },
  { id: 's.k.picwords', subject: 'spelling', grade: 'K', name: 'More picture words', steps: 3, games: PW },
  { id: 's.k.opposites', subject: 'spelling', grade: 'K', name: 'Opposite words', steps: 3, games: PW },
  { id: 's.1.spell', subject: 'spelling', grade: '1', name: 'Grade 1 spelling words', steps: 3, games: ['spellingBee'] },
  { id: 's.1.vocab', subject: 'spelling', grade: '1', name: 'Word categories', steps: 3, games: PW },
  { id: 's.2.spell', subject: 'spelling', grade: '2', name: 'Grade 2 spelling words', steps: 3, games: ['spellingBee'] },
  { id: 's.2.synonyms', subject: 'spelling', grade: '2', name: 'Words that mean the same', steps: 3, games: PW },
  { id: 's.2.antonyms', subject: 'spelling', grade: '2', name: 'Words that mean the opposite', steps: 3, games: PW },
  { id: 's.2.plurals', subject: 'spelling', grade: '2', name: 'Plurals', steps: 3, games: PW },
  { id: 's.2.contractions', subject: 'spelling', grade: '2', name: 'Contractions', steps: 3, games: PW },
  { id: 's.3.spell', subject: 'spelling', grade: '3', name: 'Grade 3 spelling words', steps: 3, games: ['spellingBee'] },
  { id: 's.3.shades', subject: 'spelling', grade: '3', name: 'Shades of meaning', steps: 3, games: PW },
  { id: 's.3.abc', subject: 'spelling', grade: '3', name: 'ABC order', steps: 3, games: PW },
  { id: 's.4.spell', subject: 'spelling', grade: '4', name: 'Grade 4 spelling words', steps: 3, games: ['spellingBee'] },
  { id: 's.4.analogies', subject: 'spelling', grade: '4', name: 'Analogies', steps: 3, games: PW },
  { id: 's.4.prefixes', subject: 'spelling', grade: '4', name: 'Choosing prefixes', steps: 3, games: PW },
  { id: 's.5.spell', subject: 'spelling', grade: '5', name: 'Grade 5 spelling words', steps: 3, games: ['spellingBee'] },
  { id: 's.5.analogies', subject: 'spelling', grade: '5', name: 'Harder analogies', steps: 3, games: PW },
  { id: 's.5.confused', subject: 'spelling', grade: '5', name: 'Commonly confused words', steps: 2, games: PW },

  // Science
  { id: 'sc.pk.animals', subject: 'science', grade: 'PK', name: 'Animals and their sounds', steps: 3, games: SS },
  { id: 'sc.pk.senses', subject: 'science', grade: 'PK', name: 'Five senses', steps: 3, games: SS },
  { id: 'sc.pk.weather', subject: 'science', grade: 'PK', name: 'Weather', steps: 3, games: SS },
  { id: 'sc.pk.bodyparts', subject: 'science', grade: 'PK', name: 'Body parts', steps: 3, games: SS },
  { id: 'sc.k.living', subject: 'science', grade: 'K', name: 'Living and not living', steps: 2, games: SORT },
  { id: 'sc.k.needs', subject: 'science', grade: 'K', name: 'What living things need', steps: 3, games: SS },
  { id: 'sc.k.weather', subject: 'science', grade: 'K', name: 'Dressing for the weather', steps: 3, games: SS },
  { id: 'sc.k.pushpull', subject: 'science', grade: 'K', name: 'Push and pull', steps: 2, games: SORT },
  { id: 'sc.1.babies', subject: 'science', grade: '1', name: 'Animals and their babies', steps: 3, games: SS },
  { id: 'sc.1.plantparts', subject: 'science', grade: '1', name: 'Parts of a plant', steps: 3, games: SS },
  { id: 'sc.1.light', subject: 'science', grade: '1', name: 'Light sources', steps: 2, games: SORT },
  { id: 'sc.1.sky', subject: 'science', grade: '1', name: 'Day and night sky', steps: 2, games: SORT },
  { id: 'sc.2.matter', subject: 'science', grade: '2', name: 'Solids, liquids and gases', steps: 3, games: SORT },
  { id: 'sc.2.habitats', subject: 'science', grade: '2', name: 'Habitats', steps: 3, games: SORT },
  { id: 'sc.2.lifecycle', subject: 'science', grade: '2', name: 'Life cycles', steps: 3, games: SS },
  { id: 'sc.2.earth', subject: 'science', grade: '2', name: 'Land and water', steps: 3, games: SS },
  { id: 'sc.2.pollinate', subject: 'science', grade: '2', name: 'Seeds and pollination', steps: 3, games: SS },
  { id: 'sc.3.magnets', subject: 'science', grade: '3', name: 'Magnets', steps: 2, games: SORT },
  { id: 'sc.3.traits', subject: 'science', grade: '3', name: 'Inherited and learned traits', steps: 2, games: SORT },
  { id: 'sc.3.weather', subject: 'science', grade: '3', name: 'Weather and climate', steps: 3, games: SS },
  { id: 'sc.3.fossils', subject: 'science', grade: '3', name: 'Fossils', steps: 3, games: SS },
  { id: 'sc.4.energy', subject: 'science', grade: '4', name: 'Forms of energy', steps: 3, games: SORT },
  { id: 'sc.4.conductors', subject: 'science', grade: '4', name: 'Conductors and insulators', steps: 2, games: SORT },
  { id: 'sc.4.adaptations', subject: 'science', grade: '4', name: 'Animal adaptations', steps: 3, games: SS },
  { id: 'sc.4.erosion', subject: 'science', grade: '4', name: 'Erosion', steps: 3, games: SS },
  { id: 'sc.5.changes', subject: 'science', grade: '5', name: 'Physical and chemical changes', steps: 2, games: SORT },
  { id: 'sc.5.ecosystem', subject: 'science', grade: '5', name: 'Producers, consumers, decomposers', steps: 3, games: SORT },
  { id: 'sc.5.space', subject: 'science', grade: '5', name: 'Earth and space', steps: 3, games: SS },
  { id: 'sc.5.water', subject: 'science', grade: '5', name: 'The water cycle', steps: 3, games: SS },

  // Logic
  { id: 'l.pk.match', subject: 'logic', grade: 'PK', name: 'Matching', steps: 3, games: ['memoryFlip'] },
  { id: 'l.pk.sort', subject: 'logic', grade: 'PK', name: 'Same color', steps: 3, games: PT },
  { id: 'l.pk.pattern', subject: 'logic', grade: 'PK', name: 'AB patterns', steps: 3, games: PT },
  { id: 'l.pk.maze', subject: 'logic', grade: 'PK', name: 'Simple paths', steps: 3, games: RP },
  { id: 'l.k.pattern', subject: 'logic', grade: 'K', name: 'Harder patterns', steps: 3, games: PT },
  { id: 'l.k.oddone', subject: 'logic', grade: 'K', name: 'Odd one out', steps: 3, games: PT },
  { id: 'l.k.memory', subject: 'logic', grade: 'K', name: 'Memory', steps: 3, games: ['memoryFlip'] },
  { id: 'l.k.maze', subject: 'logic', grade: 'K', name: 'Mazes', steps: 3, games: RP },
  { id: 'l.k.sudoku3', subject: 'logic', grade: 'K', name: '3×3 picture sudoku', steps: 3, games: ['pictureSudoku'] },
  { id: 'l.1.pattern', subject: 'logic', grade: '1', name: 'Tricky patterns', steps: 3, games: PT },
  { id: 'l.1.robot', subject: 'logic', grade: '1', name: 'First robot programs', steps: 3, games: RP },
  { id: 'l.1.memory', subject: 'logic', grade: '1', name: 'Memory', steps: 3, games: ['memoryFlip'] },
  { id: 'l.1.sudoku', subject: 'logic', grade: '1', name: 'Picture sudoku', steps: 3, games: ['pictureSudoku'] },
  { id: 'l.2.sudoku4', subject: 'logic', grade: '2', name: '4×4 picture sudoku', steps: 3, games: ['pictureSudoku'] },
  { id: 'l.2.robot', subject: 'logic', grade: '2', name: 'Robot programming', steps: 3, games: RP },
  { id: 'l.2.sequence', subject: 'logic', grade: '2', name: 'Number sequences', steps: 3, games: PT },
  { id: 'l.2.memory', subject: 'logic', grade: '2', name: 'Big memory boards', steps: 3, games: ['memoryFlip'] },
  { id: 'l.2.tangram', subject: 'logic', grade: '2', name: 'Putting shapes together', steps: 2, games: PT },
  { id: 'l.3.sequence', subject: 'logic', grade: '3', name: 'Number patterns', steps: 3, games: PT },
  { id: 'l.3.logic', subject: 'logic', grade: '3', name: 'Logic puzzles', steps: 3, games: PT },
  { id: 'l.3.robot', subject: 'logic', grade: '3', name: 'Longer robot programs', steps: 3, games: RP },
  { id: 'l.3.memory', subject: 'logic', grade: '3', name: 'Big memory boards', steps: 3, games: ['memoryFlip'] },
  { id: 'l.3.sudoku', subject: 'logic', grade: '3', name: 'Harder 4×4 sudoku', steps: 3, games: ['pictureSudoku'] },
  { id: 'l.4.sequence', subject: 'logic', grade: '4', name: 'Advanced sequences', steps: 3, games: PT },
  { id: 'l.4.logic', subject: 'logic', grade: '4', name: 'Four-person logic', steps: 3, games: PT },
  { id: 'l.4.robot', subject: 'logic', grade: '4', name: 'Robot mazes', steps: 3, games: RP },
  { id: 'l.4.memory', subject: 'logic', grade: '4', name: 'Huge memory boards', steps: 3, games: ['memoryFlip'] },
  { id: 'l.4.sudoku6', subject: 'logic', grade: '4', name: '6×6 sudoku', steps: 3, games: ['pictureSudoku'] },
  { id: 'l.5.sequence', subject: 'logic', grade: '5', name: 'Squares, triangles and more', steps: 3, games: PT },
  { id: 'l.5.logic', subject: 'logic', grade: '5', name: 'If–then reasoning', steps: 3, games: PT },
  { id: 'l.5.robot', subject: 'logic', grade: '5', name: 'Expert robot mazes', steps: 3, games: RP },
  { id: 'l.5.memory', subject: 'logic', grade: '5', name: 'Memory masters', steps: 3, games: ['memoryFlip'] },
  { id: 'l.5.sudoku6', subject: 'logic', grade: '5', name: 'Hard 6×6 sudoku', steps: 3, games: ['pictureSudoku'] },

  // World (social studies)
  { id: 'ss.pk.helpers', subject: 'social', grade: 'PK', name: 'Community helpers', steps: 3, games: HM },
  { id: 'ss.pk.feelings', subject: 'social', grade: 'PK', name: 'Feelings', steps: 3, games: HM },
  { id: 'ss.k.tools', subject: 'social', grade: 'K', name: 'Helpers and their tools', steps: 3, games: HM },
  { id: 'ss.k.position', subject: 'social', grade: 'K', name: 'Above, below, left, right', steps: 3, games: ME },
  { id: 'ss.k.pastpresent', subject: 'social', grade: 'K', name: 'Long ago and today', steps: 2, games: TT },
  { id: 'ss.k.needswants', subject: 'social', grade: 'K', name: 'Needs and wants', steps: 2, games: TT },
  { id: 'ss.k.holidays', subject: 'social', grade: 'K', name: 'Holidays', steps: 3, games: TT },
  { id: 'ss.1.rules', subject: 'social', grade: '1', name: 'Rules and safety', steps: 3, games: HM },
  { id: 'ss.1.symbols', subject: 'social', grade: '1', name: 'American symbols', steps: 3, games: TT },
  { id: 'ss.1.mapsymbols', subject: 'social', grade: '1', name: 'Maps and globes', steps: 3, games: ME },
  { id: 'ss.2.compass', subject: 'social', grade: '2', name: 'North, south, east, west', steps: 3, games: ME },
  { id: 'ss.2.continents', subject: 'social', grade: '2', name: 'Continents and oceans', steps: 3, games: ME },
  { id: 'ss.2.goods', subject: 'social', grade: '2', name: 'Goods and services', steps: 2, games: TT },
  { id: 'ss.3.compass', subject: 'social', grade: '3', name: 'In-between directions', steps: 3, games: ME },
  { id: 'ss.3.flags', subject: 'social', grade: '3', name: 'Flags of the world', steps: 3, games: ME },
  { id: 'ss.3.government', subject: 'social', grade: '3', name: 'Local, state and national government', steps: 3, games: TT },
  { id: 'ss.4.regions', subject: 'social', grade: '4', name: 'U.S. geography', steps: 3, games: ME },
  { id: 'ss.4.economics', subject: 'social', grade: '4', name: 'Money and economics', steps: 3, games: TT },
  { id: 'ss.5.mapskills', subject: 'social', grade: '5', name: 'Latitude, longitude and the equator', steps: 3, games: ME },
  { id: 'ss.5.history', subject: 'social', grade: '5', name: 'Founding of the United States', steps: 3, games: TT },
  { id: 'ss.5.government', subject: 'social', grade: '5', name: 'Three branches of government', steps: 2, games: TT },
];

export const SKILL_BY_ID = Object.fromEntries(SKILLS.map((s) => [s.id, s])) as Record<string, Skill>;

export function gradeIndex(g: Grade): number {
  return ['PK', 'K', '1', '2', '3', '4', '5'].indexOf(g);
}

export function skillsFor(subject: Subject, gameId: string, grade?: Grade): Skill[] {
  return SKILLS.filter((s) => s.subject === subject && s.games.includes(gameId) && (!grade || s.grade === grade));
}

/** Can a kid at this grade play this game? (It needs content at or below their grade.) */
export function gameAvailable(gameId: string, subject: Subject, grade: Grade): boolean {
  return SKILLS.some((s) => s.subject === subject && s.games.includes(gameId) && gradeIndex(s.grade) <= gradeIndex(grade));
}
