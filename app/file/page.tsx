import { Metadata } from 'next';
import DocumentSuiteClient from './DocumentSuiteClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  studioToolsJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/file',
  title: 'Free Online PDF Tools - Merge, Split & Compress PDF',
  description:
    'Merge, split, compress, rotate and watermark PDFs, and convert images, Word and Excel to PDF. Free, no sign-up - documents never leave your device.',
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
});

export default function DocumentSuitePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
          ]),
          studioToolsJsonLd('file'),
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
