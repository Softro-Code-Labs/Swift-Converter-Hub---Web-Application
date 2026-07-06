import { MetadataRoute } from 'next';
import { ALL_CONVERSION_PAIRS } from '@/features/image/convert/config/formats';

const BASE_URL = 'https://swiftconverterhub.com';

// --- Priority tiers -----------------------------------------------------------
// 1.0  - Homepage and hub pages (highest value, crawled most often)
// 0.9  - High-traffic conversion routes (jpg-to-png, heic-to-jpg etc.)
// 0.8  - Medium-traffic conversion routes
// 0.7  - All other conversion routes
// 0.6  - Studio landing pages
// 0.5  - Static info pages

// --- High-traffic routes -------------------------------------------------------

const HIGH_TRAFFIC_PAIRS = new Set([
  'jpg-to-png',
  'png-to-jpg',
  'jpg-to-webp',
  'png-to-webp',
  'jpg-to-ico',
  'heic-to-jpg',
  'svg-to-png',
  'webp-to-jpg',
  'webp-to-png',
  'jpg-to-pdf',
  'png-to-pdf',
  'psd-to-png',
  'psd-to-jpg',
  'gif-to-png',
  'bmp-to-jpg',
  'tiff-to-jpg',
  'avif-to-jpg',
  'ico-to-png',
  'jpg-to-bmp',
  'jpg-to-gif',
  'jpg-to-tiff',
  'png-to-gif',
  'png-to-bmp',
  'png-to-tiff',
  'heic-to-png',
  'heic-to-webp',
  'cr2-to-jpg',
  'nef-to-jpg',
  'arw-to-jpg',
  'dng-to-jpg',
]);

// --- Medium-traffic routes -----------------------------------------------------

const MEDIUM_TRAFFIC_PAIRS = new Set([
  'jpg-to-svg',
  'png-to-svg',
  'jpg-to-avif',
  'png-to-avif',
  'gif-to-jpg',
  'gif-to-webp',
  'bmp-to-png',
  'bmp-to-webp',
  'tiff-to-png',
  'tiff-to-webp',
  'webp-to-gif',
  'webp-to-bmp',
  'svg-to-jpg',
  'svg-to-webp',
  'ico-to-jpg',
  'ico-to-webp',
  'pdf-to-jpg',
  'pdf-to-png',
  'eps-to-png',
  'eps-to-jpg',
  'psd-to-webp',
  'xcf-to-png',
  'xcf-to-jpg',
  'tga-to-png',
  'tga-to-jpg',
  'pcx-to-png',
  'sgi-to-png',
  'exr-to-png',
  'hdr-to-jpg',
  'dpx-to-png',
]);

// --- Studio Tool Slugs --------------------------------------------------------

const IMAGE_STUDIO_SLUGS = new Set([
  'convert',
  'crop',
  'compress',
  'adjust',
  'metadata',
  'base64',
]);

const CHARACTER_STUDIO_SLUGS = new Set([
  'word-counter',
  'case-converter',
  'find-replace',
  'markdown-preview',
  'regex-tester',
  'text-diff',
  'lorem-ipsum',
  'text-sorter',
  'url-encoder',
  'hash-generator',
  'unicode-inspector',
  'number-base',
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // -- Static pages ------------------------------------------------------------

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/image`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/audio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/video`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/file`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/data`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/character`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // -- Image Studio Tools ------------------------------------------------------

  const imageStudioTools: MetadataRoute.Sitemap = Array.from(
    IMAGE_STUDIO_SLUGS,
  ).map((slug) => ({
    url: `${BASE_URL}/image/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // -- Chargecter Studio Tool --------------------------------------------------

  const characterStudioTools: MetadataRoute.Sitemap = Array.from(
    CHARACTER_STUDIO_SLUGS,
  ).map((slug) => ({
    url: `${BASE_URL}/character/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // -- Dynamic Image Conversion Routes ----------------------------------------
  const conversionRoutes: MetadataRoute.Sitemap = [];

  for (const { source, target } of ALL_CONVERSION_PAIRS) {
    const key = `${source}-to-${target}`;
    const isHigh = HIGH_TRAFFIC_PAIRS.has(key);
    const isMedium = MEDIUM_TRAFFIC_PAIRS.has(key);

    if (!isHigh && !isMedium) continue;

    conversionRoutes.push({
      url: `${BASE_URL}/image/convert/${key}`,
      lastModified: now,
      changeFrequency: isHigh ? 'weekly' : isMedium ? 'monthly' : 'yearly',
      priority: isHigh ? 0.8 : isMedium ? 0.7 : 0.6,
    });
  }

  return [
    ...staticPages,
    ...imageStudioTools,
    ...characterStudioTools,
    ...conversionRoutes,
  ];
}
