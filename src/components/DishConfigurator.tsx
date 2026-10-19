'use client';
import { useMemo, useState } from 'react';
import type { Dish } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { naira } from '@/lib/format';
import QtyStepper from './QtyStepper';

export default function DishConfigurator({ dish }: { dish: Dish }) {
  const { add } = useCart();
  const groups = dish.options ?? [];
  const [sel, setSel] = useState<Record<string, string[]>>({});
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  const toggle = (gid: string, cid: string, multi: boolean) =>
    setSel((s) => {
      const cur = s[gid] ?? [];
      return { ...s, [gid]: multi ? (cur.includes(cid) ? cur.filter((x) => x !== cid) : [...cur, cid]) : [cid] };
    });

  const chosen = useMemo(() => groups.flatMap((g) => g.choices.filter((c) => (sel[g.id] ?? []).includes(c.id))), [groups, sel]);
  const unit = dish.price + chosen.reduce((n, c) => n + c.price, 0);
  const missing = groups.filter((g) => g.required && !(sel[g.id]?.length));

  return (
    <div className="space-y-7">
      {groups.map((g) => (
        <fieldset key={g.id} className="space-y-3">
          <legend className="flex w-full items-baseline justify-between">
            <span className="font-display text-xl font-bold text-forest-900">{g.label}</span>
            <span className="text-xs font-medium text-ink/60">{g.required ? 'Required' : 'Optional'}</span>
          </legend>
          <div className="grid gap-2">
            {g.choices.map((c) => {
              const on = (sel[g.id] ?? []).includes(c.id);
              return (
                <label key={c.id} className={`flex min-h-[52px] cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 transition ${on ? 'border-leaf-600 bg-leaf-100' : 'border-forest-900/15 bg-white hover:border-leaf-600'}`}>
                  <span className="flex items-center gap-3">
                    <input type={g.type === 'multi' ? 'checkbox' : 'radio'} name={g.id} checked={on} onChange={() => toggle(g.id, c.id, g.type === 'multi')} className="h-5 w-5 accent-[#2F9A3F]" />
                    <span className="font-medium">{c.label}</span>
                  </span>
                  <span className="text-sm text-ink/70">{c.price ? `+${naira(c.price)}` : 'Included'}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="space-y-2">
        <label htmlFor="note" className="font-display text-xl font-bold text-forest-900">Note for the kitchen</label>
        <textarea id="note" value={note} onChange={(e) => setNote(e.target.value.slice(0, 140))} rows={2} placeholder="Less pepper, no onions…"
          className="w-full rounded-xl border border-forest-900/15 bg-white p-3 text-base outline-none focus:border-leaf-600" />
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-forest-900/10 bg-cream/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0"
        style={{ paddingBottom: 'max(.75rem, env(safe-area-inset-bottom))' }}>
        <QtyStepper qty={qty} onChange={(n) => setQty(Math.max(1, n))} />
        <button
          className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          disabled={missing.length > 0}
          onClick={() => add({ dishId: dish.id, slug: dish.slug, name: dish.name, qty, unit, options: chosen.map((c) => c.label), choiceIds: chosen.map((c) => c.id), note: note.trim() || undefined })}
        >
          {missing.length ? `Choose ${missing[0].label.replace(/^Choose /i, '').toLowerCase()}` : `Add to cart · ${naira(unit * qty)}`}
        </button>
      </div>
    </div>
  );
}
