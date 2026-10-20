-- Batch 3 migration. Run once in the Supabase SQL editor (after schema.sql).
-- Menu and zones live in code for now, so orders store plain text instead of UUID foreign keys.
alter table order_items drop constraint if exists order_items_dish_id_fkey;
alter table order_items alter column dish_id type text using dish_id::text;
alter table orders drop constraint if exists orders_zone_id_fkey;
alter table orders drop column if exists zone_id;
alter table orders add column if not exists zone_name text;
