'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { naira } from '@/lib/format';
import { statusLabel, stepsFor } from '@/lib/status';
import type { OrderStatus } from '@/lib/types';

const input = 'min-h-[44px] w-full rounded-xl border border-forest-900/20 bg-white px-3 text-base outline-none focus:border-leaf-600';
const DONE: OrderStatus[] = ['delivered', 'picked_up', 'cancelled'];
const api = async (url: string, method = 'GET', body?: unknown) => {
  const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
};
const beep = () => { try { const c = new AudioContext(), o = c.createOscillator(); o.frequency.value = 880; o.connect(c.destination); o.start(); o.stop(c.currentTime + 0.25); } catch {} };

function Login({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState(''); const [err, setErr] = useState('');
  return (
    <form className="mx-auto mt-10 max-w-sm space-y-4 rounded-xl2 bg-white p-6 shadow-sm" onSubmit={async (e) => {
      e.preventDefault(); const r = await api('/api/admin/login', 'POST', { password: pw });
      r.ok ? onDone() : setErr(r.data.error || 'Could not sign in.');
    }}>
      <h1 className="h-display text-2xl">Kitchen login</h1>
      <input className={input} type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" autoComplete="current-password" required />
      {err && <p role="alert" className="text-sm font-medium text-chili">{err}</p>}
      <button className="btn-primary w-full">Sign in</button>
    </form>
  );
}

function OrderCard({ o, reload }: { o: any; reload: () => void }) {
  const steps = stepsFor(o.fulfilment), idx = steps.indexOf(o.status), next = steps[idx + 1] as OrderStatus | undefined;
  const [rn, setRn] = useState(o.rider_name ?? ''); const [rp, setRp] = useState(o.rider_phone ?? ''); const [err, setErr] = useState('');
  const act = async (status?: OrderStatus) => {
    const r = await api('/api/admin/orders', 'PATCH', { code: o.code, status, ...(o.fulfilment === 'delivery' ? { riderName: rn, riderPhone: rp } : {}) });
    r.ok ? (setErr(''), reload()) : setErr(r.data.error || 'Failed');
  };
  const done = DONE.includes(o.status);
  return (
    <article className={`rounded-xl2 bg-white p-4 shadow-sm ${done ? 'opacity-70' : 'border-l-4 border-leaf-600'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-xl font-black text-forest-900">{o.code} <span className="ml-1 rounded-full bg-leaf-100 px-2 py-0.5 text-xs font-semibold">{o.fulfilment}</span></p>
        <p className="text-xs text-ink/60">{new Date(o.created_at).toLocaleString('en-NG', { hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' })}</p>
      </div>
      <p className="mt-1 text-sm"><strong>{o.customer_name}</strong> · <a className="text-leaf-600 underline" href={`tel:${o.phone}`}>{o.phone}</a></p>
      {o.fulfilment === 'delivery' && <p className="text-sm text-ink/80">{o.zone_name}: {o.address}</p>}
      {o.notes && <p className="mt-1 rounded bg-gold/15 px-2 py-1 text-sm">Note: {o.notes}</p>}
      <ul className="mt-2 space-y-1 text-sm">
        {o.order_items.map((i: any) => <li key={i.id}><strong>{i.qty}×</strong> {i.name}{i.selected_options?.length > 0 && ` (${i.selected_options.join(', ')})`}{i.note && <em className="text-ink/60"> “{i.note}”</em>}</li>)}
      </ul>
      <p className="mt-2 font-bold">{naira(o.total_kobo / 100)} <span className="text-sm font-medium text-leaf-600">· {statusLabel[o.status as OrderStatus]}</span></p>
      {o.fulfilment === 'delivery' && !done && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input className={input} placeholder="Rider name" value={rn} onChange={(e) => setRn(e.target.value)} />
          <input className={input} placeholder="Rider phone" inputMode="tel" value={rp} onChange={(e) => setRp(e.target.value)} />
        </div>
      )}
      {err && <p role="alert" className="mt-2 text-sm font-medium text-chili">{err}</p>}
      {!done && (
        <div className="mt-3 flex gap-2">
          {next && <button className="btn-primary flex-1" onClick={() => act(next)}>Mark: {statusLabel[next]}</button>}
          {o.fulfilment === 'delivery' && <button className="btn-dark" onClick={() => act()}>Save rider</button>}
          <button className="btn border border-chili/40 text-chili" onClick={() => confirm(`Cancel ${o.code}? Refund it in your payment dashboard.`) && act('cancelled')}>Cancel</button>
        </div>
      )}
    </article>
  );
}

function Orders({ onAuthLost }: { onAuthLost: () => void }) {
  const [orders, setOrders] = useState<any[] | null>(null); const [showDone, setShowDone] = useState(false);
  const seen = useRef<number | null>(null);
  const load = useCallback(async () => {
    const r = await api('/api/admin/orders');
    if (r.status === 401) return onAuthLost();
    if (!r.ok) return;
    const active = r.data.orders.filter((o: any) => !DONE.includes(o.status)).length;
    if (seen.current !== null && active > seen.current) beep();
    seen.current = active; setOrders(r.data.orders);
  }, [onAuthLost]);
  useEffect(() => { load(); const t = setInterval(load, 10000); return () => clearInterval(t); }, [load]);
  if (!orders) return <p className="py-8 text-ink/60">Loading orders…</p>;
  const list = orders.filter((o) => showDone === DONE.includes(o.status));
  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button className={showDone ? 'btn border border-forest-900/20' : 'btn-dark'} onClick={() => setShowDone(false)}>Active</button>
        <button className={showDone ? 'btn-dark' : 'btn border border-forest-900/20'} onClick={() => setShowDone(true)}>Finished</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((o) => <OrderCard key={o.code + o.status} o={o} reload={load} />)}
        {list.length === 0 && <p className="py-8 text-ink/60">No {showDone ? 'finished' : 'active'} orders.</p>}
      </div>
    </div>
  );
}

function MenuEditor() {
  const [dishes, setDishes] = useState<any[]>([]); const [msg, setMsg] = useState<Record<string, string>>({});
  useEffect(() => { api('/api/admin/menu').then((r) => r.ok && setDishes(r.data.dishes)); }, []);
  const edit = (id: string, p: object) => setDishes((d) => d.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const save = async (d: any) => {
    const r = await api('/api/admin/menu', 'PUT', { id: d.id, price: d.price, soldOut: d.soldOut });
    setMsg((m) => ({ ...m, [d.id]: r.ok ? 'Saved' : r.data.error }));
  };
  return (
    <ul className="divide-y divide-forest-900/10 rounded-xl2 bg-white px-4 shadow-sm">
      {dishes.map((d) => (
        <li key={d.id} className="flex flex-wrap items-center gap-3 py-3">
          <span className="min-w-[10rem] flex-1 font-semibold text-forest-900">{d.name}</span>
          <label className="flex items-center gap-1 text-sm">₦<input className={`${input} !w-28`} type="number" min={0} value={d.price} onChange={(e) => edit(d.id, { price: e.target.value })} /></label>
          <label className="flex min-h-[44px] items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5" checked={d.soldOut} onChange={(e) => edit(d.id, { soldOut: e.target.checked })} />Sold out</label>
          <button className="btn-dark !px-4" onClick={() => save(d)}>Save</button>
          {msg[d.id] && <span className="text-xs text-ink/60">{msg[d.id]}</span>}
        </li>
      ))}
    </ul>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null); const [tab, setTab] = useState<'orders' | 'menu'>('orders');
  useEffect(() => { api('/api/admin/orders').then((r) => setAuthed(r.status !== 401)); }, []);
  const lost = useCallback(() => setAuthed(false), []);
  if (authed === null) return <p className="container-x py-10 text-ink/60">Loading…</p>;
  return (
    <div className="container-x pb-16 pt-6">
      {!authed ? <Login onDone={() => setAuthed(true)} /> : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h1 className="h-display text-3xl">Kitchen</h1>
            <div className="flex gap-2">
              <button className={tab === 'orders' ? 'btn-dark' : 'btn border border-forest-900/20'} onClick={() => setTab('orders')}>Orders</button>
              <button className={tab === 'menu' ? 'btn-dark' : 'btn border border-forest-900/20'} onClick={() => setTab('menu')}>Menu & prices</button>
              <button className="btn border border-forest-900/20" onClick={async () => { await api('/api/admin/logout', 'POST'); setAuthed(false); }}>Log out</button>
            </div>
          </div>
          {tab === 'orders' ? <Orders onAuthLost={lost} /> : <MenuEditor />}
        </>
      )}
    </div>
  );
}
