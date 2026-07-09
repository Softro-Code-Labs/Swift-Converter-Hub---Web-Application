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
    'pdf compressor no server',
    'pdf shrink online free',
    'compress pdf remove metadata',
    'pdf compress remove annotations',
    'pdf compress remove bookmarks',
    'pdf compression levels online',
    'pdf optimize client side',
    'pdf compress light balanced maximum',
    'pdf compressor private browser',
    'pdf size comparison tool',
    'compress pdf email attachment',
    'pdf reduce size sharing',
    'pdf compress before after size',
    'pdf compress savings percentage',
    'compress pdf download free',
    'pdf compress no watermark',
    'pdf compress no account',
    'pdf-lib compress browser',
    'pdf compress instant free',
    'pdf compress text heavy',
    'pdf compress metadata stripper',
    'pdf compress object streams',
    'pdf compress scanned document',
    'pdf compress office document',
    'pdf compress report sharing',
    'pdf compress email ready',
    'pdf compress mobile upload',
    'compress pdf for web',
    'pdf size optimization free',
    'pdf compress safe browser',
    'pdf compress no quality loss',
    'pdf compression tool private',
    'pdf compress offline browser',
    'secure pdf compressor online',
    'pdf compress fast browser',
    'pdf file size reducer free',
    'pdf compress balanced preset',
    'pdf compress maximum preset',
    'pdf strip attachments online',
    'pdf remove annotations online',
    'pdf metadata remover free',
    'pdf compress instant download',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/document/pdf-compress',
  },
  openGraph: {
    title:
      'Compress PDF - Three Levels, Before/After Size Bar | Document Suite',
    description:
      'Light, balanced, or maximum compression - strips metadata, annotations, and bookmarks. Instant size comparison, nothing uploaded.',
    url: 'https://swiftconverterhub.com/document/pdf-compress',
    type: 'website',
  },
};

export default function PdfCompressPage() {
  return <PdfCompressTool />;
}
