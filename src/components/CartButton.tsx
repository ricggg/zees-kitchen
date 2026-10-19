'use client';
import { useCart } from '@/lib/cart';

export default function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button onClick={() => setOpen(true)} aria-label={`Open cart, ${count} items`} className="relative grid h-11 w-11 place-items-center rounded-full bg-forest-900 text-white transition hover:bg-forest-800 active:scale-95">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 8h14l-1.2 11H6.2L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-leaf-400 px-1 text-[11px] font-bold text-forest-950">{count}</span>}
    </button>
  );
}
