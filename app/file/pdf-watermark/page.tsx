import { Metadata } from 'next';
import PdfWatermarkTool from '@/features/file/pdf-watermark/components';

export const metadata: Metadata = {
  title: 'PDF Watermark',
  description:
    'Add text or image watermarks to every page of a PDF - set opacity, angle, position, and size. Live preview before applying. No server, no upload, 100% private. Powered by pdf-lib.',
  keywords: [
    'pdf watermark online free',
    'add watermark to pdf browser',
    'pdf text watermark tool',
    'pdf image watermark online',
    'watermark pdf no upload',
    'pdf watermark no server',
    'pdf stamp tool browser',
    'confidential watermark pdf',
    'draft watermark pdf online',
    'pdf watermark opacity control',
    'pdf watermark angle rotation',
    'pdf watermark position control',
    'pdf watermark tiled pattern',
    'pdf watermark center page',
    'pdf watermark corner position',
    'add logo watermark pdf',
    'add text stamp pdf browser',
    'pdf watermark live preview',
    'pdf watermark all pages',
    'pdf watermark instant free',
    'pdf watermark private browser',
    'pdf watermark no account',
    'pdf watermark no registration',
    'pdf watermark client side',
    'pdf-lib watermark browser',
    'pdf watermark download free',
    'pdf watermark custom text',
    'pdf watermark custom image',
    'pdf watermark font size',
    'pdf watermark color picker',
    'pdf watermark scale control',
    'pdf watermark do not copy',
    'pdf watermark sample stamp',
    'pdf watermark approved stamp',
    'pdf watermark secure browser',
    'pdf watermark offline tool',
    'pdf watermark fast browser',
    'pdf watermark page count',
    'pdf watermark result download',
    'pdf watermark preset text',
    'add stamp pdf online free',
    'pdf overlay text browser',
    'pdf overlay image browser',
    'pdf mark confidential online',
    'pdf draft mark browser',
    'pdf watermark logo png',
    'pdf watermark jpeg image',
    'pdf stamp generator free',
    'pdf watermark diagonal text',
    'pdf page watermark tool',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/file/pdf-watermark',
  },
  openGraph: {
    title: 'PDF Watermark - Text & Image with Live Preview | Document Suite',
    description:
      'Add CONFIDENTIAL, DRAFT, or custom text/image watermarks to every PDF page. Live canvas preview, tiled pattern, angle control - nothing uploaded.',
    url: 'https://swiftconverterhub.com/file/pdf-watermark',
    type: 'website',
  },
};

export default function PdfWatermarkPage() {
  return <PdfWatermarkTool />;
}
