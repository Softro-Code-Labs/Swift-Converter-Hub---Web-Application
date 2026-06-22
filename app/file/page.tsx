import { Metadata } from 'next';
import DocumentSuiteClient from './DocumentSuiteClient';

export const metadata: Metadata = {
  title: 'Document Suite - Free Online PDF Tools (Coming Soon)',
  description:
    'Merge, split, and compress PDF files, or convert Word and Excel documents to PDF. All processing happens in your browser - no uploads required.',
  keywords: [
    // PDF Modification & Assembly Intent
    'merge pdf online free',
    'merge pdf files online',
    'split pdf pages online',
    'extract pdf pages free',
    'combine pdf documents browser',

    // Optimization & Compression Focus
    'compress pdf file size',
    'reduce pdf size online',
    'compress pdf without losing quality',
    'shrink pdf file browser',

    // Office Document to PDF Conversions
    'word to pdf converter online',
    'excel to pdf converter free',
    'convert docx to pdf free',
    'spreadsheet to pdf browser',

    // Privacy, Security, & Client-Side Capabilities
    'pdf tools no upload',
    'completely private pdf editor',
    'secure pdf compiler online',
    'offline pdf tools browser',

    // General Document Management Intent
    'browser based pdf editor',
    'free document converter online',
    'all in one pdf toolkit',
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
