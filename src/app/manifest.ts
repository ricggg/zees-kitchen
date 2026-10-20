import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zee's Kitchen", short_name: "Zee's Kitchen", description: 'Order local and continental meals in Asaba. Try Dey Chop!',
    start_url: '/menu', display: 'standalone', background_color: '#FAF8F1', theme_color: '#0E3B1F',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
