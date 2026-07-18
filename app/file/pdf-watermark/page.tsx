import { SITE_URL } from '@/config/site';
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
  ],
  alternates: {
    canonical: `${SITE_URL}/file/pdf-watermark`,
  },
  openGraph: {
    title: 'PDF Watermark - Text & Image with Live Preview | Document Suite',
    description:
      'Add CONFIDENTIAL, DRAFT, or custom text/image watermarks to every PDF page. Live canvas preview, tiled pattern, angle control - nothing uploaded.',
    url: `${SITE_URL}/file/pdf-watermark`,
    type: 'website',
  },
};

export default function PdfWatermarkPage() {
  return <PdfWatermarkTool />;
}
