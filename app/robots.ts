import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://swiftconverterhub.com';

  return {
    rules: [
      {
        // Main crawlers - full access to all conversion pages
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Slurp',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
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
          '/privacy',
          '/terms',
        ],
        disallow: ['/api/', '/_next/', '/admin/', '*.json$'],
      },
      {
        // AI training crawlers - block entirely
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
          'Omgilibot',
          'FacebookBot',
          'Google-Extended',
          'Amazonbot',
          'cohere-ai',
          'PerplexityBot',
          'YouBot',
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
    host: baseUrl,
  };
}
