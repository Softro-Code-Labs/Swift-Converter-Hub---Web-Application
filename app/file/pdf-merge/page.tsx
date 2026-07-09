import { Metadata } from 'next';
import PdfMergeTool from '@/features/file/pdf-merge/components';

export const metadata: Metadata = {
  title: 'Merge PDF Files',
  description:
    'Combine multiple PDF files into a single document in your browser. Drag to reorder pages before merging - no server, no upload, 100% private. Powered by pdf-lib.',
  keywords: [
    // Core intent
    'merge pdf online free',
    'combine pdf files browser',
    'join pdf documents online',
    'pdf merger no upload',
    'pdf merge tool free',
    'combine multiple pdfs browser',
    'pdf joiner online free',
    'merge pdf files instantly',
    'pdf combiner no server',
    'merge pdfs private browser',

    // Reorder features
    'pdf reorder pages online',
    'drag reorder pdf merge',
    'pdf merge drag drop order',
    'pdf file order merger',
    'pdf merge custom order',
    'pdf merge sort files',
    'pdf merge arrange pages',
    'combine pdf reorder files',
    'pdf merge page sequence',
    'pdf merge file sequence',

    // Technical / use cases
    'merge pdf no account',
    'pdf merge no registration',
    'pdf merge client side',
    'offline pdf merger browser',
    'pdf-lib merge tool',
    'pdf merge wasm browser',
    'pdf merge instant download',
    'pdf merge multiple files',
    'pdf merge upload files',
    'pdf merge drop zone',

    // Document use cases
    'combine scanned pdfs online',
    'merge pdf reports browser',
    'join pdf contracts online',
    'combine pdf invoices free',
    'merge pdf chapters browser',
    'pdf merge for students',
    'pdf merge business documents',
    'pdf combine chapters online',
    'pdf merge presentations free',
    'merge pdf pages free online',

    // Privacy & features
    'private pdf merger browser',
    'pdf merge no data sent',
    'secure pdf merger online',
    'pdf merge page count show',
    'pdf merge file size info',
    'pdf merge thumbnail preview',
    'pdf merge download result',
    'pdf merge tool desktop',
    'pdf merge lightweight browser',
    'pdf merge free no watermark',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/document/pdf-merge',
  },
  openGraph: {
    title: 'Merge PDF Files - Drag to Reorder & Combine | Document Suite',
    description:
      'Combine multiple PDFs into one. Drag to reorder, see page counts and thumbnails - processed in your browser, nothing uploaded.',
    url: 'https://swiftconverterhub.com/document/pdf-merge',
    type: 'website',
  },
};

export default function PdfMergePage() {
  return <PdfMergeTool />;
}
