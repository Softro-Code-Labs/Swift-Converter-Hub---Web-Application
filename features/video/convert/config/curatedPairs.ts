/**
 * Hand-reviewed video conversion pairs. These pages have their own written
 * descriptions, are indexable and are listed in the sitemap. Every other
 * pair page is a templated, noindex page.
 *
 * Kept in this small file (re-exported from ./formats) so code that only
 * needs to know "is this pair curated?" - such as the ad layout, which runs
 * on every studio page - doesn't pull in the full format tables.
 */

export const HIGH_TRAFFIC_PAIRS = new Set([
  'mov-to-mp4',
  'mp4-to-mov',
  'webm-to-mp4',
  'mp4-to-webm',
  'avi-to-mp4',
  'mp4-to-avi',
  'mkv-to-mp4',
  'mp4-to-mkv',
  'mov-to-webm',
  'webm-to-mov',
]);

// Pre-rendered (and kept indexable) alongside HIGH_TRAFFIC_PAIRS, but ranked
// a notch below it - see app/video/convert/[conversion]/page.tsx and
// app/sitemap.ts.
export const MEDIUM_TRAFFIC_PAIRS = new Set([
  'mp4-to-m4v',
  'm4v-to-mp4',
  'mp4-to-3gp',
  '3gp-to-mp4',
  'mp4-to-flv',
  'flv-to-mp4',
  'mp4-to-ts',
  'ts-to-mp4',
  'mp4-to-wmv',
  'wmv-to-mp4',
  'mp4-to-ogv',
  'ogv-to-mp4',
  'mp4-to-mpg',
  'mpg-to-mp4',
  'webm-to-mkv',
  'mkv-to-webm',
  'mov-to-mkv',
  'mkv-to-mov',
]);
