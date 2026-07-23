import { SITE_URL } from '@/config/site';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

  return {
    rules: [
      {
        // Search engines, plus AI search/retrieval crawlers that power live
        // answers (distinct from the training crawlers blocked below).
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Slurp',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
          // OpenAI - search index + user-triggered fetches (NOT training)
          'OAI-SearchBot',
          'ChatGPT-User',
          // Anthropic - search index + user-triggered fetches (NOT training)
          'Claude-SearchBot',
          'Claude-User',
          // Perplexity - search index + user-triggered fetches
          'PerplexityBot',
          'Perplexity-User',
        ],
        allow: [
          '/',
          '/image/',
          '/audio/',
          '/video/',
          '/file/',
          '/data/',
          '/character/',
          '/about',
          '/contact',
          '/privacy',
          '/terms',
          '/llms.txt',
        ],
        disallow: ['/api/', '/_next/', '/admin/', '*.json$'],
      },
      {
        // AI training crawlers - blocked entirely. Each has a separate,
        // already-allowed sibling above for search/retrieval (e.g.
        // GPTBot vs OAI-SearchBot), so this only opts out of training
        // data collection without affecting AI-answer visibility.
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'CCBot',
          'Google-Extended',
          'cohere-ai',
          'Amazonbot',
          'FacebookBot',
          'meta-externalagent',
          'Omgilibot',
          'YouBot',
          // Documented history of ignoring robots.txt - blocked as a matter
          // of record even though it may not honor this file.
          'Bytespider',
        ],
        disallow: ['/'],
      },
      {
        // SEO audit tools - allow but rate limit via crawl-delay
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot'],
        allow: ['/'],
        disallow: ['/api/', '/_next/'],
        crawlDelay: 10,
      },
      {
        // All other bots
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
