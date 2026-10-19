-- Zee's Kitchen — run in Supabase SQL editor. Extended in later batches.
create extension if not exists "pgcrypto";

create table if not exists menu_categories (
  id text primary key, name text not null, blurb text, sort int default 0
);

create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, description text,
  category_id text references menu_categories(id),
  kind text check (kind in ('local','continental')) default 'local',
  price_kobo int not null check (price_kobo >= 0),
  image_url text, popular boolean default false, available boolean default true,
  options jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null, fee_kobo int not null default 0, eta_minutes int default 40, active boolean default true
);

create type order_status as enum ('received','preparing','ready','out_for_delivery','delivered','picked_up','cancelled');

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,                -- pickup / tracking code e.g. ZK-4821
  fulfilment text check (fulfilment in ('pickup','delivery')) not null,
  status order_status not null default 'received',
  customer_name text not null, phone text not null,
  address text, zone_id uuid references delivery_zones(id), notes text,
  subtotal_kobo int not null, delivery_fee_kobo int not null default 0, total_kobo int not null,
  payment_status text default 'pending', payment_ref text,
  rider_name text, rider_phone text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  dish_id uuid references dishes(id), name text not null,
  qty int not null check (qty > 0), unit_kobo int not null,
  selected_options jsonb default '[]'::jsonb, note text
);

create table if not exists order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  status order_status not null, created_at timestamptz default now()
);

alter table menu_categories enable row level security;
alter table dishes enable row level security;
alter table delivery_zones enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_events enable row level security;

create policy "public read menu" on menu_categories for select using (true);
create policy "public read dishes" on dishes for select using (available);
create policy "public read zones" on delivery_zones for select using (active);
-- orders/items/events: written by server routes with the service role (batch 3); tracking read policy added in batch 4.
