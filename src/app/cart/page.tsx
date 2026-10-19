'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { naira } from '@/lib/format';
import CartLines from '@/components/CartLines';

export default function CartPage() {
  const { lines, subtotal, clear } = useCart();
  return (
    <div className="container-x max-w-2xl pb-16 pt-8">
      <h1 className="h-display text-4xl">Your cart</h1>
      {lines.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-xl font-bold text-forest-900">Nothing here yet</p>
          <Link href="/menu" className="btn-primary mt-5">Browse menu</Link>
        </div>
      ) : (
        <>
          <CartLines />
          <div className="mt-4 rounded-xl2 bg-white p-5 shadow-sm">
            <div className="flex justify-between text-lg font-bold"><span>Subtotal</span><span>{naira(subtotal)}</span></div>
            <p className="mt-1 text-sm text-ink/60">Delivery fee is added at checkout.</p>
            <Link href="/checkout" className="btn-primary mt-4 w-full">Continue to checkout</Link>
            <button onClick={clear} className="mt-2 min-h-[44px] w-full text-sm font-medium text-chili hover:underline">Empty cart</button>
          </div>
        </>
      )}
    </div>
  );
}
