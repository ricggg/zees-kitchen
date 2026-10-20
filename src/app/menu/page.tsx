import { Suspense } from 'react';
import MenuBrowser from '@/components/MenuBrowser';
import { getMenu } from '@/lib/menu';

export const metadata = { title: 'Menu', description: 'Local and continental meals from Zee’s Kitchen, Asaba. Order for pickup or delivery.' };

export default async function MenuPage() {
  const dishes = await getMenu();
  return (
    <div className="container-x pb-16 pt-8">
      <h1 className="h-display text-4xl sm:text-5xl">Our menu</h1>
      <p className="mt-2 max-w-lg text-ink/70">Local favourites and continental plates, cooked when you order.</p>
      <div className="mt-4">
        <Suspense fallback={<p className="py-10 text-ink/60">Loading menu…</p>}>
          <MenuBrowser dishes={dishes} />
        </Suspense>
      </div>
    </div>
  );
}
