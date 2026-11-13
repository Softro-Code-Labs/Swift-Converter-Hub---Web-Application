/**
 * Hand-reviewed audio conversion pairs. These pages have their own written
 * descriptions, are indexable and are listed in the sitemap. Every other
 * pair page is a templated, noindex page.
 *
 * Kept in this small file (re-exported from ./formats) so code that only
 * needs to know "is this pair curated?" - such as the ad layout, which runs
 * on every studio page - doesn't pull in the full format tables.
 */

export const HIGH_TRAFFIC_PAIRS = new Set([
  'mp3-to-wav',
  'wav-to-mp3',
  'mp3-to-ogg',
  'ogg-to-mp3',
  'mp3-to-flac',
  'flac-to-mp3',
  'mp3-to-aac',
  'aac-to-mp3',
  'mp3-to-m4a',
  'm4a-to-mp3',
  'wav-to-flac',
  'flac-to-wav',
  'm4a-to-wav',
  'wav-to-m4a',
  'aac-to-wav',
  'ogg-to-wav',
  'wav-to-ogg',
  'm4a-to-aac',
  'mp3-to-opus',
  'opus-to-mp3',
]);

// Pre-rendered (and kept indexable) at build time alongside HIGH_TRAFFIC_PAIRS,
// but ranked a notch below it - see app/audio/convert/[conversion]/page.tsx
// and app/sitemap.ts.
export const MEDIUM_TRAFFIC_PAIRS = new Set([
  'wma-to-mp3',
  'mp3-to-wma',
  'wma-to-wav',
  'wav-to-wma',
  'aiff-to-mp3',
  'mp3-to-aiff',
  'aiff-to-wav',
  'wav-to-aiff',
  'aiff-to-flac',
  'ac3-to-mp3',
  'mp3-to-ac3',
  'ac3-to-wav',
  'au-to-mp3',
  'au-to-wav',
  'mp2-to-mp3',
  'mp3-to-mp2',
  'm4a-to-flac',
  'flac-to-m4a',
  'ogg-to-flac',
  'flac-to-ogg',
  'opus-to-wav',
  'wav-to-opus',
  'aac-to-flac',
  'flac-to-aac',
]);
