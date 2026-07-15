import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import JsonXmlTool from '@/features/data/json-xml/components';

export const metadata: Metadata = {
  title: 'JSON to XML Converter',
  description:
    'Convert JSON to XML or XML to JSON instantly in your browser. Supports XML attributes, custom root elements, pretty printing, and auto type coercion - no server, no upload, 100% private.',
  keywords: [
    // Core intent
    'json to xml converter',
    'xml to json converter',
    'json xml online free',
    'convert json to xml browser',
    'convert xml to json online',
    'json xml bidirectional',
    'json xml no upload',
    'json xml instant',
    'json to xml tool free',
    'xml to json tool free',

    // JSON → XML features
    'json to xml with attributes',
    'json to xml root element',
    'json to xml pretty print',
    'json array to xml list',
    'json object to xml node',
    'json to xml declaration',
    'json nested to xml tree',
    'json to xml attribute prefix',
    'json to xml custom root',
    'json to xml download',

    // XML → JSON features
    'xml to json parser browser',
    'xml attributes to json',
    'xml to json pretty print',
    'xml to json array detection',
    'xml nodes to json object',
    'xml to json text content',
    'xml to json auto coerce',
    'xml to json download',
    'xml parser no server',
    'xml to json instant preview',

    // Dev use cases
    'api xml to json converter',
    'soap to json converter',
    'rest api xml payload',
    'config xml to json',
    'java xml to json browser',
    'legacy xml modernise json',
    'xml feed to json converter',
    'rss xml to json browser',
    'xml data migration json',
    'xml api response converter',

    // Privacy & features
    'json xml no server upload',
    'offline json xml converter',
    'private xml converter browser',
    'json xml swap direction',
    'json xml copy clipboard',
    'json xml node count',
    'client side xml converter',
    'browser xml json utility',
    'json xml advanced options',
    'json xml attribute support',
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
