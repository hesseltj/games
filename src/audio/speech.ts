// Spoken prompts using the device's built-in voices. We pick the liveliest English voice we can
// find (or the one a grown-up chose), and change pitch and speed with the mood of the line.
import { getA11y } from '../ui/a11y';
import { duckMusic } from './music';

export type Mood = 'normal' | 'question' | 'praise' | 'celebrate' | 'encourage';

const MOOD: Record<Mood, { rate: number; pitch: number }> = {
  normal: { rate: 1, pitch: 1.15 },
  question: { rate: 1, pitch: 1.18 },
  praise: { rate: 1.08, pitch: 1.4 },
  celebrate: { rate: 1.05, pitch: 1.45 },
  encourage: { rate: 0.95, pitch: 1.25 },
};

// Names of voices that tend to sound natural and friendly, best first.
const PREFERRED = [
  /Natural|Neural|Online/i, // Edge/Windows "natural" voices
  /Google US English/i, // Chrome desktop
  /en-us-x-(sfg|tpc|iob|iog|tpf)/i, // Android Google voices (female, clear)
  /Samantha|Ava|Allison|Susan|Zoe|Nicky/i, // Apple
  /en-us-x-/i,
  /Google UK English Female/i,
  /Karen|Moira|Tessa/i,
];

const VOICE_KEY = 'brainy.voice';
let voice: SpeechSynthesisVoice | null = null;
let rate = 0.95;

export function englishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return speechSynthesis.getVoices().filter((v) => v.lang?.toLowerCase().startsWith('en'));
}

function rank(v: SpeechSynthesisVoice) {
  const name = `${v.name} ${v.voiceURI}`;
  const i = PREFERRED.findIndex((re) => re.test(name));
  return (i < 0 ? 50 : i) + (v.lang === 'en-US' || v.lang === 'en_US' ? 0 : 5) + (v.localService ? 0 : 1);
}

function chooseVoice() {
  const voices = englishVoices();
  if (voices.length === 0) return;
  let saved: string | null = null;
  try { saved = localStorage.getItem(VOICE_KEY); } catch { /* ignore */ }
  voice = voices.find((v) => v.voiceURI === saved) ?? [...voices].sort((a, b) => rank(a) - rank(b))[0];
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  chooseVoice();
  speechSynthesis.addEventListener?.('voiceschanged', chooseVoice);
}

export function currentVoiceURI() {
  if (!voice) chooseVoice();
  return voice?.voiceURI ?? null;
}

export function setVoice(uri: string | null) {
  try { if (uri) localStorage.setItem(VOICE_KEY, uri); else localStorage.removeItem(VOICE_KEY); } catch { /* ignore */ }
  chooseVoice();
}

export function setSpeechRate(r: number) {
  rate = r;
}

let speaking = 0;

export function speak(text: string, mood: Mood = 'normal') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!voice) chooseVoice();
  speechSynthesis.cancel();
  const m = MOOD[mood];
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? 'en-US';
  u.rate = Math.min(1.3, rate * m.rate * (getA11y('slowVoice') ? 0.8 : 1));
  u.pitch = m.pitch;
  const id = ++speaking;
  u.onstart = () => duckMusic(true);
  const done = () => { if (id === speaking) duckMusic(false); };
  u.onend = done;
  u.onerror = done;
  speechSynthesis.speak(u);
  // Some Android voices never fire onend; un-duck after a generous estimate.
  setTimeout(done, 1500 + text.length * 90);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) speechSynthesis.cancel();
  duckMusic(false);
}

// ---------- Lively lines ----------

const PRAISE = [
  'Great job!', 'You got it!', 'Awesome!', 'Woo-hoo!', 'Super!', 'Way to go!', 'Nailed it!', 'Boom! That’s right!',
  'Amazing!', 'Fantastic!', 'Yes! High five!', 'You’re a star!', 'Brilliant!', 'Look at you go!', 'Wow, nice!',
];
const PRAISE_NAMED = ['Awesome, {name}!', 'You did it, {name}!', 'Great thinking, {name}!', 'Nice one, {name}!', 'Way to go, {name}!'];
const STREAK = ['{n} in a row! You’re on fire!', '{n} in a row! Unstoppable!', 'Whoa, {n} in a row!', '{n} in a row! Keep it going!'];
const TRY_AGAIN = ['Oops! Try again!', 'So close! Try again!', 'Hmm, not quite. You can do it!', 'Almost! Give it another try!', 'Good try! Let’s try again!'];

const pickOne = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

export function praiseLine(name?: string) {
  return name && Math.random() < 0.3 ? pickOne(PRAISE_NAMED).replace('{name}', name) : pickOne(PRAISE);
}
export function streakLine(n: number) {
  return pickOne(STREAK).replace('{n}', String(n));
}
export function tryAgainLine() {
  return pickOne(TRY_AGAIN);
}
