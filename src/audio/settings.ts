import { useSyncExternalStore } from 'react';

// Per-device sound settings (a quiet tablet at bedtime shouldn't mute the others).
export type AudioSetting = 'music' | 'sounds';
const DEFAULTS: Record<AudioSetting, boolean> = { music: true, sounds: true };
const listeners = new Set<() => void>();

export function getAudioSetting(k: AudioSetting): boolean {
  try {
    const v = localStorage.getItem(`brainy.${k}`);
    return v === null ? DEFAULTS[k] : v === '1';
  } catch {
    return DEFAULTS[k];
  }
}

export function setAudioSetting(k: AudioSetting, on: boolean) {
  try { localStorage.setItem(`brainy.${k}`, on ? '1' : '0'); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

export function useAudioSetting(k: AudioSetting): boolean {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => getAudioSetting(k));
}

export function onAudioSettingsChange(fn: () => void) {
  listeners.add(fn);
}
