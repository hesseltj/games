// Small synthesized sound effects, so the app needs no audio files and works offline.
import { getAudioSetting } from './settings';

let ctx: AudioContext | null = null;

export function audioContext() {
  return ctx;
}

export function unlockAudio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.18, slideTo?: number) {
  if (!ctx || !getAudioSetting('sounds')) return;
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sfx = {
  tap: () => tone(660, 0, 0.06, 'triangle', 0.08),
  pop: () => { tone(500, 0, 0.12, 'sine', 0.25, 1400); },
  correct: () => { tone(784, 0.05, 0.12, 'triangle'); tone(1047, 0.15, 0.2, 'triangle'); },
  boop: () => tone(300, 0, 0.18, 'sine', 0.12, 220),
  coin: () => [0, 0.08, 0.16, 0.24, 0.32].forEach((t, i) => tone(988 + i * 120, t, 0.1, 'square', 0.05)),
  fanfare: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, i === 3 ? 0.45 : 0.14, 'triangle', 0.15)),
  levelUp: () => [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, i * 0.09, i === 5 ? 0.6 : 0.12, 'triangle', 0.14)),
  sparkle: () => [1568, 1760, 2093, 2349, 2637].forEach((f, i) => tone(f, i * 0.05, 0.12, 'sine', 0.06)),
  shake: () => [0, 0.1, 0.2].forEach((t) => tone(180, t, 0.07, 'square', 0.05)),
  open: () => { tone(300, 0, 0.25, 'sawtooth', 0.05, 900); [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.2 + i * 0.07, 0.2, 'triangle', 0.12)); },
  combo: () => [880, 1109, 1319].forEach((f, i) => tone(f, i * 0.06, 0.1, 'square', 0.05)),
  /** A little "yay!": a rising slide-whistle, a chord stab and sparkles. */
  cheer: () => {
    tone(500, 0, 0.35, 'sine', 0.12, 1500);
    [523, 659, 784].forEach((f) => tone(f, 0.3, 0.35, 'sawtooth', 0.04));
    [1568, 2093, 2637, 3136].forEach((f, i) => tone(f, 0.35 + i * 0.05, 0.1, 'sine', 0.05));
  },
  whoosh: () => tone(200, 0, 0.3, 'sawtooth', 0.04, 1200),
};
