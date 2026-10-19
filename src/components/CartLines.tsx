'use client';
import { useCart } from '@/lib/cart';
import { naira } from '@/lib/format';
import QtyStepper from './QtyStepper';

export default function CartLines() {
  const { lines, setQty, remove } = useCart();
  return (
    <ul className="divide-y divide-forest-900/10">
      {lines.map((l) => (
        <li key={l.key} className="flex flex-col gap-3 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-lg font-bold text-forest-900">{l.name}</p>
              {l.options.length > 0 && <p className="text-sm text-ink/70">{l.options.join(', ')}</p>}
              {l.note && <p className="text-sm italic text-ink/60">“{l.note}”</p>}
            </div>
            <p className="shrink-0 font-semibold">{naira(l.unit * l.qty)}</p>
          </div>
          <div className="flex items-center justify-between">
            <QtyStepper qty={l.qty} min={0} onChange={(n) => setQty(l.key, n)} />
            <button onClick={() => remove(l.key)} className="min-h-[44px] px-2 text-sm font-medium text-chili hover:underline">Remove</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
