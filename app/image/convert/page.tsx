import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import ImageFormatsClient from './ImageFormatsClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Format Converter',
  description:
    'Convert between 150+ image formats including JPG, PNG, WebP, AVIF, HEIC, SVG, TIFF and more - instantly in your browser. No uploads, no account, powered by WebAssembly.',
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
  alternates: {
    canonical: `${SITE_URL}/image/convert`,
  },
  openGraph: {
    title: 'Image Format Converter - 150+ Formats | Image Studio',
    description:
      'Convert between JPG, PNG, WebP, AVIF, HEIC, SVG and 145+ more formats - instant, private, no server.',
    url: `${SITE_URL}/image/convert`,
    type: 'website',
  },
};

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
