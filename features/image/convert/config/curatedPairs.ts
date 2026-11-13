/**
 * Hand-reviewed image conversion pairs. These pages have their own written
 * descriptions, are indexable and are listed in the sitemap. Every other
 * pair page is a templated, noindex page.
 *
 * Kept in this small file (re-exported from ./formats) so code that only
 * needs to know "is this pair curated?" - such as the ad layout, which runs
 * on every studio page - doesn't pull in the full format tables.
 */

export const HIGH_TRAFFIC_PAIRS = new Set([
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

export const MEDIUM_TRAFFIC_PAIRS = new Set([
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
