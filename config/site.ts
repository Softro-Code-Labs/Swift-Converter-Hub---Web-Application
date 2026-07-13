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

const PRODUCTION_URL = 'https://swiftconverterhub.com';

export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_URL
).replace(/\/$/, '');

export const SITE_NAME = 'Swift Converter Hub';

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
