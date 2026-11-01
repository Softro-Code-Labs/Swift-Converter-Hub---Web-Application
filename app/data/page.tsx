import { Metadata } from 'next';
import DataStudioClient from './DataStudioClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  studioToolsJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/data',
  title: 'Free Online Data Converters - JSON, CSV, XML & YAML',
  description:
    'Convert between JSON, CSV, XML, YAML, TOML and Excel, and format or validate JSON. Fast with large files and fully private - nothing is uploaded.',
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
});

export default function DataStudioPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Data Studio', path: '/data' },
          ]),
          studioToolsJsonLd('data'),
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
