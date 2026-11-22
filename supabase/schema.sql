-- Brainy Town cloud backup schema.
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query → paste → Run.
-- It is safe to run again.

-- Every saved thing (kids, coins, progress, items, rooms) is one row, owned by the signed-in family account.
create sequence if not exists public.records_seq;

create table if not exists public.records (
  user_id    uuid   not null default auth.uid() references auth.users (id) on delete cascade,
  collection text   not null,
  id         text   not null,
  data       jsonb  not null,
  version    bigint not null,                                    -- device timestamp; newest wins
  seq        bigint not null default nextval('public.records_seq'), -- server change order, used to pull changes
  updated_at timestamptz not null default now(),
  primary key (user_id, collection, id)
);

create index if not exists records_user_seq on public.records (user_id, seq);

-- Row-level security: a family account can only ever see and change its own rows.
alter table public.records enable row level security;

drop policy if exists "own rows: select" on public.records;
drop policy if exists "own rows: insert" on public.records;
drop policy if exists "own rows: update" on public.records;
drop policy if exists "own rows: delete" on public.records;
create policy "own rows: select" on public.records for select to authenticated using (user_id = auth.uid());
create policy "own rows: insert" on public.records for insert to authenticated with check (user_id = auth.uid());
create policy "own rows: update" on public.records for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows: delete" on public.records for delete to authenticated using (user_id = auth.uid());

grant select, insert, update, delete on public.records to authenticated;
grant usage, select on sequence public.records_seq to authenticated;
revoke all on public.records from anon;

-- Upload a batch of records. A row only changes if the incoming version is at least as new,
-- so an older tablet can never overwrite newer progress.
create or replace function public.push_records(items jsonb)
returns void
language sql
security invoker
set search_path = public
as $$
  insert into public.records (user_id, collection, id, data, version)
  select auth.uid(), r.collection, r.id, r.data, r.version
  from jsonb_to_recordset(items) as r(collection text, id text, data jsonb, version bigint)
  on conflict (user_id, collection, id) do update
    set data = excluded.data,
        version = excluded.version,
        seq = nextval('public.records_seq'),
        updated_at = now()
    where public.records.version <= excluded.version;
$$;

revoke all on function public.push_records(jsonb) from public, anon;
grant execute on function public.push_records(jsonb) to authenticated;
