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
  // Reading, 2
  { id: 'r.2.vowels', subject: 'reading', grade: '2', name: 'Vowel teams and silent e', steps: 3, games: ['wordBuilder'] },
  { id: 'r.2.digraphs', subject: 'reading', grade: '2', name: 'sh, ch, th, wh, ck', steps: 3, games: ['wordBuilder'] },
  { id: 'r.2.sight2', subject: 'reading', grade: '2', name: 'Grade 2 sight words', steps: 3, games: LL },
  { id: 'r.2.compound', subject: 'reading', grade: '2', name: 'Compound words', steps: 3, games: LL },
  { id: 'r.2.comprehend', subject: 'reading', grade: '2', name: 'Reading comprehension', steps: 3, games: ['storySpot'] },
  { id: 'r.2.prefix', subject: 'reading', grade: '2', name: 'Prefixes un- and re-', steps: 2, games: LL },

  // Spelling & vocabulary
  { id: 's.pk.picwords', subject: 'spelling', grade: 'PK', name: 'Picture words', steps: 3, games: PW },
  { id: 's.pk.opposites', subject: 'spelling', grade: 'PK', name: 'Opposites', steps: 3, games: PW },
  { id: 's.pk.categories', subject: 'spelling', grade: 'PK', name: 'What goes together', steps: 3, games: PW },
  { id: 's.k.spellcvc', subject: 'spelling', grade: 'K', name: 'Spell short words', steps: 3, games: ['spellingBee'] },
  { id: 's.k.picwords', subject: 'spelling', grade: 'K', name: 'More picture words', steps: 3, games: PW },
  { id: 's.k.opposites', subject: 'spelling', grade: 'K', name: 'Opposite words', steps: 3, games: PW },
  { id: 's.2.spell', subject: 'spelling', grade: '2', name: 'Grade 2 spelling words', steps: 3, games: ['spellingBee'] },
  { id: 's.2.synonyms', subject: 'spelling', grade: '2', name: 'Words that mean the same', steps: 3, games: PW },
  { id: 's.2.antonyms', subject: 'spelling', grade: '2', name: 'Words that mean the opposite', steps: 3, games: PW },
  { id: 's.2.plurals', subject: 'spelling', grade: '2', name: 'Plurals', steps: 3, games: PW },
  { id: 's.2.contractions', subject: 'spelling', grade: '2', name: 'Contractions', steps: 3, games: PW },

  // Science
  { id: 'sc.pk.animals', subject: 'science', grade: 'PK', name: 'Animals and their sounds', steps: 3, games: SS },
  { id: 'sc.pk.senses', subject: 'science', grade: 'PK', name: 'Five senses', steps: 3, games: SS },
  { id: 'sc.pk.weather', subject: 'science', grade: 'PK', name: 'Weather', steps: 3, games: SS },
  { id: 'sc.pk.bodyparts', subject: 'science', grade: 'PK', name: 'Body parts', steps: 3, games: SS },
  { id: 'sc.k.living', subject: 'science', grade: 'K', name: 'Living and not living', steps: 2, games: SORT },
  { id: 'sc.k.needs', subject: 'science', grade: 'K', name: 'What living things need', steps: 3, games: SS },
  { id: 'sc.k.weather', subject: 'science', grade: 'K', name: 'Dressing for the weather', steps: 3, games: SS },
  { id: 'sc.k.pushpull', subject: 'science', grade: 'K', name: 'Push and pull', steps: 2, games: SORT },
  { id: 'sc.2.matter', subject: 'science', grade: '2', name: 'Solids, liquids and gases', steps: 3, games: SORT },
  { id: 'sc.2.habitats', subject: 'science', grade: '2', name: 'Habitats', steps: 3, games: SORT },
  { id: 'sc.2.lifecycle', subject: 'science', grade: '2', name: 'Life cycles', steps: 3, games: SS },
  { id: 'sc.2.earth', subject: 'science', grade: '2', name: 'Land and water', steps: 3, games: SS },
  { id: 'sc.2.pollinate', subject: 'science', grade: '2', name: 'Seeds and pollination', steps: 3, games: SS },

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
  { id: 'l.2.sudoku4', subject: 'logic', grade: '2', name: '4×4 picture sudoku', steps: 3, games: ['pictureSudoku'] },
  { id: 'l.2.robot', subject: 'logic', grade: '2', name: 'Robot programming', steps: 3, games: RP },
  { id: 'l.2.sequence', subject: 'logic', grade: '2', name: 'Number sequences', steps: 3, games: PT },
  { id: 'l.2.memory', subject: 'logic', grade: '2', name: 'Big memory boards', steps: 3, games: ['memoryFlip'] },
  { id: 'l.2.tangram', subject: 'logic', grade: '2', name: 'Putting shapes together', steps: 2, games: PT },
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
