import { Metadata } from 'next';
import ImageStudioClient from './ImageStudioClient';

export const metadata: Metadata = {
  title: 'Image Studio - Free Online Image Tools',
  description:
    'Convert, crop, compress, adjust and inspect images entirely in your browser. 120+ formats supported, zero uploads, no account required. A complete image toolkit.',
  keywords: [
    // High-Volume Core & Format Transformations
    'free image converter online',
    'image format converter',
    'convert image formats free',
    'bulk image converter online',
    'batch image converter free',
    'convert raw to jpeg online',

    // Optimization & File Shrinking Intent
    'compress image size online',
    'reduce image file size free',
    'lossless image compressor browser',
    'shrink image dimensions online',

    // Editing, Cropping & Inspection Features
    'crop compress adjust images online',
    'crop image online free',
    'inspect image metadata browser',
    'view exif data online',
    'online image editor no download',

    // Privacy, WebAssembly & Architecture Advantages
    'no upload image editor',
    'private image conversion tool',
    'webassembly image converter',
    'browser based image tools',
    'all in one image toolkit',
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
