import { Metadata } from 'next';
import ImageStudioClient from './ImageStudioClient';

export const metadata: Metadata = {
  title: 'Image Studio - Free Online Image Tools',
  description:
    'Convert, crop, compress, adjust and inspect images entirely in your browser. 120+ formats supported, zero uploads, no account required. A complete image toolkit.',
  keywords: [
    // Original core & format transformations
    'free image converter online',
    'image format converter',
    'convert image formats free',
    'bulk image converter online',
    'batch image converter free',
    'convert raw to jpeg online',

    // Optimization & shrinking
    'compress image size online',
    'reduce image file size free',
    'lossless image compressor browser',
    'shrink image dimensions online',

    // Editing & inspection features
    'crop compress adjust images online',
    'crop image online free',
    'inspect image metadata browser',
    'view exif data online',
    'online image editor no download',

    // Privacy & tech stack advantages
    'no upload image editor',
    'private image conversion tool',
    'webassembly image converter',
    'browser based image tools',
    'all in one image toolkit',

    // Broad suite and utility keywords
    'free online image studio',
    'complete photography utility suite',
    'web based asset editor',
    'creative cloud alternative free',
    'lightweight graphic design utilities',
    'all in one media converter',

    // File type and modern asset extensions
    'heic heif browser tools',
    'webp conversion workshop',
    'avif to jpeg asset processing',
    'convert svg to vector raster',
    'ico generation utility online',
    'transparency alpha channel checker',

    // Bulk workflow and multi-file automation
    'batch photo processing online',
    'mass resize image files browser',
    'bulk image stripper exif',
    'zip pack multiple image conversions',
    'automated client side graphics tool',

    // Specific creative & platform use cases
    'social media graphics toolkit',
    'optimize product assets for e-commerce',
    'blog post feature image optimizer',
    'avatar profile picture designer tool',
    'passport and visa photo generator',

    // Engineering & Web Perf metrics
    'optimize core web vitals images',
    'lighthouse page speed photo toolkit',
    'frontend asset optimizer online',
    'html5 canvas image manipulation',

    // Privacy, Security, & Architecture positioning
    'offline capable web image studio',
    'zero tracking design utility',
    'local file reader api photo editor',
    'secure image sandbox processing',
    'wasm accelerated graphics workshop',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/image' },
  openGraph: {
    title: 'Image Studio - Free Browser-Based Image Tools',
    description:
      'Convert, crop, compress, and adjust images entirely in your browser. 120+ formats, zero uploads.',
    url: 'https://swiftconverterhub.com/image',
    type: 'website',
  },
};

export default function ImageStudioPage() {
  return <ImageStudioClient />;
}
