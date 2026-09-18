import { SITE_NAME, SITE_URL } from '@/config/site';

/**
 * Reusable helpers for creating JSON-LD structured data.
 *
 * Converts page information like breadcrumbs, FAQs, and step-by-step guides
 * into Schema.org markup to help search engines better understand the content.
 *
 * Use the JsonLd component with one or more schema builders on any page.
 */

type JsonLdValue = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdValue | JsonLdValue[] }) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is escaped to prevent a literal
          // "</script>" (or other markup) inside string values from
          // breaking out of the script tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}

/** BreadcrumbList schema. Paths are site-relative, e.g. '/image/convert'. */
export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * Organization schema for the site publisher. Only includes fields backed
 * by real, verifiable info (no invented founding dates, ratings, or social
 * profiles) - accuracy matters more than checklist completeness here, since
 * this is exactly the kind of data an AI system may quote directly.
 */
export function organizationJsonLd(): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-icon.png`,
    description:
      'Swift Converter Hub builds free, browser-based file conversion tools for images, audio, video, PDFs, structured data, and text - all processed locally via WebAssembly, with no file ever uploaded to a server.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@swiftconverterhub.com',
      url: `${SITE_URL}/contact`,
    },
  };
}

/** WebSite schema for the root domain. */
export function websiteJsonLd(): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Free, browser-based tools to convert and edit images, audio, video, PDFs, spreadsheets, and text - no uploads, no accounts, no limits.',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** FAQPage schema from the { q, a } shape already used across the site. */
export function faqPageJsonLd(faqs: { q: string; a: string }[]): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

/** HowTo schema for the numbered step lists used on every tool page. */
export function howToJsonLd(params: {
  name: string;
  description?: string;
  steps: { title: string; desc: string }[];
}): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: params.name,
    description: params.description,
    step: params.steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.title,
      text: step.desc,
    })),
  };
}

/**
 * BlogPosting schema for articles/guides. `path` is site-relative,
 * e.g. '/blog/best-image-format-for-web'. Dates are ISO 8601 strings
 * (YYYY-MM-DD) - only pass real publish/update dates, never invented ones.
 */
export function articleJsonLd(params: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: params.title,
    description: params.description,
    url: `${SITE_URL}${params.path}`,
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-icon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${params.path}`,
    },
  };
}
export function softwareApplicationJsonLd(params: {
  name: string;
  description: string;
  path: string;
  category?: string;
}): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: params.name,
    description: params.description,
    url: `${SITE_URL}${params.path}`,
    applicationCategory: params.category ?? 'MultimediaApplication',
    operatingSystem: 'Any (runs in browser)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
