import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import ImageStudioClient from './ImageStudioClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Image Studio - Free Online Image Tools',
  description:
    'Convert, crop, compress, adjust, and inspect images entirely in your browser. 150+ formats supported, zero uploads, no account required - a complete free image toolkit powered by WebAssembly.',
  keywords: [
    'image studio online free',
    'free online image tools',
    'browser based image editor',
    'all in one image toolkit',
    'complete image editing suite',
    'online image workshop free',
    'web image processing tools',
    'image utility suite browser',
  ],
  alternates: { canonical: `${SITE_URL}/image` },
  openGraph: {
    title: 'Image Studio - Free Browser-Based Image Tools',
    description:
      'Convert, crop, compress, and adjust images entirely in your browser. 150+ formats, zero uploads.',
    url: `${SITE_URL}/image`,
    type: 'website',
  },
};

export default function ImageStudioPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Image Studio', path: '/image' },
          ]),
          softwareApplicationJsonLd({
            name: 'Image Studio',
            description:
              'Convert, crop, compress, adjust, and inspect images entirely in your browser. 150+ formats supported, zero uploads.',
            path: '/image',
            category: 'MultimediaApplication',
          }),
        ]}
      />
      <ImageStudioClient />
    </>
  );
}
