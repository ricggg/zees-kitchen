'use client';
import Link from 'next/link';
import type { Dish } from '@/lib/types';
import { useCart } from '@/lib/cart';

// Quick add for dishes with no required choices; otherwise sends the customer to the dish page.
export default function AddButton({ dish }: { dish: Dish }) {
  const { add } = useCart();
  const needsChoice = dish.options?.some((o) => o.required);
  const cls = 'btn !min-h-[40px] !px-4 !py-2 bg-leaf-600 text-white hover:bg-leaf-500';
  if (needsChoice || dish.options?.length) {
    return <Link href={`/menu/${dish.slug}`} className={cls}>Customise</Link>;
  }
  return (
    <button className={cls} onClick={() => add({ dishId: dish.id, slug: dish.slug, name: dish.name, qty: 1, unit: dish.price, options: [], choiceIds: [] })}>
      Add
    </button>
  );
}
