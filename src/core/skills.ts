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

/** Wave 1 skill map (see docs/DESIGN.md §4). Skills with no games yet are tracked but not playable. */
export const SKILLS: Skill[] = [
  // Math, Pre-K
  { id: 'm.pk.colors', subject: 'math', grade: 'PK', name: 'Colors', steps: 3, games: NP },
  { id: 'm.pk.shapes', subject: 'math', grade: 'PK', name: 'Shapes', steps: 3, games: NP },
  { id: 'm.pk.count5', subject: 'math', grade: 'PK', name: 'Count to 5', steps: 3, games: NP },
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
  // Math, 1 (placeholders so grade 1 kids have something until Wave 2)
  { id: 'm.1.add20', subject: 'math', grade: '1', name: 'Add & subtract within 20', steps: 3, games: NP },
  { id: 'm.1.place100', subject: 'math', grade: '1', name: 'Tens and ones', steps: 3, games: NP },
  // Math, 2
  { id: 'm.2.add20', subject: 'math', grade: '2', name: 'Fast facts within 20', steps: 3, games: NP },
  { id: 'm.2.add100', subject: 'math', grade: '2', name: 'Add & subtract within 100', steps: 3, games: NP },
  { id: 'm.2.place1000', subject: 'math', grade: '2', name: 'Place value to 1000', steps: 3, games: NP },
  { id: 'm.2.skip', subject: 'math', grade: '2', name: 'Skip counting', steps: 3, games: NP },
  { id: 'm.2.evenodd', subject: 'math', grade: '2', name: 'Even and odd', steps: 2, games: NP },
  { id: 'm.2.time', subject: 'math', grade: '2', name: 'Telling time', steps: 3, games: [] },
  { id: 'm.2.money', subject: 'math', grade: '2', name: 'Counting money', steps: 3, games: [] },
  { id: 'm.2.measure', subject: 'math', grade: '2', name: 'Measuring length', steps: 2, games: [] },
  // Math, 3 (so the oldest has a next level to reach)
  { id: 'm.3.times', subject: 'math', grade: '3', name: 'Times tables', steps: 3, games: NP },
];

export const SKILL_BY_ID = Object.fromEntries(SKILLS.map((s) => [s.id, s])) as Record<string, Skill>;

export function gradeIndex(g: Grade): number {
  return ['PK', 'K', '1', '2', '3', '4', '5'].indexOf(g);
}

export function skillsFor(subject: Subject, gameId: string, grade?: Grade): Skill[] {
  return SKILLS.filter((s) => s.subject === subject && s.games.includes(gameId) && (!grade || s.grade === grade));
}
