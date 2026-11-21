export type Grade = 'PK' | 'K' | '1' | '2' | '3' | '4' | '5';
export const GRADES: Grade[] = ['PK', 'K', '1', '2', '3', '4', '5'];
export const GRADE_LABEL: Record<Grade, string> = {
  PK: 'Preschool', K: 'Kindergarten', '1': '1st grade', '2': '2nd grade',
  '3': '3rd grade', '4': '4th grade', '5': '5th grade',
};

export type Subject = 'math' | 'reading' | 'spelling' | 'science' | 'logic';
export type Currency = 'coins' | 'stars' | 'gems' | 'leaves' | 'pieces';

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
  createdAt: number;
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
  createdAt: number;
}
