import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import DocumentSuiteClient from './DocumentSuiteClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Document Suite - Free Online PDF Tools',
  description:
    'Merge, split, and compress PDF files, convert Word and Excel to PDF, or turn a PDF back into an editable Word document. All processing happens in your browser - no uploads required.',
  keywords: [
    'document suite online free',
    'pdf tools browser free',
    'online pdf toolkit no upload',
    'all in one pdf tools',
    'client side pdf editor free',
    'pdf tools no server',
    'private pdf tools browser',
    'offline pdf toolkit online',
    'free pdf editor online',
    'pdf tools no signup',
    'edit pdf in browser free',
    'pdf toolkit online free',
    'pdf to word converter online',
    'convert pdf to editable word document',
  ],
  alternates: { canonical: `${SITE_URL}/file` },
  openGraph: {
    title: 'Document Suite - Free Online PDF Tools',
    description:
      'Merge, split, compress, and convert PDFs to and from Word - entirely in your browser.',
    url: `${SITE_URL}/file`,
    type: 'website',
  },
};

export default function DocumentSuitePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
          ]),
          softwareApplicationJsonLd({
            name: 'Document Suite',
            description:
              'Merge, split, and compress PDF files, convert Word and Excel to PDF, or turn a PDF back into an editable Word document - all in your browser.',
            path: '/file',
            category: 'BusinessApplication',
          }),
        ]}
      />
      <DocumentSuiteClient />
    </>
  );
}
