import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import PdfCompressTool from '@/features/file/pdf-compress/components';

export const metadata: Metadata = {
  title: 'Compress PDF',
  description:
    'Reduce PDF file size by removing metadata, annotations, bookmarks, and attachments - three compression levels, all in your browser. No server, no upload, 100% private.',
  keywords: [
    'compress pdf online free',
    'reduce pdf size browser',
    'pdf compressor no upload',
    'pdf size reducer online',
    'compress pdf file free',
    'pdf optimizer browser',
    'pdf compression tool online',
    'reduce pdf file size free',
  ],
  alternates: {
    canonical: `${SITE_URL}/file/pdf-compress`,
  },
  openGraph: {
    title:
      'Compress PDF - Three Levels, Before/After Size Bar | Document Suite',
    description:
      'Light, balanced, or maximum compression - strips metadata, annotations, and bookmarks. Instant size comparison, nothing uploaded.',
    url: `${SITE_URL}/file/pdf-compress`,
    type: 'website',
  },
};

export default function PdfCompressPage() {
  return <PdfCompressTool />;
}
