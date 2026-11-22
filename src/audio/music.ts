// Upbeat generated music: drums, bass, chords and a catchy lead, with a different song per screen.
// No audio files needed (works offline). Music ducks under the voice so instructions stay clear.
import { audioContext, unlockAudio } from './sfx';
import { getAudioSetting, onAudioSettingsChange } from './settings';

export type SongId = 'home' | 'shop' | 'house' | 'game' | 'calm';

interface Song {
  bpm: number;
  swing?: number;
  /** Chord roots (MIDI) per bar; chords are triads on the major/minor scale. */
  chords: { root: number; minor?: boolean }[];
  /** 16 steps per bar. Numbers index the chord tones (0,1,2 = root, third, fifth; 3+ go an octave up). -1 = rest. */
  lead: number[][];
  bass: number[]; // 16 steps: 0 root, 1 fifth, -1 rest
  kick: number[]; snare: number[]; hat: number[]; // 16 steps, 1 = hit
  leadWave: OscillatorType;
  volume: number;
}

const _ = -1;
const SONGS: Record<SongId, Song> = {
  home: {
    bpm: 116, chords: [{ root: 60 }, { root: 67 }, { root: 69, minor: true }, { root: 65 }],
    lead: [
      [0, _, 2, _, 4, _, 2, _, 3, _, 2, _, 1, _, _, _],
      [1, _, 2, _, 3, _, 2, 1, 0, _, 1, _, 2, _, _, _],
      [2, _, 3, 2, 1, _, 0, _, 1, _, 2, _, 3, _, _, _],
      [3, _, 2, _, 1, _, 2, _, 0, _, _, _, _, _, _, _],
    ],
    bass: [0, _, _, 0, _, _, 1, _, 0, _, _, 0, _, 1, _, _],
    kick: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    hat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    leadWave: 'square', volume: 0.75,
  },
  shop: {
    bpm: 108, swing: 0.18, chords: [{ root: 62, minor: true }, { root: 67 }, { root: 60 }, { root: 69, minor: true }],
    lead: [
      [2, _, 3, _, 2, 1, _, 0, _, _, 2, _, 4, _, _, _],
      [1, _, 1, 2, 3, _, 2, _, 1, _, 0, _, 1, _, _, _],
      [4, _, 3, _, 2, _, 3, 4, 3, _, 2, _, 0, _, _, _],
      [2, _, 1, _, 0, _, 1, _, 2, _, _, _, _, _, _, _],
    ],
    bass: [0, _, 0, _, _, 1, _, 0, _, 0, _, _, 1, _, 0, _],
    kick: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    hat: [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    leadWave: 'triangle', volume: 0.8,
  },
  house: {
    bpm: 92, chords: [{ root: 65 }, { root: 60 }, { root: 62, minor: true }, { root: 67 }],
    lead: [
      [0, _, _, 1, 2, _, _, _, 3, _, 2, _, 1, _, _, _],
      [2, _, _, 1, 0, _, _, _, 1, _, 2, _, _, _, _, _],
      [0, _, 1, _, 2, _, 3, _, 2, _, 1, _, 0, _, _, _],
      [1, _, _, 2, 1, _, 0, _, _, _, _, _, _, _, _, _],
    ],
    bass: [0, _, _, _, _, _, 1, _, 0, _, _, _, 1, _, _, _],
    kick: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    hat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    leadWave: 'triangle', volume: 0.7,
  },
  game: {
    bpm: 126, chords: [{ root: 57, minor: true }, { root: 65 }, { root: 60 }, { root: 67 }],
    lead: [
      [0, _, 0, 2, _, 0, 3, _, 2, _, 1, _, 0, _, _, _],
      [2, _, 2, 3, _, 2, 4, _, 3, _, 2, _, 1, _, _, _],
      [0, _, 1, 2, _, 3, 2, _, 1, _, 0, _, 2, _, _, _],
      [3, _, 2, _, 1, _, 0, _, _, _, _, _, _, _, _, _],
    ],
    bass: [0, _, 0, _, 0, _, 1, _, 0, _, 0, _, 1, _, 0, 1],
    kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    hat: [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
    leadWave: 'square', volume: 0.45,
  },
  calm: {
    bpm: 76, chords: [{ root: 60 }, { root: 57, minor: true }, { root: 65 }, { root: 67 }],
    lead: [[0, _, _, _, 2, _, _, _, 1, _, _, _, _, _, _, _], [2, _, _, _, 1, _, _, _, 0, _, _, _, _, _, _, _], [0, _, _, _, 1, _, _, _, 2, _, _, _, _, _, _, _], [1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _]],
    bass: [0, _, _, _, _, _, _, _, 1, _, _, _, _, _, _, _],
    kick: Array(16).fill(0), snare: Array(16).fill(0), hat: Array(16).fill(0),
    leadWave: 'sine', volume: 0.6,
  },
};

const midi = (n: number) => 440 * 2 ** ((n - 69) / 12);
function chordTone(c: { root: number; minor?: boolean }, idx: number) {
  const tones = [0, c.minor ? 3 : 4, 7];
  return c.root + tones[idx % 3] + 12 * Math.floor(idx / 3);
}

let wantedSong: SongId | null = null;
let playing: SongId | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let nextTime = 0;
let step = 0;
let ducked = false;

function env(ctx: AudioContext, t: number, vol: number, attack: number, dur: number) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0002), t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(master!);
  return g;
}
function tone(ctx: AudioContext, freq: number, t: number, dur: number, vol: number, type: OscillatorType, cutoff?: number) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  const g = env(ctx, t, vol, 0.01, dur);
  if (cutoff) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = cutoff;
    o.connect(f).connect(g);
  } else o.connect(g);
  o.start(t);
  o.stop(t + dur + 0.05);
}
function kick(ctx: AudioContext, t: number) {
  const o = ctx.createOscillator();
  o.frequency.setValueAtTime(140, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
  o.connect(env(ctx, t, 0.5, 0.002, 0.18));
  o.start(t);
  o.stop(t + 0.2);
}
function noiseHit(ctx: AudioContext, t: number, vol: number, dur: number, type: BiquadFilterType, freq: number) {
  if (!noise) {
    noise = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  src.connect(f).connect(env(ctx, t, vol, 0.001, dur));
  src.start(t);
  src.stop(t + dur + 0.02);
}

function schedule() {
  const ctx = audioContext();
  if (!ctx || !master || !playing) return;
  const song = SONGS[playing];
  const sixteenth = 60 / song.bpm / 4;
  while (nextTime < ctx.currentTime + 0.3) {
    const bar = Math.floor(step / 16) % song.chords.length;
    const s = step % 16;
    const chord = song.chords[bar];
    const t = nextTime + (song.swing && s % 2 === 1 ? sixteenth * song.swing : 0);
    if (song.kick[s]) kick(ctx, t);
    if (song.snare[s]) noiseHit(ctx, t, 0.18, 0.14, 'bandpass', 1800);
    if (song.hat[s]) noiseHit(ctx, t, s % 4 === 0 ? 0.05 : 0.03, 0.04, 'highpass', 7000);
    const b = song.bass[s];
    if (b >= 0) tone(ctx, midi(chord.root - 24 + (b === 1 ? 7 : 0)), t, sixteenth * 1.8, 0.16, 'triangle');
    if (s === 0) [0, 1, 2].forEach((i) => tone(ctx, midi(chordTone(chord, i)), t, sixteenth * 15, 0.025, 'sawtooth', 1200));
    const l = song.lead[bar][s];
    if (l >= 0) tone(ctx, midi(chordTone(chord, l) + 12), t, sixteenth * 1.6, 0.05, song.leadWave, 2600);
    nextTime += sixteenth;
    step++;
  }
}

function targetVolume() {
  if (!playing) return 0;
  return SONGS[playing].volume * (ducked ? 0.25 : 1);
}

function start(id: SongId) {
  const ctx = audioContext();
  if (!ctx) return;
  if (playing === id && timer) return;
  stop();
  playing = id;
  master = ctx.createGain();
  master.gain.value = 0.0001;
  master.connect(ctx.destination);
  master.gain.setTargetAtTime(targetVolume(), ctx.currentTime, 0.3);
  nextTime = ctx.currentTime + 0.1;
  step = 0;
  timer = setInterval(schedule, 100);
}

function stop() {
  if (timer) clearInterval(timer);
  timer = null;
  const m = master;
  const ctx = audioContext();
  if (m && ctx) {
    m.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
    setTimeout(() => m.disconnect(), 700);
  }
  master = null;
  playing = null;
}

function apply() {
  const inGame = wantedSong === 'game';
  const allowed = getAudioSetting('music') && (!inGame || getAudioSetting('gameMusic'));
  if (wantedSong && allowed && document.visibilityState === 'visible') start(wantedSong);
  else stop();
}

/** Quietly lower the music while the voice is talking. */
export function duckMusic(on: boolean) {
  ducked = on;
  const ctx = audioContext();
  if (master && ctx) master.gain.setTargetAtTime(targetVolume(), ctx.currentTime, on ? 0.05 : 0.4);
}

/** Re-check after a tap (audio can only start after the first touch). */
export function refreshMusic() {
  apply();
}

/** Screens pick a song (or null for silence). */
export function setSong(id: SongId | null) {
  wantedSong = id;
  if (id) unlockAudio();
  apply();
}

/** Back-compat for older callers. */
export function setMusicWanted(on: boolean) {
  setSong(on ? 'home' : null);
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', apply);
  onAudioSettingsChange(apply);
}
