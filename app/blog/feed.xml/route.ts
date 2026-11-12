import { SITE_NAME, SITE_URL } from '@/config/site';
import { BLOG_POSTS } from '@/config/blog';

/**
 * RSS 2.0 feed of the blog - /blog/feed.xml
 *
 * Built from config/blog.ts, so a new post appears here (and in the sitemap
 * and llms.txt) as soon as it is added to the registry. Feed readers,
 * aggregators and some search tools use it to discover new posts.
 */

export const dynamic = 'force-static';

const escapeXml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/** RSS wants RFC 822 dates. Noon UTC keeps the calendar day in every time zone. */
const rssDate = (isoDay: string) => new Date(`${isoDay}T12:00:00Z`).toUTCString();

export function GET() {
  const posts = [...BLOG_POSTS].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );
  const feedUrl = `${SITE_URL}/blog/feed.xml`;

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}${post.path}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rssDate(post.datePublished)}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE_NAME} Blog`)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Plain-language guides to file formats, compression, on-device AI and browser-based conversion.</description>
    <language>en</language>
    ${posts.length ? `<lastBuildDate>${rssDate(posts[0].datePublished)}</lastBuildDate>` : ''}
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
