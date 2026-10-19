import { Suspense } from 'react';
import MenuBrowser from '@/components/MenuBrowser';

export const metadata = { title: 'Menu' };

export default function MenuPage() {
  return (
    <div className="container-x pb-16 pt-8">
      <h1 className="h-display text-4xl sm:text-5xl">Our menu</h1>
      <p className="mt-2 max-w-lg text-ink/70">Local favourites and continental plates, cooked when you order.</p>
      <div className="mt-4">
        <Suspense fallback={<p className="py-10 text-ink/60">Loading menu…</p>}>
          <MenuBrowser />
        </Suspense>
      </div>
    </div>
  );
}
