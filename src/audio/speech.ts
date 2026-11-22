let voice: SpeechSynthesisVoice | null = null;
let voicesReady = false;

const PREFERRED = [/Google US English/i, /Samantha/i, /en-US.*(Female|Natural)/i, /Karen/i, /Google UK English Female/i];

function chooseVoice() {
  if (!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices().filter((v) => v.lang?.toLowerCase().startsWith('en'));
  if (voices.length === 0) return;
  voicesReady = true;
  for (const re of PREFERRED) {
    const v = voices.find((x) => re.test(x.name) || re.test(`${x.lang} ${x.name}`));
    if (v) { voice = v; return; }
  }
  voice = voices.find((v) => v.lang === 'en-US') ?? voices[0];
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  chooseVoice();
  speechSynthesis.addEventListener?.('voiceschanged', chooseVoice);
}

import { getA11y } from '../ui/a11y';

let rate = 0.95;
export function setSpeechRate(r: number) {
  rate = r;
}

export function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  if (!voicesReady) chooseVoice();
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? 'en-US';
  u.rate = rate * (getA11y('slowVoice') ? 0.8 : 1);
  u.pitch = 1.1;
  speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
