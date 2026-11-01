import { Metadata } from 'next';
import ImageFormatsClient from './ImageFormatsClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/image/convert',
  title: 'Image Converter - JPG, PNG, WebP, HEIC & 150+ Formats',
  description:
    'Convert images between JPG, PNG, WebP, HEIC, AVIF, SVG, ICO and 150+ formats. Batch up to 20 files, free and private - images never leave your browser.',
  keywords: [
    'image format converter online',
    'convert image formats free',
    'online image converter 150 formats',
    'browser image format converter',
    'free image format conversion tool',
    'bulk image format converter',
    'batch convert image formats online',
    'image file format changer',
    'convert raw camera photo online',
    'convert vector image format',
    'image format converter no signup',
  ],
});

export default function ImageFormatsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Image Studio', path: '/image' },
            { name: 'Format Converter', path: '/image/convert' },
          ]),
          softwareApplicationJsonLd({
            name: 'Image Format Converter',
            description:
              'Convert between 150+ image formats, entirely in your browser.',
            path: '/image/convert',
            category: 'MultimediaApplication',
          }),
        ]}
      />
      <ImageFormatsClient />
    </>
  );
}
