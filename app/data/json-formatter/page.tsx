import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import JsonFormatterTool from '@/features/data/json-formatter/components';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator',
  description:
    'Beautify, minify, and validate JSON instantly in your browser. Sort keys, escape ASCII, inspect structure stats - no server, no upload, 100% private.',
  keywords: [
    'json formatter online',
    'json beautifier free',
    'json minifier online',
    'json validator browser',
    'pretty print json online',
    'format json free tool',
    'json beautify no upload',
    'json formatter instant',
    'json pretty printer online',
    'json syntax checker free',
    'validate json online free',
    'json key sorter tool',
  ],
  alternates: {
    canonical: `${SITE_URL}/data/json-formatter`,
  },
  openGraph: {
    title:
      'JSON Formatter & Validator - Beautify, Minify, Validate | Data Studio',
    description:
      'Beautify, minify, or validate JSON instantly. Sort keys, ASCII escape, structure stats - no server, no upload.',
    url: `${SITE_URL}/data/json-formatter`,
    type: 'website',
  },
};

export default function JsonFormatterPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Data Studio', path: '/data' },
            { name: 'JSON Formatter & Validator', path: '/data/json-formatter' },
          ]),
          softwareApplicationJsonLd({
            name: 'JSON Formatter & Validator',
            description:
              'Beautify, minify, and validate JSON instantly in your browser. Sort keys, escape ASCII, inspect structure stats - no server, no upload, 100% private.',
            path: '/data/json-formatter',
            category: 'DeveloperApplication',
          }),
        ]}
      />
      <JsonFormatterTool />
    </>
  );
}
