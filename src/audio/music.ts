// Gentle generated background music for the hub, shop and house (never during games,
// so voice prompts stay clear). No audio files needed, so it also works offline.
import { audioContext, unlockAudio } from './sfx';
import { getAudioSetting, onAudioSettingsChange } from './settings';

const CHORDS = [
  [261.63, 329.63, 392.0], // C
  [196.0, 246.94, 293.66], // G
  [220.0, 261.63, 329.63], // Am
  [174.61, 220.0, 261.63], // F
];
const MELODY = [0, 2, 1, 2, 0, 1, 2, 1]; // chord-tone pattern for the arpeggio
const BEAT = 0.42;

let wanted = false;
let timer: ReturnType<typeof setInterval> | null = null;
let master: GainNode | null = null;
let nextTime = 0;
let step = 0;

function note(ctx: AudioContext, freq: number, t: number, dur: number, vol: number, type: OscillatorType) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master!);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function schedule() {
  const ctx = audioContext();
  if (!ctx || !master) return;
  while (nextTime < ctx.currentTime + 0.6) {
    const chord = CHORDS[Math.floor(step / 8) % CHORDS.length];
    const i = step % 8;
    note(ctx, chord[MELODY[i]] * 2, nextTime, BEAT * 0.9, 0.05, 'triangle');
    if (i === 0) chord.forEach((f) => note(ctx, f / 2, nextTime, BEAT * 7.5, 0.018, 'sine'));
    nextTime += BEAT;
    step++;
  }
}

function start() {
  const ctx = audioContext();
  if (!ctx || timer) return;
  master = ctx.createGain();
  master.gain.value = 0.8;
  master.connect(ctx.destination);
  nextTime = ctx.currentTime + 0.1;
  timer = setInterval(schedule, 200);
}

function stop() {
  if (timer) clearInterval(timer);
  timer = null;
  if (master) {
    const m = master;
    const ctx = audioContext();
    if (ctx) m.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
    setTimeout(() => m.disconnect(), 800);
  }
  master = null;
}

function apply() {
  if (wanted && getAudioSetting('music') && document.visibilityState === 'visible') start();
  else stop();
}

/** Re-check after a tap (audio can only start after the first touch). */
export function refreshMusic() {
  apply();
}

/** Screens call this: true on calm screens (hub, shop, house), false in games. */
export function setMusicWanted(on: boolean) {
  wanted = on;
  if (on) unlockAudio();
  apply();
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', apply);
  onAudioSettingsChange(apply);
}
