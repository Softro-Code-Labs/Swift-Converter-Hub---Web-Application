/**
 * Centralized site-wide configuration.
 *
 * Single source of truth for the production URL, brand name, and contact
 * addresses so they never drift out of sync across metadata, sitemap,
 * robots.txt, and legal pages.
 *
 * NEXT_PUBLIC_SITE_URL can override this per-environment (preview/staging
 * deploys) without touching code.
 */

const PRODUCTION_URL = 'https://www.swiftconverterhub.com';

export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_URL
).replace(/\/$/, '');

export const SITE_NAME = 'Swift Converter Hub';

/**
 * When the tool, studio and home pages last changed in a meaningful way.
 * Used as `lastmod` in the sitemap. Bump it when you change page content
 * (not for every deploy) - search engines trust lastmod only when it moves
 * with real changes. Blog posts use their own dates from config/blog.ts.
 */
export const SITE_CONTENT_UPDATED = '2026-11-12';

/** Privacy policy and terms ("Version 1.0, June 2026"). Month precision. */
export const LEGAL_UPDATED = '2026-06';

export const SITE_EMAILS = {
  support: 'support@swiftconverterhub.com',
  privacy: 'privacy@swiftconverterhub.com',
  hello: 'hello@swiftconverterhub.com',
  noreply: 'noreply@swiftconverterhub.com',
} as const;

/** Build an absolute URL from a site-relative path, e.g. absoluteUrl('/image') */
export function absoluteUrl(path = ''): string {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
