import { Metadata } from 'next';
import DataStudioClient from './DataStudioClient';

export const metadata: Metadata = {
  title: 'Data Studio - Free Online Data Format Converter',
  description:
    'Convert between CSV, JSON, XML and YAML formats entirely in your browser. Parse Excel files, format JSON, and encode Base64 - no uploads required.',
  keywords: [
    // Suite identity
    'data studio online free',
    'data format converter browser',
    'online data conversion tools',
    'all in one data converter',
    'client side data tools free',
    'no upload data converter',
    'private data conversion browser',
    'offline data converter online',
    'data transformation tools free',
    'browser based data utilities',

    // CSV ↔ JSON
    'csv to json converter online',
    'json to csv converter free',
    'csv json bidirectional browser',
    'parse csv online free',
    'csv delimiter converter browser',
    'spreadsheet to json online',
    'json records to csv free',
    'csv header row json tool',
    'csv to json no upload',
    'instant csv json converter',

    // JSON ↔ XML
    'json to xml converter online',
    'xml to json converter free',
    'json xml bidirectional browser',
    'xml parser online free',
    'soap xml to json browser',
    'json to xml attribute support',
    'xml to json no upload',
    'json xml instant converter',
    'api xml to json free',
    'convert json xml browser',

    // YAML ↔ JSON
    'yaml to json converter online',
    'json to yaml converter free',
    'yaml json kubernetes browser',
    'docker compose yaml converter',
    'ci pipeline yaml to json',
    'openapi yaml json converter',
    'yaml multi document converter',
    'yaml json no upload free',
    'yaml parser online browser',
    'yaml json instant converter',

    // Excel, TOML, JSON formatter, Base64
    'excel to json converter free',
    'xlsx to json browser tool',
    'toml to json converter online',
    'cargo toml json converter',
    'json formatter beautifier free',
    'json minifier validator online',
    'json pretty print browser',
    'base64 encoder decoder online',
    'jwt token decoder browser',
    'base64 text no upload free',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/data' },
  openGraph: {
    title: 'Data Studio - Free Online Data Format Converter',
    description: 'Convert CSV, JSON, XML and YAML entirely in your browser.',
    url: 'https://swiftconverterhub.com/data',
    type: 'website',
  },
};

export default function DataStudioPage() {
  return <DataStudioClient />;
}
