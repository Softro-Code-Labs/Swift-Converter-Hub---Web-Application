import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import CsvJsonTool from '@/features/data/csv-json/components';

export const metadata: Metadata = {
  title: 'CSV to JSON Converter',
  description:
    'Convert CSV to JSON or JSON to CSV instantly in your browser. Supports custom delimiters, header rows, pretty printing, and auto type coercion - no server, no upload, 100% private.',
  keywords: [
    // Core intent
    'csv to json converter',
    'json to csv converter',
    'csv json online free',
    'convert csv to json browser',
    'convert json to csv online',
    'csv json tool no upload',
    'csv to json instant',
    'json to csv instant',
    'csv json bidirectional',
    'csv json private tool',

    // CSV features
    'csv parser online free',
    'csv to json with headers',
    'csv delimiter converter',
    'tab separated to json',
    'semicolon csv converter',
    'pipe delimited csv converter',
    'csv quoted fields parser',
    'multiline csv to json',
    'csv column mapping tool',
    'csv header row converter',

    // JSON features
    'json to csv flattener',
    'json array to csv',
    'json object to csv row',
    'pretty print json csv',
    'minify json output',
    'json type coercion csv',
    'nested json to csv',
    'json records to spreadsheet',
    'json to flat csv browser',
    'json download as csv',

    // Dev & data use cases
    'api response to csv',
    'spreadsheet to json api',
    'database export csv json',
    'data pipeline converter',
    'etl csv json browser',
    'convert data format online',
    'csv to json no coding',
    'json csv data cleaning',
    'quick csv json conversion',
    'developer data converter',

    // Privacy & features
    'csv json no server',
    'offline csv json converter',
    'private data converter browser',
    'csv json instant preview',
    'csv table preview tool',
    'csv json download output',
    'csv json copy clipboard',
    'csv to json swap direction',
    'client side csv parser',
    'browser csv json utility',
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
