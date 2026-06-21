import { Metadata } from 'next';
import DocumentSuiteClient from './DocumentSuiteClient';

export const metadata: Metadata = {
  title: 'Document Suite - Free Online PDF Tools (Coming Soon)',
  description:
    'Merge, split, and compress PDF files, or convert Word and Excel documents to PDF. All processing happens in your browser - no uploads required.',
  keywords: [
    'merge pdf files',
    'merge pdf files online',
    'merge pdf online free',
    'split pdf pages online',
    'compress pdf file size',
    'word to pdf converter online',
    'excel to pdf converter free',
    'pdf tools no upload',
    'browser based pdf editor',
    'free document converter online',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/file' },
  openGraph: {
    title: 'Document Suite - Free Online PDF Tools',
    description: 'Merge, split and compress PDFs entirely in your browser.',
    url: 'https://swiftconverterhub.com/file',
    type: 'website',
  },
};

export default function DocumentSuitePage() {
  return <DocumentSuiteClient />;
}
