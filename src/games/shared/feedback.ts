import { useState } from 'react';
import type { Kid } from '../../core/types';
import { praiseLine, speak, tryAgainLine } from '../../audio/speech';
import { sfx } from '../../audio/sfx';

/** Shared cheer / try-again feedback: voice, sound, and the buddy's speech bubble. */
export function useFeedback(kid: Kid) {
  const [said, setSaid] = useState<string | null>(null);
  return {
    said,
    reset: () => setSaid(null),
    praise: (prefix = '', big = false) => {
      const l = praiseLine(kid.name);
      setSaid(l);
      sfx.correct();
      if (big) setTimeout(() => sfx.cheer(), 200);
      speak(`${prefix} ${l}`.trim(), 'praise');
    },
    oops: (extra = '') => {
      const l = tryAgainLine();
      setSaid(l);
      sfx.boop();
      speak(`${l} ${extra}`.trim(), 'encourage');
    },
  };
}
