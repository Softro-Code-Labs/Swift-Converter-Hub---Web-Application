import { Metadata } from 'next';
import DataStudioClient from './DataStudioClient';

export const metadata: Metadata = {
  title: 'Data Studio - Free Online Data Format Converter (Coming Soon)',
  description:
    'Convert between CSV, JSON, XML and YAML formats entirely in your browser. Parse Excel files, format JSON, and encode Base64 - no uploads required.',
  keywords: [
    'data format converter',
    'json to csv converter',
    'csv to json converter online',
    'json to xml converter',
    'yaml to json online',
    'excel to json converter free',
    'json formatter online',
    'data format converter browser',
    'base64 encode decode online',
    'free data conversion tools',
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
