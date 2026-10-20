'use client';
import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categories } from '@/lib/menu-data';
import type { Dish } from '@/lib/types';
import DishCard from './DishCard';

export default function MenuBrowser({ dishes }: { dishes: Dish[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const cat = params.get('cat') ?? 'all';
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<'all' | 'local' | 'continental'>('all');

  const list = useMemo(() => dishes.filter((d) =>
    (cat === 'all' || d.category === cat) &&
    (kind === 'all' || d.type === kind) &&
    (q.trim() === '' || (d.name + ' ' + d.description).toLowerCase().includes(q.trim().toLowerCase()))
  ), [dishes, cat, kind, q]);

  const setCat = (c: string) => router.replace(c === 'all' ? '/menu' : `/menu?cat=${c}`, { scroll: false });
  const chip = (on: boolean) => `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition min-h-[40px] ${on ? 'bg-forest-900 text-white' : 'bg-white text-forest-900 border border-forest-900/15 hover:border-leaf-600'}`;

  return (
    <div>
      <div className="sticky top-[104px] z-30 -mx-4 space-y-3 bg-cream/95 px-4 py-3 backdrop-blur md:top-16 sm:-mx-6 sm:px-6">
        <input
          type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jollof, egusi, chicken…"
          aria-label="Search menu"
          className="h-12 w-full rounded-full border border-forest-900/15 bg-white px-5 text-base outline-none transition focus:border-leaf-600"
        />
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Categories">
          <button className={chip(cat === 'all')} onClick={() => setCat('all')}>All</button>
          {categories.map((c) => <button key={c.id} className={chip(cat === c.id)} onClick={() => setCat(c.id)}>{c.name}</button>)}
        </div>
        <div className="flex gap-2">
          {(['all', 'local', 'continental'] as const).map((k) => (
            <button key={k} className={chip(kind === k)} onClick={() => setKind(k)}>{k === 'all' ? 'Local & continental' : k === 'local' ? 'Local' : 'Continental'}</button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-xl font-bold text-forest-900">Nothing matches that</p>
          <p className="mt-1 text-sm text-ink/70">Try another word or clear the filters.</p>
          <button className="btn-dark mt-5" onClick={() => { setQ(''); setKind('all'); setCat('all'); }}>Clear filters</button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => <DishCard key={d.id} dish={d} />)}
        </div>
      )}
    </div>
  );
}
