import { NextResponse } from 'next/server';
import { admin, newCode, paymentsConfigured, priceCart, startPayment } from '@/lib/server';
import { getZone } from '@/lib/zones';
import { getMenu } from '@/lib/menu';

export const runtime = 'nodejs';
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  if (!paymentsConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY)
    return bad('Online ordering is not configured yet. Please call us to order.', 503);

  let b: any;
  try { b = await req.json(); } catch { return bad('Invalid request.'); }

  const name = String(b.name ?? '').trim().slice(0, 80);
  const phone = String(b.phone ?? '').replace(/[\s-]/g, '');
  const fulfilment = b.fulfilment === 'delivery' ? 'delivery' : 'pickup';
  if (name.length < 2) return bad('Please enter your name.');
  if (!/^(0|\+?234)\d{10}$/.test(phone)) return bad('Please enter a valid Nigerian phone number.');

  const priced = priceCart(b.items, await getMenu());
  if ('error' in priced) return bad(priced.error);

  let fee = 0, zone: ReturnType<typeof getZone> = undefined, address: string | null = null;
  if (fulfilment === 'delivery') {
    zone = getZone(String(b.zoneId));
    address = String(b.address ?? '').trim().slice(0, 240);
    if (!zone) return bad('Please choose your delivery area.');
    if (address.length < 6) return bad('Please enter your delivery address.');
    fee = zone.fee;
  }
  const total = priced.subtotal + fee;
  if (b.expectedTotal !== undefined && Number(b.expectedTotal) !== total)
    return NextResponse.json({ error: 'Some prices changed. Please check your updated total and pay again.', units: priced.lines.map((l) => l.unit) }, { status: 409 });
  const notes = String(b.notes ?? '').trim().slice(0, 300) || null;

  const db = admin();
  let order: { id: string; code: string } | null = null;
  for (let i = 0; i < 6 && !order; i++) {
    const { data, error } = await db.from('orders').insert({
      code: newCode(), fulfilment, customer_name: name, phone, address, zone_name: zone?.name ?? null, notes,
      subtotal_kobo: priced.subtotal * 100, delivery_fee_kobo: fee * 100, total_kobo: total * 100,
    }).select('id, code').single();
    if (data) order = data;
    else if (error?.code !== '23505') return bad('Could not place your order. Please try again.', 500);
  }
  if (!order) return bad('Could not place your order. Please try again.', 500);

  await db.from('order_items').insert(priced.lines.map((l) => ({
    order_id: order!.id, dish_id: l.dishId, name: l.name, qty: l.qty, unit_kobo: l.unit * 100,
    selected_options: l.options, note: l.note,
  })));
  await db.from('order_events').insert({ order_id: order.id, status: 'received' });

  const ref = `${order.code}-${Date.now().toString(36)}`;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const url = await startPayment({ ref, totalNaira: total, code: order.code, name, phone, origin });
  if (!url) return bad('Payment could not be started. Please try again.', 502);

  await db.from('orders').update({ payment_ref: ref }).eq('id', order.id);
  return NextResponse.json({ code: order.code, url });
}
