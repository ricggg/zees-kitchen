'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { naira } from '@/lib/format';
import { getZone, zones } from '@/lib/zones';
import { site } from '@/lib/site';
import CartLines from '@/components/CartLines';

const field = 'mt-1 w-full min-h-[48px] rounded-xl border border-forest-900/20 bg-white px-4 text-base text-ink outline-none focus:border-leaf-600 focus:ring-2 focus:ring-leaf-400/40';

export default function CheckoutPage() {
  const { lines, subtotal, reprice } = useCart();
  const [fulfilment, setFulfilment] = useState<'pickup' | 'delivery'>('pickup');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const zone = getZone(zoneId);
  const fee = fulfilment === 'delivery' && zone ? zone.fee : 0;

  if (lines.length === 0)
    return (
      <div className="container-x py-16 text-center">
        <h1 className="h-display text-4xl">Checkout</h1>
        <p className="mt-3 text-ink/70">Your cart is empty.</p>
        <Link href="/menu" className="btn-primary mt-5">Browse menu</Link>
      </div>
    );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, fulfilment, zoneId, address, notes, expectedTotal: subtotal + fee,
          items: lines.map((l) => ({ dishId: l.dishId, qty: l.qty, choiceIds: l.choiceIds, note: l.note })),
        }),
      });
      const data = await res.json();
      if (res.status === 409 && Array.isArray(data.units)) reprice(data.units);
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      try { localStorage.setItem('zk-track', JSON.stringify({ code: data.code, p: phone.replace(/\D/g, '').slice(-4) })); } catch {}
      window.location.href = data.url; // Paystack hosted payment page
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setBusy(false);
    }
  }

  const tab = (v: 'pickup' | 'delivery') =>
    `min-h-[48px] flex-1 rounded-full px-4 text-sm font-semibold transition ${fulfilment === v ? 'bg-forest-900 text-white shadow-soft' : 'text-forest-900 hover:bg-leaf-100'}`;

  return (
    <div className="container-x pb-16 pt-8">
      <h1 className="h-display text-4xl">Checkout</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="space-y-6">
          <div className="flex gap-1 rounded-full border border-forest-900/15 bg-white p-1" role="tablist">
            <button type="button" role="tab" aria-selected={fulfilment === 'pickup'} className={tab('pickup')} onClick={() => setFulfilment('pickup')}>Pickup</button>
            <button type="button" role="tab" aria-selected={fulfilment === 'delivery'} className={tab('delivery')} onClick={() => setFulfilment('delivery')}>Home delivery</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Your name
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required minLength={2} />
            </label>
            <label className="text-sm font-medium">Phone number
              <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="08012345678" required />
            </label>
          </div>

          {fulfilment === 'pickup' ? (
            <p className="rounded-xl2 bg-leaf-100 p-4 text-sm text-forest-900">
              You will get an order code after payment. Show it at {site.name}, {site.city} when you come for your food.
            </p>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-medium">Delivery area
                <select className={field} value={zoneId} onChange={(e) => setZoneId(e.target.value)} required>
                  <option value="">Choose your area in {site.city}</option>
                  {zones.map((z) => <option key={z.id} value={z.id}>{z.name}, {naira(z.fee)}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium">Full address / landmark
                <textarea className={`${field} py-3`} rows={3} value={address} onChange={(e) => setAddress(e.target.value)} required minLength={6} />
              </label>
              {zone && <p className="text-sm text-ink/70">Estimated delivery: about {zone.eta} minutes after your food is ready.</p>}
            </div>
          )}

          <label className="block text-sm font-medium">Note for the kitchen (optional)
            <textarea className={`${field} py-3`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} />
          </label>

          {error && <p role="alert" className="rounded-xl bg-chili/10 p-3 text-sm font-medium text-chili">{error}</p>}
          <button className="btn-primary w-full text-base" disabled={busy}>
            {busy ? 'Taking you to payment…' : `Pay ${naira(subtotal + fee)} securely`}
          </button>
          <p className="text-center text-xs text-ink/60">Secure payment by card or bank transfer.</p>
        </form>

        <aside className="h-fit rounded-xl2 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold text-forest-900">Your order</h2>
          <CartLines />
          <dl className="mt-3 space-y-1 border-t border-forest-900/10 pt-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{naira(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{fulfilment === 'pickup' ? 'Free' : zone ? naira(fee) : 'Choose area'}</dd></div>
            <div className="flex justify-between pt-1 text-lg font-bold"><dt>Total</dt><dd>{naira(subtotal + fee)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
