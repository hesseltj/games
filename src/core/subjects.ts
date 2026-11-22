import type { Currency, Subject } from './types';

export interface SubjectInfo {
  id: Subject;
  name: string;
  emoji: string;
  currency: Currency;
  color: string;
}

export const SUBJECTS: SubjectInfo[] = [
  { id: 'math', name: 'Math', emoji: '🔢', currency: 'coins', color: '#ffb627' },
  { id: 'reading', name: 'Reading', emoji: '📖', currency: 'stars', color: '#ff6b8b' },
  { id: 'spelling', name: 'Spelling', emoji: '🔤', currency: 'gems', color: '#7b6cf6' },
  { id: 'science', name: 'Science', emoji: '🔬', currency: 'leaves', color: '#3fbf7f' },
  { id: 'logic', name: 'Logic', emoji: '🧩', currency: 'pieces', color: '#3fa7f0' },
  { id: 'social', name: 'World', emoji: '🌎', currency: 'shards', color: '#d9822b' },
];

export const SUBJECT_BY_ID = Object.fromEntries(SUBJECTS.map((s) => [s.id, s])) as Record<Subject, SubjectInfo>;

export const CURRENCIES: { id: Currency; name: string; emoji: string }[] = [
  { id: 'coins', name: 'Coins', emoji: '🪙' },
  { id: 'stars', name: 'Stars', emoji: '⭐' },
  { id: 'gems', name: 'Gems', emoji: '💎' },
  { id: 'leaves', name: 'Leaves', emoji: '🍃' },
  { id: 'pieces', name: 'Puzzle Pieces', emoji: '🧩' },
  { id: 'shards', name: 'Compass Shards', emoji: '🧭' },
];
