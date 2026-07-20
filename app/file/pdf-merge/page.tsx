import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import PdfMergeTool from '@/features/file/pdf-merge/components';

export const metadata: Metadata = {
  title: 'Merge PDF Files',
  description:
    'Combine multiple PDF files into a single document in your browser. Drag to reorder pages before merging - no server, no upload, 100% private. Powered by pdf-lib.',
  keywords: [
    'merge pdf online free',
    'combine pdf files browser',
    'join pdf documents online',
    'pdf merger no upload',
    'pdf merge tool free',
    'combine multiple pdfs browser',
    'pdf joiner online free',
    'merge pdf files instantly',
    'combine pdf documents free',
    'pdf lib merge tool',
    'reorder pdf pages before merge',
    'append pdf files online',
  ],
  alternates: {
    canonical: `${SITE_URL}/file/pdf-merge`,
  },
  openGraph: {
    title: 'Merge PDF Files - Drag to Reorder & Combine | Document Suite',
    description:
      'Combine multiple PDFs into one. Drag to reorder, see page counts and thumbnails - processed in your browser, nothing uploaded.',
    url: `${SITE_URL}/file/pdf-merge`,
    type: 'website',
  },
};

export default function PdfMergePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
            { name: 'Merge PDF Files', path: '/file/pdf-merge' },
          ]),
          softwareApplicationJsonLd({
            name: 'Merge PDF Files',
            description:
              'Combine multiple PDF files into a single document in your browser. Drag to reorder pages before merging - no server, no upload, 100% private. Powered by pdf-lib.',
            path: '/file/pdf-merge',
            category: 'BusinessApplication',
          }),
        ]}
      />
      <PdfMergeTool />
    </>
  );
}
