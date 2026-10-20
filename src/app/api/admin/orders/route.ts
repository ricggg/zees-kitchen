import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { admin } from '@/lib/server';
import { stepsFor } from '@/lib/status';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const no = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export async function GET() {
  if (!isAdmin()) return no();
  const { data, error } = await admin().from('orders').select('*, order_items(*)')
    .eq('payment_status', 'paid').order('created_at', { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: 'Could not load orders.' }, { status: 500 });
  return NextResponse.json({ orders: data });
}

export async function PATCH(req: Request) {
  if (!isAdmin()) return no();
  const b = await req.json().catch(() => ({}));
  const db = admin();
  const { data: o } = await db.from('orders').select('id, fulfilment, rider_name').eq('code', String(b.code)).maybeSingle();
  if (!o) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  const patch: Record<string, unknown> = {};
  if (typeof b.riderName === 'string') patch.rider_name = b.riderName.trim().slice(0, 60) || null;
  if (typeof b.riderPhone === 'string') patch.rider_phone = b.riderPhone.replace(/[^\d+]/g, '').slice(0, 16) || null;
  if (b.status !== undefined) {
    const ok = [...stepsFor(o.fulfilment), 'cancelled'].includes(b.status);
    if (!ok) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    if (b.status === 'out_for_delivery' && !(patch.rider_name ?? o.rider_name))
      return NextResponse.json({ error: 'Add the rider’s name first.' }, { status: 400 });
    patch.status = b.status; // batch4.sql trigger logs the event
  }
  const { error } = await db.from('orders').update(patch).eq('id', o.id);
  if (error) return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
