import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container-x py-20 text-center">
      <p className="font-display text-7xl font-black text-leaf-600">404</p>
      <h1 className="h-display mt-2 text-3xl">That page is not on the menu</h1>
      <Link href="/menu" className="btn-primary mt-6">See our menu</Link>
    </div>
  );
}
