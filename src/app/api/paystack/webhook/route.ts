import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { admin } from '@/lib/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get('x-paystack-signature') ?? '';
  const expected = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY ?? '').update(raw).digest('hex');
  const a = Buffer.from(sig), e = Buffer.from(expected);
  if (a.length !== e.length || !timingSafeEqual(a, e)) return new NextResponse('Invalid signature', { status: 401 });

  const evt = JSON.parse(raw);
  if (evt.event === 'charge.success') {
    const db = admin();
    const { data: o } = await db.from('orders').select('id,total_kobo').eq('payment_ref', evt.data.reference).maybeSingle();
    if (o && o.total_kobo === evt.data.amount)
      await db.from('orders').update({ payment_status: 'paid', updated_at: new Date().toISOString() }).eq('id', o.id);
  }
  return NextResponse.json({ ok: true });
}
