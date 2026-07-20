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
    'Merge, split, and compress PDF files, or convert Word and Excel documents to PDF. All processing happens in your browser - no uploads required.',
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
  ],
  alternates: { canonical: `${SITE_URL}/file` },
  openGraph: {
    title: 'Document Suite - Free Online PDF Tools',
    description: 'Merge, split and compress PDFs entirely in your browser.',
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
              'Merge, split, and compress PDF files, or convert Word and Excel documents to PDF - all in your browser.',
            path: '/file',
            category: 'BusinessApplication',
          }),
        ]}
      />
      <DocumentSuiteClient />
    </>
  );
}
