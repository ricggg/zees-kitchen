import { NextResponse } from 'next/server';
import { admin, confirmPayment } from '@/lib/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { code: string } }) {
  const db = admin();
  const code = params.code.toUpperCase();
  let { data: o } = await db.from('orders').select('*, order_items(*)').eq('code', code).maybeSingle();
  if (!o) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  // Fallback to the webhook: confirm with the payment provider when the customer lands back here.
  if (o.payment_status === 'pending' && o.payment_ref) {
    if (await confirmPayment(o.payment_ref, o.total_kobo / 100)) {
      await db.from('orders').update({ payment_status: 'paid', updated_at: new Date().toISOString() }).eq('id', o.id);
      o = { ...o, payment_status: 'paid' };
    }
  }
  // Public view: no phone or address.
  return NextResponse.json({
    code: o.code, fulfilment: o.fulfilment, status: o.status, paid: o.payment_status === 'paid',
    zone: o.zone_name, total: o.total_kobo / 100, fee: o.delivery_fee_kobo / 100, subtotal: o.subtotal_kobo / 100,
    name: String(o.customer_name).split(' ')[0],
    items: o.order_items.map((i: any) => ({ name: i.name, qty: i.qty, options: i.selected_options, unit: i.unit_kobo / 100 })),
  });
}
