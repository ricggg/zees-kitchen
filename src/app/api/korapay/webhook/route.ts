import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { admin, confirmPayment } from '@/lib/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const raw = await req.text();
  let evt: any;
  try { evt = JSON.parse(raw); } catch { return new NextResponse('Bad payload', { status: 400 }); }

  // Kora signs only the `data` object with your secret key (HMAC SHA-256).
  const sig = req.headers.get('x-korapay-signature') ?? '';
  const expected = createHmac('sha256', process.env.KORAPAY_SECRET_KEY ?? '').update(JSON.stringify(evt.data ?? {})).digest('hex');
  const a = Buffer.from(sig), e = Buffer.from(expected);
  if (a.length !== e.length || !timingSafeEqual(a, e)) return new NextResponse('Invalid signature', { status: 401 });

  if (evt.event === 'charge.success') {
    const db = admin();
    const { data: o } = await db.from('orders').select('id, total_kobo, payment_status').eq('payment_ref', evt.data?.reference).maybeSingle();
    // Re-check with Kora's API so we never rely on the webhook body alone. Safe to receive twice.
    if (o && o.payment_status !== 'paid' && (await confirmPayment(evt.data.reference, o.total_kobo / 100)))
      await db.from('orders').update({ payment_status: 'paid', updated_at: new Date().toISOString() }).eq('id', o.id);
  }
  return NextResponse.json({ ok: true });
}
