import type { ThemeId } from './types';

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  emoji: string;
  bg: string;
  accent: string;
  /** Emoji used as countable objects in games, so games feel like the kid's theme. */
  objects: string[];
}

export const THEMES: ThemeInfo[] = [
  { id: 'animals', name: 'Animal Friends', emoji: '🐾', bg: '#e8f6dc', accent: '#6bbf59', objects: ['🐶', '🐱', '🐰', '🐻', '🐸', '🐥'] },
  { id: 'squishy', name: 'Squishy Squad', emoji: '🍡', bg: '#fdeaf6', accent: '#f49ac9', objects: ['🍡', '🧁', '🍩', '🍬', '🍓', '☁️'] },
  { id: 'dolls', name: 'Dollhouse Dreams', emoji: '🎀', bg: '#f6e8ff', accent: '#c58af0', objects: ['🎀', '👑', '💖', '🌸', '🦄', '👗'] },
  { id: 'sports', name: 'Sports Stars', emoji: '⚽', bg: '#e3efff', accent: '#3d7eea', objects: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏆'] },
  { id: 'creatures', name: 'Creature Catchers', emoji: '⚡', bg: '#fff6d6', accent: '#f2b705', objects: ['⚡', '💧', '🔥', '🌱', '🥚', '✨'] },
  { id: 'bricks', name: 'Brick Builders', emoji: '🧱', bg: '#ffe9e3', accent: '#e8553e', objects: ['🧱', '🚀', '🏰', '🤖', '🚗', '🔧'] },
];

export const THEME_BY_ID = Object.fromEntries(THEMES.map((t) => [t.id, t])) as Record<ThemeId, ThemeInfo>;
