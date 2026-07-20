import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import UrlEncoderTool from '@/features/character/url-encoder/components';

export const metadata: Metadata = {
  title: 'URL Encoder / Decoder',
  description:
    'Encode or decode URL components using encodeURIComponent and encodeURI, and parse any URL into protocol, host, path, query params, and hash - instantly in your browser, 100% private.',
  keywords: [
    'url encoder online',
    'url decoder online',
    'url encode decode free',
    'encode url online tool',
    'decode url online free',
    'url encoding tool browser',
    'percent encoding online',
    'url percent decode tool',
    'uri component encoder',
    'parse url online free',
    'query string parser online',
    'url parts breakdown tool',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/url-encoder`,
  },
  openGraph: {
    title:
      'URL Encoder / Decoder - Encode, Decode & Parse URLs | Character Studio',
    description:
      'encodeURIComponent, encodeURI, decode, and full URL parser with query param table - instant, private, no server.',
    url: `${SITE_URL}/character/url-encoder`,
    type: 'website',
  },
};

export default function UrlEncoderPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'URL Encoder / Decoder', path: '/character/url-encoder' },
          ]),
          softwareApplicationJsonLd({
            name: 'URL Encoder / Decoder',
            description:
              'Encode or decode URL components using encodeURIComponent and encodeURI, and parse any URL into protocol, host, path, query params, and hash - instantly in your browser, 100% private.',
            path: '/character/url-encoder',
            category: 'UtilitiesApplication',
          }),
        ]}
      />
      <UrlEncoderTool />
    </>
  );
}
