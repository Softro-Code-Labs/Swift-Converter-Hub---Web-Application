import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import CsvJsonTool from '@/features/data/csv-json/components';

export const metadata: Metadata = {
  title: 'CSV to JSON Converter',
  description:
    'Convert CSV to JSON or JSON to CSV instantly in your browser. Supports custom delimiters, header rows, pretty printing, and auto type coercion - no server, no upload, 100% private.',
  keywords: [
    'csv to json converter',
    'json to csv converter',
    'csv json online free',
    'convert csv to json browser',
    'convert json to csv online',
    'csv json tool no upload',
    'csv to json instant',
    'json to csv instant',
  ],
  alternates: {
    canonical: `${SITE_URL}/data/csv-json`,
  },
  openGraph: {
    title:
      'CSV ↔ JSON Converter - Instant Bidirectional Conversion | Data Studio',
    description:
      'Paste CSV, get JSON. Paste JSON, get CSV. Custom delimiters, header toggle, pretty print - instant, private, no server.',
    url: `${SITE_URL}/data/csv-json`,
    type: 'website',
  },
};

export default function CsvJsonPage() {
  return <CsvJsonTool />;
}
