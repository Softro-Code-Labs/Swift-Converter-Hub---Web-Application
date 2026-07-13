import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import PdfRotateTool from '@/features/file/pdf-rotate/components';

export const metadata: Metadata = {
  title: 'PDF Page Rotator',
  description:
    'Rotate individual PDF pages or all pages at once - 90°, 180°, or 270°. Visual page grid with live rotation preview. No server, no upload, 100% private. Powered by pdf-lib.',
  keywords: [
    'rotate pdf pages online',
    'pdf page rotator free',
    'rotate pdf online no upload',
    'pdf rotate 90 degrees',
    'pdf rotate 180 degrees',
    'pdf rotate individual pages',
    'pdf page orientation fix',
    'rotate pdf browser tool',
    'pdf rotate no server',
    'pdf rotator private free',
    'rotate all pdf pages',
    'pdf rotate single page',
    'fix pdf orientation online',
    'pdf rotate clockwise free',
    'pdf rotate counterclockwise',
    'pdf rotate 270 degrees',
    'pdf page rotate preview',
    'pdf rotate thumbnail grid',
    'pdf-lib rotate browser',
    'rotate pdf instant download',
    'pdf rotate scanned pages',
    'fix sideways pdf online',
    'pdf rotate upside down',
    'pdf rotate landscape portrait',
    'pdf rotate no watermark',
    'pdf rotate no account',
    'pdf rotate client side',
    'offline pdf page rotator',
    'secure pdf rotator browser',
    'pdf rotate visual grid',
    'pdf rotate bulk all pages',
    'pdf page flip online',
    'pdf rotate result download',
    'rotate pdf free tool',
    'pdf rotate reset pages',
    'pdf page rotation badge',
    'rotate scanned document pdf',
    'pdf rotate hover controls',
    'pdf rotate page count',
    'pdf rotate file size',
    'pdf rotate fast browser',
    'pdf rotate document fix',
    'pdf rotate report pages',
    'pdf rotate invoice fix',
    'pdf rotate mobile browser',
    'pdf page rotator no install',
    'pdf rotate online tool',
    'pdf rotate apply changes',
    'pdf rotate download output',
    'pdf rotate private document',
  ],
  alternates: {
    canonical: `${SITE_URL}/file/pdf-rotate`,
  },
  openGraph: {
    title: 'PDF Page Rotator - Rotate Individual or All Pages | Document Suite',
    description:
      'Visual page grid - hover to rotate individual pages or rotate all at once. 90°, 180°, 270° support. Nothing uploaded.',
    url: `${SITE_URL}/file/pdf-rotate`,
    type: 'website',
  },
};

export default function PdfRotatePage() {
  return <PdfRotateTool />;
}
