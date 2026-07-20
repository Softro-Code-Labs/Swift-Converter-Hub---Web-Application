import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import PdfSplitTool from '@/features/file/pdf-split/components';

export const metadata: Metadata = {
  title: 'Split PDF Pages',
  description:
    'Extract specific pages, split by custom ranges, or divide a PDF into equal parts - all in your browser. No server, no upload, 100% private. Powered by pdf-lib.',
  keywords: [
    'split pdf online free',
    'extract pdf pages browser',
    'pdf page extractor free',
    'split pdf no upload',
    'pdf splitter browser tool',
    'extract pages from pdf online',
    'pdf split by range',
    'pdf split every n pages',
    'divide pdf into parts online',
    'pdf page extractor tool',
    'separate pdf pages free',
    'pdf splitter no signup',
  ],
  alternates: {
    canonical: `${SITE_URL}/file/pdf-split`,
  },
  openGraph: {
    title:
      'Split PDF Pages - Extract, Range Split & Equal Parts | Document Suite',
    description:
      'Click pages to extract, define named ranges, or split every N pages - all in your browser, nothing uploaded.',
    url: `${SITE_URL}/file/pdf-split`,
    type: 'website',
  },
};

export default function PdfSplitPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
            { name: 'Split PDF Pages', path: '/file/pdf-split' },
          ]),
          softwareApplicationJsonLd({
            name: 'Split PDF Pages',
            description:
              'Extract specific pages, split by custom ranges, or divide a PDF into equal parts - all in your browser. No server, no upload, 100% private. Powered by pdf-lib.',
            path: '/file/pdf-split',
            category: 'BusinessApplication',
          }),
        ]}
      />
      <PdfSplitTool />
    </>
  );
}
