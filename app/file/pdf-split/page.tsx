import { Metadata } from 'next';
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
    'split pdf into parts free',
    'pdf page range extractor',
    'split pdf pages online',
    'pdf split no server',
    'pdf extract pages free tool',
    'split pdf private browser',
    'pdf split page thumbnail',
    'pdf split visual page select',
    'pdf split click pages',
    'pdf split named groups',
    'pdf split download all',
    'pdf split multiple outputs',
    'split large pdf browser',
    'pdf split instant free',
    'split pdf client side',
    'pdf-lib split browser',
    'pdf split no watermark',
    'pdf page picker online',
    'pdf split range string',
    'extract single page pdf',
    'pdf split part download',
    'pdf split page count',
    'pdf page select grid',
    'split pdf book chapters',
    'pdf split reports pages',
    'split scanned pdf pages',
    'pdf split equal parts',
    'pdf divide every page',
    'pdf split 1 page each',
    'pdf split even odd pages',
    'pdf split free no account',
    'pdf split no registration',
    'offline pdf split browser',
    'secure pdf split tool',
    'pdf split thumbnails preview',
    'pdf split page numbers',
    'pdf split result files',
    'pdf split multiple ranges',
    'pdf split group pages',
    'pdf split named output',
    'pdf split range validator',
    'pdf split bulk download',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/document/pdf-split',
  },
  openGraph: {
    title:
      'Split PDF Pages - Extract, Range Split & Equal Parts | Document Suite',
    description:
      'Click pages to extract, define named ranges, or split every N pages - all in your browser, nothing uploaded.',
    url: 'https://swiftconverterhub.com/document/pdf-split',
    type: 'website',
  },
};

export default function PdfSplitPage() {
  return <PdfSplitTool />;
}
