import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import ImageFormatsClient from './ImageFormatsClient';

export const metadata: Metadata = {
  title: 'Format Converter',
  description:
    'Convert between 150+ image formats including JPG, PNG, WebP, AVIF, HEIC, SVG, TIFF and more - instantly in your browser. No uploads, no account, powered by WebAssembly.',
  keywords: [
    'image format converter online',
    'convert image formats free',
    'online image converter 120 formats',
    'browser image format converter',
    'free image format conversion tool',
    'bulk image format converter',
    'batch convert image formats online',
    'image file format changer',
  ],
  alternates: {
    canonical: `${SITE_URL}/image/convert`,
  },
  openGraph: {
    title: 'Image Format Converter - 150+ Formats | Image Studio',
    description:
      'Convert between JPG, PNG, WebP, AVIF, HEIC, SVG and 114 more formats - instant, private, no server.',
    url: `${SITE_URL}/image/convert`,
    type: 'website',
  },
};

export default function ImageFormatsPage() {
  return <ImageFormatsClient />;
}
