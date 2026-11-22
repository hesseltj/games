import type { Rng } from '../../core/random';

export type ShapeName = 'circle' | 'square' | 'triangle' | 'rectangle' | 'star' | 'heart' | 'oval' | 'diamond' | 'rtriangle' | 'semicircle' | 'hexagon' | 'trapezoid';

/** What's drawn inside an answer choice. */
export type OptContent =
  | { kind: 'number'; n: number; dots?: boolean }
  | { kind: 'text'; text: string }
  | { kind: 'color'; name: string; hex: string }
  | { kind: 'shape'; shape: ShapeName }
  | { kind: 'emoji'; emoji: string; label?: string }
  | { kind: 'group'; emoji: string; count: number }
  | { kind: 'coins'; coins: number[] };

export interface ChoiceOption {
  id: string;
  content: OptContent;
  correct: boolean;
}

/** What's shown above the choices. */
export type Display =
  | { kind: 'none' }
  | { kind: 'text'; text: string }
  | { kind: 'objects'; emoji: string; count: number; faded?: number; frame?: boolean }
  | { kind: 'sum'; emoji: string; a: number; b: number }
  | { kind: 'tenFrame'; filled: number }
  | { kind: 'emoji'; emoji: string; label?: string }
  | { kind: 'pattern'; items: OptContent[] }
  | { kind: 'story'; title: string; emoji: string; lines: string[] }
  | { kind: 'coins'; coins: number[] }
  | { kind: 'clock'; h: number; m: number }
  | { kind: 'ruler'; start: number; length: number; emoji: string }
  | { kind: 'order'; emoji: string; text: string };

export interface ChoiceQuestion {
  id: string;
  skillId: string;
  step: number;
  /** Spoken aloud when the question appears. */
  say: string;
  /** Spoken by the 🔊 button (defaults to `say`). */
  repeat?: string;
  /** Short instruction shown on screen. */
  prompt: string;
  display: Display;
  options: ChoiceOption[];
}

export interface GenContext {
  rng: Rng;
  step: number;
  /** Theme emoji used for counting objects and card art. */
  objects: string[];
  kidName: string;
}

export type ChoiceGen = (ctx: GenContext) => ChoiceQuestion;
