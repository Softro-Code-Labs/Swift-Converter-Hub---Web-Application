import { SITE_URL } from '@/config/site';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

  return {
    rules: [
      {
        // Search engines, plus AI *search & retrieval* crawlers - these build
        // the live index/answer AI assistants cite from, and are distinct
        // from the training crawlers blocked below. Blocking these is what
        // actually removes a site from ChatGPT Search, Claude's answers,
        // Perplexity, and similar - allowing them is the whole point of
        // being visible in AI-driven discovery.
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
        // AI *training* crawlers - block entirely. Each of these has a
        // separate, already-allowed sibling above for search/retrieval
        // (OAI-SearchBot vs GPTBot, Claude-SearchBot vs ClaudeBot), so
        // blocking training does not remove this site from AI answers -
        // it only opts out of having content used as raw training data.
        // (Google-Extended is the same idea for Gemini/Vertex training and
        // does not affect Google Search or AI Overviews eligibility.)
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
