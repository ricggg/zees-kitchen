import Link from 'next/link';
import Logo from './Logo';
import CartButton from './CartButton';

const links = [
  { href: '/menu', label: 'Menu' },
  { href: '/track', label: 'Track order' },
  { href: '/#how', label: 'How it works' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest-900/10 bg-cream/90 backdrop-blur" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Zee's Kitchen home"><Logo /></Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-forest-900/80 transition hover:text-leaf-600">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/menu" className="btn-primary hidden sm:inline-flex">Order now</Link>
          <CartButton />
        </div>
      </div>
      {/* mobile nav row */}
      <nav className="container-x flex gap-6 overflow-x-auto pb-2 text-sm font-medium md:hidden" aria-label="Mobile">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="whitespace-nowrap text-forest-900/80">{l.label}</Link>
        ))}
      </nav>
    </header>
  );
}
