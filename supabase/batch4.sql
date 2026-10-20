-- Batch 4 migration. Run once in the Supabase SQL editor (after batch3.sql).
-- Logs every status change into order_events so the tracker can show times.
create or replace function log_order_status() returns trigger language plpgsql as $$
begin
  if new.status is distinct from old.status then
    insert into order_events(order_id, status) values (new.id, new.status);
    new.updated_at = now();
  end if;
  return new;
end $$;

drop trigger if exists orders_status_log on orders;
create trigger orders_status_log before update on orders
  for each row execute function log_order_status();

-- Tracking reads go through /api/track (service role, code + phone check), so no public read policy on orders.
-- Handy for testing until the admin dashboard (batch 5):
--   update orders set status = 'preparing' where code = 'ZK-1234';
--   update orders set status = 'out_for_delivery', rider_name = 'Emeka', rider_phone = '08000000000' where code = 'ZK-1234';
