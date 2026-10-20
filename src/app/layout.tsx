import type { Metadata, Viewport } from 'next';
import { Fraunces, DM_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/lib/cart';
import { site } from '@/lib/site';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', weight: ['600', '800', '900'], style: ['normal', 'italic'] });
const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: { siteName: site.name, locale: 'en_NG', type: 'website', title: `${site.name} — ${site.tagline}`, description: `Local and continental meals in ${site.city}. Pickup or delivery.` },
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: `Order local and continental meals from ${site.name} in ${site.city}. Pick up with a code or get it delivered to your door.`,
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0E3B1F' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Restaurant', name: site.name, slogan: site.tagline, telephone: '+234' + site.phone.slice(1), servesCuisine: ['Nigerian', 'Continental'], address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: 'Delta State', addressCountry: 'NG' }, url: process.env.NEXT_PUBLIC_SITE_URL }) }} />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
