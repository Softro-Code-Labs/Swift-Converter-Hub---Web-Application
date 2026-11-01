import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/config/site';

/** Web app manifest: name, colours and icons used when the site is added to
 *  a phone's home screen or installed as an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - Free, Private File Tools`,
    short_name: 'Swift Converter',
    description:
      'Convert, compress and edit images, PDFs, audio, video and data files in your browser. Nothing is uploaded.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f9fb',
    theme_color: '#f8f9fb',
    categories: ['productivity', 'utilities'],
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      // Android / installed app. Artwork sits inside the maskable safe zone,
      // so the same files work for both purposes.
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
