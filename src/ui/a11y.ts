import { useSyncExternalStore } from 'react';

// Per-device accessibility settings, applied as classes on <html>.
export type A11ySetting = 'bigText' | 'reduceMotion' | 'slowVoice' | 'highContrast';
const listeners = new Set<() => void>();

export function getA11y(k: A11ySetting): boolean {
  try { return localStorage.getItem(`brainy.${k}`) === '1'; } catch { return false; }
}

export function setA11y(k: A11ySetting, on: boolean) {
  try { localStorage.setItem(`brainy.${k}`, on ? '1' : '0'); } catch { /* ignore */ }
  applyA11y();
  listeners.forEach((l) => l());
}

export function useA11y(k: A11ySetting): boolean {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => getA11y(k));
}

export function applyA11y() {
  const root = document.documentElement;
  root.classList.toggle('big-text', getA11y('bigText'));
  root.classList.toggle('reduce-motion', getA11y('reduceMotion'));
  root.classList.toggle('high-contrast', getA11y('highContrast'));
}
