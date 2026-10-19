import Logo from './Logo';
import { site, waLink } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="mt-10 bg-forest-950 text-white/80">
      <div className="container-x grid gap-10 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo light />
          <p className="max-w-xs text-sm">{site.services.join(' · ')}.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-display text-lg font-bold text-white">Call or message</p>
          <a className="block hover:text-leaf-400" href={`tel:${site.phone}`}>{site.phone}</a>
          <a className="block hover:text-leaf-400" href={waLink()} target="_blank" rel="noreferrer">WhatsApp {site.whatsapp}</a>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-display text-lg font-bold text-white">Catering</p>
          <p>We cater indoor and outdoor events across {site.city}. Message us on WhatsApp for a quote.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {site.name}, {site.city}.
      </div>
    </footer>
  );
}
