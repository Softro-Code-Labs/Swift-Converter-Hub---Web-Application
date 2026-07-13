import { SITE_NAME, SITE_URL } from '@/config/site';

/** Renders one or more JSON-LD schema objects. */
// Escape '<' to prevent breaking out of the script tag.

type JsonLdValue = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdValue | JsonLdValue[] }) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
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
 * SoftwareApplication schema for a studio/tool page. `path` is
 * site-relative, e.g. '/image/convert/jpg-to-png'.
 */
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
