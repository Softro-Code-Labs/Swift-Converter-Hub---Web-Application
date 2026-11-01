import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/config/site';
import { studioForPath, toolForPath } from '@/config/tools';

/**
 * One place to build page metadata, so every page gets the same complete set:
 * title, description, canonical URL, Open Graph and Twitter cards with a
 * generated share image. Page files only supply what is unique to them.
 */
export interface PageSeo {
  /** Site-relative path, e.g. '/image/compress'. */
  path: string;
  /** Page title without the brand suffix (the root layout adds it). */
  title: string;
  /** 110-158 characters: what the page does, in searchers' words. */
  description: string;
  keywords?: string[];
  /** Short label for the share image, e.g. "Compress Images". Defaults to title. */
  ogTitle?: string;
  /** Use the title as-is, without the " | Swift Converter Hub" suffix. */
  absoluteTitle?: boolean;
  noindex?: boolean;
  type?: 'website' | 'article';
  /** Use a designed share image (e.g. '/og-image.png') instead of the generated one. */
  ogImage?: string;
}

/** URL of the generated 1200x630 share image for a page. */
export function ogImageUrl(title: string, path: string, subtitle?: string) {
  const params = new URLSearchParams({ title });
  const studio = studioForPath(path);
  if (studio) {
    params.set('studio', studio.id);
    if (path === studio.href) params.set('kind', 'hub');
  }
  // Format-pair pages (/video/convert/mov-to-mp4) show the two formats.
  const pair = path.match(/\/([a-z0-9]{2,5})-to-([a-z0-9]{2,5})$/i);
  if (pair) {
    params.set('from', pair[1]);
    params.set('to', pair[2]);
  }
  // Tool pages describe the tool itself rather than the whole studio.
  const tool = studio && path !== studio.href ? toolForPath(path) : undefined;
  const sub = subtitle ?? tool?.desc;
  if (sub) params.set('sub', sub);
  return `/og?${params.toString()}`;
}

export function pageMetadata(seo: PageSeo): Metadata {
  const url = seo.path === '/' ? SITE_URL : `${SITE_URL}${seo.path}`;
  const fullTitle = seo.absoluteTitle
    ? seo.title
    : `${seo.title} | ${SITE_NAME}`;
  const image = {
    url:
      seo.ogImage ??
      ogImageUrl(seo.ogTitle ?? seo.title.split(' - ')[0], seo.path),
    width: 1200,
    height: 630,
    alt: seo.ogTitle ?? seo.title,
  };

  return {
    title: seo.absoluteTitle ? { absolute: seo.title } : seo.title,
    description: seo.description,
    ...(seo.keywords?.length ? { keywords: seo.keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      type: seo.type ?? 'website',
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      title: fullTitle,
      description: seo.description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: seo.description,
      images: [image.url],
    },
    ...(seo.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
