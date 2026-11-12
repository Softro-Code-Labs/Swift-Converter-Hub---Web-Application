import { SITE_URL } from '@/config/site';
import { MetadataRoute } from 'next';

// Engine files that load only when a visitor presses a tool's button (the
// AI background-removal model and runtime, and the OCR language data, about
// 170 MB together). No page needs them to render, so bots never need them.
const LAZY_ENGINE_FILES = ['/models/', '/ort/', '/tesseract/'];

// Engines that studio pages start loading as soon as they open. Bots that
// render pages (search engines) must keep access to these, or their rendered
// copy shows an "engine failed" error. Only non-rendering bots skip them.
const EAGER_ENGINE_FILES = ['/magick.wasm', '/ffmpeg/'];

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
          '/blog',
          '/about',
          '/contact',
          '/privacy',
          '/terms',
          '/llms.txt',
        ],
        // /_next/ (CSS + JS) must stay crawlable so search engines can render
        // pages the way visitors see them.
        disallow: ['/api/', '/admin/', '*.json$', ...LAZY_ENGINE_FILES],
      },
      {
        // AI training crawlers - blocked entirely. Each has a separate,
        // still-allowed sibling for search/retrieval (e.g. GPTBot vs
        // OAI-SearchBot above, Applebot-Extended vs Applebot under '*'), so
        // this only opts out of training data collection without affecting
        // search or AI-answer visibility.
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'CCBot',
          'Google-Extended',
          'Applebot-Extended',
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
        disallow: ['/api/', ...LAZY_ENGINE_FILES, ...EAGER_ENGINE_FILES],
        crawlDelay: 10,
      },
      {
        // All other bots
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', ...LAZY_ENGINE_FILES],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
