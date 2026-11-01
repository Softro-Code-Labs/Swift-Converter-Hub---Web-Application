import { Metadata } from 'next';
import ImageStudioClient from './ImageStudioClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  studioToolsJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/image',
  title: 'Free Online Image Tools - Convert, Compress & Crop',
  description:
    'Convert, compress, crop, resize and edit images free in your browser. Works with JPG, PNG, WebP, HEIC, AVIF and 150+ formats. No upload, no sign-up.',
  keywords: [
    'image studio online free',
    'free online image tools',
    'browser based image editor',
    'all in one image toolkit',
    'complete image editing suite',
    'online image workshop free',
    'web image processing tools',
    'image utility suite browser',
    'free photo editor online',
    'no signup image tools',
    'batch photo processing online',
    'image editing suite free',
  ],
});

export default function ImageStudioPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Image Studio', path: '/image' },
          ]),
          studioToolsJsonLd('image'),
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
