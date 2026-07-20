import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
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
    'fix pdf orientation online',
    'rotate single pdf page',
    'pdf landscape to portrait',
    'pdf rotate tool free',
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
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
            { name: 'PDF Page Rotator', path: '/file/pdf-rotate' },
          ]),
          softwareApplicationJsonLd({
            name: 'PDF Page Rotator',
            description:
              'Rotate individual PDF pages or all pages at once - 90°, 180°, or 270°. Visual page grid with live rotation preview. No server, no upload, 100% private. Powered by pdf-lib.',
            path: '/file/pdf-rotate',
            category: 'BusinessApplication',
          }),
        ]}
      />
      <PdfRotateTool />
    </>
  );
}
