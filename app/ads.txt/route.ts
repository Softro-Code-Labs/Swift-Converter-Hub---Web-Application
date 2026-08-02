import { ADSENSE } from '@/lib/adsense';

/**
 * ads.txt - https://iabtechlab.com/ads-txt/
 *
 * Declares which companies are authorized to sell ad inventory on this
 * site. Google requires this for every domain serving AdSense ads; its
 * absence can block ad serving even after a site is otherwise approved.
 *
 * Served as a live route (not a static file) so the publisher ID always
 * stays in sync with lib/adsense.ts instead of being duplicated by hand.
 */

function buildAdsTxt(): string {
  // ADSENSE.PUBLISHER_ID is the "ca-pub-..." form used in ad unit code;
  // ads.txt entries use the "pub-..." form without the "ca-" prefix.
  const pubId = ADSENSE.PUBLISHER_ID.replace(/^ca-/, '');

  const lines: string[] = [
    `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`,
  ];

  return lines.join('\n') + '\n';
}

export async function GET() {
  return new Response(buildAdsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
