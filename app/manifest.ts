import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Carpetstory — Handmade Rugs from Jaipur',
    short_name: 'Carpetstory',
    description:
      'One-of-one hand-knotted rugs woven by single artisans over six to ten months.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#F5F1EA',
    theme_color: '#1A1817',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32 48x48',
        type: 'image/x-icon',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
