import { SITE_URL } from '@/config/site';
import { MetadataRoute } from 'next';
import {
  ALL_CONVERSION_PAIRS,
  HIGH_TRAFFIC_PAIRS,
  MEDIUM_TRAFFIC_PAIRS,
} from '@/features/image/convert/config/formats';
import {
  ALL_CONVERSION_PAIRS as ALL_AUDIO_CONVERSION_PAIRS,
  HIGH_TRAFFIC_PAIRS as AUDIO_HIGH_TRAFFIC_PAIRS,
  MEDIUM_TRAFFIC_PAIRS as AUDIO_MEDIUM_TRAFFIC_PAIRS,
} from '@/features/audio/convert/config/formats';
import {
  ALL_CONVERSION_PAIRS as ALL_VIDEO_CONVERSION_PAIRS,
  HIGH_TRAFFIC_PAIRS as VIDEO_HIGH_TRAFFIC_PAIRS,
  MEDIUM_TRAFFIC_PAIRS as VIDEO_MEDIUM_TRAFFIC_PAIRS,
} from '@/features/video/convert/config/formats';

const BASE_URL = SITE_URL;

// --- Priority tiers -----------------------------------------------------------
// 1.0  - Homepage and hub pages (highest value, crawled most often)
// 0.9  - High-traffic conversion routes (jpg-to-png, heic-to-jpg etc.)
// 0.8  - Medium-traffic conversion routes
// 0.7  - All other conversion routes
// 0.6  - Studio landing pages
// 0.5  - Static info pages

// --- Studio Tool Slugs --------------------------------------------------------

const IMAGE_STUDIO_SLUGS = new Set([
  'convert',
  'crop',
  'compress',
  'adjust',
  'metadata',
  'base64',
]);

const AUDIO_STUDIO_SLUGS = new Set([
  'convert',
  'trim',
  'compress',
  'volume',
  'merge',
]);

const VIDEO_STUDIO_SLUGS = new Set([
  'convert',
  'trim',
  'compress',
  'extract-audio',
  'to-gif',
]);

const DOCUMENT_STUDIO_SLUGS = new Set([
  'pdf-merge',
  'pdf-split',
  'pdf-compress',
  'pdf-rotate',
  'office-to-pdf',
  'pdf-to-word',
  'pdf-watermark',
]);

const DATA_STUDIO_SLUGS = new Set([
  'csv-json',
  'json-xml',
  'yaml-json',
  'excel-json',
  'toml-json',
  'json-formatter',
  'base64-text',
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

// --- Sitemap ------------------------------------------------------------------

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

  // -- Audio Studio Tools -------------------------------------------------------

  const audioStudioTools: MetadataRoute.Sitemap = Array.from(
    AUDIO_STUDIO_SLUGS,
  ).map((slug) => ({
    url: `${BASE_URL}/audio/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // -- Video Studio Tools -------------------------------------------------------

  const videoStudioTools: MetadataRoute.Sitemap = Array.from(
    VIDEO_STUDIO_SLUGS,
  ).map((slug) => ({
    url: `${BASE_URL}/video/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // -- Document Studio Tools ---------------------------------------------------

  const documentStudioTools: MetadataRoute.Sitemap = Array.from(
    DOCUMENT_STUDIO_SLUGS,
  ).map((slug) => ({
    url: `${BASE_URL}/file/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // -- Data Studio Tools -------------------------------------------------------

  const dataStudioTools: MetadataRoute.Sitemap = Array.from(
    DATA_STUDIO_SLUGS,
  ).map((slug) => ({
    url: `${BASE_URL}/data/${slug}`,
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

  const imageConversionRoutes: MetadataRoute.Sitemap = [];

  for (const { source, target } of ALL_CONVERSION_PAIRS) {
    const key = `${source}-to-${target}`;
    const isHigh = HIGH_TRAFFIC_PAIRS.has(key);
    const isMedium = MEDIUM_TRAFFIC_PAIRS.has(key);

    // Only submit the curated, hand-reviewed pairs. The remaining
    // auto-generated combinations are marked noindex on-page (see
    // app/image/convert/[conversion]/page.tsx) and are intentionally left
    // out of the sitemap so they aren't presented as bulk "content" to
    // search engines / ad review.
    if (!isHigh && !isMedium) continue;

    imageConversionRoutes.push({
      url: `${BASE_URL}/image/convert/${key}`,
      lastModified: now,
      changeFrequency: isHigh ? 'weekly' : isMedium ? 'monthly' : 'yearly',
      priority: isHigh ? 0.8 : isMedium ? 0.7 : 0.6,
    });
  }

  // -- Dynamic Audio Conversion Routes ------------------------------------------

  const audioConversionRoutes: MetadataRoute.Sitemap = [];

  for (const { source, target } of ALL_AUDIO_CONVERSION_PAIRS) {
    const key = `${source}-to-${target}`;
    const isHigh = AUDIO_HIGH_TRAFFIC_PAIRS.has(key);
    const isMedium = AUDIO_MEDIUM_TRAFFIC_PAIRS.has(key);
    if (!isHigh && !isMedium) continue;

    audioConversionRoutes.push({
      url: `${BASE_URL}/audio/convert/${key}`,
      lastModified: now,
      changeFrequency: isHigh ? 'weekly' : 'monthly',
      priority: isHigh ? 0.8 : 0.7,
    });
  }

  // -- Dynamic Video Conversion Routes ------------------------------------------

  const videoConversionRoutes: MetadataRoute.Sitemap = [];

  for (const { source, target } of ALL_VIDEO_CONVERSION_PAIRS) {
    const key = `${source}-to-${target}`;
    const isHigh = VIDEO_HIGH_TRAFFIC_PAIRS.has(key);
    const isMedium = VIDEO_MEDIUM_TRAFFIC_PAIRS.has(key);
    if (!isHigh && !isMedium) continue;

    videoConversionRoutes.push({
      url: `${BASE_URL}/video/convert/${key}`,
      lastModified: now,
      changeFrequency: isHigh ? 'weekly' : 'monthly',
      priority: isHigh ? 0.8 : 0.7,
    });
  }

  return [
    ...staticPages,
    ...imageStudioTools,
    ...audioStudioTools,
    ...videoStudioTools,
    ...documentStudioTools,
    ...dataStudioTools,
    ...characterStudioTools,
    ...imageConversionRoutes,
    ...audioConversionRoutes,
    ...videoConversionRoutes,
  ];
}
