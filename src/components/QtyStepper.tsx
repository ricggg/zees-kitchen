'use client';
export default function QtyStepper({ qty, onChange, min = 1 }: { qty: number; onChange: (n: number) => void; min?: number }) {
  const b = 'grid h-11 w-11 place-items-center rounded-full border border-forest-900/20 text-lg font-bold text-forest-900 transition hover:bg-leaf-100 active:scale-95 disabled:opacity-40';
  return (
    <div className="inline-flex items-center gap-3" role="group" aria-label="Quantity">
      <button type="button" className={b} onClick={() => onChange(qty - 1)} disabled={qty <= min && min > 0} aria-label="Decrease">−</button>
      <span className="w-6 text-center font-semibold tabular-nums" aria-live="polite">{qty}</span>
      <button type="button" className={b} onClick={() => onChange(qty + 1)} aria-label="Increase">+</button>
    </div>
  );
}
