import { NextResponse } from 'next/server';
import { admin } from '@/lib/server';
import { zones } from '@/lib/zones';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Best-effort brute-force guard (per server instance).
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now(), h = hits.get(ip);
  if (!h || now - h.t > 10 * 60_000) { hits.set(ip, { n: 1, t: now }); return false; }
  return ++h.n > 30;
}

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'local';
  if (limited(ip)) return NextResponse.json({ error: 'Too many tries. Please wait a few minutes.' }, { status: 429 });

  const u = new URL(req.url);
  const code = (u.searchParams.get('code') ?? '').trim().toUpperCase();
  const p = (u.searchParams.get('p') ?? '').replace(/\D/g, '');
  const notFound = NextResponse.json({ error: 'We could not find that order. Check your code and the last 4 digits of your phone number.' }, { status: 404 });
  if (!/^ZK-\d{4}$/.test(code) || p.length !== 4) return notFound;

  const db = admin();
  const { data: o } = await db.from('orders').select('*').eq('code', code).maybeSingle();
  if (!o || o.payment_status !== 'paid' || !String(o.phone).replace(/\D/g, '').endsWith(p)) return notFound;

  const { data: ev } = await db.from('order_events').select('status, created_at').eq('order_id', o.id).order('created_at');
  const zone = zones.find((z) => z.name === o.zone_name);
  return NextResponse.json({
    code: o.code, fulfilment: o.fulfilment, status: o.status, zone: o.zone_name, eta: zone?.eta ?? null,
    events: ev ?? [],
    rider: o.status === 'out_for_delivery' && o.rider_name ? { name: o.rider_name, phone: o.rider_phone } : null,
  });
}
