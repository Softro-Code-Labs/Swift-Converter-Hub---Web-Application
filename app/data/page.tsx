import { Metadata } from 'next';
import DataStudioClient from './DataStudioClient';

export const metadata: Metadata = {
  title: 'Data Studio - Free Online Data Format Converter (Coming Soon)',
  description:
    'Convert between CSV, JSON, XML and YAML formats entirely in your browser. Parse Excel files, format JSON, and encode Base64 - no uploads required.',
  keywords: [
    // JSON Transformation & Formatting Focus
    'csv to json converter online',
    'json to csv converter',
    'json formatter online',
    'pretty print json browser',
    'yaml to json online',
    'json to xml converter',

    // Spreadsheet & Configuration Conversions
    'excel to json converter free',
    'parse excel file online',
    'convert csv to xml',
    'xml to yaml converter free',

    // Security, Encoding, & Identity Utilities
    'base64 encode decode online',
    'base64 string converter free',
    'url encode decode browser',
    'client side data transformation',

    // Privacy & Core Utility Architectural Intent
    'data format converter browser',
    'text to data utility online',
    'no upload data converter',
    'secure data conversion tools',
    'free data conversion tools',
    'offline data converter online',
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
