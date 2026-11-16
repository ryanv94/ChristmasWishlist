-- Shared "bought" list. One row per taken item; the primary key makes the first claim win.
create table if not exists public.purchases (
  item_id text primary key,
  created_at timestamptz not null default now()
);

alter table public.purchases enable row level security;
grant select, insert, delete on public.purchases to anon;

create policy "anyone can read" on public.purchases for select to anon using (true);
create policy "anyone can mark bought" on public.purchases for insert to anon with check (true);
create policy "anyone can undo" on public.purchases for delete to anon using (true);
