import type { MetadataRoute } from 'next';
import { dishes } from '@/lib/menu-data';
const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: base, priority: 1 }, { url: `${base}/menu`, priority: 0.9 }, { url: `${base}/track` },
    ...dishes.map((d) => ({ url: `${base}/menu/${d.slug}`, priority: 0.7 }))];
}
