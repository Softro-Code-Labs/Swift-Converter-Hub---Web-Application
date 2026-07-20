import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import JsonXmlTool from '@/features/data/json-xml/components';

export const metadata: Metadata = {
  title: 'JSON to XML Converter',
  description:
    'Convert JSON to XML or XML to JSON instantly in your browser. Supports XML attributes, custom root elements, pretty printing, and auto type coercion - no server, no upload, 100% private.',
  keywords: [
    'json to xml converter',
    'xml to json converter',
    'json xml online free',
    'convert json to xml browser',
    'convert xml to json online',
    'json xml bidirectional',
    'json xml no upload',
    'json xml instant',
    'json xml attribute converter',
    'convert api response to xml',
    'xml pretty print online',
    'json to xml with root element',
  ],
  alternates: {
    canonical: `${SITE_URL}/data/json-xml`,
  },
  openGraph: {
    title:
      'JSON ↔ XML Converter - Bidirectional with Attribute Support | Data Studio',
    description:
      'Convert JSON to XML or XML to JSON with full attribute support, custom root tags, and pretty printing - instant, private, no server.',
    url: `${SITE_URL}/data/json-xml`,
    type: 'website',
  },
};

export default function JsonXmlPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Data Studio', path: '/data' },
            { name: 'JSON to XML Converter', path: '/data/json-xml' },
          ]),
          softwareApplicationJsonLd({
            name: 'JSON to XML Converter',
            description:
              'Convert JSON to XML or XML to JSON instantly in your browser. Supports XML attributes, custom root elements, pretty printing, and auto type coercion - no server, no upload, 100% private.',
            path: '/data/json-xml',
            category: 'DeveloperApplication',
          }),
        ]}
      />
      <JsonXmlTool />
    </>
  );
}
