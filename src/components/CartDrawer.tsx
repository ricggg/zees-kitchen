'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/lib/cart';
import { naira } from '@/lib/format';
import CartLines from './CartLines';

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, count } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, setOpen]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-forest-950/60 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />
      <aside role="dialog" aria-modal="true" aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-[100dvh] w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
          <h2 className="font-display text-2xl font-black text-forest-900">Your order {count > 0 && <span className="text-leaf-600">({count})</span>}</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="grid h-11 w-11 place-items-center rounded-full text-2xl hover:bg-leaf-100">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="font-display text-xl font-bold text-forest-900">Your cart is empty</p>
                <p className="mt-1 text-sm text-ink/70">Pick something delicious from the menu.</p>
                <Link href="/menu" onClick={() => setOpen(false)} className="btn-primary mt-5">Browse menu</Link>
              </div>
            </div>
          ) : <CartLines />}
        </div>
        {lines.length > 0 && (
          <div className="space-y-3 border-t border-forest-900/10 bg-white px-5 py-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            <div className="flex justify-between text-lg font-bold"><span>Subtotal</span><span>{naira(subtotal)}</span></div>
            <p className="text-xs text-ink/60">Delivery fee is added at checkout.</p>
            <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary w-full">Checkout</Link>
            <Link href="/cart" onClick={() => setOpen(false)} className="btn w-full text-forest-900 hover:bg-leaf-100">View full cart</Link>
          </div>
        )}
      </aside>
    </div>
  );
}
