import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { PullPage, Remote, SyncRecord } from './sync';

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const cloudConfigured = !!(URL && KEY);

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient | null {
  if (!cloudConfigured) return null;
  client ??= createClient(URL!, KEY!, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'brainy.auth' } });
  return client;
}

const PAGE = 1000;

export const supabaseRemote: Remote = {
  async push(records: SyncRecord[]) {
    const { error } = await supabase()!.rpc('push_records', { items: records });
    if (error) throw new Error(error.message);
  },
  async pull(cursor: number): Promise<PullPage> {
    const { data, error } = await supabase()!
      .from('records')
      .select('collection,id,data,version,seq')
      .gt('seq', cursor)
      .order('seq', { ascending: true })
      .limit(PAGE);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as (SyncRecord & { seq: number })[];
    return {
      records: rows.map(({ collection, id, data, version }) => ({ collection, id, data, version: Number(version) })),
      cursor: rows.length ? Number(rows[rows.length - 1].seq) : cursor,
      more: rows.length === PAGE,
    };
  },
};
