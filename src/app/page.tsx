import Link from 'next/link';
import { categories, dishes } from '@/lib/menu-data';
import DishCard from '@/components/DishCard';
import { site } from '@/lib/site';

const steps = [
  { t: 'Choose your meal', d: 'Browse local and continental dishes, pick your protein and extras, and add as many items as you like.' },
  { t: 'Pay at checkout', d: 'Pick pickup or home delivery, pay online, and receive your order code instantly.' },
  { t: 'Collect or track', d: 'Show your code  to the delivery, or follow a live progress bar until the rider reaches your door.' },
];

export default function Home() {
  const popular = dishes.filter((d) => d.popular).slice(0, 4);
  return (
    <>
      {/* HERO: deep green panel + diagonal tagline ribbon from the banner */}
      <section className="leaf-pattern relative overflow-hidden bg-forest-900 text-white">
        <div className="container-x grid items-center gap-10 pb-28 pt-12 sm:pt-20 md:grid-cols-[1.2fr_.8fr]">
          <div className="hero-in space-y-6">
            <p className="text-sm font-medium text-leaf-400">Fresh food · Fast delivery · Home-taste guaranteed</p>
            <h1 className="font-display text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl">
              Zee&rsquo;s Kitchen
            </h1>
            <p className="max-w-md text-lg text-white/80">
              Egusi, jollof, peppered chicken and continental plates, cooked fresh in {site.city} and brought to you hot.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/menu" className="btn-primary">Order now</Link>
              <Link href="/track" className="btn-ghost">Track an order</Link>
            </div>
          </div>
          <div className="hidden justify-self-center md:block" aria-hidden>
            <div className="grid h-64 w-64 place-items-center rounded-full border-[10px] border-leaf-400/40 bg-forest-800 shadow-soft">
              <span className="font-display text-8xl font-black text-white">Z</span>
            </div>
          </div>
        </div>
        <div className="ribbon absolute inset-x-0 bottom-0 h-24 sm:h-28">
          <p className="container-x flex h-full items-center justify-center pt-3 font-display text-2xl font-extrabold italic text-white sm:text-4xl">
            {site.name}&hellip; {site.tagline}
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container-x">
          <h2 className="h-display text-3xl sm:text-4xl">What are you hungry for?</h2>
          <div className="-mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {categories.map((c) => (
              <Link key={c.id} href={`/menu?cat=${c.id}`} className="min-w-[70%] snap-start rounded-xl2 border border-forest-900/10 bg-white p-5 transition hover:border-leaf-600 hover:shadow-soft sm:min-w-0">
                <h3 className="font-display text-xl font-bold text-forest-900">{c.name}</h3>
                <p className="mt-1 text-sm text-ink/70">{c.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section className="section bg-cream-200">
        <div className="container-x">
          <div className="flex items-end justify-between gap-4">
            <h2 className="h-display text-3xl sm:text-4xl">Customer favourites</h2>
            <Link href="/menu" className="text-sm font-semibold text-leaf-600 hover:underline">See full menu</Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((d) => <DishCard key={d.id} dish={d} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (a true sequence, so numbered) */}
      <section id="how" className="section scroll-mt-28">
        <div className="container-x">
          <h2 className="h-display text-3xl sm:text-4xl">From menu to doorstep</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.t} className="rounded-xl2 bg-forest-900 p-6 text-white">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf-400 font-bold text-forest-900">{i + 1}</span>
                <h3 className="mt-4 font-display text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-white/75">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
