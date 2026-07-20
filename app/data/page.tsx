import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import DataStudioClient from './DataStudioClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Data Studio - Free Online Data Format Converter',
  description:
    'Convert between CSV, JSON, XML and YAML formats entirely in your browser. Parse Excel files, format JSON, and encode Base64 - no uploads required.',
  keywords: [
    'data studio online free',
    'data format converter browser',
    'online data conversion tools',
    'all in one data converter',
    'client side data tools free',
    'no upload data converter',
    'private data conversion browser',
    'offline data converter online',
    'developer data tools online',
    'structured data converter free',
    'no signup data tools',
    'api data format converter',
  ],
  alternates: { canonical: `${SITE_URL}/data` },
  openGraph: {
    title: 'Data Studio - Free Online Data Format Converter',
    description: 'Convert CSV, JSON, XML and YAML entirely in your browser.',
    url: `${SITE_URL}/data`,
    type: 'website',
  },
};

export default function DataStudioPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Data Studio', path: '/data' },
          ]),
          softwareApplicationJsonLd({
            name: 'Data Studio',
            description:
              'Convert between CSV, JSON, XML and YAML formats entirely in your browser - no uploads required.',
            path: '/data',
            category: 'DeveloperApplication',
          }),
        ]}
      />
      <DataStudioClient />
    </>
  );
}
