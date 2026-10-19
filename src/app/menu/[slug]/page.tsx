import Link from 'next/link';
import { notFound } from 'next/navigation';
import { dishes, getDish } from '@/lib/menu-data';
import { naira } from '@/lib/format';
import DishConfigurator from '@/components/DishConfigurator';

export const generateStaticParams = () => dishes.map((d) => ({ slug: d.slug }));
export const generateMetadata = ({ params }: { params: { slug: string } }) => ({ title: getDish(params.slug)?.name ?? 'Dish' });

export default function DishPage({ params }: { params: { slug: string } }) {
  const dish = getDish(params.slug);
  if (!dish) notFound();
  return (
    <div className="container-x pb-10 pt-6">
      <Link href={`/menu?cat=${dish.category}`} className="inline-flex min-h-[44px] items-center text-sm font-semibold text-leaf-600 hover:underline">‹ Back to menu</Link>
      <div className="mt-2 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="leaf-pattern grid aspect-[4/3] place-items-center overflow-hidden rounded-xl2 bg-forest-800 md:sticky md:top-24 md:self-start">
          {dish.image
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
            : <span className="font-display text-8xl font-black text-white/90">{dish.name[0]}</span>}
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-leaf-600">{dish.type === 'local' ? 'Local dish' : 'Continental'}</p>
            <h1 className="h-display mt-1 text-4xl sm:text-5xl">{dish.name}</h1>
            <p className="mt-3 max-w-md text-ink/75">{dish.description}</p>
            <p className="mt-3 text-2xl font-bold text-forest-900">from {naira(dish.price)}</p>
          </div>
          <DishConfigurator dish={dish} />
        </div>
      </div>
    </div>
  );
}
