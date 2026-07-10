import { Metadata } from 'next';
import DocumentSuiteClient from './DocumentSuiteClient';

export const metadata: Metadata = {
  title: 'Document Suite - Free Online PDF Tools',
  description:
    'Merge, split, and compress PDF files, or convert Word and Excel documents to PDF. All processing happens in your browser - no uploads required.',
  keywords: [
    // Suite identity
    'document suite online free',
    'pdf tools browser free',
    'online pdf toolkit no upload',
    'all in one pdf tools',
    'client side pdf editor free',
    'pdf tools no server',
    'private pdf tools browser',
    'offline pdf toolkit online',
    'browser based pdf utilities',
    'free document converter online',

    // PDF merge
    'merge pdf online free',
    'combine pdf files browser',
    'pdf merger no upload',
    'join pdf documents online',
    'pdf combiner drag reorder',
    'merge pdf no account',
    'pdf merge instant browser',
    'combine multiple pdfs free',
    'pdf merge page thumbnails',
    'pdf joiner free tool',

    // PDF split
    'split pdf online free',
    'extract pdf pages browser',
    'pdf page extractor free',
    'split pdf by range online',
    'pdf split no upload',
    'pdf page picker browser',
    'split pdf into parts free',
    'extract single page pdf',
    'pdf split every n pages',
    'pdf splitter no server',

    // PDF compress
    'compress pdf online free',
    'reduce pdf size browser',
    'pdf compressor no upload',
    'pdf size reducer online',
    'pdf optimizer browser free',
    'compress pdf remove metadata',
    'shrink pdf no server',
    'pdf compress instant free',
    'reduce pdf file size free',
    'pdf compression tool browser',

    // PDF rotate, watermark, office
    'rotate pdf pages online free',
    'pdf page rotator browser',
    'fix pdf orientation online',
    'pdf watermark online free',
    'add watermark to pdf browser',
    'confidential watermark pdf',
    'pdf stamp tool free',
    'word to pdf converter free',
    'excel to pdf converter browser',
    'docx to pdf no upload',
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
