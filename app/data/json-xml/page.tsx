import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
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
  return <JsonXmlTool />;
}
