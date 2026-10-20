'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';
import { naira } from '@/lib/format';
import { site, waLink } from '@/lib/site';
import OrderTracker from '@/components/OrderTracker';

interface Order {
  code: string; fulfilment: 'pickup' | 'delivery'; paid: boolean; zone: string | null; name: string;
  total: number; fee: number; subtotal: number;
  items: { name: string; qty: number; options: string[]; unit: number }[];
}

export default function OrderPage({ params }: { params: { code: string } }) {
  const { clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [missing, setMissing] = useState(false);
  const [phone4, setPhone4] = useState('');
  useEffect(() => {
    try { const t = JSON.parse(localStorage.getItem('zk-track') || '{}'); if (t.code === params.code.toUpperCase()) setPhone4(t.p || ''); } catch {}
  }, [params.code]);

  useEffect(() => {
    let stop = false, tries = 0;
    async function load() {
      const res = await fetch(`/api/orders/${params.code}`, { cache: 'no-store' });
      if (res.status === 404) return setMissing(true);
      const o: Order = await res.json();
      if (stop) return;
      setOrder(o);
      if (o.paid) clear();
      else if (++tries < 10) setTimeout(load, 3000); // payment may take a moment to confirm
    }
    load();
    return () => { stop = true; };
  }, [params.code, clear]);

  if (missing)
    return <div className="container-x py-16 text-center"><h1 className="h-display text-3xl">Order not found</h1><Link href="/menu" className="btn-primary mt-5">Back to menu</Link></div>;
  if (!order) return <div className="container-x py-16 text-center text-ink/70">Loading your order…</div>;

  return (
    <div className="container-x max-w-xl pb-16 pt-8">
      {order.paid ? (
        <div className="rounded-xl2 bg-forest-900 p-6 text-center text-white shadow-soft">
          <p className="text-sm uppercase tracking-widest text-lime-300">Thank you, {order.name}!</p>
          <p className="mt-2 text-sm text-white/80">{order.fulfilment === 'pickup' ? 'Your pickup code' : 'Your order code'}</p>
          <p className="mt-1 font-display text-6xl font-black tracking-wider text-gold" aria-label={`Order code ${order.code}`}>{order.code}</p>
          <p className="mt-3 text-sm text-white/80">
            {order.fulfilment === 'pickup'
              ? `Show this code at ${site.name} when you come for your food.`
              : `We are preparing your order for delivery to ${order.zone}. Keep this code to track it.`}
          </p>
        </div>
      ) : (
        <div className="rounded-xl2 bg-white p-6 text-center shadow-sm">
          <p className="font-display text-xl font-bold text-forest-900">Confirming your payment…</p>
          <p className="mt-2 text-sm text-ink/70">This usually takes a few seconds. If you were charged and nothing changes, send us your code <strong>{order.code}</strong> on WhatsApp.</p>
          <a className="btn-dark mt-4" href={waLink(`Hello Zee's Kitchen, my order code is ${order.code}`)}>WhatsApp us</a>
        </div>
      )}

      <div className="mt-6">
        {order.paid && (phone4
          ? <OrderTracker code={order.code} phone4={phone4} />
          : <Link href={`/track?code=${order.code}`} className="btn-dark w-full">Track this order</Link>)}
      </div>

      <div className="mt-6 rounded-xl2 bg-white p-5 shadow-sm">
        <ul className="divide-y divide-forest-900/10">
          {order.items.map((i, k) => (
            <li key={k} className="flex justify-between gap-3 py-3 text-sm">
              <span><strong>{i.qty}×</strong> {i.name}{i.options.length > 0 && <span className="block text-ink/60">{i.options.join(', ')}</span>}</span>
              <span className="shrink-0 font-semibold">{naira(i.unit * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 space-y-1 border-t border-forest-900/10 pt-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{naira(order.subtotal)}</span></div>
          {order.fulfilment === 'delivery' && <div className="flex justify-between"><span>Delivery</span><span>{naira(order.fee)}</span></div>}
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{naira(order.total)}</span></div>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/menu" className="btn-primary flex-1">Order more</Link>
        <a href={`tel:${site.phone}`} className="btn-dark flex-1">Call {site.phone}</a>
      </div>
    </div>
  );
}
