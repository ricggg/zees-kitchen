import Link from 'next/link';
import type { Dish } from '@/lib/types';
import { naira } from '@/lib/format';
import AddButton from './AddButton';

export default function DishCard({ dish }: { dish: Dish }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl2 border border-forest-900/10 bg-white shadow-sm transition hover:shadow-soft">
      <Link href={`/menu/${dish.slug}`} className="block">
        <div className="leaf-pattern relative grid aspect-[4/3] place-items-center bg-forest-800">
          {dish.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <span className="font-display text-5xl font-black text-white/90">{dish.name[0]}</span>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-forest-900">
            {dish.type === 'local' ? 'Local' : 'Continental'}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link href={`/menu/${dish.slug}`}><h3 className="font-display text-lg font-bold text-forest-900">{dish.name}</h3></Link>
        <p className="line-clamp-2 text-sm text-ink/70">{dish.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <p className="font-semibold text-leaf-600">{naira(dish.price)}</p>
          <AddButton dish={dish} />
        </div>
      </div>
    </article>
  );
}
