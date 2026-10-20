'use client';
import { useEffect, useState } from 'react';
import { statusHint, statusLabel, stepsFor } from '@/lib/status';
import type { FulfilmentType, OrderStatus } from '@/lib/types';

interface Track {
  code: string; fulfilment: FulfilmentType; status: OrderStatus; zone: string | null; eta: number | null;
  events: { status: OrderStatus; created_at: string }[];
  rider: { name: string; phone: string | null } | null;
}
const time = (iso?: string) => (iso ? new Date(iso).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' }) : '');

export default function OrderTracker({ code, phone4, onError }: { code: string; phone4: string; onError?: (m: string) => void }) {
  const [t, setT] = useState<Track | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let stop = false, timer: ReturnType<typeof setTimeout>;
    async function load() {
      if (document.visibilityState === 'visible') {
        try {
          const res = await fetch(`/api/track?code=${encodeURIComponent(code)}&p=${phone4}`, { cache: 'no-store' });
          const data = await res.json();
          if (stop) return;
          if (!res.ok) { setErr(data.error); onError?.(data.error); return; }
          setErr(''); setT(data);
          if (['delivered', 'picked_up', 'cancelled'].includes(data.status)) return; // finished, stop polling
        } catch { /* keep trying */ }
      }
      timer = setTimeout(load, 8000);
    }
    load();
    return () => { stop = true; clearTimeout(timer); };
  }, [code, phone4, onError]);

  if (err) return <p role="alert" className="rounded-xl bg-chili/10 p-4 text-sm font-medium text-chili">{err}</p>;
  if (!t) return <p className="py-6 text-center text-ink/70">Loading your order progress…</p>;

  const steps = stepsFor(t.fulfilment);
  const idx = Math.max(steps.indexOf(t.status), 0);
  const cancelled = t.status === 'cancelled';
  const pct = cancelled ? 0 : (idx / (steps.length - 1)) * 100;
  const at = (s: OrderStatus) => t.events.find((e) => e.status === s)?.created_at;

  return (
    <section aria-live="polite" className="rounded-xl2 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-widest text-leaf-600">{t.code}</p>
      <h2 className="mt-1 font-display text-2xl font-black text-forest-900">{statusLabel[t.status]}</h2>
      <p className="mt-1 text-sm text-ink/70">{statusHint(t.status, t.fulfilment)}</p>
      {t.fulfilment === 'delivery' && t.eta && !['delivered', 'cancelled'].includes(t.status) && (
        <p className="mt-1 text-sm text-ink/70">Usually about {t.eta} minutes to {t.zone} once your food is ready.</p>
      )}

      {!cancelled && (
        <div className="mt-5" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Order progress">
          <div className="h-3 overflow-hidden rounded-full bg-leaf-100">
            <div className="h-full rounded-full bg-leaf-600 motion-safe:transition-[width] motion-safe:duration-700" style={{ width: `${Math.max(pct, 6)}%` }} />
          </div>
        </div>
      )}

      <ol className="mt-5 space-y-4">
        {steps.map((s, i) => {
          const done = !cancelled && i <= idx, current = !cancelled && i === idx;
          return (
            <li key={s} className="flex items-center gap-3">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${done ? 'bg-leaf-600 text-white' : 'bg-leaf-100 text-forest-900/50'} ${current ? 'ring-4 ring-leaf-400/40' : ''}`}>
                {done ? '✓' : i + 1}
              </span>
              <span className={`flex-1 text-sm ${done ? 'font-semibold text-forest-900' : 'text-ink/50'}`}>{statusLabel[s]}</span>
              <span className="text-xs text-ink/50">{time(at(s))}</span>
            </li>
          );
        })}
      </ol>

      {t.rider && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-leaf-100 p-4">
          <div><p className="text-xs uppercase tracking-wider text-forest-900/60">Your rider</p><p className="font-semibold text-forest-900">{t.rider.name}</p></div>
          {t.rider.phone && <a href={`tel:${t.rider.phone}`} className="btn-dark">Call rider</a>}
        </div>
      )}
    </section>
  );
}
