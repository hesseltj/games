export type Grade = 'PK' | 'K' | '1' | '2' | '3' | '4' | '5';
export const GRADES: Grade[] = ['PK', 'K', '1', '2', '3', '4', '5'];
export const GRADE_LABEL: Record<Grade, string> = {
  PK: 'Preschool', K: 'Kindergarten', '1': '1st grade', '2': '2nd grade',
  '3': '3rd grade', '4': '4th grade', '5': '5th grade',
};

export type Subject = 'math' | 'reading' | 'spelling' | 'science' | 'logic' | 'social';
export type Currency = 'coins' | 'stars' | 'gems' | 'leaves' | 'pieces' | 'shards';

export type ThemeId = 'animals' | 'squishy' | 'dolls' | 'sports' | 'creatures' | 'bricks';

export interface AvatarConfig {
  skin: string;
  hairStyle: number;
  hairColor: string;
  shirt: string;
}

export interface Kid {
  id: string;
  name: string;
  grade: Grade;
  gradeBySubject: Partial<Record<Subject, Grade>>;
  favoriteTheme: ThemeId;
  avatar: AvatarConfig;
  equipped?: Equipped;
  /** Shop item the kid is saving up for (shown on the hub). */
  goalItemId?: string | null;
  starterGranted?: boolean;
  /** Badges the kid has already been shown, so new ones can be celebrated. */
  seenBadges?: string[];
  /** Soft daily play limit in minutes (null/undefined = no limit). */
  dailyLimitMin?: number | null;
  /** Extra minutes a grown-up allowed for one day. */
  limitBonus?: { day: string; minutes: number } | null;
  createdAt: number;
  updatedAt: number;
}

export interface Equipped {
  hat?: string | null;
  outfit?: string | null;
  /** Inventory item id of the pet that follows the kid around. */
  buddy?: string | null;
}

export interface InventoryItem {
  id: string;
  kidId: string;
  /** Catalog item id or backdrop id. */
  itemId: string;
  source: 'shop' | 'starter' | 'gift';
  acquiredAt: number;
  updatedAt: number;
}

export interface Placement {
  /** Inventory id of the placed item. */
  inv: string;
  /** Position in % of the room box (x = center, y = bottom edge). */
  x: number;
  y: number;
  flip?: boolean;
}

export interface Room {
  id: string; // `${kidId}:${type}`
  kidId: string;
  type: string;
  wallpaper: string;
  floor: string;
  placements: Placement[];
  updatedAt: number;
}

export interface LedgerEntry {
  id: string;
  kidId: string;
  currency: Currency;
  amount: number;
  reason: string;
  refId?: string;
  createdAt: number;
}

export interface SkillProgress {
  kidId: string;
  skillId: string;
  step: number;
  rightStreak: number;
  missStreak: number;
  recent: boolean[];
  days: string[];
  mastered: boolean;
  updatedAt: number;
}

export interface RoundLog {
  id: string;
  kidId: string;
  gameId: string;
  subject: Subject;
  skills: string[];
  correctFirstTry: number;
  total: number;
  durationSec: number;
  earned: number;
  /** Inventory id of the buddy pet during this round (creatures evolve with rounds played together). */
  buddy?: string | null;
  createdAt: number;
}
