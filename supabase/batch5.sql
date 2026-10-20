-- Batch 5 migration. Run once in the Supabase SQL editor (after batch4.sql).
create table if not exists menu_overrides (
  dish_id text primary key,
  price int check (price >= 0),
  sold_out boolean not null default false,
  updated_at timestamptz default now()
);
alter table menu_overrides enable row level security; -- no policies: only the server (service role) reads/writes
