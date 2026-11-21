import { cloudConfigured, supabase, supabaseRemote } from './cloud';
import { enqueueAll, getMeta, setMeta, syncOnce } from './sync';
import { getState, loadAll, setLocalChangeHandler, setState, type SyncStatus } from './store';

let running = false;
let again = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let userId: string | null = null;
let fullPullDone = false;

function status(patch: Partial<SyncStatus>) {
  setState({ sync: { ...getState().sync, ...patch } });
}

export async function syncNow(full = false) {
  if (!userId) return;
  if (running) { again = true; return; }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) { status({ state: 'offline' }); return; }
  running = true;
  status({ state: 'syncing', error: undefined });
  try {
    await syncOnce(supabaseRemote, { full: full || !fullPullDone });
    fullPullDone = true;
    status({ state: 'idle', lastSyncedAt: Date.now() });
  } catch (e) {
    status({ state: navigator.onLine === false ? 'offline' : 'error', error: e instanceof Error ? e.message : String(e) });
  } finally {
    running = false;
    if (again) { again = false; requestSync(); }
  }
}

/** Debounced: lots of small changes (answers, drags) become one upload. */
export function requestSync(delay = 2500) {
  if (!userId) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => { timer = null; syncNow(); }, delay);
}

async function onSignedIn(id: string, email: string | null) {
  await loadAll(); // never let a pull race the first load from the device
  const previous = await getMeta<string>('syncUser');
  userId = id;
  status({ email, state: 'idle' });
  if (previous !== id) {
    // First time this device syncs with this account: upload everything already here.
    await enqueueAll();
    await setMeta('syncUser', id);
    await setMeta('pullCursor', 0);
  }
  await syncNow(true);
}

export async function initSync() {
  status({ configured: cloudConfigured, state: 'off' });
  const sb = supabase();
  if (!sb) return;
  setLocalChangeHandler(() => requestSync());
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') { userId = null; status({ email: null, state: 'off' }); }
    else if (session?.user && session.user.id !== userId && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
      // Defer: Supabase recommends not awaiting other calls inside this callback.
      setTimeout(() => onSignedIn(session.user.id, session.user.email ?? null), 0);
    }
  });
  window.addEventListener('online', () => requestSync(500));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') requestSync(500); });
  setInterval(() => { if (document.visibilityState === 'visible') syncNow(); }, 60_000);
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase()!.auth.signInWithPassword({ email, password });
  return error?.message ?? null;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase()!.auth.signUp({ email, password });
  if (error) return { error: error.message, needsConfirm: false };
  return { error: null, needsConfirm: !data.session };
}

export async function signOut() {
  await supabase()!.auth.signOut();
}
