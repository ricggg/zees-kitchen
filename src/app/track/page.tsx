'use client';
import { useEffect, useState } from 'react';
import OrderTracker from '@/components/OrderTracker';
import { site, waLink } from '@/lib/site';

const field = 'mt-1 w-full min-h-[48px] rounded-xl border border-forest-900/20 bg-white px-4 text-base text-ink outline-none focus:border-leaf-600 focus:ring-2 focus:ring-leaf-400/40';

export default function TrackPage() {
  const [code, setCode] = useState('');
  const [p, setP] = useState('');
  const [active, setActive] = useState<{ code: string; p: string } | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('code');
    let saved: { code?: string; p?: string } = {};
    try { saved = JSON.parse(localStorage.getItem('zk-track') || '{}'); } catch {}
    const c = (q || saved.code || '').toUpperCase();
    if (c) setCode(c);
    if (c && saved.code === c && saved.p) { setP(saved.p); setActive({ code: c, p: saved.p }); }
  }, []);

  function go(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim().toUpperCase(), d = p.replace(/\D/g, '');
    try { localStorage.setItem('zk-track', JSON.stringify({ code: c, p: d })); } catch {}
    setActive({ code: c, p: d });
  }

  return (
    <div className="container-x max-w-xl pb-16 pt-8">
      <h1 className="h-display text-4xl">Track your order</h1>
      <form onSubmit={go} className="mt-6 grid gap-4 rounded-xl2 bg-white p-5 shadow-sm sm:grid-cols-2">
        <label className="text-sm font-medium">Order code
          <input className={field} value={code} onChange={(e) => { setCode(e.target.value); setActive(null); }} placeholder="ZK-1234" autoCapitalize="characters" required />
        </label>
        <label className="text-sm font-medium">Last 4 digits of your phone
          <input className={field} value={p} onChange={(e) => { setP(e.target.value); setActive(null); }} inputMode="numeric" maxLength={4} pattern="\d{4}" placeholder="5475" required />
        </label>
        <button className="btn-primary sm:col-span-2">Track order</button>
      </form>
      <div className="mt-6">
        {active && <OrderTracker key={active.code + active.p} code={active.code} phone4={active.p} />}
      </div>
      <p className="mt-6 text-center text-sm text-ink/60">
        Need help? Call {site.phone} or <a className="font-semibold text-leaf-600 underline" href={waLink('Hello Zee\'s Kitchen, I need help with my order')}>WhatsApp us</a>.
      </p>
    </div>
  );
}
