import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from './App';
import { initSync } from './data/syncManager';
import { unlockAudio } from './audio/sfx';
import { refreshMusic } from './audio/music';
import { applyA11y } from './ui/a11y';
import './styles.css';

registerSW({ immediate: true });
initSync();
applyA11y();
// Browsers only allow sound after a touch; the first tap anywhere turns audio on.
document.addEventListener('pointerdown', () => { unlockAudio(); refreshMusic(); });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
